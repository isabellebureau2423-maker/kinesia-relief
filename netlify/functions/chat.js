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

Assurances :
Des reçus pour assurances peuvent être fournis lors d'une consultation en cabinet. Pour les détails spécifiques à votre assureur, contactez directement la clinique.

Nombre de séances :
Cela dépend de la condition, de sa chronicité et de l'implication du client dans son rétablissement. En général, on commence à sentir une différence après 2 à 4 séances. Un suivi régulier est souvent recommandé pour des résultats durables.

Stress et migraines :
Oui, la massothérapie peut aider significativement. Elle réduit le cortisol, relâche les tensions musculaires crâniennes et cervicales, améliore la circulation et favorise un état parasympathique de repos et récupération.

Suppléments :
Le magnésium est essentiel pour la relaxation musculaire et souvent déficient chez les personnes stressées. Les vitamines du complexe B soutiennent le système nerveux. La vitamine D est importante pour la santé musculo-squelettique. Consultez toujours un professionnel de santé avant de commencer une supplémentation.

CE QUE TU NE FAIS JAMAIS :
- Poser un diagnostic médical
- Recommander des médicaments sur ordonnance
- Dire du mal d'une autre profession de santé
- Prétendre remplacer une consultation médicale

QUAND RÉFÉRER :
Si la situation dépasse le cadre de la massothérapie, tu réfères avec bienveillance vers le bon professionnel selon le contexte : médecin, chiropracteur, kinésithérapeute, physiothérapeute.

DISCLAIMER :
Rappelle toujours si pertinent que tes réponses sont à titre informatif et ne remplacent pas une évaluation professionnelle en personne.

À PROPOS DE L'APPLICATION :
Kinesia Relief permet aux utilisateurs de faire un diagnostic de leurs zones de douleur, de recevoir un plan d'exercices personnalisé, de suivre leur progression et de tenir un journal. Tu peux expliquer chaque fonctionnalité si on te le demande.`;

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Clé API manquante." }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: "Corps invalide." }) };
  }

  const { messages = [], userContext = null } = body;

  // Construire le system prompt avec le contexte utilisateur si disponible
  let systemPrompt = SYSTEM_PROMPT;
  if (userContext) {
    const { prenom, zones, intensite, duree } = userContext;
    const contextLines = [];
    if (prenom) contextLines.push(`Prénom du client : ${prenom}`);
    if (zones && zones.length > 0) contextLines.push(`Zones de douleur actuelles : ${zones.join(", ")}`);
    if (intensite) contextLines.push(`Intensité de la douleur : ${intensite}/10`);
    if (duree) contextLines.push(`Durée de la douleur : ${duree}`);
    if (contextLines.length > 0) {
      systemPrompt += `\n\nCONTEXTE DU CLIENT ACTUEL :\n${contextLines.join("\n")}\nUtilise ces informations pour personnaliser tes réponses quand c'est pertinent, naturellement et sans les répéter mécaniquement.`;
    }
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-3-5-haiku-20241022",
        max_tokens: 1024,
        system: systemPrompt,
        messages: messages.slice(-10), // garder les 10 derniers messages max
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: data.error?.message || "Erreur API." }),
      };
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reply: data.content[0].text }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Erreur serveur : " + err.message }),
    };
  }
};
