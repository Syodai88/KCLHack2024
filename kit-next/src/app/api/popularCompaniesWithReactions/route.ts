//人気企業とその企業に対するユーザーのリアクションをまとめて取得するAPI
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized: Missing token' }, { status: 401 });
    }
    // トークンの分割と検証
    const token = authHeader.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: Invalid token format' }, { status: 401 });
    }

    const { userId } = await request.json();
    // 人気企業を取得
    const topCompanies = await prisma.company.findMany({
      orderBy: {
        interestedCount: 'desc',
      },
      take: 3,
    });

    const companyIds = topCompanies.map(company => company.corporateNumber);

    // ユーザーのリアクションを一度に取得
    const reactions = await prisma.$transaction([
      prisma.interest.findMany({
        where: { userId, companyId: { in: companyIds } },
      }),
      prisma.intern.findMany({
        where: { userId, companyId: { in: companyIds } },
      }),
      prisma.event.findMany({
        where: { userId, companyId: { in: companyIds } },
      }),
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

    // 企業情報にリアクション情報を付加
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
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
