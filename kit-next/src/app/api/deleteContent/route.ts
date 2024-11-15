import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const contentId = searchParams.get('contentId');
  const userId = searchParams.get('userId');
  const type = searchParams.get('type'); // "post" or "comment"

  // パラメータのバリデーション
  if (!contentId || !userId || !type) {
    return NextResponse.json({ error: 'contentId, userId, and type are required' }, { status: 400 });
  }

  try {
    if (type === 'post') {
      // 投稿の削除処理
      const post = await prisma.post.findUnique({
        where: { id: BigInt(contentId) },
      });
      if (!post) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
      }
      // 投稿の所有者のみ削除可能
      if (post.userId !== userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }

      await prisma.post.delete({
        where: { id: BigInt(contentId) },
      });

      return NextResponse.json({ message: 'Post deleted successfully' }, { status: 200 });

    } else if (type === 'comment') {
      // コメントの削除処理
      const comment = await prisma.comment.findUnique({
        where: { id: Number(contentId) },
      });

      if (!comment) {
        return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
      }

      // コメントの所有者のみ削除可能
      if (comment.userId !== userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }

      await prisma.comment.delete({
        where: { id: Number(contentId) },
      });

      return NextResponse.json({ message: 'Comment deleted successfully' }, { status: 200 });

    } else {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error deleting content:', error);
    return NextResponse.json({ error: 'Failed to delete content' }, { status: 500 });
  }
}
