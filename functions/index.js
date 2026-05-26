const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");

const anthropicKey  = defineSecret("ANTHROPIC_API_KEY");
const stripeSecret  = defineSecret("STRIPE_SECRET_KEY");

// ── Stripe price IDs (bac à sable) ───────────────────────────────────────────
const PRICE_IDS = {
  monthly: "price_1TYwhhRJSRAId9LLaxazcXoL",
  annual:  "price_1TYwhoRJSRAId9LLmW27OIWJ",
};

exports.createSubscription = onRequest(
  { secrets: [stripeSecret], cors: true, region: "us-central1", invoker: "public" },
  async (req, res) => {
    if (req.method !== "POST")
      return res.status(405).json({ error: "Method not allowed" });

    const { plan, email, name, uid } = req.body || {};
    if (!plan || !email)
      return res.status(400).json({ error: "Missing required fields: plan, email" });

    const priceId = PRICE_IDS[plan];
    if (!priceId)
      return res.status(400).json({ error: `Invalid plan: ${plan}` });

    const Stripe = require("stripe");
    const stripe = new Stripe(stripeSecret.value(), { apiVersion: "2023-10-16" });

    try {
      // Find or create Stripe customer linked to Firebase UID
      const existing = await stripe.customers.list({ email, limit: 1 });
      const customer = existing.data.length > 0
        ? existing.data[0]
        : await stripe.customers.create({ email, name: name || "", metadata: { firebaseUid: uid } });

      // Create subscription with 7-day trial
      // Trial = $0 first invoice → uses setup_intent (not payment_intent) to save the card
      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: priceId }],
        payment_behavior: "default_incomplete",
        payment_settings: { save_default_payment_method: "on_subscription" },
        expand: ["latest_invoice.payment_intent", "pending_setup_intent"],
        trial_period_days: 7,
      });

      // For trials: pending_setup_intent holds the clientSecret
      // For non-trials: latest_invoice.payment_intent holds it
      const clientSecret =
        subscription.pending_setup_intent?.client_secret ||
        subscription.latest_invoice?.payment_intent?.client_secret;

      if (!clientSecret) {
        return res.status(500).json({ error: "Impossible de récupérer le clientSecret Stripe." });
      }

      return res.json({
        subscriptionId: subscription.id,
        customerId:     customer.id,
        clientSecret,
        intentType: subscription.pending_setup_intent ? "setup" : "payment",
      });
    } catch (err) {
      console.error("Stripe error:", err.message);
      return res.status(500).json({ error: err.message });
    }
  }
);

const SYSTEM_PROMPT = `Tu es Kinesia Assistant, l'assistante virtuelle de l'application Kinesia Relief, créée par Isabelle, massothérapeute professionnelle.

TON IDENTITÉ :
Tu représentes Isabelle et son approche thérapeutique. Tu parles au nom de Kinesia Relief avec chaleur, bienveillance et professionnalisme.

TON APPROCHE THÉRAPEUTIQUE :
Tu travailles à deux niveaux : traiter le symptôme pour soulager rapidement, et chercher la cause profonde pour éviter les récidives. Tu crois fermement que le corps envoie des signaux qu'il faut apprendre à écouter. Ta phrase signature : "Votre corps vous parle."

TA CLIENTÈLE :
Adultes de 20 à 55 ans — sportifs, jeunes mamans, personnes stressées, travailleurs de bureau souffrant de postures prolongées.

TON TON :
- Tu vouvoies toujours les clients
- Tu es chaleureuse, attentionnée, à l'écoute, bienveillante
- Tu es pédagogue : tu expliques simplement, sans jargon excessif
- Français professionnel et accessible, sans expressions régionales
- Réponses concises mais complètes (3-5 phrases en général)

QUESTIONS FRÉQUENTES — TES RÉPONSES :

Assurances : Des reçus pour assurances peuvent être fournis lors d'une consultation en cabinet. Pour les détails spécifiques à votre assureur, contactez directement la clinique.

Nombre de séances : Cela dépend de la condition, de sa chronicité et de l'implication du client dans son rétablissement. En général, on commence à sentir une différence après 2 à 4 séances.

Stress et migraines : Oui, la massothérapie peut aider significativement. Elle réduit le cortisol, relâche les tensions musculaires crâniennes et cervicales, améliore la circulation et favorise un état parasympathique de repos et récupération.

Suppléments : Le magnésium est essentiel pour la relaxation musculaire. Les vitamines du complexe B soutiennent le système nerveux. La vitamine D est importante pour la santé musculo-squelettique. Consultez toujours un professionnel avant une supplémentation.

CE QUE TU NE FAIS JAMAIS :
- Poser un diagnostic médical
- Recommander des médicaments sur ordonnance
- Dire du mal d'une autre profession de santé
- Prétendre remplacer une consultation médicale

QUAND RÉFÉRER :
Si la situation dépasse la massothérapie, tu réfères vers : médecin, chiropracteur, kinésithérapeute, physiothérapeute.

DISCLAIMER : Rappelle si pertinent que tes réponses sont à titre informatif et ne remplacent pas une évaluation professionnelle.

À PROPOS DE L'APPLICATION :
Kinesia Relief permet de faire un diagnostic des zones de douleur, recevoir un plan d'exercices personnalisé, suivre sa progression et tenir un journal.`;

exports.chat = onRequest(
  { secrets: [anthropicKey], cors: true, region: "us-central1", invoker: "public" },
  async (req, res) => {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { messages = [], userContext = null } = req.body;

    // Vérifier que la clé API existe
    const apiKey = anthropicKey.value();
    if (!apiKey) {
      console.error("ERREUR: Clé API Anthropic manquante");
      return res.status(500).json({ error: "Clé API manquante" });
    }
    console.log("Clé API présente, longueur:", apiKey.length);

    let systemPrompt = SYSTEM_PROMPT;
    if (userContext) {
      const { prenom, zones, intensite, duree } = userContext;
      const lines = [];
      if (prenom) lines.push(`Prénom du client : ${prenom}`);
      if (zones?.length) lines.push(`Zones de douleur : ${zones.join(", ")}`);
      if (intensite) lines.push(`Intensité : ${intensite}/10`);
      if (duree) lines.push(`Durée : ${duree}`);
      if (lines.length) {
        systemPrompt += `\n\nCONTEXTE DU CLIENT :\n${lines.join("\n")}\nUtilise ces infos naturellement pour personnaliser tes réponses.`;
      }
    }

    try {
      console.log("Appel Anthropic API avec", messages.length, "messages");

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-5",
          max_tokens: 1024,
          system: systemPrompt,
          messages: messages.slice(-10),
        }),
      });

      const data = await response.json();
      console.log("Réponse Anthropic status:", response.status);

      if (!response.ok) {
        console.error("Erreur Anthropic:", JSON.stringify(data));
        return res.status(500).json({
          error: data.error?.message || "Erreur API Anthropic",
          details: data.error || data,
        });
      }

      const reply = data.content?.[0]?.text;
      if (!reply) {
        console.error("Pas de texte dans la réponse:", JSON.stringify(data));
        return res.status(500).json({ error: "Réponse vide de l'API" });
      }

      console.log("Succès, réponse longueur:", reply.length);
      return res.json({ reply });
    } catch (err) {
      console.error("Exception:", err.message, err.stack);
      return res.status(500).json({ error: err.message });
    }
  }
);
