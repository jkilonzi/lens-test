"use client"

import { useUser } from "@/context/UserContext"
import { useCurrentAccount } from "@mysten/dapp-kit"
import { Wallet, CheckCircle, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function WalletStatusIndicator() {
  const { user, canCreateEvents, needsWalletForEventCreation } = useUser()
  const account = useCurrentAccount()

  if (!user) return null

  const walletConnected = user.walletConnected || !!account?.address
  const authMethod = user.authMethod

  // Show different status based on event creation capability
  if (canCreateEvents()) {
    return (
      <Badge variant="outline" className="flex items-center gap-1 text-green-600 border-green-200 bg-green-50">
        <CheckCircle className="w-3 h-3" />
        {authMethod === 'wallet' ? 'Wallet Authenticated' : 'Ready to Create Events'}
      </Badge>
    )
  }

  if (needsWalletForEventCreation()) {
    return (
      <Badge variant="outline" className="flex items-center gap-1 text-amber-600 border-amber-200 bg-amber-50">
        <AlertCircle className="w-3 h-3" />
        Wallet Required for Events
      </Badge>
    )
  }
  if (authMethod === 'wallet') {
    return (
      <Badge variant="outline" className="flex items-center gap-1 text-green-600 border-green-200 bg-green-50">
        <CheckCircle className="w-3 h-3" />
        Wallet Connected
      </Badge>
    )
  }

  if (walletConnected) {
    return (
      <Badge variant="outline" className="flex items-center gap-1 text-green-600 border-green-200 bg-green-50">
        <CheckCircle className="w-3 h-3" />
        Wallet Connected
      </Badge>
    )
  }


  return null
}