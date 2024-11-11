import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function normalizeQuery(query: string): string {
    return query.normalize('NFKC').toLowerCase().trim();
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query');
  const normalizedQuery = query ? normalizeQuery(query) : '';

  if (query !== null && typeof query !== 'string') {
    return NextResponse.json({ error: '無効なクエリパラメータです。' }, { status: 400 });
  }

  try {
    const tags = await prisma.tag.findMany({
      where: {
        name: {
          contains: normalizedQuery,
          mode: 'insensitive',
        },
      },
    });

    return NextResponse.json(tags, { status: 200 });
  } catch (error) {
    console.error('Error fetching tags:', error);
    return NextResponse.json({ error: 'タグの検索に失敗しました。' }, { status: 500 });
  }
}
