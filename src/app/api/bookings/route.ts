import { API_URL } from "@/config/api";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      packageId, 
      packageName, 
      date, 
      guests, 
      totalPrice, 
      userName, 
      userEmail, 
      userPhone, 
      addons 
    } = body;

    if (!userName || !userEmail || !date || !packageId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.create({
      data: {
        packageId,
        packageName,
        date: new Date(date),
        guests: parseInt(guests),
        totalPrice: parseFloat(totalPrice),
        userName,
        userEmail,
        userPhone,
        addons: JSON.stringify(addons),
      },
    });

    return NextResponse.json({ success: true, booking });
  } catch (error) {
    console.error("Booking Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
