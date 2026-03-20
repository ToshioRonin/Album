import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // Definimos params como Promesa
) {
  try {
    // 1. DESENVOLVER PARAMS (Obligatorio en Next.js 16+)
    const resolvedParams = await params;
    const id = resolvedParams.id;

    // 2. Convertir y limpiar el ID
    const idNumber = parseInt(id.trim(), 10);

    // LOG para que confirmes en la terminal que ahora sí llega el número
    console.log("Intentando borrar ID real:", idNumber);

    if (isNaN(idNumber)) {
      return NextResponse.json(
        { error: `El valor '${id}' no es un número válido.` },
        { status: 400 }
      );
    }

    // 3. Ejecutar el borrado en Prisma
    const deletedPhoto = await prisma.photo.delete({
      where: {
        id: idNumber,
      },
    });

    return NextResponse.json({
      message: "¡Borrado con éxito!",
      deletedPhoto,
    });

  } catch (error: any) {
    console.error("ERROR EN EL SERVIDOR:", error.message);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: "El registro no existe en la base de datos." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Error interno", detalle: error.message },
      { status: 500 }
    );
  }
}