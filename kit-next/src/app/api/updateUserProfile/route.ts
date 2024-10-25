// /pages/api/updateUserProfile.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, profile } = body;

    if (!userId || !profile) {
      return NextResponse.json({ error: 'userId and profile are required' }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name: profile.handleName,
        year: profile.year,
        department: profile.department,
        other: profile.other,
        profileImage: profile.profileImage, // 画像のURLを更新
      },
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error('ユーザープロフィールの更新エラー:', error);
    return NextResponse.json({ error: 'Failed to update user profile' }, { status: 500 });
  }
}
