import {
  Building,
  Building2,
  Factory,
  GraduationCap,
  Home,
  Hotel,
  Landmark,
  SquarePlus,
  Store,
  Warehouse,
} from 'lucide-react';

export const industrySectors = [
  { label: 'Homes', icon: Home },
  { label: 'Retail & shops', icon: Store },
  { label: 'Schools & colleges', icon: GraduationCap },
  { label: 'Hospitals & clinics', icon: SquarePlus },
  { label: 'Corporate offices', icon: Building2 },
  { label: 'Hotels', icon: Hotel },
  { label: 'Factories & industries', icon: Factory },
  { label: 'Apartments & societies', icon: Building },
  { label: 'Commercial spaces', icon: Landmark },
  { label: 'Farms & farmhouses', icon: Warehouse },
];

/**
 * 10-Sector visual matrix displaying key areas of operation with gold line iconography.
 * Replaces the static paragraph with a structured, high-contrast visual grid.
 */
export function IndustrySectorsGrid() {
  return (
    <div data-reveal="up" className="mx-auto mb-10 max-w-5xl sm:mb-12">
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-navy-950 shadow-2xl">
        <div className="grid grid-cols-2 border-l border-t border-white/10 sm:grid-cols-3 md:grid-cols-5">
          {industrySectors.map((sector) => {
            const Icon = sector.icon;
            return (
              <div
                key={sector.label}
                className="group flex flex-col items-center justify-center border-b border-r border-white/10 p-5 text-center transition-all duration-200 hover:bg-white/[0.04] sm:p-6"
              >
                <Icon
                  aria-hidden="true"
                  className="size-6 text-gold-400 transition-transform duration-200 group-hover:scale-110"
                  strokeWidth={1.75}
                />
                <span className="mt-3 text-xs font-medium text-white/85 transition-colors group-hover:text-white sm:text-sm">
                  {sector.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
