import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url!);
    const q = searchParams.get("q") || "";

    const where: any = q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
          ],
        }
      : {};

    const users = await prisma.users.findMany({
      // where,
      // select: {
      //   id: true,
      //   name: true,
      //   email: true,
      //   phone: true,
      //   address: true,
      //   role: true,
      //   created_at: true,
      //   status : true,
      // },
      orderBy: { created_at: "desc" },
    });
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Không thể tải dữ liệu người dùng" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const data = await req.json();

  try {
    // Mã hóa password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    const user = await prisma.users.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        phone: data.phone,
        address: data.address,
        role: data.role,
        // created_at: data.created_at,
        status: data.status,
      },
    });

    // Không trả về password_hash trong response
    const { password_hash, ...userWithoutPassword } = user;
    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (err: any) {
    if (err.code === "P2002") {
      return NextResponse.json({ error: "Email đã tồn tại" }, { status: 400 });
    }
    console.error("Error creating user:", err);
    return NextResponse.json(
      { error: "Không thể tạo người dùng" },
      { status: 400 }
    );
  }
}
