"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import Companycard from '../../components/common/Companycard'
import Sidebar from '@/components/common/Sidebar';
import SplitPage from '@/components/common/SplitPage';
import SearchForm from '@/components/registercompany/searchForm';

interface Company  {
  userId: string;
  corporateNumber: string;
  name: string;
  location: string;
  companyUrl: string;
  businessSummary: string;
  businessSummaryAi : string;
  interestedCount: number;
  internCount: number;
  eventJoinCount: number;
  updateDate: string;
}

interface ContentProps {
  companies: Company[];  // 検索結果の企業リストを受け取る
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
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Welcome, {user?.email}</h1>
      <p>User ID: {user?.uid}</p>
      <div>
        {companies.length > 0 ? (
          companies.map((company) => (
            <Companycard
              key={company.corporateNumber}
              userId={user?.uid || ''}
              image='https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg6WtGDvj1jszSP30qcBgkdNhSRkB4FHNGiN8s85mvGUDw-w2H3Hw-numR7W7tkWygsQ4mG-fLTBotRvV86eVJTdd473sryVzgrMx_Nxbs1IDuHQ0rNwWfbvoC6Zd1OFEpbMMBfE2YmN2I/s800/business_icon_big_company.png'
              name={company.name}
              details={`所在地: ${company.location}\n業務概要: ${company.businessSummary}\n最終更新日: ${company.updateDate}\nLike Count: ${company.interestedCount}`} 
              companyId={company.corporateNumber} 
              interestCount={company.interestedCount} 
              internCount={company.internCount} 
              eventJoinCount={company.eventJoinCount}
              userInterest={false} 
              userIntern={false} 
              userEventJoin={false}
            />
          ))
        ) : (
          <p>上位企業情報が見つかりませんでした。</p>
        )}
      </div>
    </div>
  );
};

const Home: React.FC = () => {
  const [results, setResults] = useState<Company[]>([]);

  const fetchPopularCompanies = async () => {
    try {
      const res = await fetch('/api/popularCompany');
      const data = await res.json();
      setResults(data);
    } catch (error) {
      console.error('Error fetching top companies:', error);
      setResults([]);
    }
  };

  const fetchCompanies = async (query: string) => {
    try {
      const res = await fetch(`/api/fetchDbCompanyInfo?name=${encodeURIComponent(query)}`);
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
      <SearchForm onSearch={fetchCompanies} />
      <Content companies={results} /> {/* 検索結果をContentに渡す */}
    </SplitPage>
  );
}

export default Home;
