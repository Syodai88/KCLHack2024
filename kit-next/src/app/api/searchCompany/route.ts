import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');
  
  if (!name) {
    return NextResponse.json({ error: 'name query parameter is required' }, { status: 400 });
  }

  const apiKey = process.env.NEXT_PUBLIC_GBIZINFO_API_KEY;
  const apiUrl = `https://info.gbiz.go.jp/hojin/v1/hojin?name=${encodeURIComponent(name)}&page=1&limit=1000`;

  try {
    const response = await axios.get(apiUrl, {
      headers: {
        'accept': 'application/json',
        'X-hojinInfo-api-token': apiKey,
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    let errorMessage = 'Failed to fetch company data';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
