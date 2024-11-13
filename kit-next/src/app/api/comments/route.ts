import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { userId, postId, content, parentId } = await req.json();

    // 必要なパラメータが揃っているか確認
    if (!postId || !content || content.trim() === '') {
      return NextResponse.json({ error: '不正なリクエストです' }, { status: 400 });
    }

    // リプライの場合、親コメントが存在するかチェック
    if (parentId) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: Number(parentId) },
      });
      if (!parentComment) {
        return NextResponse.json({ error: '親コメントが存在しません' }, { status: 404 });
      }
    }

    // コメントの作成
    const newComment = await prisma.comment.create({
      data: {
        postId: Number(postId),
        userId,
        content,
        parentId: parentId ? Number(parentId) : null,
      },
      include: {
        user: true,//成功後にユーザー名を即時反映
      },
    });
    const sanitizedComment = {
        ...newComment,
        id: Number(newComment.id),
        postId: Number(newComment.postId),
        parentId: newComment.parentId ? Number(newComment.parentId) : null,
    };
  

    // 成功レスポンス
    // 成功レスポンスを返す
    return NextResponse.json({ comment: sanitizedComment }, { status: 201 });

  } catch (error) {
    console.error('コメントの投稿エラー:', error);
    return NextResponse.json({ error: 'コメントの投稿に失敗しました' }, { status: 500 });
  }
}
