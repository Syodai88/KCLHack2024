import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const corporateNumber = searchParams.get('corporate_number');
  
  if (!corporateNumber) {
    return NextResponse.json({ error: 'corporate_number query parameter is required' }, { status: 400 });
  }

  const apiKey = process.env.NEXT_PUBLIC_GBIZINFO_API_KEY;
  const apiUrl = `https://info.gbiz.go.jp/hojin/v1/hojin/${encodeURIComponent(corporateNumber)}`;

  try {
    const response = await axios.get(apiUrl, {
      headers: {
        'accept': 'application/json',
        'X-hojinInfo-api-token': apiKey,
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    let errorMessage = 'Failed to fetch company details';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
