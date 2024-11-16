import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error('GEMINI_API_KEY is not set');
}

const genAI = new GoogleGenerativeAI(API_KEY);

export async function POST(req: Request) {
  const body = await req.json();
  const { companyName } = body;

  if (!companyName) {
    return NextResponse.json({ error: 'companyName is required in the request body' }, { status: 400 });
  }

  try {
    const prompt = `
企業「${companyName}」について、以下の構造に従ってJSON形式で詳細情報を提供してください。情報は何度も検証して限りなく精度の高い情報にした上で提供してください。事業概要は2～3行で内容がわかるように簡潔にまとめてください。必要な構造は次の通りです：

{
  "kana": "String",         // 企業名のふりがな。
  "employeeNumber": "Int",  // 従業員数。
  "businessSummary": "String", // 事業概要（2~3行で要点をまとめる。加えて就職する大学生に対してどのような人がおすすめかアドバイスする）。
  "keyMessage": "String",   // 企業の特徴や魅力を伝える簡単なメッセージ。
  "companyUrl": "String",   // 公式ウェブサイトのURL。
  "dateOfEstablishment": "ISO 8601 日付形式", // 設立日。
  "averageContinuousServiceYears": "Float", // 平均継続勤務年数。
  "averageAge": "Float",    // 従業員の平均年齢。
  "averageSalary": "String",   // 新卒年収(x万形式)
}
`;

    // Gemini 1.5モデルを取得
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig: { "responseMimeType": "application/json" } });

    // コンテンツを生成
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    if (text) {
      const jsonData = JSON.parse(text);
      return NextResponse.json( jsonData , { status: 200 });
    } else {
      return NextResponse.json({ error: 'No content was returned from the AI model.' }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Error generating company info:', error);
    return NextResponse.json({ error: 'Failed to generate company information.' }, { status: 500 });
  }
}
