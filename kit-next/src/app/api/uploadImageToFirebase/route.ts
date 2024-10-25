// src/app/api/uploadImageToFirebase/route.ts
import { adminStorage } from "@/plugins/firebaseAdomin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { base64Image, userId } = await request.json();
    
    if (!base64Image || !userId) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
    await deleteOldImages(userId);

    const timestamp = new Date().getTime();
    const fileName = `profiles/${userId}/${timestamp}.jpg`; 
    const imageBuffer = Buffer.from(base64Image, "base64"); 
    const file = adminStorage.file(fileName);

    //画像をFirebase Storageにアップロード
    await file.save(imageBuffer, {
      metadata: {
        contentType: "image/jpeg",
        cacheControl: "public, max-age=31536000", //キャッシュ設定
      },
      resumable: false,
      public: true,
    });

    const publicUrl = `https://storage.googleapis.com/${adminStorage.name}/${fileName}`;
    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    console.error("画像のアップロード中にエラーが発生しました:", error);
    return NextResponse.json({ error: "画像のアップロードに失敗しました" }, { status: 500 });
  }
}
//古い画像を削除する関数
async function deleteOldImages(userId: string) {
    try {
        // userId フォルダ内のファイル一覧を取得
        const [files] = await adminStorage.getFiles({ prefix: `profiles/${userId}/` });
        // すべてのファイルを削除
        for (const file of files) {
            await file.delete();
        }
    } catch (error) {
        if ((error as { code?: number }).code !== 404) { // 404エラー（ファイルが見つからない場合）は無視
            console.error("古い画像の削除中にエラーが発生しました:", error);
          }
    }
  }