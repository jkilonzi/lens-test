import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getCommunityById } from "@/lib/communities-data"
import { Twitter, MessageCircle, Share2, Users, ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"

interface CommunityPageProps {
  params: {
    community: string
  }
}

export default function CommunityPage({ params }: CommunityPageProps) {
  const community = getCommunityById(params.community)

  if (!community) {
    notFound()
  }

  const upcomingEvents = community.events.filter((event) => event.type === "upcoming")
  const pastEvents = community.events.filter((event) => event.type === "past")

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="font-semibold text-lg">Sui Events</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-gray-600 hover:text-blue-600">
                Home
              </Link>
              <Link href="/communities" className="text-gray-900 hover:text-blue-600">
                Communities
              </Link>
              <Link href="/events" className="text-gray-600 hover:text-blue-600">
                Upcoming Events
              </Link>
              <Link href="/resources" className="text-gray-600 hover:text-blue-600">
                Resources
              </Link>
              <Link href="/dashboard" className="text-gray-600 hover:text-blue-600">
                Dashboard
              </Link>
            </nav>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6">Get Started</Button>
        </div>
      </header>

      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <Link href="/communities" className="inline-flex items-center text-blue-600 hover:text-blue-700">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Communities
        </Link>
      </div>

      {/* Hero Section */}
      <section className="relative h-[500px] overflow-hidden">
        <Image
          src={community.heroImage || "/placeholder.svg"}
          alt={`${community.name} community event`}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 w-full">
            <div className="max-w-2xl">
              <div className="flex items-center space-x-4 mb-4">
                <h1 className="text-4xl font-bold text-white">{community.heroTitle}</h1>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                    <Twitter className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <p className="text-white/90 text-lg mb-6 leading-relaxed">{community.heroDescription}</p>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">Register to Attend</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Other Events Section */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Other Sui Events in {community.name}</h2>
            <div className="flex items-center space-x-4">
              <Link href="#" className="text-gray-600 hover:text-blue-600 underline">
                Past Events ({pastEvents.length})
              </Link>
              <span className="text-gray-400">|</span>
              <Link href="#" className="text-blue-600 hover:text-blue-700 underline">
                Upcoming ({upcomingEvents.length})
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {upcomingEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden">
                <div className="relative h-48">
                  <Image src={event.image || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{event.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">
                      <Users className="w-3 h-3 mr-1" />
                      {event.attendees} Going
                    </Badge>
                    <span className="text-xs text-gray-500">{event.date}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

// Generate static params for known communities
export async function generateStaticParams() {
  return [{ community: "ghana" }, { community: "kenya" }, { community: "nigeria" }]
}
