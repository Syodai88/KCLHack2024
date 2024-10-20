import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import React from 'react';

interface CompanyPageProps {
  params: {
    companyId: string;
  };
}

const CompanyPage = async ({ params }: CompanyPageProps) => {
  const { companyId } = params;
  console.log(companyId);

  try {
    // IDで企業データを取得
    const company = await prisma.company.findUnique({
      where: {
        corporateNumber: companyId,
      },
    });

    // 企業が見つからない場合は404ページを返す
    if (!company) {
      notFound();
    }

    return (
      <div>
        <h1>{company.name}</h1>
        <p>所在地: {company.location}</p>
        <p>従業員数: {company.employeeNumber}</p>
        {/* 必要に応じて他のフィールドを追加 */}
      </div>
    );
  } catch (error) {
    console.error('企業情報の取得エラー:', error);
    return <div>企業の詳細を読み込めませんでした</div>;
  }
};

export default CompanyPage;