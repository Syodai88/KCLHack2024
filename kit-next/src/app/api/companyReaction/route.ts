import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const { actionType, companyId, userId } = await req.json();

  if (!actionType || !companyId) {
    return NextResponse.json({ error: 'actionTypeとcompanyIdは必須です' }, { status: 400 });
  }

  try {
    if (actionType === 'interest') {
      await prisma.interest.create({
        data:{
            companyId,
            userId,
        },
      });
    } else if (actionType === 'intern') {
      await prisma.intern.create({
        data:{
            companyId,
            userId,
        },
      });
    } else if (actionType === 'eventJoin') {
      await prisma.event.create({
        data:{
            companyId,
            userId,
        },
      });
    } else {
      return NextResponse.json({ error: 'Invalid action type' }, { status: 400 });
    }

    return NextResponse.json({ message: `${actionType}が正常に登録されました` }, { status: 200 });
  } catch (error) {
    console.error('Error updating action:', error);
    return NextResponse.json({ error: 'Failed to update action' }, { status: 500 });
  }
}
