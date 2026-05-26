  // ── DONNÉES RÉFÉRENCE ────────────────────────────────────────────────────────
  const OLFACTO_DATA = [
    { nom:"Lavande vraie", latin:"Lavandula angustifolia", emoji:"💜",
      usage:"Diffusion 30 min, inhalation directe ou sur oreiller",
      bienfaits:"Anti-stress, améliore le sommeil, calme l'anxiété et les tensions nerveuses" },
    { nom:"Bergamote", latin:"Citrus bergamia", emoji:"🟡",
      usage:"Diffusion 20 min, inhalation sur mouchoir",
      bienfaits:"Soulage l'anxiété et la dépression légère, élève l'humeur, apaisante" },
    { nom:"Citron", latin:"Citrus limon", emoji:"🍋",
      usage:"Diffusion 20 min, inhalation matinale",
      bienfaits:"Clarifie le mental, purifie l'air, redonne de l'énergie et de la concentration" },
    { nom:"Menthe poivrée", latin:"Mentha piperita", emoji:"🌿",
      usage:"Inhalation courte (1–2 min), diffusion en journée",
      bienfaits:"Stimule la concentration, combat la fatigue mentale, soulage les maux de tête" },
    { nom:"Encens (Boswellia)", latin:"Boswellia carterii", emoji:"🕯️",
      usage:"Diffusion pendant méditation ou relaxation",
      bienfaits:"Apaise l'esprit, favorise la méditation, réduit le stress profond et l'anxiété" },
    { nom:"Vétiver", latin:"Vetiveria zizanoides", emoji:"🌾",
      usage:"Diffusion le soir, 1 goutte sur les poignets à humer",
      bienfaits:"Ancrage émotionnel, calme le stress chronique et les pensées envahissantes" },
    { nom:"Ylang-ylang", latin:"Cananga odorata", emoji:"🌼",
      usage:"Diffusion 15 min max (puissant), mélangé à la lavande",
      bienfaits:"Diminue la tension nerveuse, rééquilibre les émotions, favorise la détente" },
    { nom:"Camomille romaine", latin:"Chamaemelum nobile", emoji:"🌸",
      usage:"Diffusion douce, inhalation sur mouchoir",
      bienfaits:"Calme l'irritabilité, soulage l'anxiété, aide à lâcher-prise" },
    { nom:"Géranium rosat", latin:"Pelargonium graveolens", emoji:"🌺",
      usage:"Diffusion, inhalation ou 1 goutte sur le sternum",
      bienfaits:"Équilibre émotionnel, harmonise l'humeur, soutien hormonal" },
    { nom:"Rose de Damas", latin:"Rosa damascena", emoji:"🌹",
      usage:"Inhalation directe du flacon, diffusion précieuse",
      bienfaits:"Soulage le chagrin et la tristesse, favorise l'amour de soi, très apaisante" },
  ];

  const AROMA_DATA = [
    { nom:"Gaulthérie couchée", latin:"Gaultheria procumbens", emoji:"❄️",
      usage:"1–2 gouttes diluées dans huile végétale, massage local",
      bienfaits:"Antalgique puissant, soulage douleurs musculaires et articulaires, effet chaud" },
    { nom:"Eucalyptus citronné", latin:"Eucalyptus citriodora", emoji:"🌿",
      usage:"5 gouttes dans 10 ml d'huile, massage des zones douloureuses",
      bienfaits:"Anti-inflammatoire majeur, soulage rhumatismes, tendinites et arthrose" },
    { nom:"Menthe poivrée", latin:"Mentha piperita", emoji:"🧊",
      usage:"1 goutte diluée, massage local froid sur zone douloureuse",
      bienfaits:"Effet froid immédiat, analgésique, soulage migraines et contractures" },
    { nom:"Hélichryse italienne", latin:"Helichrysum italicum", emoji:"🟠",
      usage:"Pure ou diluée sur hématomes, 2–3 fois/jour",
      bienfaits:"Résout les hématomes, anti-inflammatoire, cicatrisante, drainante" },
    { nom:"Romarin camphré", latin:"Rosmarinus officinalis ct camphre", emoji:"🌱",
      usage:"5 gouttes dans 10 ml d'huile, massage musculaire avant/après effort",
      bienfaits:"Décontracturante, soulage courbatures et contractures musculaires" },
    { nom:"Camomille romaine", latin:"Chamaemelum nobile", emoji:"🌸",
      usage:"3–4 gouttes diluées, massage des zones en spasme",
      bienfaits:"Anti-spasmodique, soulage crampes, contractures et tensions musculaires" },
    { nom:"Clou de girofle", latin:"Eugenia caryophyllus", emoji:"🔴",
      usage:"1 goutte max diluée dans 10 ml huile (irritant pur), massage doux",
      bienfaits:"Analgésique puissant, anti-infectieux, soulage douleurs intenses" },
    { nom:"Gingembre officinal", latin:"Zingiber officinale", emoji:"🫚",
      usage:"4–5 gouttes dans 10 ml huile, massage réchauffant circulaire",
      bienfaits:"Stimule la circulation, réchauffant, soulage douleurs articulaires et raideurs" },
    { nom:"Lavandin super", latin:"Lavandula hybrida super", emoji:"💜",
      usage:"5–6 gouttes dans 10 ml huile, massage muscles tendus",
      bienfaits:"Décontracturante, antalgique douce, soulage courbatures et dos tendu" },
    { nom:"Cyprès toujours vert", latin:"Cupressus sempervirens", emoji:"🌲",
      usage:"5 gouttes dans 10 ml huile, massage montant des jambes",
      bienfaits:"Améliore la circulation veineuse, soulage jambes lourdes et œdèmes" },
  ];

  const PLANTES_DATA = [
    { nom:"Arnica", latin:"Arnica montana", emoji:"🌻",
      usage:"GEL ou CRÈME en usage externe uniquement — jamais sur plaie ouverte",
      bienfaits:"Contusions, hématomes, douleurs musculaires post-effort, anti-inflammatoire local" },
    { nom:"Harpagophytum", latin:"Harpagophytum procumbens", emoji:"🪝",
      usage:"Gélules (480 mg/j) ou décoction — cure de 4 à 8 semaines",
      bienfaits:"Arthrose, tendinites, douleurs lombaires chroniques, anti-inflammatoire articulaire" },
    { nom:"Curcuma", latin:"Curcuma longa", emoji:"🟡",
      usage:"Gélules (1–2 g/j avec poivre noir) ou en cuisine quotidienne",
      bienfaits:"Anti-inflammatoire systémique puissant, soulage arthrite et douleurs chroniques" },
    { nom:"Reine-des-prés", latin:"Filipendula ulmaria", emoji:"🤍",
      usage:"Infusion (2 g/tasse, 3x/j) ou gélules — éviter si allergie à l'aspirine",
      bienfaits:"Aspirine naturelle, anti-inflammatoire, soulage douleurs musculaires et articulaires" },
    { nom:"Boswellia", latin:"Boswellia serrata", emoji:"🕯️",
      usage:"Gélules (300–500 mg d'acide boswellique 3x/j) — cure de 4 sem.",
      bienfaits:"Anti-inflammatoire chronique, arthrite, tendinites, inflammations intestinales" },
    { nom:"Valériane", latin:"Valeriana officinalis", emoji:"😴",
      usage:"Infusion ou gélules le soir — effet en 2 à 4 semaines",
      bienfaits:"Détend les muscles, réduit contractures, améliore le sommeil réparateur" },
    { nom:"Saule blanc", latin:"Salix alba", emoji:"🌿",
      usage:"Décoction d'écorce ou gélules (240 mg salicine/j)",
      bienfaits:"Analgésique naturel, fièvre, douleurs lombaires et articulaires, anti-inflammatoire" },
    { nom:"Gingembre", latin:"Zingiber officinale", emoji:"🫚",
      usage:"Infusion racine fraîche, gélules ou en cuisine — 1–2 g/jour",
      bienfaits:"Anti-inflammatoire, améliore la circulation, soulage nausées et douleurs" },
    { nom:"Millepertuis", latin:"Hypericum perforatum", emoji:"☀️",
      usage:"Gélules — attention interactions médicamenteuses nombreuses, consulter médecin",
      bienfaits:"Douleurs nerveuses, sciatique, névralgie, effets antidépresseurs légers" },
    { nom:"Griffe du chat", latin:"Uncaria tomentosa", emoji:"🐾",
      usage:"Gélules (300 mg 3x/j) — cure de 3 mois minimum",
      bienfaits:"Immunostimulant, anti-inflammatoire articulaire, arthrose, douleurs rhumatismales" },
  ];

  const VITAMINES_DATA = [
    { nom:"Magnésium", type:"Minéral", emoji:"⚡",
      dose:"300–400 mg/jour (bisglycinate ou malate pour meilleure absorption)",
      bienfaits:"Essentiel à la relaxation musculaire, prévient les crampes, réduit le stress et la fatigue" },
    { nom:"Vitamine D3", type:"Vitamine liposoluble", emoji:"☀️",
      dose:"1000–2000 UI/jour (avec vitamine K2), idéalement après analyse sanguine",
      bienfaits:"Santé osseuse et musculaire, prévient les douleurs musculaires, soutient l'immunité" },
    { nom:"Oméga-3 (EPA/DHA)", type:"Acide gras essentiel", emoji:"🐟",
      dose:"1–3 g/jour d'EPA+DHA, de préférence avec un repas gras",
      bienfaits:"Anti-inflammatoire majeur, soulage douleurs articulaires et musculaires chroniques" },
    { nom:"Vitamine B12", type:"Vitamine hydrosoluble", emoji:"🔵",
      dose:"500–1000 µg/jour (méthylcobalamine sublinguale pour meilleure absorption)",
      bienfaits:"Santé du système nerveux, prévient neuropathies, régénération musculaire" },
    { nom:"Vitamine C", type:"Vitamine hydrosoluble", emoji:"🍊",
      dose:"500–1000 mg/jour (en plusieurs prises pour éviter diarrhée)",
      bienfaits:"Synthèse du collagène, récupération musculaire, puissant antioxydant" },
    { nom:"Coenzyme Q10", type:"Antioxydant", emoji:"⚡",
      dose:"100–300 mg/jour avec un repas gras",
      bienfaits:"Énergie cellulaire musculaire, réduit fatigue chronique, protection mitochondriale" },
    { nom:"Zinc", type:"Minéral", emoji:"🔩",
      dose:"15–25 mg/jour (gluconate ou bisglycinate), à distance du calcium",
      bienfaits:"Récupération et réparation musculaire, anti-inflammatoire, soutien immunitaire" },
    { nom:"Potassium", type:"Électrolyte", emoji:"🍌",
      dose:"Via alimentation (bananes, légumineuses) ou 200–400 mg en supplément",
      bienfaits:"Prévient les crampes musculaires, régule la contraction musculaire, équilibre électrolytique" },
    { nom:"Curcumine", type:"Phytonutriment", emoji:"🟡",
      dose:"500 mg 2–3x/jour avec pipérine (poivre noir) pour absorption",
      bienfaits:"Anti-inflammatoire concentré, soulage douleurs chroniques, équivaut aux AINS naturels" },
    { nom:"Protéines / BCAA", type:"Acides aminés", emoji:"💪",
      dose:"BCAA : 5–10 g avant/après effort; Protéines : 1,6–2 g/kg/jour",
      bienfaits:"Réparation des fibres musculaires, prévient la fonte musculaire, accélère la récupération" },
  ];

  // ── ÉCRAN JOURNAL ────────────────────────────────────────────────────────────
  if (screen === "journal") {
    const fr = lang === "fr";
    const journalTabs = [
      { id:"olfacto",   icon:"🌸", label:"Olfacto" },
      { id:"aroma",     icon:"💆", label:"Aroma" },
      { id:"plantes",   icon:"🌿", label:"Plantes" },
      { id:"vitamines", icon:"💊", label:"Vitamines" },
    ];
    const currentData =
      journalTab === "olfacto"   ? OLFACTO_DATA :
      journalTab === "aroma"     ? AROMA_DATA :
      journalTab === "plantes"   ? PLANTES_DATA : VITAMINES_DATA;

    const sectionTitle =
      journalTab === "olfacto"   ? "🌸 Olfactothérapie" :
      journalTab === "aroma"     ? "💆 Aromathérapie" :
      journalTab === "plantes"   ? "🌿 Plantes médicinales" : "💊 Vitamines & Minéraux";

    const sectionSub =
      journalTab === "olfacto"   ? "10 huiles essentielles — diffusion & inhalation" :
      journalTab === "aroma"     ? "10 huiles essentielles — massage & application" :
      journalTab === "plantes"   ? "10 plantes — utilisations & fonctions" :
                                   "10 suppléments — douleurs musculaires";
    return (
      <div style={bgMain}>
        <Swirls/>
        <div style={{ position:"relative", zIndex:1, width:"100%", maxWidth:480,
          margin:"0 auto", height:"100dvh", display:"flex", flexDirection:"column" }}>

          {/* Header */}
          <div style={{ padding:"12px 20px 0", flexShrink:0 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <LogoCircle size={40}/>
                <div>
                  <div style={{ color:"white", fontWeight:700, letterSpacing:3, fontSize:12,
                    fontFamily:"'Cinzel',Georgia,serif" }}>KINESIA</div>
                  <div style={{ color:"#c9a84c", fontSize:12,
                    fontFamily:"'Great Vibes',cursive" }}>Relief</div>
                </div>
              </div>
              <button onClick={() => setLang(fr?"en":"fr")} style={{
                background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.2)",
                borderRadius:20, padding:"4px 10px", color:"rgba(255,255,255,0.7)",
                fontSize:11, cursor:"pointer", fontWeight:600 }}>{fr?"EN":"FR"}</button>
            </div>

            {/* 4 sub-tabs */}
            <div style={{ display:"flex", gap:6, marginBottom:10 }}>
              {journalTabs.map(t => (
                <button key={t.id} onClick={() => setJournalTab(t.id)} style={{
                  flex:1, padding:"8px 0", border:"none", borderRadius:10, cursor:"pointer",
                  background: journalTab===t.id ? "linear-gradient(135deg,#0dcfc6,#077a72)" : "rgba(255,255,255,0.08)",
                  color: journalTab===t.id ? "#1a1a1a" : "rgba(255,255,255,0.55)",
                  fontWeight: journalTab===t.id ? 700 : 400, fontSize:10,
                  display:"flex", flexDirection:"column", alignItems:"center", gap:2,
                }}>
                  <span style={{ fontSize:16 }}>{t.icon}</span>
                  <span>{t.label}</span>
                </button>
              ))}
            </div>

            <div style={{ marginBottom:8 }}>
              <div style={{ color:"white", fontSize:16, fontWeight:700,
                fontFamily:"'Cinzel',serif" }}>{sectionTitle}</div>
              <div style={{ color:"rgba(255,255,255,0.45)", fontSize:11, marginTop:2 }}>{sectionSub}</div>
            </div>
          </div>

          {/* Cards scrollables */}
          <div style={{ flex:1, overflowY:"auto", padding:"0 16px 16px" }}>
            {currentData.map((item, idx) => (
              <div key={idx} style={{
                background: idx % 2 === 0 ? "rgba(13,207,198,0.06)" : "rgba(255,255,255,0.05)",
                border:"1px solid rgba(255,255,255,0.09)", borderRadius:14,
                padding:"14px", marginBottom:10,
              }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                  <div style={{ fontSize:28, flexShrink:0 }}>{item.emoji}</div>
                  <div>
                    <div style={{ color:"white", fontWeight:700, fontSize:14 }}>{item.nom}</div>
                    <div style={{ color:"rgba(255,255,255,0.35)", fontSize:11, fontStyle:"italic" }}>
                      {item.latin || item.type}
                    </div>
                  </div>
                  <div style={{ marginLeft:"auto", background:"rgba(201,168,76,0.15)",
                    border:"1px solid rgba(201,168,76,0.3)", borderRadius:20,
                    padding:"2px 8px", color:"#c9a84c", fontSize:10, fontWeight:700,
                    flexShrink:0 }}>#{idx+1}</div>
                </div>

                <div style={{ background:"rgba(13,207,198,0.08)", borderRadius:8,
                  padding:"8px 10px", marginBottom:8 }}>
                  <div style={{ color:"#0dcfc6", fontSize:10, fontWeight:700,
                    letterSpacing:1, marginBottom:3 }}>
                    {journalTab === "vitamines" ? "📏 DOSE RECOMMANDÉE" : "📋 COMMENT UTILISER"}
                  </div>
                  <div style={{ color:"rgba(255,255,255,0.75)", fontSize:12, lineHeight:1.5 }}>
                    {item.usage || item.dose}
                  </div>
                </div>

                <div style={{ color:"rgba(255,255,255,0.6)", fontSize:12, lineHeight:1.6 }}>
                  <span style={{ color:"#c9a84c", fontWeight:700 }}>✦ </span>
                  {item.bienfaits}
                </div>
              </div>
            ))}

            <div style={{ background:"rgba(167,139,250,0.08)", border:"1px solid rgba(167,139,250,0.2)",
              borderRadius:12, padding:"12px 14px", marginTop:4 }}>
              <div style={{ color:"#a78bfa", fontSize:10, fontWeight:700, letterSpacing:1, marginBottom:4 }}>
                ⚠️ AVERTISSEMENT
              </div>
              <div style={{ color:"rgba(255,255,255,0.45)", fontSize:11, lineHeight:1.6 }}>
                Ces informations sont à titre éducatif uniquement. Consultez toujours un professionnel de santé avant de commencer une supplémentation ou un traitement naturel, surtout si vous prenez des médicaments.
              </div>
            </div>
          </div>

          <TabBar/>
        </div>
      </div>
    );
  }
