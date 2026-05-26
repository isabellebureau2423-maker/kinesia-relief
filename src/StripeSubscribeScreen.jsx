import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase.js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const PRICE_IDS = {
  monthly: "price_1TYwhhRJSRAId9LLaxazcXoL",
  annual:  "price_1TYwhoRJSRAId9LLmW27OIWJ",
};

const CF_URL = "https://us-central1-kinesia-relief.cloudfunctions.net/createSubscription";

// ── Styles ────────────────────────────────────────────────────────────────────
const bgMain = {
  position:"relative", height:"100dvh", overflow:"hidden", fontFamily:"sans-serif",
  background:"linear-gradient(175deg,#043830 0%,#065a50 20%,#054840 45%,#033a30 75%,#022820 100%)",
};
const inp = {
  width:"100%", padding:"9px 12px", background:"rgba(255,255,255,0.1)",
  border:"1px solid rgba(255,255,255,0.2)", borderRadius:10, color:"white",
  fontSize:14, outline:"none", boxSizing:"border-box",
};
const CARD_STYLE = {
  style: {
    base: {
      color:"#ffffff", fontSize:"14px", fontFamily:"sans-serif",
      "::placeholder":{ color:"rgba(255,255,255,0.35)" },
    },
    invalid:{ color:"#ff6b6b" },
  },
};
const cardWrap = {
  ...inp, padding:"10px 12px", cursor:"text",
};

// ── Decorative SVG ────────────────────────────────────────────────────────────
function Swirls() {
  return (
    <svg style={{ position:"absolute",inset:0,width:"100%",height:"100%",opacity:0.13,pointerEvents:"none" }}
      viewBox="0 0 400 900" preserveAspectRatio="xMidYMid slice">
      <path d="M -80 280 Q 200 130 480 300" fill="none" stroke="white" strokeWidth="1.5"/>
      <path d="M -80 360 Q 200 190 480 380" fill="none" stroke="white" strokeWidth="1"/>
      <path d="M -80 440 Q 200 270 480 460" fill="none" stroke="white" strokeWidth="0.8"/>
      <circle cx="330" cy="190" r="115" fill="none" stroke="white" strokeWidth="1"/>
      <circle cx="55" cy="660" r="85" fill="none" stroke="white" strokeWidth="0.8"/>
    </svg>
  );
}

// ── Inner form (must be inside <Elements>) ────────────────────────────────────
function SubscribeForm({ lang, plan: planProp, setPlan, setScreenAndSave, currentUser, setLang }) {
  const stripe   = useStripe();
  const elements = useElements();
  const fr       = lang === "fr";

  // Use local plan state, defaulting to "monthly" if parent has "free"
  const [localPlan, setLocalPlan] = useState(
    planProp === "monthly" || planProp === "annual" ? planProp : "monthly"
  );
  const plan    = localPlan;
  const handlePlanChange = (p) => { setLocalPlan(p); setPlan(p); };

  const [name,    setName]    = useState("");
  const [email,   setEmail]   = useState(currentUser?.email || "");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState(false);

  const handlePay = async () => {
    if (!stripe || !elements) return;
    if (!name.trim() || !email.trim()) {
      setError(fr ? "Veuillez remplir tous les champs." : "Please fill in all fields.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      // 1 — Create subscription on backend
      const res = await fetch(CF_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, email, name, uid: currentUser?.uid || email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur serveur");

      // 2 — Confirm card payment with Stripe
      const cardNumber = elements.getElement(CardNumberElement);
      const { error: stripeErr } = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: cardNumber,
          billing_details: { name, email },
        },
      });
      if (stripeErr) throw new Error(stripeErr.message);

      // 3 — Save subscription to Firestore
      if (currentUser?.uid) {
        await setDoc(doc(db, "users", currentUser.uid), {
          plan,
          stripeCustomerId:     data.customerId,
          stripeSubscriptionId: data.subscriptionId,
          subscriptionUpdatedAt: serverTimestamp(),
        }, { merge: true });
      }

      setSuccess(true);
      setTimeout(() => setScreenAndSave("dashboard"), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Success screen ───────────────────────────────────────────────────────
  if (success) return (
    <div style={{ ...bgMain, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:16 }}>
      <Swirls/>
      <div style={{ fontSize:52 }}>✅</div>
      <div style={{ color:"#c9a84c", fontSize:20, fontWeight:700, fontFamily:"'Cinzel',serif", textAlign:"center" }}>
        {fr ? "Abonnement activé !" : "Subscription activated!"}
      </div>
      <div style={{ color:"rgba(255,255,255,0.6)", fontSize:14 }}>
        {fr ? "Redirection vers le tableau de bord…" : "Redirecting to dashboard…"}
      </div>
    </div>
  );

  // ── Payment form ─────────────────────────────────────────────────────────
  return (
    <div style={bgMain}>
      <Swirls/>
      <div style={{ position:"relative", zIndex:1, width:"100%", maxWidth:480, margin:"0 auto", height:"100dvh", overflowY:"auto" }}>

        {/* Header */}
        <div style={{ padding:"14px 20px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:44, height:44, borderRadius:"50%", background:"rgba(201,168,76,0.2)",
              border:"2px solid #c9a84c", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <span style={{ color:"#c9a84c", fontWeight:900, fontFamily:"'Cinzel',serif", fontSize:18 }}>K</span>
            </div>
            <div>
              <div style={{ color:"white", fontWeight:700, letterSpacing:3, fontSize:13, fontFamily:"'Cinzel',Georgia,serif" }}>KINESIA</div>
              <div style={{ color:"#c9a84c", fontSize:13, fontFamily:"'Great Vibes',cursive" }}>Relief</div>
            </div>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={() => setLang(lang === "fr" ? "en" : "fr")} style={{
              background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.2)",
              borderRadius:20, padding:"5px 10px", color:"rgba(255,255,255,0.7)", fontSize:11,
              cursor:"pointer", fontWeight:600,
            }}>{lang === "fr" ? "EN" : "FR"}</button>
            <button onClick={() => setScreenAndSave("welcome")} style={{
              background:"rgba(255,255,255,0.15)", border:"1px solid rgba(255,255,255,0.3)",
              borderRadius:20, padding:"7px 16px", color:"white", fontSize:13, cursor:"pointer",
            }}>{fr ? "← Retour" : "← Back"}</button>
          </div>
        </div>

        <div style={{ padding:"0 22px 40px" }}>

          {/* Title */}
          <div style={{ textAlign:"center", marginBottom:22 }}>
            <div style={{ fontSize:28, marginBottom:6 }}>✦</div>
            <div style={{ color:"white", fontSize:21, fontWeight:700, fontFamily:"'Cinzel',serif", marginBottom:10 }}>
              {fr ? "Choisir un abonnement" : "Choose a plan"}
            </div>
            <div style={{ background:"rgba(13,207,198,0.12)", border:"1px solid rgba(13,207,198,0.3)",
              borderRadius:10, padding:"8px 14px" }}>
              <span style={{ color:"#0dcfc6", fontSize:12, fontWeight:600 }}>
                🎁 {fr ? "Essai gratuit 7 jours — aucune facturation avant la fin" : "7-day free trial — no charge until trial ends"}
              </span>
            </div>
          </div>

          {/* Plan selection */}
          <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:22 }}>
            {[
              { id:"monthly", name:fr?"Mensuel":"Monthly",   price:fr?"14,99$ / mois":"$14.99 / month", desc:fr?"Accès complet. Annulable en tout temps.":"Full access. Cancel anytime." },
              { id:"annual",  name:fr?"Annuel":"Annual",     price:fr?"150$ / an":"$150 / year",         desc:fr?"Économise 2 mois. Accès complet 12 mois.":"Save 2 months. Full 12-month access.", badge:fr?"Meilleure valeur":"Best value" },
            ].map(p => (
              <div key={p.id} onClick={() => handlePlanChange(p.id)} style={{
                border: plan===p.id ? "2px solid #c9a84c" : "1px solid rgba(255,255,255,0.15)",
                borderRadius:14, padding:"14px 16px", cursor:"pointer", position:"relative",
                background: plan===p.id ? "rgba(201,168,76,0.12)" : "rgba(255,255,255,0.05)",
              }}>
                {p.badge && (
                  <div style={{ position:"absolute", top:-10, right:14, background:"#c9a84c",
                    color:"#1a1a1a", fontSize:10, fontWeight:700, borderRadius:10, padding:"2px 10px" }}>
                    {p.badge}
                  </div>
                )}
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div>
                    <div style={{ color:"white", fontWeight:700, fontSize:15 }}>{p.name}</div>
                    <div style={{ color:"rgba(255,255,255,0.5)", fontSize:12, marginTop:2 }}>{p.desc}</div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ color: plan===p.id?"#c9a84c":"white", fontWeight:800, fontSize:15 }}>{p.price}</div>
                    <div style={{ width:18, height:18, borderRadius:"50%", marginTop:4, marginLeft:"auto",
                      border:"2px solid "+(plan===p.id?"#c9a84c":"rgba(255,255,255,0.3)"),
                      background:plan===p.id?"#c9a84c":"transparent",
                      display:"flex", alignItems:"center", justifyContent:"center" }}>
                      {plan===p.id && <span style={{ fontSize:9, color:"#1a1a1a", fontWeight:900 }}>✓</span>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:18 }}>
            <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.15)" }}/>
            <span style={{ color:"rgba(255,255,255,0.4)", fontSize:12 }}>{fr?"Informations de paiement":"Payment info"}</span>
            <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.15)" }}/>
          </div>

          {/* Form fields */}
          <div style={{ display:"flex", flexDirection:"column", gap:11, marginBottom:18 }}>

            {/* Name */}
            <div>
              <label style={{ color:"rgba(255,255,255,0.65)", fontSize:12, display:"block", marginBottom:4 }}>
                {fr?"Nom sur la carte":"Cardholder name"}
              </label>
              <input type="text" placeholder={fr?"Jean Dupont":"Jane Smith"} value={name}
                onChange={e => setName(e.target.value)} style={inp}/>
            </div>

            {/* Email */}
            <div>
              <label style={{ color:"rgba(255,255,255,0.65)", fontSize:12, display:"block", marginBottom:4 }}>
                {fr?"Courriel":"Email"}
              </label>
              <input type="email" placeholder="ton@courriel.com" value={email}
                onChange={e => setEmail(e.target.value)} style={inp}/>
            </div>

            {/* Card number — Stripe Element */}
            <div>
              <label style={{ color:"rgba(255,255,255,0.65)", fontSize:12, display:"block", marginBottom:4 }}>
                {fr?"Numéro de carte":"Card number"}
              </label>
              <div style={{ ...cardWrap, display:"flex", alignItems:"center", gap:8 }}>
                <div style={{ flex:1 }}>
                  <CardNumberElement options={CARD_STYLE}/>
                </div>
                <div style={{ display:"flex" }}>
                  <div style={{ width:22, height:14, background:"#eb001b", borderRadius:3, opacity:0.85 }}/>
                  <div style={{ width:22, height:14, background:"#f79e1b", borderRadius:3, opacity:0.75, marginLeft:-8 }}/>
                </div>
              </div>
            </div>

            {/* Expiry + CVV — Stripe Elements */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:11 }}>
              <div>
                <label style={{ color:"rgba(255,255,255,0.65)", fontSize:12, display:"block", marginBottom:4 }}>
                  {fr?"Expiration":"Expiry"}
                </label>
                <div style={cardWrap}>
                  <CardExpiryElement options={CARD_STYLE}/>
                </div>
              </div>
              <div>
                <label style={{ color:"rgba(255,255,255,0.65)", fontSize:12, display:"block", marginBottom:4 }}>CVV</label>
                <div style={cardWrap}>
                  <CardCvcElement options={CARD_STYLE}/>
                </div>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{ background:"rgba(255,80,80,0.15)", border:"1px solid rgba(255,80,80,0.4)",
              borderRadius:10, padding:"10px 14px", marginBottom:14, color:"#ff8080", fontSize:13 }}>
              {error}
            </div>
          )}

          {/* Stripe badge */}
          <div style={{ display:"flex", justifyContent:"center", alignItems:"center", gap:6, marginBottom:14 }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 0L8.5 5H14L9.5 8L11 13L7 10L3 13L4.5 8L0 5H5.5L7 0Z" fill="rgba(255,255,255,0.25)"/>
            </svg>
            <span style={{ color:"rgba(255,255,255,0.35)", fontSize:11 }}>
              {fr?"Paiement sécurisé par":"Secured by"} <span style={{ color:"rgba(255,255,255,0.55)", fontWeight:600 }}>Stripe</span>
            </span>
          </div>

          {/* Pay button */}
          <button onClick={handlePay} disabled={loading || !stripe} style={{
            width:"100%", padding:"14px 0", border:"none", borderRadius:12,
            fontSize:15, fontWeight:700, cursor: loading ? "wait" : "pointer",
            background: loading ? "rgba(201,168,76,0.5)" : "linear-gradient(90deg,#c9a84c,#e8c96a)",
            color: loading ? "rgba(255,255,255,0.6)" : "#1a1a1a",
            boxShadow:"0 8px 24px rgba(201,168,76,0.35)", marginBottom:10,
            display:"flex", alignItems:"center", justifyContent:"center", gap:8,
          }}>
            {loading ? (
              <>
                <div style={{ width:16, height:16, borderRadius:"50%", border:"2px solid rgba(0,0,0,0.3)", borderTop:"2px solid #1a1a1a", animation:"spin 0.8s linear infinite" }}/>
                {fr?"Traitement…":"Processing…"}
              </>
            ) : (
              fr
                ? (plan==="annual" ? "Commencer l'essai gratuit — 150$/an" : "Commencer l'essai gratuit — 14,99$/mois")
                : (plan==="annual" ? "Start free trial — $150/yr"           : "Start free trial — $14.99/mo")
            )}
          </button>

          <div style={{ color:"rgba(255,255,255,0.3)", fontSize:11, textAlign:"center", marginBottom:10, lineHeight:1.6 }}>
            {fr?"Aucune facturation pendant 7 jours. Annulable à tout moment.":"No charge for 7 days. Cancel anytime."}
          </div>

          <button onClick={() => setScreenAndSave("dashboard")} style={{
            width:"100%", padding:"12px 0", border:"none", background:"transparent",
            color:"rgba(255,255,255,0.35)", fontSize:12, cursor:"pointer",
          }}>
            {fr?"Continuer gratuitement (version prototype)":"Continue for free (prototype)"}
          </button>
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

// ── Public export (wraps with Stripe Elements provider) ──────────────────────
export default function StripeSubscribeScreen(props) {
  return (
    <Elements stripe={stripePromise}>
      <SubscribeForm {...props}/>
    </Elements>
  );
}
