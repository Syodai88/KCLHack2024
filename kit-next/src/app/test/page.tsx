"use client";

import { useState } from 'react';

export default function Home() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);

  const searchCompany = async () => {
    try {
      const res = await fetch(`/api/searchCompany?query=${encodeURIComponent(query)}`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setResults(data);
    } catch (error) {
      console.error('Error searching companies:', error);
      setResults(null);
    }
  };

  return (
    <div>
      <h1>Company Search</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter company name"
      />
      <button onClick={searchCompany}>Search</button>
      {results && (
        <div>
          <h2>Search Results:</h2>
          <pre>{JSON.stringify(results, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
