'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image'; 
import Link from 'next/link';
import { use } from 'react'; // Import the use hook
import { Menu } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { ConnectButton } from '@mysten/dapp-kit';
import { useUser } from '@/context/UserContext';

interface CommunityEventsPageProps {
  params: Promise<{
    community: string;
  }>;
}

const CommunityEventsPage: React.FC<CommunityEventsPageProps> = ({ params }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useUser();
  
  // Await the params using React's use hook
  const resolvedParams = use(params);
  
  // Community data with events for each community
  const communityData = {
    ghana: {
      name: 'Ghana',
      flagIcon: '/Ghana (GH).svg',
      mainEvent: {
        title: 'Game Night in Ghana',
        image: 'https://i.ibb.co/8DGCTXfs/Go-Qzp-CXYAAgop4.jpg',
        description: 'The Sui community in Ghana is hosting a game night. Join us for an evening of fun games, networking, and learning about the latest developments in the Sui ecosystem.',
        date: 'June 24, 2025, 02:23 PM EAT',
      },
      otherEvents: [
        {
          title: 'Developer Meetup Ghana',
          image: 'https://via.placeholder.com/300x200?text=Developer+Meetup+Ghana',
          type: 'Meetup',
          date: 'July 5, 2025'
        },
        {
          title: 'CONTENT CREATORS BOOTCAMP',
          image: 'https://via.placeholder.com/300x200?text=Content+Creators+Bootcamp',
          type: 'Bootcamp',
          date: 'July 12, 2025'
        },
        {
          title: 'Sui Community Meetup Accra',
          image: 'https://via.placeholder.com/300x200?text=Sui+Community+Meetup',
          type: 'Meetup',
          date: 'July 18, 2025'
        },
        {
          title: 'Developers Night Ghana',
          image: 'https://via.placeholder.com/300x200?text=Developers+Night',
          type: 'Night Event',
          date: 'July 25, 2025'
        },
      ]
    },
    india: {
      name: 'India',
      flagIcon: '/Portugal (PT) (3).svg', // You mentioned this is used for India
      mainEvent: {
        title: 'Sui Blockchain Workshop India',
        image: 'https://i.ibb.co/5hdNKtFT/Screenshot-2025-07-28-235207.png',
        description: 'Join the largest blockchain workshop in India focused on Sui ecosystem development, smart contracts, and dApp building.',
        date: 'August 15, 2025, 10:00 AM IST',
      },
      otherEvents: [
        {
          title: 'Mumbai Developer Meetup',
          image: 'https://via.placeholder.com/300x200?text=Mumbai+Developer+Meetup',
          type: 'Meetup',
          date: 'August 20, 2025'
        },
        {
          title: 'Bangalore Sui Community',
          image: 'https://via.placeholder.com/300x200?text=Bangalore+Sui+Community',
          type: 'Community',
          date: 'August 22, 2025'
        },
        {
          title: 'Delhi Blockchain Conference',
          image: 'https://via.placeholder.com/300x200?text=Delhi+Blockchain+Conference',
          type: 'Conference',
          date: 'August 28, 2025'
        },
        {
          title: 'Hyderabad Tech Talk',
          image: 'https://via.placeholder.com/300x200?text=Hyderabad+Tech+Talk',
          type: 'Tech Talk',
          date: 'September 5, 2025'
        },
      ]
    },
    korea: {
      name: 'Korea',
      flagIcon: '/Portugal (PT).svg',
      mainEvent: {
        title: 'Seoul Sui Summit 2025',
        image: '/cOMMUNITY CARD.png',
        description: 'The biggest Sui community event in Korea featuring keynote speakers, workshops, and networking opportunities.',
        date: 'September 10, 2025, 09:00 AM KST',
      },
      otherEvents: [
        {
          title: 'Busan Developer Workshop',
          image: 'https://via.placeholder.com/300x200?text=Busan+Developer+Workshop',
          type: 'Workshop',
          date: 'September 15, 2025'
        },
        {
          title: 'Korea Sui Gaming Event',
          image: 'https://via.placeholder.com/300x200?text=Korea+Sui+Gaming',
          type: 'Gaming',
          date: 'September 20, 2025'
        },
        {
          title: 'Incheon Blockchain Meetup',
          image: 'https://via.placeholder.com/300x200?text=Incheon+Blockchain',
          type: 'Meetup',
          date: 'September 25, 2025'
        },
        {
          title: 'Daegu Tech Conference',
          image: 'https://via.placeholder.com/300x200?text=Daegu+Tech+Conference',
          type: 'Conference',
          date: 'October 1, 2025'
        },
      ]
    },
    kenya: {
      name: 'Kenya',
      flagIcon: '/Portugal (PT) (1).svg',
      mainEvent: {
        title: 'Nairobi Blockchain Festival',
        image: 'https://i.ibb.co/YBvqHqsp/Screenshot-2025-06-24-030451.png',
        description: 'Kenya\'s premier blockchain event bringing together developers, entrepreneurs, and innovators in the Sui ecosystem.',
        date: 'October 12, 2025, 08:00 AM EAT',
      },
      otherEvents: [
        {
          title: 'Mombasa Developer Bootcamp',
          image: 'https://via.placeholder.com/300x200?text=Mombasa+Developer+Bootcamp',
          type: 'Bootcamp',
          date: 'October 18, 2025'
        },
        {
          title: 'Kisumu Sui Workshop',
          image: 'https://via.placeholder.com/300x200?text=Kisumu+Sui+Workshop',
          type: 'Workshop',
          date: 'October 22, 2025'
        },
        {
          title: 'Nakuru Tech Meetup',
          image: 'https://via.placeholder.com/300x200?text=Nakuru+Tech+Meetup',
          type: 'Meetup',
          date: 'October 28, 2025'
        },
        {
          title: 'Eldoret Innovation Hub',
          image: 'https://via.placeholder.com/300x200?text=Eldoret+Innovation',
          type: 'Innovation',
          date: 'November 5, 2025'
        },
      ]
    },
    nigeria: {
      name: 'Nigeria',
      flagIcon: '/Nigeria (NG).svg',
      mainEvent: {
        title: 'Lagos Sui Conference 2025',
        image: 'https://i.ibb.co/0jzvvMmY/Screenshot-2025-07-28-234111.png',
        description: 'Nigeria\'s largest blockchain conference focused on Sui ecosystem development and African blockchain adoption.',
        date: 'November 15, 2025, 09:00 AM WAT',
      },
      otherEvents: [
        {
          title: 'Abuja Developer Meetup',
          image: 'https://via.placeholder.com/300x200?text=Abuja+Developer',
          type: 'Meetup',
          date: 'November 20, 2025'
        },
        {
          title: 'Port Harcourt Tech Summit',
          image: 'https://via.placeholder.com/300x200?text=Port+Harcourt+Tech',
          type: 'Summit',
          date: 'November 25, 2025'
        },
        {
          title: 'Kano Blockchain Workshop',
          image: 'https://via.placeholder.com/300x200?text=Kano+Blockchain',
          type: 'Workshop',
          date: 'December 2, 2025'
        },
        {
          title: 'Ibadan Innovation Day',
          image: 'https://via.placeholder.com/300x200?text=Ibadan+Innovation',
          type: 'Innovation',
          date: 'December 8, 2025'
        },
      ]
    },
    pakistan: {
      name: 'Pakistan',
      flagIcon: '/Pakistan (PK).svg', // You'll need to add this flag
      mainEvent: {
        title: 'Karachi Blockchain Summit 2025',
        image: 'https://i.ibb.co/dwsfkSxh/m-image-kw6-KKXO7v-KPlb5-Xtz-MAR.jpg',
        description: 'Pakistan\'s premier blockchain event bringing together developers, entrepreneurs, and innovators in the Sui ecosystem.',
        date: 'December 15, 2025, 10:00 AM PKT',
      },
      otherEvents: [
        {
          title: 'Lahore Developer Meetup',
          image: 'https://i.ibb.co/YFDT9gmF/images-q-tbn-ANd9-Gc-Tq-PC3-Dzz-Bqv-Ced-TVKYm-a-OQVf-Hk-Ev6-Bm-V0-Lg-s.jpg',
          type: 'Meetup',
          date: 'December 20, 2025'
        },
        {
          title: 'Islamabad Tech Workshop',
          image: 'https://i.ibb.co/LDGjwHMh/shafiqa-event-islamabad-2024-3-1024x823.jpg',
          type: 'Workshop',
          date: 'December 25, 2025'
        },
        {
          title: 'Faisalabad Innovation Hub',
          image: 'https://i.ibb.co/8n6xskYJ/1710907422.jpg',
          type: 'Innovation',
          date: 'January 2, 2026'
        },
        {
          title: 'Peshawar Blockchain Conference',
          image: 'https://via.placeholder.com/300x200?text=Peshawar+Blockchain',
          type: 'Conference',
          date: 'January 8, 2026'
        },
      ]
    },
    china: {
      name: 'China',
      flagIcon: '/Portugal (PT) (6).svg', // Using the same flag as in your communities page
      mainEvent: {
        title: 'Shanghai Sui Summit 2025',
        image: 'https://i.ibb.co/cXJkR8pz/Screenshot-2025-07-28-234503.png', // Using the same image as in your communities page
        description: 'China\'s premier blockchain event bringing together developers, entrepreneurs, and innovators in the Sui ecosystem.',
        date: 'January 15, 2026, 09:00 AM CST',
      },
      otherEvents: [
        {
          title: 'Beijing Developer Workshop',
          image: 'https://i.ibb.co/mFMv82h9/sui-og.webp',
          type: 'Workshop',
          date: 'January 20, 2026'
        },
        {
          title: 'Shenzhen Tech Meetup',
          image: 'https://i.ibb.co/GQzvvKpy/kh71-T2673m.jpg',
          type: 'Meetup',
          date: 'January 25, 2026'
        },
        {
          title: 'Guangzhou Innovation Hub',
          image: 'https://i.ibb.co/FkGKLjhZ/sui-workshop-3.webp',
          type: 'Innovation',
          date: 'February 1, 2026'
        },
        {
          title: 'Hangzhou Blockchain Conference',
          image: 'https://i.ibb.co/MkKGndcS/hq720.jpg',
          type: 'Conference',
          date: 'February 8, 2026'
        },
      ]
    },
    vietnam: {
      name: 'Vietnam',
      flagIcon: '/Vietnam (VN).svg',
      mainEvent: {
        title: 'Ho Chi Minh City Blockchain Summit',
        image: 'https://i.ibb.co/NgpSDJMW/Screenshot-2025-07-28-233205.png',
        description: 'Vietnam\'s largest blockchain event focused on Sui ecosystem development and Southeast Asian blockchain adoption.',
        date: 'February 15, 2026, 09:00 AM ICT',
      },
      otherEvents: [
        {
          title: 'Hanoi Developer Meetup',
          image: 'https://via.placeholder.com/300x200?text=Hanoi+Developer',
          type: 'Meetup',
          date: 'February 20, 2026'
        },
        {
          title: 'Da Nang Tech Workshop',
          image: 'https://via.placeholder.com/300x200?text=Da+Nang+Tech',
          type: 'Workshop',
          date: 'February 25, 2026'
        },
        {
          title: 'Can Tho Innovation Hub',
          image: 'https://via.placeholder.com/300x200?text=Can+Tho+Innovation',
          type: 'Innovation',
          date: 'March 5, 2026'
        },
        {
          title: 'Hai Phong Blockchain Conference',
          image: 'https://via.placeholder.com/300x200?text=Hai+Phong+Blockchain',
          type: 'Conference',
          date: 'March 12, 2026'
        },
      ]
    },
    portugal: {
      name: 'Portugal',
      flagIcon: '/Portugal (PT) (2).svg',
      mainEvent: {
        title: 'Lisbon Sui Conference 2026',
        image: 'https://i.ibb.co/Y4k6M6p1/Screenshot-2025-07-28-235104.png',
        description: 'Portugal\'s premier blockchain event bringing together European developers and innovators in the Sui ecosystem.',
        date: 'March 20, 2026, 09:00 AM WET',
      },
      otherEvents: [
        {
          title: 'Porto Developer Workshop',
          image: 'https://via.placeholder.com/300x200?text=Porto+Developer',
          type: 'Workshop',
          date: 'March 25, 2026'
        },
        {
          title: 'Coimbra Tech Meetup',
          image: 'https://via.placeholder.com/300x200?text=Coimbra+Tech',
          type: 'Meetup',
          date: 'April 1, 2026'
        },
        {
          title: 'Braga Innovation Summit',
          image: 'https://via.placeholder.com/300x200?text=Braga+Innovation',
          type: 'Summit',
          date: 'April 8, 2026'
        },
        {
          title: 'Faro Blockchain Workshop',
          image: 'https://via.placeholder.com/300x200?text=Faro+Blockchain',
          type: 'Workshop',
          date: 'April 15, 2026'
        },
      ]
    },
    turkiye: {
      name: 'Turkiye',
      flagIcon: '/Portugal (PT) (4).svg',
      mainEvent: {
        title: 'Istanbul Blockchain Summit 2026',
        image: 'https://i.ibb.co/Jjf3bj6M/Screenshot-2025-07-28-234949.png',
        description: 'Turkey\'s largest blockchain conference focused on bridging Europe and Asia through the Sui ecosystem.',
        date: 'April 22, 2026, 09:00 AM TRT',
      },
      otherEvents: [
        {
          title: 'Ankara Developer Meetup',
          image: 'https://via.placeholder.com/300x200?text=Ankara+Developer',
          type: 'Meetup',
          date: 'April 28, 2026'
        },
        {
          title: 'Izmir Tech Workshop',
          image: 'https://via.placeholder.com/300x200?text=Izmir+Tech',
          type: 'Workshop',
          date: 'May 5, 2026'
        },
        {
          title: 'Bursa Innovation Hub',
          image: 'https://via.placeholder.com/300x200?text=Bursa+Innovation',
          type: 'Innovation',
          date: 'May 12, 2026'
        },
        {
          title: 'Antalya Blockchain Conference',
          image: 'https://via.placeholder.com/300x200?text=Antalya+Blockchain',
          type: 'Conference',
          date: 'May 20, 2026'
        },
      ]
    },
    japan: {
      name: 'Japan',
      flagIcon: '/Portugal (PT) (5).svg',
      mainEvent: {
        title: 'Tokyo Sui Summit 2026',
        image: 'https://i.ibb.co/M58pNWTd/Screenshot-2025-07-28-234306.png',
        description: 'Japan\'s premier blockchain event bringing together Asian developers and innovators in the Sui ecosystem.',
        date: 'May 25, 2026, 09:00 AM JST',
      },
      otherEvents: [
        {
          title: 'Osaka Developer Workshop',
          image: 'https://via.placeholder.com/300x200?text=Osaka+Developer',
          type: 'Workshop',
          date: 'June 1, 2026'
        },
        {
          title: 'Kyoto Tech Meetup',
          image: 'https://via.placeholder.com/300x200?text=Kyoto+Tech',
          type: 'Meetup',
          date: 'June 8, 2026'
        },
        {
          title: 'Yokohama Innovation Summit',
          image: 'https://via.placeholder.com/300x200?text=Yokohama+Innovation',
          type: 'Summit',
          date: 'June 15, 2026'
        },
        {
          title: 'Nagoya Blockchain Conference',
          image: 'https://via.placeholder.com/300x200?text=Nagoya+Blockchain',
          type: 'Conference',
          date: 'June 22, 2026'
        },
      ]
    },
    uganda: {
      name: 'Uganda',
      flagIcon: '/Portugal (PT) (7).svg',
      mainEvent: {
        title: 'Kampala Blockchain Festival 2026',
        image: 'https://i.ibb.co/5gcT3VTc/Screenshot-2025-07-28-233947.png',
        description: 'Uganda\'s premier blockchain event bringing together East African developers and innovators in the Sui ecosystem.',
        date: 'June 28, 2026, 08:00 AM EAT',
      },
      otherEvents: [
        {
          title: 'Entebbe Developer Workshop',
          image: 'https://via.placeholder.com/300x200?text=Entebbe+Developer',
          type: 'Workshop',
          date: 'July 5, 2026'
        },
        {
          title: 'Gulu Tech Meetup',
          image: 'https://via.placeholder.com/300x200?text=Gulu+Tech',
          type: 'Meetup',
          date: 'July 12, 2026'
        },
        {
          title: 'Mbarara Innovation Hub',
          image: 'https://via.placeholder.com/300x200?text=Mbarara+Innovation',
          type: 'Innovation',
          date: 'July 20, 2026'
        },
        {
          title: 'Jinja Blockchain Conference',
          image: 'https://via.placeholder.com/300x200?text=Jinja+Blockchain',
          type: 'Conference',
          date: 'July 28, 2026'
        },
      ]
    },
    philippines: {
      name: 'Philippines',
      flagIcon: '/Portugal (PT) (8).svg',
      mainEvent: {
        title: 'Manila Blockchain Summit 2026',
        image: 'https://i.ibb.co/8LR9KvLg/Screenshot-2025-07-28-233810.png',
        description: 'Philippines\' largest blockchain event bringing together Southeast Asian developers and innovators in the Sui ecosystem.',
        date: 'August 5, 2026, 09:00 AM PHT',
      },
      otherEvents: [
        {
          title: 'Cebu Developer Workshop',
          image: 'https://via.placeholder.com/300x200?text=Cebu+Developer',
          type: 'Workshop',
          date: 'August 12, 2026'
        },
        {
          title: 'Davao Tech Meetup',
          image: 'https://via.placeholder.com/300x200?text=Davao+Tech',
          type: 'Meetup',
          date: 'August 20, 2026'
        },
        {
          title: 'Iloilo Innovation Hub',
          image: 'https://via.placeholder.com/300x200?text=Iloilo+Innovation',
          type: 'Innovation',
          date: 'August 28, 2026'
        },
        {
          title: 'Baguio Blockchain Conference',
          image: 'https://via.placeholder.com/300x200?text=Baguio+Blockchain',
          type: 'Conference',
          date: 'September 5, 2026'
        },
      ]
    },
    indonesia: {
      name: 'Indonesia',
      flagIcon: '/Uganda (UG).svg',
      mainEvent: {
        title: 'Jakarta Sui Conference 2026',
        image: 'https://i.ibb.co/zHGXK8DM/Screenshot-2025-07-28-233403.png',
        description: 'Indonesia\'s premier blockchain event bringing together Southeast Asian developers and innovators in the Sui ecosystem.',
        date: 'September 12, 2026, 09:00 AM WIB',
      },
      otherEvents: [
        {
          title: 'Surabaya Developer Workshop',
          image: 'https://via.placeholder.com/300x200?text=Surabaya+Developer',
          type: 'Workshop',
          date: 'September 20, 2026'
        },
        {
          title: 'Bandung Tech Meetup',
          image: 'https://via.placeholder.com/300x200?text=Bandung+Tech',
          type: 'Meetup',
          date: 'September 28, 2026'
        },
        {
          title: 'Medan Innovation Hub',
          image: 'https://via.placeholder.com/300x200?text=Medan+Innovation',
          type: 'Innovation',
          date: 'October 5, 2026'
        },
        {
          title: 'Yogyakarta Blockchain Conference',
          image: 'https://via.placeholder.com/300x200?text=Yogyakarta+Blockchain',
          type: 'Conference',
          date: 'October 12, 2026'
        },
      ]
    },
    france: {
      name: 'France',
      flagIcon: '/Uganda (UG) (1).svg',
      mainEvent: {
        title: 'Paris Blockchain Summit 2026',
        image: 'https://i.ibb.co/pjRM3qg1/Screenshot-2025-07-28-235342.png',
        description: 'France\'s premier blockchain event bringing together European developers and innovators in the Sui ecosystem.',
        date: 'October 20, 2026, 09:00 AM CET',
      },
      otherEvents: [
        {
          title: 'Lyon Developer Workshop',
          image: 'https://via.placeholder.com/300x200?text=Lyon+Developer',
          type: 'Workshop',
          date: 'October 28, 2026'
        },
        {
          title: 'Marseille Tech Meetup',
          image: 'https://via.placeholder.com/300x200?text=Marseille+Tech',
          type: 'Meetup',
          date: 'November 5, 2026'
        },
        {
          title: 'Toulouse Innovation Hub',
          image: 'https://via.placeholder.com/300x200?text=Toulouse+Innovation',
          type: 'Innovation',
          date: 'November 12, 2026'
        },
        {
          title: 'Nice Blockchain Conference',
          image: 'https://via.placeholder.com/300x200?text=Nice+Blockchain',
          type: 'Conference',
          date: 'November 20, 2026'
        },
      ]
    }
  };

  // Get current community data or fallback
  type CommunityKey = keyof typeof communityData;
  const normalizedCommunity = resolvedParams.community.toLowerCase().trim();
  
  // Debug logging
  console.log('=== DEBUGGING COMMUNITY SELECTION ===');
  console.log('Raw URL param:', resolvedParams.community);
  console.log('Normalized community:', normalizedCommunity);
  console.log('Available communities:', Object.keys(communityData));
  console.log('Does community exist?', normalizedCommunity in communityData);
  
  const currentCommunity = communityData[normalizedCommunity as CommunityKey];
  console.log('Selected community:', currentCommunity?.name || 'NOT FOUND');
  console.log('=========================================');
  
  // If community doesn't exist, show an error or redirect
  if (!currentCommunity) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Community Not Found</h1>
          <p className="text-gray-600 mb-4">
            The community "{resolvedParams.community}" doesn't exist yet.
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Available communities: {Object.keys(communityData).join(', ')}
          </p>
          <Link 
            href="/communities"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Communities
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/landing" className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center">
                <Image 
                  src="https://i.ibb.co/PZHSkCVG/Suilens-Logo-Mark-Suilens-Black.png" 
                  alt="Suilens Logo" 
                  width={60}
                  height={60}
                  className="object-contain"
                />
              </div>
              <span className="text-xl sm:text-2xl font-bold text-[#020B15]">Suilens</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex text-sm font-inter items-center space-x-8">
              {["Communities", "Discover", "Dashboard","Bounties"].map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase().replace(' ', '-')}`}
                  className="text-gray-600 font-medium hover:text-gray-900 transition-colors"
                >
                  {item}
                </Link>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex text-sm items-center space-x-4">                                    
              <Link href='/create'>
                <Button className="bg-[#4DA2FF] hover:bg-blue-500 transition-colors text-white px-6 rounded-xl">
                  Create Event
                </Button>
              </Link>
              {!user ? (
                <ConnectButton />
              ) : (
                <Link href="/profile">
                  <img
                    src={user.avatarUrl || "https://via.placeholder.com/100"}
                    alt="Profile"
                    className="w-10 h-10 rounded-full border-2 border-blue-500 cursor-pointer"
                  />
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center space-x-2">
              {!user ? (
                <ConnectButton />
              ) : (
                <Link href="/profile">
                  <img
                    src={user.avatarUrl || "https://via.placeholder.com/100"}
                    alt="Profile"
                    className="w-8 h-8 rounded-full border-2 border-blue-500 cursor-pointer"
                  />
                </Link>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2"
              >
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <nav className="lg:hidden mt-4 pb-4 border-t pt-4">
              <div className="flex flex-col space-y-3">
                {["Communities", "Discover", "Dashboard","Bounties"].map((item) => (
                  <Link
                    key={item}
                    href={`/${item.toLowerCase().replace(' ', '-')}`}
                    className="text-gray-600 font-medium hover:text-gray-900 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item}
                  </Link>
                ))}
                <Link href='/create' onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="bg-[#4DA2FF] hover:bg-blue-500 transition-colors text-white px-6 rounded-xl w-full mt-2">
                    Create Event
                  </Button>
                </Link>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Main Event Section */}
      <div className="w-full m-1 relative"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${currentCommunity.mainEvent.image})`, 
          height: '700px', 
          backgroundSize: 'cover', 
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center'
        }}>
          
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h1 className="text-5xl font-medium mb-4">{currentCommunity.mainEvent.title}</h1>
            <p className="text-white mb-2 max-w-2xl">{currentCommunity.mainEvent.description}</p>
            <p className="text-sm text-gray-200 mb-4">{currentCommunity.mainEvent.date}</p>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Register Now
            </button>
          </div>
        </div>

      <div className="container mx-auto p-6">
        
        {/* Other Events Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center space-x-3">
            <span>Other Sui Events in {currentCommunity.name}</span>
            <Image 
              src={currentCommunity.flagIcon} 
              alt={`${currentCommunity.name} Flag`} 
              width={24} 
              height={24} 
              className="object-contain"
            />
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {currentCommunity.otherEvents.map((event, index: number) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <img src={event.image} alt={event.title} className="w-full h-40 object-cover" />
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-2">{event.title}</h3>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">{event.type}</span>
                    <span className="text-sm text-gray-500">{event.date}</span>
                  </div>
                  <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors">
                    Register
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default CommunityEventsPage;