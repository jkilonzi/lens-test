'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function BrowseBounty() {
  return (
    <div className="min-h-screen bg-[#F5F6FA] text-gray-800 flex flex-col items-center">
      {/* Header */}
      <header className="w-full max-w-7xl px-4 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <img src="/Suilens LogoMark(Suilens Black).png" alt="Suilens Logo" className="h-8" />
          <nav className="space-x-6 text-sm font-medium text-gray-500">
            <Link href="/" className="hover:text-gray-900">Home</Link>
            <Link href="/communities" className="hover:text-gray-900">Communities</Link>
            <Link href="/discover" className="hover:text-gray-900">Discover Events</Link>
            <Link href="/bounties" className="text-gray-900 font-semibold">Bounties</Link>
            <Link href="/dashboard" className="hover:text-gray-900">Dashboard</Link>
          </nav>
        </div>
        <img src="/placeholder-user.jpg" alt="Profile" className="h-8 w-8 rounded-full object-cover" />
      </header>
      {/* Main Section */}
      <main className="w-full max-w-7xl px-4 py-12 flex flex-col items-center">
        <section className="text-left w-full mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Browse Bounties</h1>
          <div className="flex flex-wrap gap-3 mb-8">
            <span className="bg-gray-100 text-gray-700 px-4 py-1 rounded-full text-sm font-medium">DeFi</span>
            <span className="bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm font-medium border border-blue-200">DAO</span>
            <span className="bg-gray-100 text-gray-700 px-4 py-1 rounded-full text-sm font-medium">Gaming</span>
            <span className="bg-gray-100 text-gray-700 px-4 py-1 rounded-full text-sm font-medium">Education</span>
            <span className="bg-gray-100 text-gray-700 px-4 py-1 rounded-full text-sm font-medium">Social</span>
            <span className="bg-gray-100 text-gray-700 px-4 py-1 rounded-full text-sm font-medium">Development</span>
          </div>
          <div className="flex justify-end">
            <button className="bg-gray-900 text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-gray-800 transition">Create a bounty</button>
          </div>
        </section>
        {/* Bounty List */}
        <section className="w-full flex flex-col gap-6">
          {/* Bounty Card Example */}
          <div className="bg-white rounded-2xl shadow flex items-center px-6 py-5 justify-between">
            <div className="flex items-center gap-4">
              <img src="/cOMMUNITY CARD (1).png" alt="Bounty Icon" className="h-14 w-14 rounded-full object-cover" />
              <div>
                <h3 className="font-semibold text-lg">Create a two-minutes video guide for suilend.</h3>
                <div className="flex items-center text-xs text-gray-400 gap-2 mt-1">
                  <span><img src="/mdi_people.png" alt="Participants" className="inline h-4 w-4 mr-1" />10 Participants</span>
                  <span>•</span>
                  <span>Due in 15 days</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <img src="/Vector.svg" alt="USDC" className="h-6 w-6" />
              <span className="text-blue-500 font-bold text-lg">1,000 USDC</span>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow flex items-center px-6 py-5 justify-between">
            <div className="flex items-center gap-4">
              <img src="/download (2) 1.png" alt="Bounty Icon" className="h-14 w-14 rounded-full object-cover" />
              <div>
                <h3 className="font-semibold text-lg">Write a beginner-friendly guide to using Slush Wallet</h3>
                <div className="flex items-center text-xs text-gray-400 gap-2 mt-1">
                  <span><img src="/mdi_people.png" alt="Participants" className="inline h-4 w-4 mr-1" />10 Participants</span>
                  <span>•</span>
                  <span>Due in 3 days</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <img src="/Vector.svg" alt="USDC" className="h-6 w-6" />
              <span className="text-blue-500 font-bold text-lg">1,000 USDC</span>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow flex items-center px-6 py-5 justify-between">
            <div className="flex items-center gap-4">
              <img src="/cOMMUNITY CARD (2).png" alt="Bounty Icon" className="h-14 w-14 rounded-full object-cover" />
              <div>
                <h3 className="font-semibold text-lg">Create a lightweight leaderboard for top contributors</h3>
                <div className="flex items-center text-xs text-gray-400 gap-2 mt-1">
                  <span><img src="/mdi_people.png" alt="Participants" className="inline h-4 w-4 mr-1" />10 Participants</span>
                  <span>•</span>
                  <span>Due in 15 days</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <img src="/Vector.svg" alt="USDC" className="h-6 w-6" />
              <span className="text-blue-500 font-bold text-lg">1,000 USDC</span>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow flex items-center px-6 py-5 justify-between">
            <div className="flex items-center gap-4">
              <img src="/download (3) 1.png" alt="Bounty Icon" className="h-14 w-14 rounded-full object-cover" />
              <div>
                <h3 className="font-semibold text-lg">Write a Sui SDK Wrapper in Python</h3>
                <div className="flex items-center text-xs text-gray-400 gap-2 mt-1">
                  <span><img src="/mdi_people.png" alt="Participants" className="inline h-4 w-4 mr-1" />10 Participants</span>
                  <span>•</span>
                  <span>Due in 15 days</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <img src="/Vector.svg" alt="USDC" className="h-6 w-6" />
              <span className="text-blue-500 font-bold text-lg">1,000 USDC</span>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow flex items-center px-6 py-5 justify-between">
            <div className="flex items-center gap-4">
              <img src="/Vector (1).svg" alt="Bounty Icon" className="h-14 w-14 rounded-full object-cover" />
              <div>
                <h3 className="font-semibold text-lg">Create a Twitter thread summarizing our latest event</h3>
                <div className="flex items-center text-xs text-gray-400 gap-2 mt-1">
                  <span><img src="/mdi_people.png" alt="Participants" className="inline h-4 w-4 mr-1" />10 Participants</span>
                  <span>•</span>
                  <span>Due in 15 days</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <img src="/Vector.svg" alt="USDC" className="h-6 w-6" />
              <span className="text-blue-500 font-bold text-lg">1,000 USDC</span>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow flex items-center px-6 py-5 justify-between">
            <div className="flex items-center gap-4">
              <img src="/download (4) 1 (1).png" alt="Bounty Icon" className="h-14 w-14 rounded-full object-cover" />
              <div>
                <h3 className="font-semibold text-lg">Create a Unit Testing Framework for Sui Move Modules</h3>
                <div className="flex items-center text-xs text-gray-400 gap-2 mt-1">
                  <span><img src="/mdi_people.png" alt="Participants" className="inline h-4 w-4 mr-1" />10 Participants</span>
                  <span>•</span>
                  <span>Due in 15 days</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <img src="/Vector.svg" alt="USDC" className="h-6 w-6" />
              <span className="text-blue-500 font-bold text-lg">730 USDC</span>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow flex items-center px-6 py-5 justify-between">
            <div className="flex items-center gap-4">
              <img src="/download (4) 1.png" alt="Bounty Icon" className="h-14 w-14 rounded-full object-cover" />
              <div>
                <h3 className="font-semibold text-lg">Develop a Multi-sig Wallet Contract Using Move</h3>
                <div className="flex items-center text-xs text-gray-400 gap-2 mt-1">
                  <span><img src="/mdi_people.png" alt="Participants" className="inline h-4 w-4 mr-1" />10 Participants</span>
                  <span>•</span>
                  <span>Due in 15 days</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <img src="/Vector.svg" alt="USDC" className="h-6 w-6" />
              <span className="text-blue-500 font-bold text-lg">500 USDC</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}