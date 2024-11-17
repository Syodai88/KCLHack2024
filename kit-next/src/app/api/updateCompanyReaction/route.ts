import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // `interest` テーブルで企業ごとのカウントを取得
    const interestCounts = await prisma.interest.groupBy({
      by: ['companyId'],
      _count: { companyId: true },
    });

    const internCounts = await prisma.intern.groupBy({
      by: ['companyId'],
      _count: { companyId: true },
    });

    const eventJoinCounts = await prisma.event.groupBy({
      by: ['companyId'],
      _count: { companyId: true },
    });

    // 結果をMapに変換して効率的にアクセス
    const interestCountMap = new Map(interestCounts.map(item => [item.companyId, item._count.companyId]));
    const internCountMap = new Map(internCounts.map(item => [item.companyId, item._count.companyId]));
    const eventJoinCountMap = new Map(eventJoinCounts.map(item => [item.companyId, item._count.companyId]));

    // すべての企業を取得
    const companies = await prisma.company.findMany({
      select: { corporateNumber: true },
    });

    const updateOperations = companies.map((company) => {
      const corporateNumber = company.corporateNumber;

      const interestedCount = interestCountMap.get(corporateNumber) || 0;
      const internCount = internCountMap.get(corporateNumber) || 0;
      const eventJoinCount = eventJoinCountMap.get(corporateNumber) || 0;

      return prisma.company.update({
        where: { corporateNumber },
        data: {
          interestedCount,
          internCount,
          eventJoinCount,
        },
      });
    });

    // トランザクション内で一括更新
    await prisma.$transaction(updateOperations);

    return NextResponse.json({ message: 'Reaction counts updated successfully' });
  } catch (error) {
    console.error('Error updating reaction counts:', error);
    return NextResponse.json({ error: 'Failed to update reaction counts' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json(null, { status: 204, headers: { 'Allow': 'POST' } });
}
