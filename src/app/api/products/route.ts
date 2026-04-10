import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url!);
    const q = searchParams.get("q") || "";

    const where: any = q
      ? {
          name: { contains: q, mode: "insensitive" },
        }
      : {};

    const products = await prisma.products
      .findMany
      //     {
      //   where,
      //   select: {
      //     id: true,
      //     name: true,
      //     slug: true,
      //     description: true,
      //   },
      //  orderBy: { name: "asc" };
      // }
      ();

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Không thể tải dữ liệu danh mục" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  if (!data.name) {
    return NextResponse.json(
      { error: "Thiếu trường bắt buộc" },
      { status: 400 }
    );
  }
  try {
    const product = await prisma.products.create({
      data: {
        name: data.name,
        slug: data.slug || data.name.toLowerCase().replace(/\s+/g, "-"),
        description: data.description,
      },
    });
    return NextResponse.json(product, { status: 201 });
  } catch (err: any) {
    if (err.code === "P2002") {
      return NextResponse.json(
        { error: "Tên danh mục đã tồn tại" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Không thể tạo danh mục" },
      { status: 400 }
    );
  }
}
