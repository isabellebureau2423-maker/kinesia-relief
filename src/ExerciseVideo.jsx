import { useRef, useState, useEffect } from 'react';

const toSlug = (title) =>
  (title || '')
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, '-');

// Lecture vidéo avec fallback vers image statique, puis ExerciseAnim si rien n'existe
export default function ExerciseVideo({ title, animFallback }) {
  const videoRef = useRef(null);
  const [hasVideo, setHasVideo] = useState(null);   // null=pending, true/false
  const [hasImage, setHasImage] = useState(null);   // null=pending, true/false
  const [playing, setPlaying] = useState(false);
  const slug = toSlug(title);
  const videoSrc = `/videos/${slug}.mp4`;
  const imgSrc  = `/exercises/${slug}.jpg?v=7`;

  // 1) Vérifier si une vidéo existe (Content-Type pour éviter le fallback SPA index.html)
  useEffect(() => {
    fetch(videoSrc, { method: 'HEAD' })
      .then(r => {
        const ct = r.headers.get('content-type') || '';
        setHasVideo(r.ok && ct.startsWith('video/'));
      })
      .catch(() => setHasVideo(false));
  }, [videoSrc]);

  // 2) Si pas de vidéo, vérifier si une image existe via Image() natif
  // (plus fiable que HEAD car Firebase SPA renvoie 200 même pour les 404)
  useEffect(() => {
    if (hasVideo !== false) return;
    const img = new Image();
    img.onload  = () => setHasImage(true);
    img.onerror = () => setHasImage(false);
    img.src = imgSrc;
  }, [hasVideo, imgSrc]);

  // Pendant la vérification : ne rien afficher (évite le flash d'image à fond blanc)
  if (hasVideo === null) return null;

  // Pas de vidéo → vérification image en cours
  if (hasVideo === false && hasImage === null) return null;

  // Pas de vidéo, pas d'image → rien (on n'affiche pas l'animation à fond blanc)
  if (hasVideo === false && hasImage === false) return null;

  // Pas de vidéo mais image trouvée → afficher l'image
  if (hasVideo === false && hasImage === true) {
    return (
      <div style={{
        width: '100%',
        borderRadius: '12px',
        overflow: 'hidden',
        background: '#0a1f18',
        marginBottom: 8,
        border: '1px solid rgba(255,255,255,0.07)',
      }}>
        <img
          src={imgSrc}
          alt={title}
          style={{
            width: '100%',
            display: 'block',
            objectFit: 'contain',
            maxHeight: 260,
          }}
        />
      </div>
    );
  }

  // Vidéo trouvée → lecteur vidéo
  const handleClick = () => {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
      setPlaying(false);
    } else {
      videoRef.current.play();
      setPlaying(true);
    }
  };

  return (
    <div
      onClick={handleClick}
      style={{
        position: 'relative',
        width: '100%',
        borderRadius: '12px',
        overflow: 'hidden',
        background: '#0a1f18',
        cursor: 'pointer',
        marginBottom: 8,
        border: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      <video
        ref={videoRef}
        src={videoSrc}
        loop
        muted
        playsInline
        style={{ width: '100%', display: 'block', objectFit: 'contain' }}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      {/* Overlay play/pause */}
      {!playing && (
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0,0,0,0.35)',
        }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: 'rgba(193,154,82,0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <svg width="16" height="18" viewBox="0 0 16 18" fill="none">
              <path d="M2 1.5l12 7-12 7V1.5z" fill="#1a4a3a"/>
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
