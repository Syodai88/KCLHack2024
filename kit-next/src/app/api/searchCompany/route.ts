import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const apiKey = process.env.NEXT_PUBLIC_YAHOO_API_KEY;

export async function GET(request: NextRequest) {
  console.log('API Key:', apiKey);  // APIキーの値をログに出力

  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  const url = `https://job.yahooapis.jp/v1/furusato/company/?appid=${apiKey}&query=${encodeURIComponent(query)}`;

  try {
    const response = await axios.get(url);
    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching data from Yahoo API' }, { status: 500 });
  }
}
