import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('name');
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  try {
    // 企業データを取得（クエリがある場合は部分一致検索）
    const companies = query
      ? await prisma.company.findMany({
          where: { name: { contains: query, mode: 'insensitive' } },
          orderBy: { interestedCount: 'desc' },
        })
      : await prisma.company.findMany({
          orderBy: { interestedCount: 'desc' },
        });

    const companyIds = companies.map(company => company.corporateNumber);

    // ユーザーのリアクション情報を一度に取得
    const reactions = await prisma.$transaction([
      prisma.interest.findMany({ where: { userId, companyId: { in: companyIds } } }),
      prisma.intern.findMany({ where: { userId, companyId: { in: companyIds } } }),
      prisma.event.findMany({ where: { userId, companyId: { in: companyIds } } }),
    ]);

    // リアクション情報を整理
    const reactionMap = companyIds.reduce((acc, companyId) => {
      acc[companyId] = {
        isInterested: reactions[0].some(r => r.companyId === companyId),
        isInterned: reactions[1].some(r => r.companyId === companyId),
        isEventJoined: reactions[2].some(r => r.companyId === companyId),
      };
      return acc;
    }, {} as Record<string, { isInterested: boolean; isInterned: boolean; isEventJoined: boolean }>);

    // 企業情報にリアクション情報を追加
    const companiesWithReactions = companies.map(company => ({
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
