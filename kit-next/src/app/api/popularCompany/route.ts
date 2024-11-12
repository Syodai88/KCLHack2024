//機能をまとめたAPIを作成したので削除予定、本番環境移行前に削除する
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const topCompanies = await prisma.company.findMany({
      orderBy: {
        interestedCount: 'desc',
      },
      take: 3,
    });

    return NextResponse.json(topCompanies, { status: 200 });
  } catch (error) {
    console.error('Error fetching top companies:', error);
    return NextResponse.json({ error: 'Failed to fetch top companies' }, { status: 500 });
  }
}
