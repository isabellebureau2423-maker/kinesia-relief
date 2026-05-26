import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './KinesiaReliefV19.jsx';
import InstallPWA from './InstallPWA.jsx';

// ── CACHE BUSTER v4 ───────────────────────────────────────────────────────────
// Force la destruction de tous les anciens caches service worker une seule fois.
// Changer CACHE_KEY pour forcer un nouveau nettoyage à l'avenir.
const CACHE_KEY = 'kinesia-cache-cleared-v11';
if (!localStorage.getItem(CACHE_KEY)) {
  (async () => {
    try {
      // 1) Supprimer tous les caches du navigateur
      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map(k => caches.delete(k)));
      }
      // 2) Désinscrire tous les service workers
      if ('serviceWorker' in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map(r => r.unregister()));
      }
      // 3) Marquer comme fait et recharger pour prendre les nouveaux fichiers
      localStorage.setItem(CACHE_KEY, '1');
      window.location.reload();
    } catch (e) {
      localStorage.setItem(CACHE_KEY, '1');
    }
  })();
}
// ─────────────────────────────────────────────────────────────────────────────

ReactDOM.createRoot(document.getElementById('root')).render(<React.StrictMode><App /><InstallPWA /></React.StrictMode>);
