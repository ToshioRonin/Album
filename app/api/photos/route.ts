
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

"Metodo GET"
export async function GET() {
  const photos = await prisma.photo.findMany({
    orderBy: { createdAt: 'desc' }
  })
  return NextResponse.json(photos)
}

//Metodo POST para crear una nueva foto en la base de datos
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, imageUrl } = body;

    if (!title || !imageUrl) {
      return NextResponse.json(
        { message: "Faltan campos obligatorios: title o url" },
        { status: 400 }
      );
    }

    const newPhoto = await prisma.photo.create({
      data: {
        title,
        imageUrl,
      },
    });

    return NextResponse.json(newPhoto, { status: 201 });

  } catch (error) {
    console.error("Error al crear la foto:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}