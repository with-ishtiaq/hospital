import React, { useEffect, useState } from 'react';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const PatientMedicine = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [q, setQ] = useState('');
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${API_BASE}/medicine-shops`);
        const json = await res.json();
        if (!res.ok || !json?.success) throw new Error(json?.error || 'Failed to load medicine shops');
        setShops(json.data || []);
      } catch (e) {
        setError(e.message || 'Failed to load');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const openUrl = (url) => {
    if (!url) return;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const onSearch = async (e) => {
    e.preventDefault();
    const query = q.trim();
    if (!query) return;
    setSearching(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/medicine-shops/search?q=${encodeURIComponent(query)}`);
      const json = await res.json();
      if (!res.ok || !json?.success) throw new Error(json?.error || 'Search failed');
      setResults(json.data || []);
    } catch (e) {
      setResults([]);
      setError(e.message || 'Search failed');
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow sm:rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Medicine Shops</h3>
          <p className="mt-1 text-sm text-gray-500">Open the official online pharmacies.</p>
        </div>

        <div className="p-4">
          <form onSubmit={onSearch} className="flex flex-col md:flex-row gap-2 md:items-center mb-4">
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search medicine name (e.g., Paracetamol)"
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
            <button
              type="submit"
              disabled={searching}
              className="px-4 py-2 rounded-md text-white bg-emerald-600 disabled:opacity-50 text-sm"
            >
              {searching ? 'Searching...' : 'Search'}
            </button>
          </form>
          {loading && <div className="text-sm text-gray-600">Loading shops...</div>}
          {error && <div className="text-sm text-red-600">{error}</div>}
          {!loading && !error && results.length > 0 && (
            <div className="mb-5">
              <div className="text-sm font-medium text-gray-900 mb-2">Search results</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {results.map((r) => (
                  <div key={r.id} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="text-base font-semibold text-gray-900 truncate">{r.name}</div>
                      <div className="mt-1 text-xs text-gray-500 break-words">{r.website}</div>
                    </div>
                    <div className="flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => openUrl(r.searchUrl)}
                        disabled={!r.searchUrl}
                        className="px-3 py-2 rounded-md text-white bg-blue-600 disabled:opacity-50 min-w-[150px] text-sm"
                      >
                        Open results
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {shops.map((s) => (
                <div key={s.id} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="text-base font-semibold text-gray-900 truncate">{s.name}</div>
                    <div className="mt-1 text-xs text-gray-500 break-words">{s.website}</div>
                  </div>
                  <div className="flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => openUrl(s.website)}
                      disabled={!s.website}
                      className="px-3 py-2 rounded-md text-white bg-emerald-600 disabled:opacity-50 min-w-[150px] text-sm"
                    >
                      Open Website
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientMedicine;
