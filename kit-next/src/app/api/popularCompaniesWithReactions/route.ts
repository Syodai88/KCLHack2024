//人気企業とその企業に対するユーザーのリアクションをまとめて取得するAPI
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  try {
    // 人気企業の取得
    const topCompanies = await prisma.company.findMany({
      orderBy: { interestedCount: 'desc' },
      take: 3,
    });

    const companyIds = topCompanies.map(company => company.corporateNumber);

    // ユーザーのリアクション情報を取得
    const reactions = await prisma.$transaction([
      prisma.interest.findMany({ where: { userId, companyId: { in: companyIds } } }),
      prisma.intern.findMany({ where: { userId, companyId: { in: companyIds } } }),
      prisma.event.findMany({ where: { userId, companyId: { in: companyIds } } }),
    ]);

    const reactionMap = companyIds.reduce((acc, companyId) => {
      acc[companyId] = {
        isInterested: reactions[0].some(r => r.companyId === companyId),
        isInterned: reactions[1].some(r => r.companyId === companyId),
        isEventJoined: reactions[2].some(r => r.companyId === companyId),
      };
      return acc;
    }, {} as Record<string, { isInterested: boolean; isInterned: boolean; isEventJoined: boolean }>);

    const companiesWithReactions = topCompanies.map(company => ({
      ...company,
      reactions: reactionMap[company.corporateNumber] || {
        isInterested: false,
        isInterned: false,
        isEventJoined: false,
      },
    }));

    return NextResponse.json(companiesWithReactions, { status: 200 });
  } catch (error) {
    console.error('Error fetching companies with reactions:', error);
    return NextResponse.json({ error: 'Failed to fetch companies' }, { status: 500 });
  }
}
