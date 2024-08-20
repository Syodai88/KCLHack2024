// pages/index.tsx
"use client";

import { useState, useEffect } from 'react';
import SearchForm from '../../components/search/searchForm';
import SplitPage from '@/components/common/SplitPage';


const Home: React.FC = () => {
  const [results, setResults] = useState(null);

  useEffect(() => {
    // ページロード時に企業検索を実行する
    searchCompany('');
  }, []);

  const searchCompany = async (query: string) => {
    try {
      const res = await fetch(`/api/searchCompany?name=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data);
    } catch (error) {
      console.error('Error searching companies:', error);
      setResults(null);
    }
  };

  return (
    <SplitPage sidebar={<p className="text-black">Sidebar Content</p>}>
      <div className="space-y-6">
        <SearchForm onSearch={searchCompany} />
        {results && (
          <div className="mt-6 bg-white p-6 rounded-lg shadow-md w-full">
            <h2 className="text-2xl font-semibold text-accent mb-4">Search Results:</h2>
            <pre className="bg-gray-100 p-4 rounded-md text-gray-700">{JSON.stringify(results, null, 2)}</pre>
          </div>
        )}
      </div>
    </SplitPage>
  );
}

export default Home;
