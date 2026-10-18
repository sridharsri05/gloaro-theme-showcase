import { BrandIcon } from './Icon.jsx';
import { whatsappLink, WHATSAPP_NUMBER } from '../lib/mailer.js';

// Floating WhatsApp chat button, bottom-right on every page.
export default function WhatsAppFab({ text }) {
  const pretty = `+${WHATSAPP_NUMBER.slice(0, 2)} ${WHATSAPP_NUMBER.slice(2, 7)} ${WHATSAPP_NUMBER.slice(7)}`;
  return (
    <a className="wa-fab" href={whatsappLink(text)} target="_blank" rel="noopener noreferrer" aria-label={`Chat on WhatsApp ${pretty}`} title={`WhatsApp ${pretty}`}>
      <span className="wa-fab-ring" aria-hidden="true" />
      <BrandIcon name="whatsapp" size={28} />
      <span className="wa-fab-label">Chat with us</span>
    </a>
  );
}
