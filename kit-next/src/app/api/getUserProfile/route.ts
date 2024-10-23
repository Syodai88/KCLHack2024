import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request){
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ error: 'userId query parameter is required' }, { status: 400 });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { 
                id: userId,
            },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}