//各ユーザーが各企業のリアクションをしているか判定するAPI
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { userId, companyId } = await request.json();

    const interest = await prisma.interest.findFirst({
      where: {
        userId: userId,
        companyId: companyId,
      },
    });

    const intern = await prisma.intern.findFirst({
      where: {
        userId: userId,
        companyId: companyId,
      },
    });

    const event = await prisma.event.findFirst({
      where: {
        userId: userId,
        companyId: companyId,
      },
    });

    return NextResponse.json({
      isInterested: !!interest,
      isInterned: !!intern,
      isEventJoined: !!event,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch user reactions' }, { status: 500 });
  }
}
