import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CATEGORIES, THEMES, getTheme, getCategory } from '../data/themes.js';
import { getAttribution, newEnquiryId } from '../lib/tracking.js';
import { saveEnquiry } from '../lib/enquiries.js';
import { loadPalette, describePalette } from '../lib/palette.js';
import { sendEnquiryEmail, enquiryMailto, NOTIFY_EMAIL } from '../lib/mailer.js';
import { ThemePreview } from '../components/ThemeCard.jsx';
import ShareBar from '../components/ShareBar.jsx';
import Icon from '../components/Icon.jsx';
import DemoLink from '../components/DemoLink.jsx';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[0-9\s\-().]{7,20}$/;

function validate(f) {
  const e = {};
  if (f.customerName.trim().length < 2) e.customerName = 'Please enter your full name.';
  if (f.businessName.trim().length < 2) e.businessName = 'Please enter your business name.';
  const digits = f.phone.replace(/\D/g, '');
  if (!f.phone.trim()) e.phone = 'Phone number is required.';
  else if (!PHONE_RE.test(f.phone.trim()) || digits.length < 7 || digits.length > 15)
    e.phone = 'Enter a valid phone number (7–15 digits, optional +country code).';
  if (!f.email.trim()) e.email = 'Email address is required.';
  else if (!EMAIL_RE.test(f.email.trim())) e.email = 'Enter a valid email, e.g. name@company.com.';
  if (!f.category) e.category = 'Please choose a business category.';
  if (!f.themeId) e.themeId = 'Please choose a theme.';
  return e;
}

const LABELS = {
  customerName: 'Your name', businessName: 'Business name', phone: 'Phone number',
  email: 'Email address', category: 'Business category', themeId: 'Selected theme',
};

export default function Enquire() {
  const { themeId: routeTheme } = useParams();
  const navigate = useNavigate();
  const preTheme = getTheme(routeTheme);
  const attribution = useMemo(() => getAttribution(), []);
  const enquiryId = useRef(newEnquiryId());

  const [form, setForm] = useState({
    customerName: '', businessName: '', phone: '', email: '',
    category: preTheme?.category || '', themeId: preTheme?.id || '',
    requirements: '', website: '',
  });
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [serverMsg, setServerMsg] = useState('');
  const [result, setResult] = useState(null);

  useEffect(() => {
    setForm((f) => ({ ...f, category: preTheme?.category || f.category, themeId: preTheme?.id || f.themeId }));
  }, [routeTheme]); // eslint-disable-line react-hooks/exhaustive-deps

  const theme = getTheme(form.themeId);
  const category = getCategory(form.category);
  const themeOptions = THEMES.filter((t) => !form.category || t.category === form.category);

  const set = (k) => (ev) => {
    const v = ev.target.value;
    setForm((f) => {
      const next = { ...f, [k]: v };
      if (k === 'category' && getTheme(f.themeId)?.category !== v) next.themeId = '';
      if (k === 'themeId' && v) next.category = getTheme(v).category;
      if (touched[k] || status === 'error') setErrors(validate(next));
      return next;
    });
    if (k === 'themeId' && v) navigate(`/enquire/${v}`, { replace: true });
  };
  const blur = (k) => () => { setTouched((t) => ({ ...t, [k]: true })); setErrors(validate(form)); };

  const submit = async (ev) => {
    ev.preventDefault();
    if (status === 'submitting') return; // guard against double submit
    const errs = validate(form);
    setErrors(errs);
    setTouched(Object.fromEntries(Object.keys(LABELS).map((k) => [k, true])));
    if (Object.keys(errs).length) {
      setStatus('error');
      setServerMsg('Please fix the highlighted fields below.');
      document.getElementById(`f-${Object.keys(errs)[0]}`)?.focus();
      return;
    }
    if (form.website) { setStatus('success'); setResult({ ok: true, enquiryId: enquiryId.current, mode: 'local' }); return; } // honeypot: pretend success
    setStatus('submitting');
    setServerMsg('');
    // Stored in this browser's localStorage, then emailed to the GLOARO inbox.
    const record = {
      ...form,
      themeName: getTheme(form.themeId)?.name,
      enquiryId: enquiryId.current,
      leadSource: attribution.leadSource,
      utm: attribution.utm,
      palette: loadPalette(form.themeId),
    };
    const data = saveEnquiry(record);
    if (data.ok) {
      const mail = data.duplicate ? { ok: true, skipped: true } : await sendEnquiryEmail(record);
      setResult({ ...data, email: mail.ok ? 'sent' : 'failed', emailError: mail.error, mailto: enquiryMailto(record) });
      setStatus('success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setServerMsg(data.error || 'Something went wrong. Please try again.');
    setStatus('error');
  };

  const palette = form.themeId ? loadPalette(form.themeId) : null;

  if (status === 'success' && result) {
    return (
      <section className="section page-top">
        <div className="container narrow">
          <div className="success-card anim-pop">
            <div className="success-burst"><Icon name="check" size={40} stroke={2.6} /></div>
            <h1 className="h2">{result.duplicate ? 'We already have your enquiry' : 'Thank you! Your enquiry is in.'}</h1>
            <p>
              {result.duplicate
                ? 'This enquiry was submitted moments ago, so we didn’t create a duplicate. Our team will contact you shortly.'
                : <>Our team will contact <strong>{form.customerName}</strong> at <strong>{form.email}</strong> about the <strong>{theme?.name}</strong> theme.</>}
            </p>
            <div className="success-id">Enquiry ID <code>{result.enquiryId}</code></div>
            {!result.duplicate && result.email === 'sent' && (
              <p className="success-mail"><b>✓ Emailed to the GLOARO team</b> · Chosen colours: {describePalette(palette)}</p>
            )}
            {!result.duplicate && result.email === 'failed' && (
              <div className="demo-note">
                <p className="success-mail failed"><b>Email notification could not be sent</b> ({result.emailError}). Your enquiry is saved in this browser.</p>
                <a className="btn btn-outline btn-sm" href={result.mailto}><Icon name="mail" size={16} /> Send it from your email app</a>
              </div>
            )}
            <div className="success-actions">
              <Link to="/themes" className="btn btn-outline">Browse more themes</Link>
              {theme && <DemoLink themeId={theme.id} className="btn btn-primary">Back to {theme.name}</DemoLink>}
            </div>
          </div>
        </div>
      </section>
    );
  }

  const field = (k, props = {}) => (
    <div className={`field ${errors[k] && touched[k] ? 'has-error' : ''} ${props.full ? 'full' : ''}`}>
      <label htmlFor={`f-${k}`}>{LABELS[k]} <span className="req">*</span></label>
      <input id={`f-${k}`} name={k} value={form[k]} onChange={set(k)} onBlur={blur(k)}
        aria-invalid={Boolean(errors[k] && touched[k])} aria-describedby={`e-${k}`} {...props.input} />
      <span className="err" id={`e-${k}`} role="alert">{touched[k] ? errors[k] : ''}</span>
    </div>
  );

  return (
    <section className="section page-top enquire">
      <div className="container enquire-grid">
        <div className="enquire-form-wrap anim-up">
          <span className="eyebrow">Create your website</span>
          <h1 className="h2">Tell us about your business</h1>
          <p className="muted">Takes under a minute. Fields marked <span className="req">*</span> are required.</p>

          {status === 'error' && serverMsg && (
            <div className="alert" role="alert"><Icon name="shield" size={18} /> {serverMsg}</div>
          )}

          <form className="form" onSubmit={submit} noValidate>
            {field('customerName', { input: { autoComplete: 'name', placeholder: 'e.g. Priya Sharma' } })}
            {field('businessName', { input: { autoComplete: 'organization', placeholder: 'e.g. Spice Route Kitchen' } })}
            {field('phone', { input: { type: 'tel', autoComplete: 'tel', placeholder: '+91 98765 43210', inputMode: 'tel' } })}
            {field('email', { input: { type: 'email', autoComplete: 'email', placeholder: 'you@business.com' } })}

            <div className={`field ${errors.category && touched.category ? 'has-error' : ''}`}>
              <label htmlFor="f-category">{LABELS.category} <span className="req">*</span></label>
              <select id="f-category" value={form.category} onChange={set('category')} onBlur={blur('category')}>
                <option value="">Select a category</option>
                {CATEGORIES.filter((c) => c.live).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <span className="err" role="alert">{touched.category ? errors.category : ''}</span>
            </div>

            <div className={`field ${errors.themeId && touched.themeId ? 'has-error' : ''}`}>
              <label htmlFor="f-themeId">{LABELS.themeId} <span className="req">*</span></label>
              <select id="f-themeId" value={form.themeId} onChange={set('themeId')} onBlur={blur('themeId')}>
                <option value="">Select a theme</option>
                {themeOptions.map((t) => <option key={t.id} value={t.id}>{t.name} — {t.type}</option>)}
              </select>
              <span className="err" role="alert">{touched.themeId ? errors.themeId : ''}</span>
            </div>

            <div className="field readonly">
              <label>Theme ID</label>
              <input value={form.themeId || '—'} readOnly tabIndex={-1} />
            </div>
            <div className="field readonly">
              <label>Chosen colours</label>
              <input value={describePalette(palette)} readOnly tabIndex={-1} title="Change colours from the live demo’s “Colours” button" />
            </div>

            <div className="field full">
              <label htmlFor="f-req">Additional requirements</label>
              <textarea id="f-req" rows={4} value={form.requirements} onChange={set('requirements')}
                maxLength={1500} placeholder="Pages you need, online ordering, booking, languages, timeline, budget…" />
              <span className="hint">{form.requirements.length}/1500</span>
            </div>

            {/* honeypot — hidden from humans */}
            <div className="hp" aria-hidden="true">
              <label>Website<input tabIndex={-1} autoComplete="off" value={form.website} onChange={set('website')} /></label>
            </div>

            <div className="form-foot full">
              <span className="source">Source: <strong>{attribution.leadSource}</strong>{attribution.utm ? ` · ${attribution.utm}` : ''}</span>
              <button className="btn btn-primary btn-lg" type="submit" disabled={status === 'submitting'}>
                {status === 'submitting' ? <><span className="spinner" /> Sending to {NOTIFY_EMAIL}…</> : <>Submit enquiry <Icon name="arrow" size={18} /></>}
              </button>
            </div>
          </form>
        </div>

        <aside className="enquire-side anim-up" style={{ '--d': '120ms' }}>
          <div className="side-card">
            <span className="side-label">Your selection</span>
            {theme ? (
              <>
                <ThemePreview themeId={theme.id} title={theme.name} key={theme.id} />
                <h3>{theme.name}</h3>
                <p className="muted">{theme.type} · {category?.name}</p>
                <ul className="features">
                  {theme.features.map((f) => <li key={f}><Icon name="check" size={14} stroke={2.4} />{f}</li>)}
                </ul>
                <div className="side-actions">
                  <DemoLink themeId={theme.id} className="btn btn-outline btn-sm"><Icon name="eye" size={16} /> Live demo</DemoLink>
                </div>
                <ShareBar theme={theme} />
              </>
            ) : (
              <div className="side-empty">
                <Icon name="layout" size={28} />
                <p>Pick a theme from the form or <Link to="/themes">browse the gallery</Link>.</p>
              </div>
            )}
          </div>
          <div className="side-assure">
            <Icon name="shield" size={18} /> Your details are only used by the GLOARO team to respond to this enquiry.
          </div>
        </aside>
      </div>
    </section>
  );
}
