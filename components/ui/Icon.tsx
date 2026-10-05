import type { SVGProps } from 'react';
import {
  AppWindow,
  BadgeCheck,
  Battery,
  BatteryCharging,
  BriefcaseBusiness,
  Building2,
  Cable,
  CalendarCheck,
  Cctv,
  Check,
  CircuitBoard,
  ClipboardCheck,
  Cloud,
  CodeXml,
  Database,
  Droplets,
  EthernetPort,
  Eye,
  Factory,
  Fingerprint,
  Gauge,
  Globe,
  GraduationCap,
  Handshake,
  HardHat,
  Headset,
  Hotel,
  House,
  Key,
  LampWallDown,
  LandPlot,
  Layers,
  LayoutDashboard,
  Mail,
  MapPin,
  Megaphone,
  Network,
  PenTool,
  Phone,
  PlugZap,
  Radio,
  Router,
  Ruler,
  Scale,
  Search,
  Server,
  Settings2,
  Share2,
  Shield,
  Smartphone,
  Sofa,
  Sparkles,
  Stethoscope,
  Store,
  Sun,
  Target,
  UsersRound,
  Video,
  Volume2,
  Wifi,
  Workflow,
  Wrench,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import type { IconName } from '@/types/content';

const registry: Record<IconName, LucideIcon> = {
  cctv: Cctv,
  'video-door': Video,
  fingerprint: Fingerprint,
  wrench: Wrench,
  shield: Shield,
  intercom: Phone,
  speaker: Volume2,
  fiber: Cable,
  lan: Network,
  wifi: Wifi,
  router: Router,
  switch: EthernetPort,
  server: Server,
  support: Headset,
  isp: Radio,
  sun: Sun,
  'on-grid': PlugZap,
  'off-grid': BatteryCharging,
  hybrid: Zap,
  pump: Droplets,
  'street-light': LampWallDown,
  meter: Gauge,
  cleaning: Sparkles,
  battery: Battery,
  inverter: CircuitBoard,
  code: CodeXml,
  smartphone: Smartphone,
  software: AppWindow,
  erp: LayoutDashboard,
  crm: UsersRound,
  seo: Search,
  'google-ads': Target,
  'meta-ads': Megaphone,
  social: Share2,
  branding: BadgeCheck,
  design: PenTool,
  building: Building2,
  architecture: Ruler,
  interior: Sofa,
  construction: HardHat,
  property: Key,
  home: House,
  education: GraduationCap,
  healthcare: Stethoscope,
  corporate: BriefcaseBusiness,
  hospitality: Hotel,
  manufacturing: Factory,
  commercial: Store,
  phone: Phone,
  mail: Mail,
  'map-pin': MapPin,
  clipboard: ClipboardCheck,
  calendar: CalendarCheck,
  handshake: Handshake,
  settings: Settings2,
  layers: Layers,
  workflow: Workflow,
  eye: Eye,
  globe: Globe,
  cloud: Cloud,
  database: Database,
  check: Check,
  scale: Scale,
  plot: LandPlot,
};

interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'ref'> {
  name: IconName;
  size?: number;
  strokeWidth?: number;
}

/** Brand icon set. Decorative by default; pass aria-label to expose meaning. */
export function Icon({ name, size = 20, strokeWidth = 1.6, ...rest }: IconProps) {
  const Component = registry[name];
  const labelled = Boolean(rest['aria-label']);
  return <Component size={size} strokeWidth={strokeWidth} aria-hidden={labelled ? undefined : true} {...rest} />;
}

export function WhatsAppIcon({ size = 20, ...rest }: Omit<SVGProps<SVGSVGElement>, 'ref'> & { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...rest}>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.87 9.87 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.22-8.24 8.22Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.43-.06-.13-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28Z" />
    </svg>
  );
}

export function FacebookIcon({ size = 20, ...rest }: Omit<SVGProps<SVGSVGElement>, 'ref'> & { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...rest}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

export function InstagramIcon({ size = 20, ...rest }: Omit<SVGProps<SVGSVGElement>, 'ref'> & { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...rest}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}
