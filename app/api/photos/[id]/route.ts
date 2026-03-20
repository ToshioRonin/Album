import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

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
