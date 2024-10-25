import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; 
import { adminAuth } from '@/plugins/firebaseAdmin';

export async function POST(req: NextRequest) {
  const body = await req.json();

  // リクエストヘッダーからIDトークンを取得
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const idToken = authHeader.split('Bearer ')[1];

  try {
    // IDトークンを検証
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // リクエストのユーザーIDと一致するか確認
    if (uid !== body.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ユーザー情報をデータベースに保存
    await prisma.user.create({
      data: {
        id: body.id,
        email: body.email,
        name: body.name || "未設定",
        year: body.year || "未設定",
        department: body.department || "未設定",
      },
    });

    return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Error creating user' }, { status: 500 });
  }
}
