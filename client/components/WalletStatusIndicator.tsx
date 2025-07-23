"use client"

import { useUser } from "@/context/UserContext"
import { useCurrentAccount } from "@mysten/dapp-kit"
import { Wallet, CheckCircle, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function WalletStatusIndicator() {
  const { user, isWalletRequired } = useUser()
  const account = useCurrentAccount()

  if (!user) return null

  const walletConnected = user.walletConnected || !!account?.address
  const authMethod = user.authMethod

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

  if (isWalletRequired()) {
    return (
      <Badge variant="outline" className="flex items-center gap-1 text-amber-600 border-amber-200 bg-amber-50">
        <AlertCircle className="w-3 h-3" />
        Wallet Required
      </Badge>
    )
  }

  return null
}