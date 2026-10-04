import type { Industry, IndustryId } from '@/types/content';

/**
 * Industries describe where PPAB's offerings apply. They intentionally make no claims
 * about past clients or completed work — that belongs in verified project records.
 */
export const industries: Industry[] = [
  {
    id: 'residential',
    name: 'Residential',
    icon: 'home',
    audience: 'Homes, villas, apartments and housing societies',
    headline: 'Safer, Smarter & Better-Connected Homes',
    summary:
      'From the entrance gate to the rooftop, PPAB brings together security, connectivity, solar energy, and property expertise to create safer, more comfortable, and efficient homes and residential communities.',
    needs: [
      'Know who is at the door before opening it',
      'Watch gates, entrances and parking',
      'Strong Wi-Fi in every room',
      'Lower electricity bills with rooftop solar',
      'Plan, build, furnish or renovate a home',
    ],
    solutions: [
      { division: 'secure', services: ['CCTV Camera', 'Video Door Phone'] },
      { division: 'connect', services: ['Wi-Fi', 'Routers'] },
      { division: 'solar', services: ['On-Grid Solar', 'Hybrid Solar'] },
      { division: 'space', services: ['Real Estate', 'Architecture'] },
    ],
    imageId: 'industry-residential',
    seo: {
      title: 'Residential Solutions: CCTV, Wi-Fi, Solar & Home Construction',
      description:
        'CCTV, video door phones, home Wi-Fi, rooftop solar, architecture, interiors and construction for homes and housing societies.',
    },
  },
  {
    id: 'education',
    name: 'Education',
    icon: 'education',
    audience: 'Schools, colleges, coaching centres and campuses',
    headline: 'Secure, Connected & Efficient Campuses',
    summary:
      'Educational campuses need safe premises, reliable connectivity, and smart systems that make everyday administration easier. PPAB brings these solutions together for schools, colleges, and educational institutions.',
    tagline: 'One Campus. One Integrated Solution.',
    needs: [
      'Coverage of gates, corridors and common areas',
      'Attendance for staff and students',
      'Campus-wide network and Wi-Fi',
      'School ERP, website and communication',
      'Solar power and street lighting across the campus',
    ],
    solutions: [
      { division: 'secure', services: ['CCTV Camera', 'Biometric Attendance'] },
      { division: 'connect', services: ['LAN / CAN', 'Wi-Fi'] },
      { division: 'digital', services: ['Website Development', 'School ERP / School Software'] },
      { division: 'solar', services: ['On-Grid Solar', 'Solar Street Light'] },
    ],
    imageId: 'industry-education',
    seo: {
      title: 'Education Solutions: Campus CCTV, Networking, ERP & Solar',
      description:
        'CCTV, biometric attendance, campus networking, Wi-Fi, school ERP, websites and solar for schools, colleges and campuses.',
    },
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    icon: 'healthcare',
    audience: 'Hospitals, clinics, nursing homes and diagnostic centres',
    headline: 'Secure, Connected & Reliable Healthcare Facilities',
    summary:
      'Hospitals and clinics need dependable infrastructure to keep patients, staff, and daily operations safe and connected. PPAB provides integrated solutions for security, networking, backup power, and digital management.',
    tagline: 'Reliable Infrastructure. Better Care.',
    needs: [
      'Coverage of entrances, wards and visitor areas',
      'Attendance across shifts',
      'Reliable network for systems and devices',
      'Solar with battery backup',
      'Patient-facing website and CRM',
    ],
    solutions: [
      { division: 'secure', services: ['CCTV Camera', 'Biometric Attendance'] },
      { division: 'connect', services: ['LAN / CAN', 'Wi-Fi'] },
      { division: 'solar', services: ['Hybrid Solar', 'Solar Battery'] },
      { division: 'digital', services: ['Website Development', 'CRM'] },
    ],
    imageId: 'industry-healthcare',
    seo: {
      title: 'Healthcare Solutions: CCTV, Networking, Solar Backup & Digital',
      description:
        'CCTV, attendance, networking, server racks, hybrid solar with battery backup, websites and CRM for hospitals and clinics.',
    },
  },
  {
    id: 'corporate',
    name: 'Corporate',
    icon: 'corporate',
    audience: 'Corporate offices, IT companies and business centres',
    headline: 'Offices that work as well as your team does.',
    summary:
      'Modern offices run on secure premises, fast networks and good software. PPAB delivers the full stack, from the network rack to the CRM.',
    needs: [
      'Attendance and premises security',
      'Structured cabling, Wi-Fi and server racks',
      'IT support after go-live',
      'CRM, ERP and a strong website',
      'Office interiors that suit the way you work',
    ],
    solutions: [
      { division: 'secure', services: ['CCTV Camera', 'Biometric Attendance', 'Video Door Phone'] },
      { division: 'connect', services: ['LAN / CAN', 'Wi-Fi', 'Switches', 'Server Racks', 'IT Support'] },
      { division: 'digital', services: ['CRM', 'ERP', 'Website Development', 'SEO'] },
      { division: 'space', services: ['Interior Design'] },
    ],
    imageId: 'industry-corporate',
    seo: {
      title: 'Corporate Office Solutions: Networking, Security, ERP & Interiors',
      description:
        'Office networking, Wi-Fi, server racks, IT support, CCTV, biometric attendance, CRM, ERP and office interiors.',
    },
  },
  {
    id: 'hospitality',
    name: 'Hospitality',
    icon: 'hospitality',
    audience: 'Hotels, resorts, restaurants and banquet venues',
    headline: 'Memorable Guest Experiences Start with Reliable Infrastructure',
    summary:
      'Hotels and hospitality businesses need more than great service. Guests expect fast Wi-Fi, secure premises, comfortable spaces, and a strong digital presence. PPAB brings these essential solutions together to help hospitality businesses deliver a better guest experience.',
    tagline: 'Better Infrastructure. Better Experiences. Happier Guests.',
    needs: [
      'Guest Wi-Fi across rooms and common areas',
      'Security for lobbies, entrances and parking',
      'Lower energy costs with solar',
      'Visibility through social media and ads',
      'Interiors that reflect your brand',
    ],
    solutions: [
      { division: 'connect', services: ['Wi-Fi', 'Routers'] },
      { division: 'secure', services: ['CCTV Camera', 'Video Door Phone'] },
      { division: 'solar', services: ['On-Grid Solar', 'Hybrid Solar'] },
      { division: 'digital', services: ['Meta Ads', 'Social Media Marketing'] },
      { division: 'space', services: ['Interior Design'] },
    ],
    imageId: 'industry-hospitality',
    seo: {
      title: 'Hospitality Solutions: Guest Wi-Fi, Security, Solar & Branding',
      description:
        'Guest Wi-Fi, CCTV, solar, branding, social media and interior design for hotels, resorts and restaurants.',
    },
  },
  {
    id: 'manufacturing',
    name: 'Manufacturing',
    icon: 'manufacturing',
    audience: 'Factories, plants, warehouses and industrial units',
    headline: 'Industrial Sites That Are Secure, Connected & Powered',
    summary:
      'Manufacturing facilities need reliable security, strong networks across multiple buildings, efficient energy solutions, and digital systems that support daily operations. PPAB brings these capabilities together through one trusted partner.',
    tagline: 'One Partner. Integrated Infrastructure. Smarter Operations.',
    needs: [
      'Perimeter, yard and loading-bay coverage',
      'Workforce attendance',
      'Fiber links between sheds and offices',
      'Industrial-scale solar and solar pumps',
      'ERP to connect operations',
    ],
    solutions: [
      { division: 'secure', services: ['CCTV Camera', 'Biometric Attendance'] },
      { division: 'connect', services: ['Fiber Networking', 'LAN / CAN'] },
      { division: 'solar', services: ['On-Grid Solar', 'Solar Water Pump'] },
      { division: 'digital', services: ['ERP', 'Software Development'] },
      { division: 'space', services: ['Construction'] },
    ],
    imageId: 'industry-manufacturing',
    seo: {
      title: 'Manufacturing & Warehouse Solutions: CCTV, Fiber, Solar & ERP',
      description:
        'Perimeter CCTV, attendance, fiber networking, industrial solar, solar pumps, ERP and construction for factories and warehouses.',
    },
  },
  {
    id: 'commercial',
    name: 'Commercial',
    icon: 'commercial',
    audience: 'Shops, showrooms, malls and commercial complexes',
    headline: 'Commercial spaces that attract, protect and perform.',
    summary:
      'Retail and commercial spaces need security at the counter, connectivity for customers and staff, and marketing that brings people in. PPAB covers all three.',
    needs: [
      'Coverage of counters, entrances and stock areas',
      'Wi-Fi and billing connectivity',
      'Rooftop solar for daytime loads',
      'Local SEO, Google Ads and Meta Ads',
      'Store interiors and property guidance',
    ],
    solutions: [
      { division: 'secure', services: ['CCTV Camera', 'Maintenance & AMC'] },
      { division: 'connect', services: ['Wi-Fi', 'Routers'] },
      { division: 'solar', services: ['On-Grid Solar', 'Net Metering'] },
      { division: 'digital', services: ['SEO', 'Google Ads', 'Meta Ads', 'Graphic Designing'] },
      { division: 'space', services: ['Interior Design', 'Real Estate'] },
    ],
    imageId: 'industry-commercial',
    seo: {
      title: 'Commercial & Retail Solutions: CCTV, Wi-Fi, Solar & Marketing',
      description:
        'CCTV, Wi-Fi, rooftop solar, SEO, Google Ads, Meta Ads, store interiors and property guidance for shops, showrooms and complexes.',
    },
  },
];

export const industryIds = industries.map((i) => i.id);

export function getIndustry(id: IndustryId): Industry {
  const industry = industries.find((i) => i.id === id);
  if (!industry) throw new Error(`Unknown industry: ${id}`);
  return industry;
}

export function isIndustryId(value: string): value is IndustryId {
  return (industryIds as string[]).includes(value);
}
