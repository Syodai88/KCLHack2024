//postテーブルのデータの定期更新用のAPI、デプロイ後にGoole Cloud Schedulerで定期実行の設定をすること
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const posts = await prisma.post.findMany();

    for (const post of posts) {
      // Likeのカウントを取得
      const likeCount = await prisma.like.count({
        where: { postId: post.id },
      });

      // PostのlikeCountを更新
      await prisma.post.update({
        where: { id: post.id },
        data: {
          likeCount,
        },
      });
    }

    return NextResponse.json({ message: 'Like counts updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating like counts:', error);
    return NextResponse.json({ error: 'Failed to update like counts' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json(null, { status: 204, headers: { 'Allow': 'POST' } });
}
