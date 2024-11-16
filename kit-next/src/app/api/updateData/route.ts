import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // === 1. PostテーブルのlikeCountの更新 ===
    const posts = await prisma.post.findMany();
    for (const post of posts) {
      const likeCount = await prisma.like.count({
        where: { postId: post.id },
      });

      await prisma.post.update({
        where: { id: post.id },
        data: { likeCount },
      });
    }
    console.log('Post like counts updated successfully');

    // === 2. Companyテーブルのreaction countsの更新 ===
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
    console.log('Company reaction counts updated successfully');

    return NextResponse.json({ message: 'Data updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating data:', error);
    return NextResponse.json({ error: 'Failed to update data' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json(null, { status: 204, headers: { 'Allow': 'POST' } });
}
