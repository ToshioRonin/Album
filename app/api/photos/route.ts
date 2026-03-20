
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Asegúrate de que la ruta a tu cliente de prisma sea correcta


export async function GET() {
  const photos = await prisma.photo.findMany({
    orderBy: { createdAt: 'desc' }
  })
  return NextResponse.json(photos)
}

export async function POST(request: Request) {
  try {
    // 1. Extraemos los datos del cuerpo de la petición (body)
    const body = await request.json();
    const { title, imageUrl } = body;

    // 2. Validación básica (puedes agregar más campos según tu modelo de Prisma)
    if (!title || !imageUrl) {
      return NextResponse.json(
        { message: "Faltan campos obligatorios: title o url" },
        { status: 400 }
      );
    }

    // 3. Creamos el registro en la base de datos usando Prisma
    // Nota: Asegúrate de que tu modelo en schema.prisma se llame 'photo'
    const newPhoto = await prisma.photo.create({
      data: {
        title,
        imageUrl,
      },
    });

    // 4. Devolvemos la respuesta de éxito
    return NextResponse.json(newPhoto, { status: 201 });

  } catch (error) {
    console.error("Error al crear la foto:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}