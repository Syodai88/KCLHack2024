import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Post } from '@prisma/client';

interface PostRequestBody {
  userId: string;
  companyId: string;
  title: string;
  content: string;
  newTags: string[];
  tags: string[];
}
function normalizeTag(tag: string): string {
    // Unicode 正規化 (NFKC) + 小文字変換
    return tag.normalize('NFKC').toLowerCase().trim();
}
export async function POST(req: Request) {
  try {
    const body: PostRequestBody = await req.json();
    const { userId, companyId, title, content, newTags, tags } = body;

    // バリデーションチェック
    const missingFields = [];
    if (!userId) missingFields.push('userId');
    if (!companyId) missingFields.push('companyId');
    if (!title) missingFields.push('title');
    if (!content) missingFields.push('content');

    if (missingFields.length > 0) {
      console.error(`必須フィールドが不足しています: ${missingFields.join(', ')}`);
      return NextResponse.json(
        { error: `以下のフィールドを入力してください: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (prisma) => {
      // 投稿の作成
      const newPost: Post = await prisma.post.create({
        data: {
          userId,
          companyId,
          title,
          content,
        },
      });

      // 新規タグの保存
      if (newTags && newTags.length > 0) {
        const uniqueNewTags = Array.from(new Set(newTags));
        await prisma.tag.createMany({
          data: uniqueNewTags.map((name: string) => ({ name })),
          skipDuplicates: true,
        });
      }

      // タグの取得
      const normalizedTags = tags.map(normalizeTag);
      const allTags = await prisma.tag.findMany({
        where: { name: { in: normalizedTags } },
      });

      // PostTag の関連付け
      if (allTags.length > 0) {
        const postTagData = allTags.map((tag) => ({
          postId: Number(newPost.id),
          tagId: tag.id,
        }));
        await prisma.postTag.createMany({ data: postTagData });
      }
      return newPost;
    });

    // 正常なレスポンスを返す
    return NextResponse.json(
      { success: true, postId: Number(result.id) },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error saving post with tags:', error);

    // エラーの詳細をログに出力
    if (error instanceof Error) {
      console.error('エラーの詳細:', error.message);
    }

    // エラーレスポンスを返す
    return NextResponse.json(
      { error: '投稿の保存に失敗しました。' },
      { status: 500 }
    );
  }
}
