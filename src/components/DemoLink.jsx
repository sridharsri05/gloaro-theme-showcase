// Link to a theme's live demo. Deliberately a full page load (not a client-side route change)
// so the demo always mounts fresh: no page-transition race, no stale state from the previous page.
export default function DemoLink({ themeId, className = '', children, ...rest }) {
  return (
    <a href={`/themes/${themeId}`} className={className} {...rest}>
      {children}
    </a>
  );
}
