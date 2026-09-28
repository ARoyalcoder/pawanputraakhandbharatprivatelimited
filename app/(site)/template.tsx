/**
 * Re-mounts on every navigation, giving each page a short, fast entrance.
 * Pure CSS so it never delays navigation or depends on hydration.
 */
export default function SiteTemplate({ children }: { children: React.ReactNode }) {
  return <div className="motion-safe:animate-page-in">{children}</div>;
}
