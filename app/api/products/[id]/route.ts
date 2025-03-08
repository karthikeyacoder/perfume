import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const product = db.products.getById(params.id)
  if (product) {
    return NextResponse.json(product)
  } else {
    return NextResponse.json({ error: "Product not found" }, { status: 404 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json()
  const updatedProduct = db.products.update(params.id, body)
  if (updatedProduct) {
    return NextResponse.json(updatedProduct)
  } else {
    return NextResponse.json({ error: "Product not found" }, { status: 404 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  db.products.delete(params.id)
  return NextResponse.json({}, { status: 204 })
}

