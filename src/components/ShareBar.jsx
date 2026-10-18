import { useState } from 'react';
import Icon, { BrandIcon } from './Icon.jsx';
import { themeShareUrl } from '../lib/tracking.js';

export default function ShareBar({ theme, variant = 'light' }) {
  const [copied, setCopied] = useState(false);
  const text = `Check out the "${theme.name}" ${theme.type} website theme by GLOARO`;

  const copy = async () => {
    const url = themeShareUrl(theme.id, 'copy_link');
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = url; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } catch { /* ignore */ }
      ta.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const open = (href) => window.open(href, '_blank', 'noopener,noreferrer,width=640,height=560');
  const wa = () => open(`https://wa.me/?text=${encodeURIComponent(`${text}: ${themeShareUrl(theme.id, 'whatsapp')}`)}`);
  const fb = () => open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(themeShareUrl(theme.id, 'facebook'))}`);
  const li = () => open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(themeShareUrl(theme.id, 'linkedin'))}`);

  return (
    <div className={`share share--${variant}`}>
      <button type="button" onClick={copy} className="share-btn" aria-label="Copy theme link">
        <Icon name={copied ? 'check' : 'link'} size={16} />
        <span>{copied ? 'Copied!' : 'Copy link'}</span>
      </button>
      <button type="button" onClick={wa} className="share-btn share-ico wa" aria-label="Share on WhatsApp"><BrandIcon name="whatsapp" /></button>
      <button type="button" onClick={fb} className="share-btn share-ico fb" aria-label="Share on Facebook"><BrandIcon name="facebook" /></button>
      <button type="button" onClick={li} className="share-btn share-ico li" aria-label="Share on LinkedIn"><BrandIcon name="linkedin" /></button>
    </div>
  );
}
