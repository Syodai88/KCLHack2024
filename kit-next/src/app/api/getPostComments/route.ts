import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest){
  try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get('postId')
    if(!postId){
      return NextResponse.json({ error: 'postIdが指定されていません。' }, { status: 400 });
    }
    // 投稿情報と関連するユーザー、企業、タグ情報の取得
    const post = await prisma.post.findUnique({
      where: {
        id: BigInt(postId),
      },
      include: {
        user: true,
        company: true,
        postTags: {
          include: {
            tag: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json({ error: '投稿が見つかりませんでした。' }, { status: 404 });
    }

    // コメントの取得
    const comments = await prisma.comment.findMany({
      where: {
        postId: BigInt(postId),
      },
      orderBy: {
        createdAt: 'asc',
      },
      include: {
        user: true,
      },
    });

    // BigIntをNumber型に変換して、必要なフィールドのみを選択
    const normalizedPost = {
      id: Number(post.id),
      userId: post.userId,
      companyId: post.companyId,
      title: post.title,
      content: post.content,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      user: {
        id: post.user.id,
        name: post.user.name,
      },
      company: {
        id: post.company.corporateNumber,
        name: post.company.name,
      },
      tags: post.postTags.map((postTag) => ({
        id: Number(postTag.tag.id),
        name: postTag.tag.name,
      })),
    };

    const normalizedComments = comments.map((comment) => ({
      id: Number(comment.id),
      postId: Number(comment.postId),
      parentId: comment.parentId ? Number(comment.parentId) : null,
      content: comment.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      user: {
        id: comment.user.id,
        name: comment.user.name,
      },
    }));

    // 正常なレスポンスを返す
    return NextResponse.json(
      { post: normalizedPost, comments: normalizedComments },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching post and comments:', error);
    return NextResponse.json(
      { error: '投稿の取得に失敗しました。' },
      { status: 500 }
    );
  }
}
