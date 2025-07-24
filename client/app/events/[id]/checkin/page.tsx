"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

declare global {
  interface Window {
    Html5QrcodeScanner: any;
  }
}

export default function CheckinPage() {
  const params = useParams();
  const eventId =
    params && typeof params.id === "string"
      ? params.id
      : params && Array.isArray(params.id)
      ? params.id[0]
      : undefined;

  const [registrantName, setRegistrantName] = useState("");
  const [checkinStatus, setCheckinStatus] = useState<string | null>(null);
  const [scannerInitialized, setScannerInitialized] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegistrantName(e.target.value);
  };

  const handleManualCheckin = async () => {
    if (!registrantName || !eventId) {
      setCheckinStatus("Please enter a registrant name.");
      return;
    }
    try {
      const response = await fetch(`/api/events/${eventId}/checkin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: registrantName }),
      });
      if (response.ok) {
        setCheckinStatus("Check-in successful!");
      } else {
        const data = await response.json();
        setCheckinStatus(`Check-in failed: ${data.error || "Unknown error"}`);
      }
    } catch (error) {
      setCheckinStatus("Check-in failed: Network error");
    }
  };

  useEffect(() => {
    if (!scannerInitialized && typeof window !== "undefined" && window.Html5QrcodeScanner) {
      const html5QrcodeScanner = new window.Html5QrcodeScanner(
        "qr-reader",
        { fps: 10, qrbox: 250 },
        false
      );
      html5QrcodeScanner.render(
        (decodedText: string) => {
          setRegistrantName(decodedText);
          handleManualCheckin();
          html5QrcodeScanner.clear();
        },
        (errorMessage: string) => {
          // ignore scan errors
        }
      );
      setScannerInitialized(true);
    }
  }, [scannerInitialized]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-4">Event Check-in</h1>
      <div className="mb-4 w-full max-w-md">
        <label className="block mb-2 font-medium">Registrant Name</label>
        <Input
          type="text"
          value={registrantName}
          onChange={handleInputChange}
          placeholder="Enter registrant name"
          className="mb-2"
        />
        <Button onClick={handleManualCheckin} className="w-full">
          Check In
        </Button>
      </div>
      <div id="qr-reader" className="mb-4 w-full max-w-md" />
      {checkinStatus && (
        <p className="text-center text-lg font-semibold">{checkinStatus}</p>
      )}
    </div>
  );
}
