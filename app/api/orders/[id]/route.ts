import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import type { OrderStatus } from "@/lib/db"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const order = db.orders.getById(params.id)

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error("Get order error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const updates = await request.json()
    const updatedOrder = db.orders.update(params.id, updates)

    if (!updatedOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json(updatedOrder)
  } catch (error) {
    console.error("Update order error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const { status, note } = await request.json()

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 })
    }

    const updatedOrder = db.orders.updateStatus(params.id, status as OrderStatus, note)

    if (!updatedOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json(updatedOrder)
  } catch (error) {
    console.error("Update order status error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

