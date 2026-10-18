import { useState } from 'react';
import { PHOTOS, unsplashUrl } from './photos.js';

// Real photography from free, key-less sources:
//  1. Unsplash CDN — curated, subject-checked photos (see photos.js).
//  2. Picsum — random real photo fallback if the first request fails.
export const fallbackPhoto = (seed, w = 800, h = 600) =>
  `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;

export const photoUrl = (id, w, h) => (PHOTOS[id] ? unsplashUrl(PHOTOS[id], w, h) : fallbackPhoto(id, w, h));

/**
 * <Photo id="croissant" w={800} h={600} alt="…" />
 * `id` is a key from photos.js. Unknown ids fall straight through to Picsum.
 */
export function Photo({ id, w = 800, h = 600, alt = '', className = '', style, eager = false, ...rest }) {
  const [src, setSrc] = useState(() => photoUrl(id, w, h));
  const [failed, setFailed] = useState(false);
  const onError = () => { if (!failed) { setFailed(true); setSrc(fallbackPhoto(id, w, h)); } };
  return (
    <img
      src={src}
      alt={alt}
      width={w}
      height={h}
      loading={eager ? 'eager' : 'lazy'}
      fetchpriority={eager ? 'high' : 'auto'}
      decoding="async"
      onError={onError}
      className={`photo ${className}`}
      style={{ objectFit: 'cover', width: '100%', height: '100%', ...style }}
      {...rest}
    />
  );
}
