import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const corporateNumber = searchParams.get('corporateNumber');

  if (!corporateNumber) {
    return NextResponse.json({ error: 'Corporate number is required' }, { status: 400 });
  }

  try {
    const company = await prisma.company.findUnique({
      where: { corporateNumber },
    });

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    return NextResponse.json(company);
  } catch (error) {
    console.error('Error fetching company:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
