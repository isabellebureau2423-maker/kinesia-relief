import { useState, useEffect } from 'react';

export default function InstallPWA() {
  const [prompt, setPrompt] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Ne pas afficher si déjà installé (mode standalone)
    if (window.matchMedia('(display-mode: standalone)').matches) return;

    const handler = (e) => {
      e.preventDefault();
      setPrompt(e);
      setVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!prompt) return;
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === 'accepted') setVisible(false);
    setPrompt(null);
  };

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 9999,
      background: 'linear-gradient(135deg, #1a4a3a, #2d6b52)',
      border: '1px solid rgba(193,154,82,0.6)',
      borderRadius: '16px',
      padding: '14px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      maxWidth: '340px',
      width: 'calc(100vw - 48px)',
      fontFamily: 'sans-serif',
    }}>
      <img
        src="/pwa-64x64.png"
        alt="Kinesia"
        style={{ width: 44, height: 44, borderRadius: '10px', flexShrink: 0 }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ color: '#c1a052', fontWeight: 700, fontSize: '14px' }}>
          Kinesia Relief
        </div>
        <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', marginTop: '2px' }}>
          Installer l'app sur ton téléphone
        </div>
      </div>
      <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
        <button
          onClick={() => setVisible(false)}
          style={{
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.3)',
            color: 'rgba(255,255,255,0.6)',
            borderRadius: '8px',
            padding: '6px 10px',
            fontSize: '12px',
            cursor: 'pointer',
          }}
        >
          Plus tard
        </button>
        <button
          onClick={handleInstall}
          style={{
            background: '#c1a052',
            border: 'none',
            color: '#1a4a3a',
            borderRadius: '8px',
            padding: '6px 12px',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Installer
        </button>
      </div>
    </div>
  );
}
