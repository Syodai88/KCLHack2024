"use client";

import { useState, useEffect } from 'react';
import SearchForm from '../../components/search/searchForm';
import SplitPage from '../../components/common/SplitPage';
import ResultsTable from '@/components/search/ResultsTable';


type Company = {
  corporate_number: string;
  name: string;
  location: string;
  status: string;
  update_date: string;
};

const Home: React.FC = () => {
  const [results, setResults] = useState<Company[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    // ページロード時に企業検索を実行する
    fetchCompanies('');
  }, []);

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

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <SplitPage sidebar={<p className="text-black">Sidebar Content</p>}>
      <div className="space-y-6">
        <SearchForm onSearch={fetchCompanies} />
        {results &&(
          <ResultsTable
            companies={results}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </SplitPage>
  );
}

export default Home;
