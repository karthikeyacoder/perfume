import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    let orders
    if (userId) {
      orders = db.orders.getByUserId(userId)
    } else {
      orders = db.orders.getAll()
    }

    return NextResponse.json(orders)
  } catch (error) {
    console.error("Get orders error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { userId, items, total, shippingAddress } = await request.json()

    // Validate request
    if (!userId || !items || !total) {
      return NextResponse.json({ error: "User ID, items, and total are required" }, { status: 400 })
    }

    // Create new order
    const newOrder = db.orders.create({
      userId,
      items,
      total,
      shippingAddress,
      status: "pending",
      statusHistory: [
        {
          status: "pending",
          timestamp: new Date().toISOString(),
          note: "Order placed",
        },
      ],
    })

    return NextResponse.json(newOrder, { status: 201 })
  } catch (error) {
    console.error("Create order error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

