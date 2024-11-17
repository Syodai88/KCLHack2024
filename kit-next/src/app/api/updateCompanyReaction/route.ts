import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // すべての企業IDを取得
    const companies = await prisma.company.findMany({
      select: { corporateNumber: true },
    });

    const updateOperations = [];

    for (const company of companies) {
      const corporateNumber = company.corporateNumber;

      // 各企業の興味、インターン、イベント参加のカウントを取得
      const [interestCount, internCount, eventJoinCount] = await Promise.all([
        prisma.interest.count({ where: { companyId: corporateNumber } }),
        prisma.intern.count({ where: { companyId: corporateNumber } }),
        prisma.event.count({ where: { companyId: corporateNumber } })
      ]);

      // 更新操作を準備
      updateOperations.push(
        prisma.company.update({
          where: { corporateNumber },
          data: {
            interestedCount: interestCount,
            internCount: internCount,
            eventJoinCount: eventJoinCount,
          },
        })
      );
    }

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
