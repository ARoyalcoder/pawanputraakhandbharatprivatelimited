import type { Division, IconName } from '@/types/content';

export const connect: Division = {
  id: 'connect',
  name: 'Pawan Putra Connect',
  short: 'Connect',
  tagline: 'Har Connection Mein Bharosa',
  subTagline: 'Smart Networks. Stronger Connections.',
  summary:
    'Fiber networking, LAN/CAN, Wi-Fi, routers, switches, server racks and IT support, designed as one network you can depend on.',
  overview:
    'Pawan Putra Connect plans and builds the network your people, cameras and systems depend on. From fiber runs and structured cabling to Wi-Fi coverage, switching and server racks, we treat the network as one connected system and support it after go-live.',
  icon: 'lan',
  href: '/solutions/connect',
  imageId: 'connect-overview',
  services: [
    {
      id: 'fiber-networking',
      name: 'Fiber Networking',
      summary: 'Fiber optic links between buildings, floors and network rooms for high-capacity, long-distance connectivity.',
      icon: 'fiber',
    },
    {
      id: 'lan-can',
      name: 'LAN / CAN',
      summary: 'Structured local-area and campus-area cabling that keeps every floor and building organised and connected.',
      icon: 'lan',
    },
    {
      id: 'wifi',
      name: 'Wi-Fi',
      summary: 'Wireless coverage planned around your floor plan and users, so connectivity reaches where it is needed.',
      icon: 'wifi',
    },
    {
      id: 'routers',
      name: 'Routers',
      summary: 'Router selection and configuration for internet access, branch connectivity and secure links.',
      icon: 'router',
    },
    {
      id: 'switches',
      name: 'Switches',
      summary: 'Switching that connects computers, cameras, access points and servers across your network.',
      icon: 'switch',
    },
    {
      id: 'server-racks',
      name: 'Server Racks',
      summary: 'Rack installation, cable management and power layout for tidy, serviceable network rooms.',
      icon: 'server',
    },
    {
      id: 'it-support',
      name: 'IT Support',
      summary: 'Ongoing IT support and maintenance for your network and connected devices.',
      icon: 'support',
    },
  ],
  additionalServices: ['ISP Network Solutions', 'Structured Cabling', 'IT Maintenance'],
  faqs: [
    {
      id: 'connect-offer',
      question: 'What does Pawan Putra Connect cover?',
      answer:
        'Fiber networking, LAN/CAN cabling, Wi-Fi, routers, switches, server racks and IT support. ISP network solutions are also part of the PPAB offering.',
    },
    {
      id: 'connect-campus',
      question: 'Can you network a multi-building campus?',
      answer:
        'Yes. LAN/CAN (campus area network) and fiber networking are core Connect services, used to link floors and buildings into one network.',
    },
    {
      id: 'connect-cctv',
      question: 'Can the same network carry our CCTV cameras?',
      answer:
        'Yes. Our Secure and Connect teams can plan IP cameras, PoE switches and network cabling together as one system.',
    },
    {
      id: 'connect-support',
      question: 'Do you support the network after installation?',
      answer: 'IT support and maintenance are part of Pawan Putra Connect.',
    },
  ],
  seo: {
    title: 'Pawan Putra Connect: Fiber, LAN, Wi-Fi & IT Support',
    description:
      'Fiber networking, LAN/CAN cabling, Wi-Fi, routers, switches, server racks and IT support for homes, offices, campuses and industry. Har Connection Mein Bharosa.',
  },
};

export interface NetworkNode {
  id: string;
  label: string;
  description: string;
  icon: IconName;
}

/** The path traffic takes through a typical PPAB-designed network. */
export const networkFlow: NetworkNode[] = [
  { id: 'internet', label: 'Internet', description: 'Your service provider hands over connectivity at the edge of the premises.', icon: 'globe' },
  { id: 'fiber', label: 'Fiber', description: 'Fiber links carry that connectivity across long runs, between buildings and floors.', icon: 'fiber' },
  { id: 'router', label: 'Router', description: 'The router manages internet access, routing and security at the network edge.', icon: 'router' },
  { id: 'switch', label: 'Switch', description: 'Switches distribute the network to every floor, room, camera and access point.', icon: 'switch' },
  { id: 'server', label: 'Server', description: 'Racked servers and recorders store data and run the systems your team relies on.', icon: 'server' },
  { id: 'devices', label: 'Devices', description: 'Computers, phones, Wi-Fi users, cameras and attendance devices stay connected.', icon: 'smartphone' },
];
