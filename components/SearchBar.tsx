
import React, { useState, useEffect, useRef } from 'react';
import { Search, User as UserIcon } from 'lucide-react';
import { searchGitHubUsers } from '../services/githubService';
import { GitHubUser } from '../types';

interface SearchBarProps {
  onSearch: (username: string) => void;
  loading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, loading }) => {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<Partial<GitHubUser>[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearchingSuggestions, setIsSearchingSuggestions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounce suggestion fetching
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (input.trim().length >= 3) {
        setIsSearchingSuggestions(true);
        const results = await searchGitHubUsers(input.trim());
        setSuggestions(results);
        setIsSearchingSuggestions(false);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [input]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSearch(input.trim());
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (login: string) => {
    setInput(login);
    onSearch(login);
    setShowSuggestions(false);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto" ref={containerRef}>
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className={`h-5 w-5 transition-colors ${loading ? 'text-blue-500 animate-pulse' : 'text-gray-400 group-focus-within:text-blue-500'}`} />
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={() => input.length >= 3 && setShowSuggestions(true)}
          placeholder="Enter GitHub username (e.g., torvalds)"
          className="block w-full pl-12 pr-4 py-4 bg-[#161b22] border border-[#30363d] rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-xl placeholder-gray-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="absolute right-3 top-2 bottom-2 px-6 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium rounded-xl transition-colors"
        >
          {loading ? 'Searching...' : 'Explore'}
        </button>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && (suggestions.length > 0 || isSearchingSuggestions) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#161b22] border border-[#30363d] rounded-2xl shadow-2xl overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
          {isSearchingSuggestions && suggestions.length === 0 ? (
            <div className="p-4 text-center text-gray-500 text-sm italic">
              Searching profiles...
            </div>
          ) : (
            <div className="py-2">
              <div className="px-4 py-1 text-[10px] uppercase tracking-wider text-gray-500 font-bold border-b border-[#30363d] mb-1">
                Relevant Profiles
              </div>
              {suggestions.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleSelectSuggestion(user.login || '')}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#1f2937] transition-colors text-left group"
                >
                  <img 
                    src={user.avatar_url} 
                    alt={user.login} 
                    className="w-8 h-8 rounded-lg border border-[#30363d]"
                  />
                  <div className="flex flex-col">
                    <span className="text-white font-medium group-hover:text-blue-400 transition-colors">
                      {user.login}
                    </span>
                    <span className="text-xs text-gray-500">GitHub Profile</span>
                  </div>
                  <UserIcon size={14} className="ml-auto text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
