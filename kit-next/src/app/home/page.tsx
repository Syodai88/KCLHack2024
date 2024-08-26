"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import Companycard from '../../components/common/Companycard'
import SearchBox from '../../components/common/SearchBox'
import SwitchButton from '../../components/common/SwitchButton'
import Sidebar from '@/components/common/Sidebar';
import SplitPage from '@/components/common/SplitPage';

const Content: React.FC = () => {
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
      <Companycard           
        image='https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg6WtGDvj1jszSP30qcBgkdNhSRkB4FHNGiN8s85mvGUDw-w2H3Hw-numR7W7tkWygsQ4mG-fLTBotRvV86eVJTdd473sryVzgrMx_Nxbs1IDuHQ0rNwWfbvoC6Zd1OFEpbMMBfE2YmN2I/s800/business_icon_big_company.png'
        name='ネオテック・エンジニアリング'
        details='最先端技術を駆使し、持続可能な未来を創造する総合エンジニアリング企業。イノベーションに重点を置く。'/>
      </div>
      <div>
      <Companycard           
        image='https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg6WtGDvj1jszSP30qcBgkdNhSRkB4FHNGiN8s85mvGUDw-w2H3Hw-numR7W7tkWygsQ4mG-fLTBotRvV86eVJTdd473sryVzgrMx_Nxbs1IDuHQ0rNwWfbvoC6Zd1OFEpbMMBfE2YmN2I/s800/business_icon_big_company.png'
        name='インフィニティ・ソリューションズ'
        details='無限の可能性を引き出す技術革新企業。顧客のニーズに合わせたカスタマイズソリューションを提供。'/>
      </div>
      <div>
      <Companycard           
        image='https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg6WtGDvj1jszSP30qcBgkdNhSRkB4FHNGiN8s85mvGUDw-w2H3Hw-numR7W7tkWygsQ4mG-fLTBotRvV86eVJTdd473sryVzgrMx_Nxbs1IDuHQ0rNwWfbvoC6Zd1OFEpbMMBfE2YmN2I/s800/business_icon_big_company.png'
        name='テクノフュージョン・デザイン'
        details='技術とデザインの融合で新しい価値を提供する企業。エンジニアリングとクリエイティブの力を結集。'/>
      </div>

    </div>
  );
};
const Home: React.FC = () => {
  return (
    <SplitPage sidebar={<Sidebar />}>
    <Content />
    </SplitPage>
  );
}

export default Home;
