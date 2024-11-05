import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('name'); 

  try {
    let results;
    if (query){//任意検索
      results = await prisma.company.findMany({
        where: {
          name: {
            contains: query,  // 部分一致の条件
            mode: 'insensitive', // 大文字小文字を区別しない
          },
        },
        orderBy: {
          interestedCount: 'desc', // 興味数で並び替え
        },
      });
    }else{//全件取得
      results = await prisma.company.findMany({
        orderBy: {
          interestedCount: 'desc', // 興味数で並び替え
        },
      });
    }
    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('Error fetching top companies:', error);
    return NextResponse.json({ error: 'Failed to fetch top companies' }, { status: 500 });
  }
}