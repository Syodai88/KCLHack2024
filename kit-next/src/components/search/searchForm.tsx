// components/SearchForm.tsx
"use client";

import { useState } from 'react';

interface SearchFormProps {
  onSearch: (query: string) => void;
}

//query(企業名)を入力フォームから受け取って、onSearch関数(ページ側で設定するAPI)に渡す
const SearchForm: React.FC<SearchFormProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    onSearch(query);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="flex items-center space-x-2 bg-white p-2 rounded-full shadow-md">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Enter company name"
        className="flex-grow px-4 py-2 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-primary text-black"
      />
      <button
        onClick={handleSearch}
        className="bg-primary text-white px-4 py-2 rounded-full hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary"
      >
        検索
      </button>
    </div>
  );
}

export default SearchForm;
