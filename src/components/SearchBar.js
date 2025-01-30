import React, { useState, useCallback } from 'react';
import axios from 'axios';
import './SearchBar.css';
import ImpactAnalysis from './ImpactAnalysis';
import debounce from 'lodash/debounce';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cache, setCache] = useState(new Map());
  const [selectedImpact, setSelectedImpact] = useState(null);

  // Cache configuration
  const CACHE_DURATION = 1000 * 60 * 5; // 5 minutes
  const MIN_QUERY_LENGTH = 2;

  // Initialize axios instance with default config
  const searchClient = axios.create({
    timeout: 5000,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  const fetchSuggestions = async (searchQuery) => {
    try {
      const wikiResponse = await searchClient.get(
        'https://en.wikipedia.org/w/api.php',
        {
          params: {
            action: 'query',
            list: 'search',
            srsearch: `${searchQuery} comparison`,
            format: 'json',
            origin: '*',
            utf8: 1,
            srlimit: 10
          }
        }
      );

      const wikiResults = wikiResponse.data.query.search.map(item => ({
        text: item.title,
        source: 'Wikipedia',
        snippet: item.snippet.replace(/<\/?[^>]+(>|$)/g, ""),
        url: `https://en.wikipedia.org/wiki/${encodeURIComponent(item.title)}`,
        type: 'search'
      }));

      const filteredResults = wikiResults.filter(result => 
        result.text.toLowerCase().includes('vs') || 
        result.text.toLowerCase().includes('versus') ||
        result.text.toLowerCase().includes('compared') ||
        result.text.toLowerCase().includes('comparison')
      );

      return filteredResults;
    } catch (error) {
      console.error('Search error:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
      return [];
    }
  };

  const debouncedSearch = useCallback(
    debounce(async (searchQuery) => {
      if (searchQuery.length < MIN_QUERY_LENGTH) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);

      try {
        const cacheKey = searchQuery.toLowerCase();
        const cachedResult = cache.get(cacheKey);
        
        if (cachedResult && Date.now() - cachedResult.timestamp < CACHE_DURATION) {
          setSuggestions(cachedResult.data);
          setIsLoading(false);
          return;
        }

        const results = await fetchSuggestions(searchQuery);
        
        setCache(new Map(cache.set(cacheKey, {
          data: results,
          timestamp: Date.now()
        })));

        setSuggestions(results);
      } catch (error) {
        console.error('Search failed:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    [cache]
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.text);
    setSelectedImpact(null); // Reset selected impact as we no longer have hardcoded data
  };

  return (
    <div className="search-container">
      <div className="search-wrapper">
        <span className="search-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </span>
        <input
          type="text"
          className="search-input"
          placeholder="Search for comparisons..."
          value={query}
          onChange={handleInputChange}
        />
      </div>
      {isLoading && <div className="loading-spinner">Loading...</div>}
      
      {suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((suggestion, index) => (
            <li 
              key={`${suggestion.source}-${index}`}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`suggestion-item ${suggestion.type}`}
            >
              <div className="suggestion-content">
                <h4 className="suggestion-title">{suggestion.text}</h4>
                {suggestion.snippet && (
                  <p className="suggestion-snippet">{suggestion.snippet}</p>
                )}
                <span className="suggestion-source">{suggestion.source}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
      {selectedImpact && <ImpactAnalysis impactData={selectedImpact} />}
    </div>
  );
};

export default SearchBar; 