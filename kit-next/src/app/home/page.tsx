"use client";
import { useEffect,useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import Companycard from '../../components/common/Companycard'
import Sidebar from '@/components/common/Sidebar';
import SplitPage from '@/components/common/SplitPage';
import SearchForm from '@/components/registercompany/searchForm';
interface Company  {
  corporateNumber: string;
  name: string;
  location: string;
  companyUrl: string;
  businessSummary: string;
  businessSummaryAi : string;
  interestedCount: number;
  updateDate: string;
}

const Content: React.FC = () => {

  const { user, loading } = useAuth();
  const router = useRouter();
  const [topCompanies, setTopCompanies] = useState<Company[]>([]);

  const fetchTopCompanies = async () => {
    try {
      const res = await fetch('/api/popularCompany');
      const data = await res.json();
      setTopCompanies(data);
      console.log(data);
    } catch (error) {
      console.error('Error fetching top companies:', error);
      setTopCompanies([]);
    }
  };
  

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    fetchTopCompanies(); // ページロード時に上位企業を取得
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
  

  return (
    <div>
      <h1>Welcome, {user?.email}</h1>
      <p>User ID: {user?.uid}</p>
      <div>
      {topCompanies.length > 0 ? (
            topCompanies.map((company) => (
              <Companycard
                key={company.corporateNumber}
                image='https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg6WtGDvj1jszSP30qcBgkdNhSRkB4FHNGiN8s85mvGUDw-w2H3Hw-numR7W7tkWygsQ4mG-fLTBotRvV86eVJTdd473sryVzgrMx_Nxbs1IDuHQ0rNwWfbvoC6Zd1OFEpbMMBfE2YmN2I/s800/business_icon_big_company.png'
                name={company.name}
                details={`所在地: ${company.location}\n業務概要: ${company.businessSummary}\n最終更新日: ${company.updateDate}\nLike Count: ${company.interestedCount}`}
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
  interface Company  {
    corporate_number: string;
    name: string;
    location: string;
    status: string;
    update_date: string;
  }
  const [results, setResults] = useState<Company[]>([]);
  const fetchCompanies = async (query: string) => {
    try {
      const res = await fetch(`/api/searchCompany?name=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data['hojin-infos'] || []); 
    } catch (error) {
      console.error('Error fetching companies:', error);
      setResults([]);
    }
  };
  return (
    <SplitPage sidebar={<Sidebar />}>
      <SearchForm onSearch={fetchCompanies} />
      <Content />
    </SplitPage>
  );
}

export default Home;
