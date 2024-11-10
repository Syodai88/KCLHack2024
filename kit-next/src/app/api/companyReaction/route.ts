import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const { actionType, companyId, userId } = await req.json();

  if (!actionType || !companyId || !userId) {
    return NextResponse.json({ error: 'actionType, companyId, and userId are required' }, { status: 400 });
  }

  try {
    let existingRecord;

    if (actionType === 'interest') {
      existingRecord = await prisma.interest.findFirst({
        where: {
          companyId,
          userId,
        },
      });

      if (existingRecord) {
        await prisma.interest.delete({
          where: {
            id: existingRecord.id,
          },
        });
        return NextResponse.json({ message: 'Interest removed successfully' }, { status: 200 });
      } else {
        await prisma.interest.create({
          data: {
            companyId,
            userId,
          },
        });
        return NextResponse.json({ message: 'Interest added successfully' }, { status: 200 });
      }

    } else if (actionType === 'intern') {
      existingRecord = await prisma.intern.findFirst({
        where: {
          companyId,
          userId,
        },
      });

      if (existingRecord) {
        await prisma.intern.delete({
          where: {
            id: existingRecord.id,
          },
        });
        return NextResponse.json({ message: 'Internship removed successfully' }, { status: 200 });
      } else {
        await prisma.intern.create({
          data: {
            companyId,
            userId,
          },
        });
        return NextResponse.json({ message: 'Internship added successfully' }, { status: 200 });
      }
      
    } else if (actionType === 'eventJoin') {
      existingRecord = await prisma.event.findFirst({
        where: {
          companyId,
          userId,
        },
      });

      if (existingRecord) {
        await prisma.event.delete({
          where: {
            id: existingRecord.id,
          },
        });
        return NextResponse.json({ message: 'Event participation removed successfully' }, { status: 200 });
      } else {
        await prisma.event.create({
          data: {
            companyId,
            userId,
          },
        });
        return NextResponse.json({ message: 'Event participation added successfully' }, { status: 200 });
      }
    } else {
      return NextResponse.json({ error: 'Invalid action type' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error updating action:', error);
    return NextResponse.json({ error: 'Failed to update action' }, { status: 500 });
  }
}
