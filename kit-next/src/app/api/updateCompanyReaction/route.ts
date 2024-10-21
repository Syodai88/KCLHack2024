//companyテーブルのデータの定期更新用のAPI、デプロイ後にGoole Cloud Schedulerで定期実行の設定をすること
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const companies = await prisma.company.findMany();

    for (const company of companies) {
      const interestCount = await prisma.interest.count({
        where: { companyId: company.corporateNumber },
      });

      const internCount = await prisma.intern.count({
        where: { companyId: company.corporateNumber },
      });

      const eventJoinCount = await prisma.event.count({
        where: { companyId: company.corporateNumber },
      });

      await prisma.company.update({
        where: { corporateNumber: company.corporateNumber },
        data: {
          interestedCount: interestCount,
          internCount: internCount,
          eventJoinCount: eventJoinCount,
        },
      });
    }

    return NextResponse.json({ message: 'Reaction counts updated successfully' });
  } catch (error) {
    console.error('Error updating reaction counts:', error);
    return NextResponse.json({ error: 'Failed to update reaction counts' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json(null, { status: 204, headers: { 'Allow': 'POST' } });
}
