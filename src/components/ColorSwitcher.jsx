import { PRESETS, HEADER_MODES } from '../lib/palette.js';

// Colour controls shown in the demo bar: preset swatches, custom primary/secondary, header style.
export default function ColorSwitcher({ theme, palette, onChange, onReset }) {
  const set = (patch) => onChange({ ...palette, ...patch });
  const pickPreset = (pr) => set({ preset: pr.id, p: pr.p, s: pr.s });
  const curP = palette.p || theme.look.accent;
  const curS = palette.s || theme.look.ink;

  return (
    <div className="cs" role="group" aria-label="Theme colours">
      <div className="cs-row">
        <span className="cs-label">Colour presets</span>
        <div className="cs-presets">
          {PRESETS.map((pr) => {
            const p = pr.p || theme.look.accent;
            const s = pr.s || theme.look.ink;
            const on = palette.preset === pr.id;
            return (
              <button key={pr.id} type="button" className={`cs-swatch ${on ? 'on' : ''}`} title={pr.name}
                aria-pressed={on} onClick={() => pickPreset(pr)}
                style={{ background: `linear-gradient(135deg, ${p} 50%, ${s} 50%)` }}>
                <span className="sr-only">{pr.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="cs-row cs-two">
        <label className="cs-color">
          <span className="cs-label">Primary · buttons & accents</span>
          <span className="cs-input"><input type="color" value={curP} onChange={(e) => set({ preset: 'custom', p: e.target.value })} /><code>{curP}</code></span>
        </label>
        <label className="cs-color">
          <span className="cs-label">Secondary · dark blocks</span>
          <span className="cs-input"><input type="color" value={curS} onChange={(e) => set({ preset: 'custom', s: e.target.value })} /><code>{curS}</code></span>
        </label>
      </div>

      <div className="cs-row">
        <span className="cs-label">Header style</span>
        <div className="cs-seg" role="radiogroup">
          {HEADER_MODES.map((m) => (
            <button key={m.id} type="button" role="radio" aria-checked={palette.header === m.id}
              className={palette.header === m.id ? 'on' : ''} onClick={() => set({ header: m.id })}>{m.name}</button>
          ))}
        </div>
        {palette.header === 'custom' && (
          <span className="cs-input cs-hdr"><input type="color" value={palette.hdr || '#ffffff'} onChange={(e) => set({ hdr: e.target.value })} /><code>{palette.hdr}</code></span>
        )}
      </div>

      <div className="cs-foot">
        <span>Saved in this browser · applied to previews & your enquiry.</span>
        <button type="button" className="btn btn-ghost btn-sm" onClick={onReset}>Reset</button>
      </div>
    </div>
  );
}
