import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  const products = db.products.getAll()
  return NextResponse.json(products)
}

export async function POST(request: Request) {
  const body = await request.json()
  const newProduct = db.products.create(body)
  return NextResponse.json(newProduct, { status: 201 })
}

