import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const companyId = searchParams.get('companyId');

  try {
    // フィルタリング条件を動的に構築
    const whereClause: any = {};
    if (userId) {
      whereClause.userId = userId;
    }
    if (companyId) {
      whereClause.companyId = companyId;
    }

    const posts = await prisma.post.findMany({
      where: whereClause,
      include: {
        user: true,
        company: true,
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

    // BigInt型をNumber型に変換
    const normalizedPosts = posts.map((post) => ({
      id: Number(post.id),
      userId: post.userId,
      companyId: post.companyId,
      title: post.title,
      content: post.content,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      likeCount: post.likeCount,
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

    return NextResponse.json(
      { posts: normalizedPosts },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: '投稿の取得に失敗しました。' },
      { status: 500 }
    );
  }
}
