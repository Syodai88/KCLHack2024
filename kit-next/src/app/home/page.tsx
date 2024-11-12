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
import axios from 'axios';

interface ContentProps {
  companies: Company[];  
}

const Content: React.FC<ContentProps> = ({ companies }) => {
  const { user } = useAuth();

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
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);


  //PopularCompanyにフラグを設定
  const markPopularCompanies =(companies : Company[], popularCompanyIds : string[]): Company[]=>{
    return companies.map(company => ({
      ...company,
      isPopular : popularCompanyIds.includes(company.corporateNumber),
    }));
  };

  const fetchPopularCompanies = async (userId : string) => {
    if(!user){
      return;
    }
    try {
      setIsLoading(true);
      const response = await axios.get('/api/popularCompaniesWithReactions',{
        params: {userId: userId}
      });
      const data:Company[] = response.data;
      const popularIds = data.map((company: Company) => company.corporateNumber);
      const updatedCompanies = markPopularCompanies(data, popularIds);
      setResults(updatedCompanies);
    } catch (error) {
      console.error('Error fetching top companies:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCompanies = async (query : string, userId : string) => {
    if (!user){
      return;
    }
    try {
      setIsLoading(true);
      const response = await axios.get('api/fetchDbCompaniesInfo',{
        params: {name: query, userId: userId}
      });
      setResults(response.data);  
    } catch (error) {
      console.error('Error fetching companies:', error);
      setResults([]);
    } finally{
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if(user){
      fetchPopularCompanies(user.uid); // 初回ロード時に上位企業を取得
    }
  }, [user]);


  return (
    <SplitPage sidebar={<Sidebar />}>
      <SearchForm 
        onSearch={(query) => {
          if (user) {
            fetchCompanies(query, user.uid);
          }
        }}  
        placeholder='企業名を入力(空白で全件表示)' 
      />
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          height: 'calc(100vh - 50px - 48px)',//NavibarとSeasonFromの高さを引いてスクロール設定
        }}
      >
        {isLoading || loading ? (
          <Loading />
        ) : (
          <Content companies={results} />
        )}
      </div>
    </SplitPage>
  );
}

export default Home;
