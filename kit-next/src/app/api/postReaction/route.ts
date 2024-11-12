//ユーザーがポストに対していいねのカラムを追加、削除するAPI
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const { postId, userId } = await req.json();

  if (!postId || !userId) {
    return NextResponse.json({ error: 'postId and userId are required' }, { status: 400 });
  }

  try {
    // 既存のLikeを確認
    const existingLike = await prisma.like.findFirst({
      where: {
        postId: BigInt(postId),
        userId,
      },
    });

    if (existingLike) {
      // 既にLikeが存在する場合は削除
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });

      return NextResponse.json({ message: 'Like removed successfully', likeAdded: false }, { status: 200 });
    } else {
      // Likeが存在しない場合は新規作成
      await prisma.like.create({
        data: {
          postId: BigInt(postId),
          userId,
        },
      });

      return NextResponse.json({ message: 'Like added successfully', likeAdded: true }, { status: 200 });
    }
  } catch (error) {
    console.error('Error updating like:', error);
    return NextResponse.json({ error: 'Failed to update like' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json(null, { status: 204, headers: { 'Allow': 'POST' } });
}
