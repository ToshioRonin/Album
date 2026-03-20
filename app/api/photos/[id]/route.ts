import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        const numericId = Number(id)

        if (isNaN(numericId)) {
            return NextResponse.json(
                { error: 'ID inválido' },
                { status: 400 }
            )
        }

        const photo = await prisma.photo.findUnique({
            where: {
                id: numericId
            }
        })

        if (!photo) {
            return NextResponse.json(
                { error: 'Foto no encontrada' },
                { status: 404 }
            )
        }

        return NextResponse.json(photo)

    } catch (error) {
        return NextResponse.json(
            { error: 'Error al obtener la foto' },
            { status: 500 }
        )
    }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;

    const idNumber = parseInt(id.trim(), 10);

    console.log("Intentando borrar ID real:", idNumber);

    if (isNaN(idNumber)) {
      return NextResponse.json(
        { error: `El valor '${id}' no es un número válido.` },
        { status: 400 }
      );
    }

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

// Método PATCH para editar una foto existente
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const { title, imageUrl } = body;

    const numericId = Number(id);

    if (isNaN(numericId)) {
      return NextResponse.json({ message: "ID no válido" }, { status: 400 });
    }

    const updatedPhoto = await prisma.photo.update({
      where: { id: numericId },
      data: {
        ...(title && { title }),
        ...(imageUrl && { imageUrl }),
      },
    });

    return NextResponse.json(updatedPhoto);
  } catch (error) {
    console.error("Error al actualizar:", error);
    return NextResponse.json(
      { message: "No se pudo actualizar la imagen" },
      { status: 500 }
    );
  }
}
