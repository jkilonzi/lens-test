import { NextRequest, NextResponse } from "next/server";
import { suilensService } from "@/lib/sui-client";

export async function POST(request: NextRequest) {
  try {
    // Parse JSON body instead of form data
    const body = await request.json();

    // Map frontend fields to backend expectations
    const eventData = {
      name: body.title as string,
      description: body.description as string,
      startTime: new Date(`${body.date} ${body.time}`).getTime(),
      endTime: new Date(`${body.date} ${body.endTime}`).getTime(),
      maxAttendees: body.capacity ? parseInt(body.capacity as string) : 100,
      poapTemplate: body.poapImage || "", // Use poapImage as Base64 or URL
    };

    // Generate a temporary event ID
    const eventId = `event_${Date.now()}`;

    // Create transaction block for event creation
    const txb = await suilensService.createEvent(eventData);

    return NextResponse.json({
      success: true,
      eventId: eventId,
      transactionBlock: txb.serialize(),
    });
  } catch (error) {
    console.error("Event creation error:", error);
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const eventId = searchParams.get("id");

  if (eventId) {
    return NextResponse.json({
      event: {
        id: eventId,
        name: "Sample Event",
        description: "Sample Description",
      },
    });
  }

  return NextResponse.json({ events: [] });
}