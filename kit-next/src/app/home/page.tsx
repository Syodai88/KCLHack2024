"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import Companycard from '../../components/common/Companycard'
import Sidebar from '@/components/common/Sidebar';
import SplitPage from '@/components/common/SplitPage';
import SearchForm from '@/components/registercompany/searchForm';
import type { Company } from '@/interface/interface';
import Loading from '@/components/common/Loading';

interface ContentProps {
  companies: Company[];  
}

const Content: React.FC<ContentProps> = ({ companies }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return <Loading />
  }

  return (
    <div style={{ marginTop: '30px' }}>
      {companies.length > 0 ? (
        companies.map((company: Company, index: number) => {
          let image = '/Company.svg'; 
          if (company.isPopular){
              if (index === 0) {
                image = '/Gold.svg';
              }else if (index === 1) {
                image = '/Silver.svg';
              } else if (index === 2) {
                image = '/Bronze.svg';
              }
          }
          return (
            <Companycard
              key={company.corporateNumber}
              userId={user?.uid || ''}
              company={company}
              image={image}
            />
          );
        })
      ) : (
        <p>検索結果がありません</p>
      )}
    </div>
  );
};

const Home: React.FC = () => {
  const [results, setResults] = useState<Company[]>([]);

  //PopularCompanyにフラグを設定
  const markPopularCompanies =(companies : Company[], popularCompanyIds : string[])=>{
    return companies.map(company => ({
      ...company,
      isPopular : popularCompanyIds.includes(company.corporateNumber),
    }));
  };

  const fetchPopularCompanies = async () => {
    try {
      const res = await fetch('/api/popularCompany');
      const data = await res.json();
      const popularIds = data.map((company: Company) => company.corporateNumber);
      const updatedCompanies = markPopularCompanies(data, popularIds);
      setResults(updatedCompanies);
    } catch (error) {
      console.error('Error fetching top companies:', error);
      setResults([]);
    }
  };

  const fetchCompanies = async (query: string) => {
    try {
      const res = await fetch(`/api/fetchDbCompaniesInfo?name=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data);  
    } catch (error) {
      console.error('Error fetching companies:', error);
      setResults([]);
    }
  };

  useEffect(() => {
    fetchPopularCompanies(); // 初回ロード時に上位企業を取得
  }, []);

  return (
    <SplitPage sidebar={<Sidebar />}>
      <SearchForm onSearch={fetchCompanies} placeholder='企業名を入力(空白で全件表示)' />
      <Content companies={results} /> {/* 検索結果をContentに渡す */}
    </SplitPage>
  );
}

export default Home;
