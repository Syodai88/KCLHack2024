//ポストカードに表示する情報と、投稿に対するログイン中のユーザーのリアクションを取得するAPI
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const companyId = searchParams.get('companyId');
  const loginUserId = searchParams.get('loginUserId');

  // パラメータのバリデーション: userId または companyId のどちらかが必要
  if (!loginUserId || (!userId && !companyId)) {
    return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
  }

  try {
    // クエリ条件を設定
    const whereClause: any = {};
    if (userId) {
      whereClause.userId = userId;
    }
    if (companyId) {
      whereClause.companyId = companyId;
    }

    // 投稿を取得
    const posts = await prisma.post.findMany({
      where: whereClause,
      include: {
        user: true,
        company: true,
        likes: {
          where: { userId: loginUserId },
        },
        postTags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // 各投稿に対して、ログイン中のユーザーが「いいね」しているかを判定
    const normalizedPosts = posts.map((post) => ({
      id: Number(post.id),
      userId: post.userId,
      companyId: post.companyId,
      title: post.title,
      content: post.content,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      likeCount: post.likeCount,
      isLiked: post.likes.length > 0,
      user: {
        id: post.user.id,
        name: post.user.name,
      },
      company: post.company
        ? {
            id: post.company.corporateNumber,
            name: post.company.name,
          }
        : null,
      tags: post.postTags.map((postTag) => ({
        id: postTag.tag.id,
        name: postTag.tag.name,
      })),
    }));

    return NextResponse.json({ posts: normalizedPosts }, { status: 200 });
  } catch (error) {
    console.error('Error fetching posts with reactions:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}
