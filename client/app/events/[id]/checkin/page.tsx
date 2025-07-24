"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";

export default function CheckinPage() {
  const params = useParams(); // Type: Record<string, string | string[]> | null
  const id = params?.id
    ? Array.isArray(params.id)
      ? params.id[0] // Take the first id if it's an array
      : params.id
    : undefined; // Fallback to undefined if params or id is null

  const [checkedIn, setCheckedIn] = useState(false);
  const [checking, setChecking] = useState(false);
  const account = useCurrentAccount();

  // Check if already checked in
  useEffect(() => {
    const checkAlreadyCheckedIn = async () => {
      if (!id || !account) return;
      setChecking(true);
      try {
        const response = await fetch(`http://localhost:3009/api/events/${id}/checkin/status`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to check status");
        }

        const data = await response.json();
        setCheckedIn(data.checkedIn);
      } catch (error) {
        console.error("Check-in status error:", error);
      }
      setChecking(false);
    };
    checkAlreadyCheckedIn();
  }, [id, account]);

  const handleCheckIn = async () => {
    if (!id || !account) {
      alert("Please connect your wallet.");
      return;
    }
    setChecking(true);
    try {
      // Prevent duplicate check-in
      const statusResponse = await fetch(`http://localhost:3009/api/events/${id}/checkin/status`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!statusResponse.ok) {
        throw new Error("Failed to check status");
      }

      const statusData = await statusResponse.json();
      if (statusData.checkedIn) {
        setCheckedIn(true);
        setChecking(false);
        return;
      }

      const response = await fetch(`http://localhost:3009/api/events/${id}/checkin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: account.address,
        }),
      });

      if (!response.ok) {
        throw new Error("Check-in failed");
      }

      setCheckedIn(true);
    } catch (error) {
      console.error("Check-in failed:", error);
      alert("Failed to check in. Please try again.");
    }
    setChecking(false);
  };

  // Get the current page URL for user to copy
  const [pageUrl, setPageUrl] = useState("");
  useEffect(() => {
    setPageUrl(window.location.href);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-6">Event Check-In</h1>
      <div className="mb-6">
        <ConnectButton />
      </div>
      {/* Mobile wallet browser instruction */}
      <div className="mb-6 text-center text-sm text-gray-600 max-w-md">
        <p>
          <b>On mobile?</b> Copy this link and open it in your wallet app’s browser (e.g., Slush Wallet) to check in:
        </p>
        <div className="bg-gray-100 rounded p-2 mt-2 break-all select-all">{pageUrl}</div>
      </div>
      {account && (
        <div className="mb-4 text-sm text-gray-600 text-center max-w-md break-all">
          Connected wallet: <span className="font-mono">{account.address}</span>
        </div>
      )}
      {account && !checkedIn && (
        <Button onClick={handleCheckIn} className="mt-4" disabled={checking}>
          {checking ? "Checking in..." : "Check In with Wallet"}
        </Button>
      )}
      {checkedIn && (
        <div className="text-center mt-4">
          <p className="text-green-600 font-semibold">✅ Checked in! Enjoy the event.</p>
        </div>
      )}
    </div>
  );
}