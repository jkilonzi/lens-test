"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ConnectModal, useCurrentAccount } from "@mysten/dapp-kit"
import { useUser } from "@/context/UserContext"
import { Wallet, Shield, Zap } from "lucide-react"

interface WalletConnectionModalProps {
  isOpen: boolean
  onClose: () => void
  onWalletConnected: () => void
  title?: string
  description?: string
}

export default function WalletConnectionModal({
  isOpen,
  onClose,
  onWalletConnected,
  title = "Connect Your Wallet",
  description = "To create events and mint POAPs, you need to connect your wallet first."
}: WalletConnectionModalProps) {
  const [connectModalOpen, setConnectModalOpen] = useState(false)
  const { connectWallet, user } = useUser()
  const account = useCurrentAccount()

  // Handle wallet connection
  const handleWalletConnect = () => {
    if (account?.address) {
      connectWallet(account.address)
      onWalletConnected()
      onClose()
    } else {
      setConnectModalOpen(true)
    }
  }

  // Monitor account changes
  useState(() => {
    if (account?.address && connectModalOpen) {
      connectWallet(account.address)
      setConnectModalOpen(false)
      onWalletConnected()
      onClose()
    }
  }, [account?.address, connectModalOpen, connectWallet, onWalletConnected, onClose])

  // Show different content based on auth method
  const getModalContent = () => {
    if (user?.authMethod === 'wallet') {
      return {
        title: "Wallet Already Connected",
        description: "Your wallet is already authenticated. You can create events immediately.",
        showConnectButton: false
      }
    }
    
    if (account?.address) {
      return {
        title: "Confirm Wallet Connection",
        description: "We detected a connected wallet. Confirm to use it for event creation.",
        showConnectButton: true
      }
    }
    
    return {
      title,
      description,
      showConnectButton: true
    }
  }

  const modalContent = getModalContent()
  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-blue-500" />
              {modalContent.title}
            </DialogTitle>
            <DialogDescription className="text-left">
              {modalContent.description}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Benefits */}
            {user?.authMethod !== 'wallet' && (
              <div className="bg-blue-50 rounded-lg p-4 space-y-3">
                <h4 className="font-medium text-blue-900">Why connect your wallet?</h4>
                <div className="space-y-2 text-sm text-blue-700">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    <span>Secure event creation on the blockchain</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    <span>Mint and distribute POAPs to attendees</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wallet className="w-4 h-4" />
                    <span>Manage your digital event assets</span>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              {modalContent.showConnectButton && (
                <Button 
                  onClick={handleWalletConnect}
                  className="w-full bg-blue-500 hover:bg-blue-600"
                >
                  {account?.address ? 'Use Connected Wallet' : 'Connect Wallet'}
                </Button>
              )}
              
              <Button 
                variant="outline" 
                onClick={onClose}
                className="w-full"
              >
                {user?.authMethod === 'wallet' ? 'Close' : 'Cancel'}
              </Button>
            </div>

            {account?.address && (
              <div className="text-center text-sm text-gray-600">
                <p>Wallet detected: {account.address.slice(0, 6)}...{account.address.slice(-4)}</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Sui Connect Modal */}
      <ConnectModal
        trigger={<div />}
        open={connectModalOpen}
        onOpenChange={setConnectModalOpen}
      />
    </>
  )
}