'use client';

import Link from 'next/link';

export default function BountiesPage() {
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
        <div className="flex items-center space-x-4">
          <Link href="/create">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-full font-semibold shadow hover:bg-blue-600 transition">Create Event</button>
          </Link>
          <img src="/placeholder-user.jpg" alt="Profile" className="h-8 w-8 rounded-full object-cover" />
        </div>
      </header>
      {/* Main Section */}
      <main className="w-full max-w-7xl px-4 py-12 flex flex-col items-center">
        <section className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-gray-800 leading-tight">Post or Hunt for <span className="block">bounties</span></h1>
          <p className="text-lg mb-8 text-gray-500 max-w-xl mx-auto">Got a task that needs doing? Create a bounty and let the community help. Want to earn? Browse and apply for open bounties.</p>
          <div className="flex justify-center gap-4 mb-10">
            <Link href="/create">
              <button className="bg-gray-900 text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-gray-800 transition">Create Bounty</button>
            </Link>
            <Link href="/Browsebounty">
              <button className="border border-gray-300 text-gray-900 px-6 py-2 rounded-full font-semibold bg-white hover:bg-gray-100 transition">Browse Bounties</button>
            </Link>
          </div>
          <div className="flex justify-center">
            <div className="bg-white rounded-2xl shadow flex items-center justify-center w-[600px] h-[220px]">
              <img src="https://pin.it/2DvEOWgyE" alt="Play" className="h-16 w-16 opacity-40" />
            </div>
          </div>
        </section>
        {/* Info Grid */}
        <section className="w-full flex flex-col gap-8 mb-12">
          {/* Bounty Creators Card */}
          <div className="bg-white rounded-2xl shadow flex flex-row min-h-[220px] overflow-hidden">
            {/* Text Content (left half) */}
            <div className="flex-1 flex flex-col justify-center px-8 py-6">
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-2"></span>
                <span className="text-xs text-gray-500 font-semibold">For Bounty Creators</span>
              </div>
              <h2 className="text-2xl font-bold mb-2">Need something done? Let the community handle it.</h2>
              <p className="text-gray-500 text-sm">Post a task, set a reward, and get high-quality submissions from talented contributors, fast and hassle-free.</p>
            </div>
            {/* Image Placeholder (right half) */}
            <div className="flex-1 h-full overflow-hidden">
              <img src="https://hackersonlineclub.com/wp-content/uploads/2019/05/Bug-Bounty-img.png" alt="Bounty" className="w-full h-full object-cover" />
            </div>
          </div>
          {/* Contributors Card */}
          <div className="bg-white rounded-2xl shadow flex flex-row min-h-[220px] overflow-hidden">
            {/* Image Placeholder (left half) */}
            <div className="flex-1 h-full overflow-hidden">
              <img src="https://hackersonlineclub.com/wp-content/uploads/2019/05/Bug-Bounty-img.png" alt="Contributor" className="w-full h-full object-cover" />
            </div>
            {/* Text Content (right half) */}
            <div className="flex-1 flex flex-col justify-center px-8 py-6">
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-2">💼</span>
                <span className="text-xs text-gray-500 font-semibold">For Contributors</span>
              </div>
              <h2 className="text-2xl font-bold mb-2">Earn by doing what you’re good at.</h2>
              <p className="text-gray-500 text-sm">Find tasks that match your skills, submit your work, and get rewarded in crypto. Simple as ABC</p>
            </div>
          </div>
        </section>
        {/* Opportunities & Trending */}
        <section className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* New Opportunities */}
          <div>
            <h2 className="text-xl font-bold mb-4">New Opportunities</h2>
            <div className="flex flex-col gap-4">
              <div className="bg-white p-4 rounded-lg shadow flex items-center gap-4">
                <img src="/download (2) 1.png" alt="Icon" className="h-12 w-12 rounded-full object-cover" />
                <div className="flex-1">
                  <h3 className="font-semibold">Write a beginner-friendly guide to using Slush Wallet</h3>
                  <div className="flex items-center text-xs text-gray-400 gap-2">Due in 7 days</div>
                </div>
                <span className="text-blue-500 font-bold">1200 USDC</span>
              </div>
              <div className="bg-white p-4 rounded-lg shadow flex items-center gap-4">
                <img src="/cOMMUNITY CARD (1).png" alt="Icon" className="h-12 w-12 rounded-full object-cover" />
                <div className="flex-1">
                  <h3 className="font-semibold">Create a two-minutes video guide for suilend.</h3>
                  <div className="flex items-center text-xs text-gray-400 gap-2">Due in 7 days</div>
                </div>
                <span className="text-blue-500 font-bold">1200 USDC</span>
              </div>
              <div className="bg-white p-4 rounded-lg shadow flex items-center gap-4">
                <img src="/cOMMUNITY CARD (2).png" alt="Icon" className="h-12 w-12 rounded-full object-cover" />
                <div className="flex-1">
                  <h3 className="font-semibold">Create a two-minutes video guide for suilend.</h3>
                  <div className="flex items-center text-xs text-gray-400 gap-2">Due in 7 days</div>
                </div>
                <span className="text-blue-500 font-bold">1200 USDC</span>
              </div>
              <div className="bg-white p-4 rounded-lg shadow flex items-center gap-4">
                <img src="/cOMMUNITY CARD.png" alt="Icon" className="h-12 w-12 rounded-full object-cover" />
                <div className="flex-1">
                  <h3 className="font-semibold">Create a two-minutes video guide for suilend.</h3>
                  <div className="flex items-center text-xs text-gray-400 gap-2">Due in 7 days</div>
                </div>
                <span className="text-blue-500 font-bold">1200 USDC</span>
              </div>
            </div>
            <div className="flex justify-center mt-4">
              <Link href="/bounties">
                <button className="border border-gray-300 text-gray-900 px-4 py-1 rounded-full bg-white hover:bg-gray-100 transition text-sm">Show all</button>
              </Link>
            </div>
          </div>
          {/* Trending */}
          <div>
            <h2 className="text-xl font-bold mb-4">Trending</h2>
            <div className="flex flex-col gap-4">
              <div className="bg-white p-4 rounded-lg shadow flex items-center gap-4">
                <img src="/download (3) 1.png" alt="Icon" className="h-12 w-12 rounded-full object-cover" />
                <div className="flex-1">
                  <h3 className="font-semibold">Create a two-minutes video guide for suilend.</h3>
                  <div className="flex items-center text-xs text-gray-400 gap-2">Due in 10 days</div>
                </div>
                <span className="text-blue-500 font-bold">1,000 USDC</span>
              </div>
              <div className="bg-white p-4 rounded-lg shadow flex items-center gap-4">
                <img src="/download (3) 2.png" alt="Icon" className="h-12 w-12 rounded-full object-cover" />
                <div className="flex-1">
                  <h3 className="font-semibold">Create a two-minutes video guide for suilend.</h3>
                  <div className="flex items-center text-xs text-gray-400 gap-2">Due in 10 days</div>
                </div>
                <span className="text-blue-500 font-bold">1,000 USDC</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}