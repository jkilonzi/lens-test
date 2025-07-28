export interface Event {
  id: string
  title: string
  description: string
  image: string
  attendees: number
  date: string
  type: "upcoming" | "past"
}

export interface Community {
  id: string
  name: string
  country: string
  title: string
  description: string
  image: string
  category: string
  link: string
  flagIcon: string
  heroImage: string
  heroTitle: string
  heroDescription: string
  events: Event[]
}

export const communitiesData: Community[] = [
  {
    id: "ghana",
    name: "Ghana",
    country: "Ghana",
    title: "Sui Community Ghana",
    description:
      "Join our vibrant community in Ghana where we explore the latest developments in blockchain technology, share knowledge, and build connections with fellow enthusiasts.",
    image: "https://i.ibb.co/LDDGGYdF/Screenshot-2025-06-24-141355.png",
    category: "Community",
    link: "/communities/ghana",
    flagIcon: "/Ghana (GH).svg",
    heroImage: "https://i.ibb.co/LDDGGYdF/Screenshot-2025-06-24-141355.png",
    heroTitle: "Game Night in Ghana",
    heroDescription:
      "The Sui community in Ghana is hosting a game night on this date. Lorem ipsum dolor sit amet consectetur. Arcu mauris sed lorem velit commodo diam tristique bibendum ut dictum.",
    events: [
      {
        id: "1",
        title: "Devpool Meetup",
        description: "Developer networking event",
        image: "/placeholder.svg?height=200&width=300",
        attendees: 45,
        date: "2024-02-15",
        type: "upcoming",
      },
      {
        id: "2",
        title: "Content Creators Bootcamp",
        description: "Learn content creation for Web3",
        image: "/placeholder.svg?height=200&width=300",
        attendees: 32,
        date: "2024-02-20",
        type: "upcoming",
      },
    ],
  },
  {
    id: "india",
    name: "India",
    country: "India",
    title: "Sui Community India",
    description:
      "Join our vibrant community in India where we explore the latest developments in blockchain technology, share knowledge, and build connections with fellow enthusiasts.",
    image: "https://i.ibb.co/5hdNKtFT/Screenshot-2025-07-28-235207.png",
    category: "Community",
    link: "/communities/india",
    flagIcon: "/Portugal (PT) (3).svg",
    heroImage: "https://i.ibb.co/5hdNKtFT/Screenshot-2025-07-28-235207.png",
    heroTitle: "Blockchain Innovation in India",
    heroDescription:
      "Join the Sui community in India for cutting-edge blockchain development and innovation workshops.",
    events: [
      {
        id: "3",
        title: "DeFi Workshop",
        description: "Learn DeFi development on Sui",
        image: "/placeholder.svg?height=200&width=300",
        attendees: 67,
        date: "2024-02-18",
        type: "upcoming",
      },
    ],
  },
  {
    id: "korea",
    name: "Korea",
    country: "Korea",
    title: "Sui Community Korea",
    description:
      "Join our vibrant community in Korea where we explore the latest developments in blockchain technology, share knowledge, and build connections with fellow enthusiasts.",
    image: "/cOMMUNITY CARD.png",
    category: "Community",
    link: "/communities/korea",
    flagIcon: "/Portugal (PT).svg",
    heroImage: "/cOMMUNITY CARD.png",
    heroTitle: "Seoul Blockchain Summit",
    heroDescription: "Connect with Korea's leading blockchain developers and entrepreneurs in Seoul.",
    events: [
      {
        id: "4",
        title: "Smart Contract Workshop",
        description: "Advanced smart contract development",
        image: "/placeholder.svg?height=200&width=300",
        attendees: 89,
        date: "2024-02-22",
        type: "upcoming",
      },
    ],
  },
  {
    id: "kenya",
    name: "Kenya",
    country: "Kenya",
    title: "Sui Community Kenya",
    description:
      "The Kenyan chapter of our global community brings together developers, entrepreneurs, and blockchain enthusiasts to collaborate and learn together.",
    image: "https://i.ibb.co/YBvqHqsp/Screenshot-2025-06-24-030451.png",
    category: "Community",
    link: "/communities/kenya",
    flagIcon: "/Portugal (PT) (1).svg",
    heroImage: "https://i.ibb.co/YBvqHqsp/Screenshot-2025-06-24-030451.png",
    heroTitle: "Blockchain Workshop in Kenya",
    heroDescription: "Join the Sui community in Kenya for an intensive blockchain development workshop.",
    events: [
      {
        id: "5",
        title: "Move Programming Workshop",
        description: "Learn Move language basics",
        image: "/placeholder.svg?height=200&width=300",
        attendees: 28,
        date: "2024-02-18",
        type: "upcoming",
      },
    ],
  },
  {
    id: "nigeria",
    name: "Nigeria",
    country: "Nigeria",
    title: "Sui Community Nigeria",
    description:
      "Nigeria's largest blockchain community focused on SUI ecosystem development, education, and creating opportunities for local developers and entrepreneurs.",
    image: "https://i.ibb.co/0jzvvMmY/Screenshot-2025-07-28-234111.png",
    category: "Community",
    link: "/communities/nigeria",
    flagIcon: "/Nigeria (NG).svg",
    heroImage: "https://i.ibb.co/0jzvvMmY/Screenshot-2025-07-28-234111.png",
    heroTitle: "Sui Developer Conference Lagos",
    heroDescription: "The largest Sui developer gathering in West Africa.",
    events: [
      {
        id: "6",
        title: "Web3 Startup Pitch",
        description: "Pitch your Sui-based startup",
        image: "/placeholder.svg?height=200&width=300",
        attendees: 73,
        date: "2024-02-16",
        type: "upcoming",
      },
    ],
  },
  {
    id: "pakistan",
    name: "Pakistan",
    country: "Pakistan",
    title: "SUI Pakistan",
    description:
      "A dedicated space for gamers and blockchain enthusiasts to enjoy themselves and share their passion for gaming.",
    image: "https://i.ibb.co/QjjYs0rH/Screenshot-2025-07-28-232824.png",
    category: "Development",
    link: "/communities/pakistan",
    flagIcon: "/Pakistan (PK).svg",
    heroImage: "https://i.ibb.co/QjjYs0rH/Screenshot-2025-07-28-232824.png",
    heroTitle: "Gaming & Blockchain Pakistan",
    heroDescription: "Where gaming meets blockchain technology in Pakistan.",
    events: [
      {
        id: "7",
        title: "Gaming DApp Workshop",
        description: "Build gaming dApps on Sui",
        image: "/placeholder.svg?height=200&width=300",
        attendees: 45,
        date: "2024-02-20",
        type: "upcoming",
      },
    ],
  },
  {
    id: "vietnam",
    name: "Vietnam",
    country: "Vietnam",
    title: "SUI Community Vietnam",
    description:
      "A dedicated space for gamers and blockchain enthusiasts to enjoy themselves and share their passion for gaming.",
    image: "https://i.ibb.co/NgpSDJMW/Screenshot-2025-07-28-233205.png",
    category: "Development",
    link: "/communities/vietnam",
    flagIcon: "/Vietnam (VN).svg",
    heroImage: "https://i.ibb.co/NgpSDJMW/Screenshot-2025-07-28-233205.png",
    heroTitle: "Vietnam Blockchain Hub",
    heroDescription: "Connecting Vietnam's blockchain community through innovation and collaboration.",
    events: [
      {
        id: "8",
        title: "Blockchain Basics",
        description: "Introduction to blockchain development",
        image: "/placeholder.svg?height=200&width=300",
        attendees: 56,
        date: "2024-02-25",
        type: "upcoming",
      },
    ],
  },
  {
    id: "portugal",
    name: "Portugal",
    country: "Portugal",
    title: "SUI Community Portugal",
    description:
      "A dedicated space for gamers and blockchain enthusiasts to enjoy themselves and share their passion for gaming.",
    image: "https://i.ibb.co/Y4k6M6p1/Screenshot-2025-07-28-235104.png",
    category: "Development",
    link: "/communities/portugal",
    flagIcon: "/Portugal (PT) (2).svg",
    heroImage: "https://i.ibb.co/Y4k6M6p1/Screenshot-2025-07-28-235104.png",
    heroTitle: "Portugal Tech Meetup",
    heroDescription: "Exploring the future of blockchain technology in Portugal.",
    events: [
      {
        id: "9",
        title: "Tech Innovation Summit",
        description: "Latest in blockchain innovation",
        image: "/placeholder.svg?height=200&width=300",
        attendees: 78,
        date: "2024-03-01",
        type: "upcoming",
      },
    ],
  },
  {
    id: "turkiye",
    name: "Turkiye",
    country: "Turkiye",
    title: "SUI Community Turkiye",
    description:
      "A dedicated space for gamers and blockchain enthusiasts to enjoy themselves and share their passion for gaming.",
    image: "https://i.ibb.co/Jjf3bj6M/Screenshot-2025-07-28-234949.png",
    category: "Development",
    link: "/communities/turkiye",
    flagIcon: "/Portugal (PT) (4).svg",
    heroImage: "https://i.ibb.co/Jjf3bj6M/Screenshot-2025-07-28-234949.png",
    heroTitle: "Turkiye Blockchain Conference",
    heroDescription: "Building the future of blockchain in Turkiye.",
    events: [
      {
        id: "10",
        title: "Developer Bootcamp",
        description: "Intensive blockchain development training",
        image: "/placeholder.svg?height=200&width=300",
        attendees: 92,
        date: "2024-03-05",
        type: "upcoming",
      },
    ],
  },
  {
    id: "japan",
    name: "Japan",
    country: "Japan",
    title: "SUI Community Japan",
    description:
      "A dedicated space for gamers and blockchain enthusiasts to enjoy themselves and share their passion for gaming.",
    image: "https://i.ibb.co/M58pNWTd/Screenshot-2025-07-28-234306.png",
    category: "Development",
    link: "/communities/japan",
    flagIcon: "/Portugal (PT) (5).svg",
    heroImage: "https://i.ibb.co/M58pNWTd/Screenshot-2025-07-28-234306.png",
    heroTitle: "Japan Innovation Lab",
    heroDescription: "Where traditional meets innovation in Japan's blockchain scene.",
    events: [
      {
        id: "11",
        title: "AI & Blockchain Fusion",
        description: "Exploring AI integration with blockchain",
        image: "/placeholder.svg?height=200&width=300",
        attendees: 134,
        date: "2024-03-08",
        type: "upcoming",
      },
    ],
  },
  {
    id: "china",
    name: "China",
    country: "China",
    title: "SUI Community China",
    description:
      "A dedicated space for gamers and blockchain enthusiasts to enjoy themselves and share their passion for gaming.",
    image: "https://i.ibb.co/cXJkR8pz/Screenshot-2025-07-28-234503.png",
    category: "Development",
    link: "/communities/china",
    flagIcon: "/Portugal (PT) (6).svg",
    heroImage: "https://i.ibb.co/cXJkR8pz/Screenshot-2025-07-28-234503.png",
    heroTitle: "China Blockchain Summit",
    heroDescription: "Leading blockchain innovation in China.",
    events: [
      {
        id: "12",
        title: "Enterprise Blockchain",
        description: "Blockchain solutions for enterprises",
        image: "/placeholder.svg?height=200&width=300",
        attendees: 156,
        date: "2024-03-12",
        type: "upcoming",
      },
    ],
  },
  {
    id: "uganda",
    name: "Uganda",
    country: "Uganda",
    title: "SUI Community Uganda",
    description:
      "A dedicated space for gamers and blockchain enthusiasts to enjoy themselves and share their passion for gaming.",
    image: "https://i.ibb.co/5gcT3VTc/Screenshot-2025-07-28-233947.png",
    category: "Development",
    link: "/communities/uganda",
    flagIcon: "/Portugal (PT) (7).svg",
    heroImage: "https://i.ibb.co/5gcT3VTc/Screenshot-2025-07-28-233947.png",
    heroTitle: "Uganda Tech Revolution",
    heroDescription: "Driving blockchain adoption across Uganda.",
    events: [
      {
        id: "13",
        title: "Fintech & Blockchain",
        description: "Financial technology meets blockchain",
        image: "/placeholder.svg?height=200&width=300",
        attendees: 67,
        date: "2024-03-15",
        type: "upcoming",
      },
    ],
  },
  {
    id: "phillipines",
    name: "Philippines",
    country: "Philippines",
    title: "SUI Community Philippines",
    description:
      "A dedicated space for gamers and blockchain enthusiasts to enjoy themselves and share their passion for gaming.",
    image: "https://i.ibb.co/8LR9KvLg/Screenshot-2025-07-28-233810.png",
    category: "Development",
    link: "/communities/phillipines",
    flagIcon: "/Portugal (PT) (8).svg",
    heroImage: "https://i.ibb.co/8LR9KvLg/Screenshot-2025-07-28-233810.png",
    heroTitle: "Philippines Blockchain Hub",
    heroDescription: "Connecting the Philippines blockchain ecosystem.",
    events: [
      {
        id: "14",
        title: "Island Chain Network",
        description: "Decentralized networks for island nations",
        image: "/placeholder.svg?height=200&width=300",
        attendees: 89,
        date: "2024-03-18",
        type: "upcoming",
      },
    ],
  },
  {
    id: "indonesia",
    name: "Indonesia",
    country: "Indonesia",
    title: "SUI Community Indonesia",
    description:
      "A dedicated space for gamers and blockchain enthusiasts to enjoy themselves and share their passion for gaming.",
    image: "https://i.ibb.co/zHGXK8DM/Screenshot-2025-07-28-233403.png",
    category: "Development",
    link: "/communities/indonesia",
    flagIcon: "/Uganda (UG).svg",
    heroImage: "https://i.ibb.co/zHGXK8DM/Screenshot-2025-07-28-233403.png",
    heroTitle: "Indonesia Digital Future",
    heroDescription: "Building Indonesia's digital blockchain future.",
    events: [
      {
        id: "15",
        title: "Digital Economy Summit",
        description: "Blockchain in digital economy",
        image: "/placeholder.svg?height=200&width=300",
        attendees: 123,
        date: "2024-03-22",
        type: "upcoming",
      },
    ],
  },
  {
    id: "france",
    name: "France",
    country: "France",
    title: "SUI Community France",
    description:
      "A dedicated space for gamers and blockchain enthusiasts to enjoy themselves and share their passion for gaming.",
    image: "https://i.ibb.co/pjRM3qg1/Screenshot-2025-07-28-235342.png",
    category: "Development",
    link: "/communities/france",
    flagIcon: "/Uganda (UG) (1).svg",
    heroImage: "https://i.ibb.co/pjRM3qg1/Screenshot-2025-07-28-235342.png",
    heroTitle: "France Innovation Lab",
    heroDescription: "Leading European blockchain innovation from France.",
    events: [
      {
        id: "16",
        title: "European Blockchain Alliance",
        description: "Building blockchain bridges across Europe",
        image: "/placeholder.svg?height=200&width=300",
        attendees: 145,
        date: "2024-03-25",
        type: "upcoming",
      },
    ],
  },
]

export function getCommunityById(id: string): Community | undefined {
  return communitiesData.find((community) => community.id === id)
}

export function getAllCommunities(): Community[] {
  return communitiesData
}
