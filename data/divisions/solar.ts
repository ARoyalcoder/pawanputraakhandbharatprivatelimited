import type { Division, IconName } from '@/types/content';

export const solar: Division = {
  id: 'solar',
  name: 'Pawan Putra Solar',
  short: 'Solar',
  tagline: 'Suraj Ki Shakti, Aapki Bachat',
  summary:
    'On-grid, off-grid and hybrid solar with water pumps, street lights, net metering, batteries, inverters, cleaning and AMC.',
  overview:
    'Pawan Putra Solar helps homes, businesses and industries move to solar with a system chosen for their site and usage. We cover the full journey: understanding your requirement, recommending on-grid, off-grid or hybrid, installing panels, inverters and batteries, supporting net metering, and keeping the system clean and maintained.',
  icon: 'sun',
  href: '/solutions/solar',
  imageId: 'solar-overview',
  services: [
    { id: 'on-grid', name: 'On-Grid Solar', summary: 'Grid-connected systems that use solar power during the day alongside your electricity connection.', icon: 'on-grid' },
    { id: 'off-grid', name: 'Off-Grid Solar', summary: 'Standalone systems with battery storage for places without a dependable grid supply.', icon: 'off-grid' },
    { id: 'hybrid', name: 'Hybrid Solar', summary: 'Grid-connected systems with battery backup: solar by day, stored energy when you need it.', icon: 'hybrid' },
    { id: 'water-pump', name: 'Solar Water Pump', summary: 'Solar-powered pumping for agriculture, irrigation and water supply.', icon: 'pump' },
    { id: 'street-light', name: 'Solar Street Light', summary: 'Self-powered lighting for roads, campuses, societies and open areas.', icon: 'street-light' },
    { id: 'net-metering', name: 'Net Metering', summary: 'Guidance and support with the net metering process for grid-connected systems.', icon: 'meter' },
    { id: 'cleaning', name: 'Solar Cleaning', summary: 'Panel cleaning so dust and debris do not hold back your system.', icon: 'cleaning' },
    { id: 'amc', name: 'Solar AMC', summary: 'Annual maintenance contracts for inspection, upkeep and servicing of your system.', icon: 'wrench' },
    { id: 'battery', name: 'Solar Battery', summary: 'Battery storage for off-grid and hybrid systems.', icon: 'battery' },
    { id: 'inverter', name: 'Solar Inverter', summary: 'Inverters that convert solar DC power into usable AC power for your property.', icon: 'inverter' },
  ],
  additionalServices: [],
  faqs: [
    {
      id: 'solar-which',
      question: 'Which solar system is right for my property?',
      answer:
        'It depends on your grid supply, usage and backup needs. On-grid suits properties with a dependable connection, off-grid suits places without one, and hybrid combines the grid with battery backup. Our team recommends a system after understanding your requirement.',
    },
    {
      id: 'solar-net-metering',
      question: 'Do you help with net metering?',
      answer: 'Yes. Net metering support is one of our solar services for grid-connected systems.',
    },
    {
      id: 'solar-maintenance',
      question: 'Do you clean and maintain solar systems?',
      answer: 'Yes. Solar cleaning and Solar AMC are both part of Pawan Putra Solar.',
    },
    {
      id: 'solar-pump',
      question: 'Can solar run a water pump or street lights?',
      answer: 'Yes. Solar water pumps and solar street lights are part of our solar range.',
    },
    {
      id: 'solar-savings',
      question: 'How much will I save?',
      answer:
        'Savings depend on your consumption, property and the system chosen, so we do not publish generic figures. Share your monthly electricity bill and our team will assess your requirement.',
    },
  ],
  seo: {
    title: 'Pawan Putra Solar: On-Grid, Off-Grid & Hybrid Solar',
    description:
      'On-grid, off-grid and hybrid solar, solar water pumps, street lights, net metering, batteries, inverters, cleaning and AMC. Suraj Ki Shakti, Aapki Bachat.',
  },
};

export interface SolarSegment {
  id: 'residential' | 'commercial' | 'industrial';
  name: string;
  description: string;
  fits: string[];
  icon: IconName;
}

export const solarSegments: SolarSegment[] = [
  {
    id: 'residential',
    name: 'Residential',
    description: 'Rooftop systems for independent homes, villas and housing societies.',
    fits: ['On-Grid Solar', 'Hybrid Solar', 'Net Metering', 'Solar Battery'],
    icon: 'home',
  },
  {
    id: 'commercial',
    name: 'Commercial',
    description: 'Solar for offices, shops, showrooms, schools, hospitals and complexes.',
    fits: ['On-Grid Solar', 'Hybrid Solar', 'Solar Street Light', 'Solar AMC'],
    icon: 'commercial',
  },
  {
    id: 'industrial',
    name: 'Industrial',
    description: 'Larger rooftop and ground systems for factories, warehouses and agricultural use.',
    fits: ['On-Grid Solar', 'Solar Water Pump', 'Solar Cleaning', 'Solar AMC'],
    icon: 'manufacturing',
  },
];

export type SolarSystemId = 'on-grid' | 'off-grid' | 'hybrid';

export interface SolarSystemType {
  id: SolarSystemId;
  name: string;
  headline: string;
  description: string;
  suitedFor: string;
  components: string[];
  /** Which energy paths are active in the flow diagram. */
  flows: ('panels-inverter' | 'inverter-home' | 'inverter-grid' | 'grid-home' | 'inverter-battery' | 'battery-home')[];
}

export const solarSystems: SolarSystemType[] = [
  {
    id: 'on-grid',
    name: 'On-Grid',
    headline: 'Solar with the grid',
    description:
      'Panels power your property during the day through an inverter. The grid supplies power when solar is not enough, and net metering records the energy exchanged with it.',
    suitedFor: 'Properties with a dependable grid connection.',
    components: ['Solar panels', 'On-grid inverter', 'Net meter', 'Grid connection'],
    flows: ['panels-inverter', 'inverter-home', 'inverter-grid', 'grid-home'],
  },
  {
    id: 'off-grid',
    name: 'Off-Grid',
    headline: 'Solar with storage, independent of the grid',
    description:
      'Panels charge batteries through the inverter, and the stored energy powers your property when the sun is down. There is no grid connection.',
    suitedFor: 'Locations without a dependable grid supply.',
    components: ['Solar panels', 'Off-grid inverter', 'Solar battery'],
    flows: ['panels-inverter', 'inverter-home', 'inverter-battery', 'battery-home'],
  },
  {
    id: 'hybrid',
    name: 'Hybrid',
    headline: 'Grid-connected, with battery backup',
    description:
      'Solar powers your property and charges batteries. The grid stays connected, and stored energy takes over during outages.',
    suitedFor: 'Properties that want solar plus backup during power cuts.',
    components: ['Solar panels', 'Hybrid inverter', 'Solar battery', 'Grid connection'],
    flows: ['panels-inverter', 'inverter-home', 'inverter-battery', 'battery-home', 'inverter-grid', 'grid-home'],
  },
];

export const solarBenefits: { id: string; title: string; description: string; icon: IconName }[] = [
  { id: 'bill', title: 'Lower electricity bills', description: 'Use the energy your roof produces and depend less on purchased power.', icon: 'meter' },
  { id: 'clean', title: 'Clean, renewable power', description: 'Generate electricity from sunlight, with no fuel and no emissions at the point of use.', icon: 'sun' },
  { id: 'backup', title: 'Backup when you need it', description: 'Off-grid and hybrid systems with batteries keep essentials running.', icon: 'battery' },
  { id: 'care', title: 'Looked after', description: 'Cleaning and AMC options keep your system maintained after installation.', icon: 'wrench' },
];
