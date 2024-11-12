//ポストカードに表示する情報と、投稿に対するログイン中のユーザーのリアクションを取得するAPI
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  const { userId, companyId, loginUserId } = await request.json();

  // パラメータのバリデーション
  if (!loginUserId) {
    return NextResponse.json({ error: 'loginUserId is required' }, { status: 400 });
  }

  try {
    // フィルタリング条件を動的に構築、Userごとの投稿 or Companyごとの投稿
    const whereClause: any = {};
    if (userId) {
      whereClause.userId = userId;
    }
    if (companyId) {
      whereClause.companyId = companyId;
    }

    // 投稿の取得
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
      isLiked: post.likes.length > 0, // ログインユーザーがいいねしているか
      user: {
        id: post.user.id,
        name: post.user.name,
      },
      company: {
        id: post.company.corporateNumber,
        name: post.company.name,
      },
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
