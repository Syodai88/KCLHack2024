import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma'; 
import { Prisma } from '@prisma/client';

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    // 企業情報をデータベースに保存
    const newCompany = await prisma.company.create({
      data: {
        corporateNumber: body.corporateNumber,
        name: body.name.normalize("NFKC"),
        kana: body.kana,
        representativeName: body.representativeName,
        location: body.location,
        employeeNumber: body.employeeNumber,
        businessSummary: body.businessSummary,
        businessSummaryAi: body.businessSummaryAi,
        companyUrl: body.companyUrl,
        dateOfEstablishment: body.dateOfEstablishment ? new Date(body.dateOfEstablishment) : null,
        averageContinuousServiceYears: body.averageContinuousServiceYears,
        averageAge: body.averageAge,
        averageSalaryAi: body.averageSalaryAi,
        updateDate: body.updateDate ? new Date(body.updateDate) : null,
      },
    });

    return NextResponse.json({ message: 'Company registered successfully', company: newCompany }, { status: 201 });
  } catch (error) {
    console.error('Error registering company:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        // 一意制約違反の場合
        return NextResponse.json({ error: 'Company already registered' }, { status: 409 }); // 409 Conflict
      }
    return NextResponse.json({ error: 'Error registering company' }, { status: 500 });
  }
}
