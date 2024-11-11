import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('name');

  try {
    const results = await prisma.company.findMany({
      where: {
        name: {
          contains: query || '',
          mode: 'insensitive',
        },
      },
      select: { corporateNumber: true, name: true },
      orderBy: { interestedCount: 'desc' },
      take: 10,
    });

    return NextResponse.json({ results }, { status: 200 });
  } catch (error) {
    console.error('Error fetching companies:', error);
    return NextResponse.json({ error: 'Failed to fetch companies' }, { status: 500 });
  }
}
