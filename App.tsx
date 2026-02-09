
import React, { useState, useMemo } from 'react';
import { AppState, GitHubUser, GitHubRepo } from './types';
import { fetchGitHubUser, fetchGitHubRepos } from './services/githubService';
import { generateAIInsight } from './services/geminiService';
import SearchBar from './components/SearchBar';
import ProfileHeader from './components/ProfileHeader';
import RepoCard from './components/RepoCard';
import LanguageChart from './components/LanguageChart';
import AIInsightPanel from './components/AIInsightPanel';
import { Github, AlertCircle, TrendingUp, Sparkles, ChevronLeft, Layout, Box, BarChart3, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type ViewType = 'home' | 'results';
type TabType = 'overview' | 'projects';

const App: React.FC = () => {
  const [view, setView] = useState<ViewType>('home');
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [repoSearch, setRepoSearch] = useState('');
  const [state, setState] = useState<AppState>({
    user: null,
    repos: [],
    loading: false,
    error: null,
    aiInsight: null,
    isGeneratingInsight: false,
  });

  const handleSearch = async (username: string) => {
    setState(prev => ({ ...prev, loading: true, error: null, aiInsight: null }));
    setRepoSearch('');
    setActiveTab('overview');
    try {
      const [user, repos] = await Promise.all([
        fetchGitHubUser(username),
        fetchGitHubRepos(username)
      ]);
      setState(prev => ({ ...prev, user, repos, loading: false }));
      setView('results');
    } catch (err: any) {
      setState(prev => ({ ...prev, loading: false, error: err.message }));
    }
  };

  const handleGenerateInsight = async () => {
    if (!state.user || state.repos.length === 0) return;
    setState(prev => ({ ...prev, isGeneratingInsight: true }));
    try {
      const insightRepos = state.repos.slice(0, 20);
      const insight = await generateAIInsight(state.user, insightRepos);
      setState(prev => ({ ...prev, aiInsight: insight, isGeneratingInsight: false }));
    } catch (err) {
      setState(prev => ({ ...prev, isGeneratingInsight: false, error: "AI Insight generation failed." }));
    }
  };

  const filteredRepos = useMemo(() => {
    if (!repoSearch) return state.repos;
    const lowerSearch = repoSearch.toLowerCase();
    return state.repos.filter(repo => 
      repo.name.toLowerCase().includes(lowerSearch) || 
      (repo.description && repo.description.toLowerCase().includes(lowerSearch)) ||
      (repo.language && repo.language.toLowerCase().includes(lowerSearch))
    );
  }, [state.repos, repoSearch]);

  const goBack = () => setView('home');

  return (
    <div className="min-h-screen relative bg-[#05070a] selection:bg-blue-500/30">
      {/* Cinematic Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/10 blur-[120px] rounded-full animate-pulse [animation-delay:2s]" />
      </div>

      {/* Global Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#05070a]/60 backdrop-blur-xl border-b border-white/5 py-4">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={goBack}>
            <div className="bg-white p-1.5 rounded-xl transition-transform group-hover:scale-110">
              <Github className="w-5 h-5 text-[#0d1117]" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              GitHub <span className="text-blue-500">Analysis</span>
            </span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-widest text-gray-400 font-bold">
              <Sparkles size={12} className="text-blue-400" />
              Gemini 3 Pro Intelligence
            </div>
            {view === 'results' && (
              <button 
                onClick={goBack}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 transition-all text-sm font-bold text-white shadow-lg shadow-blue-600/20"
              >
                <Search size={16} />
                New Search
              </button>
            )}
          </div>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {view === 'home' ? (
          <motion.main
            key="home"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 container mx-auto px-6 flex flex-col items-center justify-center min-h-screen"
          >
            <div className="max-w-4xl w-full space-y-16 text-center">
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/5 border border-white/10 text-blue-400 text-[10px] font-bold uppercase tracking-[0.2em]"
                >
                  Deep Profile Analysis Engine
                </motion.div>
                
                <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-white leading-tight">
                  GitHub <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-white to-emerald-400">
                    Analysis
                  </span>
                </h1>
                
                <p className="text-gray-400 text-lg md:text-2xl max-w-2xl mx-auto font-light leading-relaxed">
                  Enter a GitHub username to extract professional DNA, project records, and AI-driven personality insights.
                </p>
              </div>

              <div className="space-y-4">
                <SearchBar onSearch={handleSearch} loading={state.loading} />
                {state.error && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 max-w-2xl mx-auto text-sm"
                  >
                    <AlertCircle size={18} />
                    <p className="font-medium">{state.error}</p>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.main>
        ) : (
          <motion.main
            key="results"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative z-10 container mx-auto px-6 pt-32 pb-20"
          >
            {state.user && (
              <div className="max-w-7xl mx-auto space-y-12">
                {/* Profile Slide Header */}
                <ProfileHeader user={state.user} />

                {/* Structured Tab Navigation */}
                <div className="flex items-center justify-center">
                  <div className="inline-flex p-1 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                    <button
                      onClick={() => setActiveTab('overview')}
                      className={`flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold transition-all ${
                        activeTab === 'overview' 
                        ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' 
                        : 'text-gray-500 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Layout size={18} />
                      Persona Overview
                    </button>
                    <button
                      onClick={() => setActiveTab('projects')}
                      className={`flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold transition-all ${
                        activeTab === 'projects' 
                        ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' 
                        : 'text-gray-500 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Box size={18} />
                      Original Projects ({state.repos.length})
                    </button>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {activeTab === 'overview' ? (
                    <motion.div
                      key="overview"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                    >
                      <div className="lg:col-span-2">
                        <AIInsightPanel 
                          insight={state.aiInsight} 
                          loading={state.isGeneratingInsight} 
                          onGenerate={handleGenerateInsight} 
                        />
                      </div>
                      <div className="space-y-8">
                        <LanguageChart repos={state.repos} />
                        <div className="glass-card p-6 rounded-[2rem] border-white/5 space-y-4">
                          <h3 className="text-white font-bold flex items-center gap-2">
                            <BarChart3 size={18} className="text-blue-400" />
                            Core Statistics
                          </h3>
                          <div className="space-y-4">
                            {[
                              { label: 'Original Works', value: state.repos.length },
                              { label: 'Followers', value: state.user.followers },
                              { label: 'Account Age', value: `${Math.floor((Date.now() - new Date(state.user.created_at).getTime()) / (1000 * 60 * 60 * 24 * 365))} Years` },
                              { label: 'Public Impact', value: state.repos.reduce((acc, r) => acc + r.stargazers_count, 0) + ' Stars' },
                            ].map(stat => (
                              <div key={stat.label} className="flex justify-between items-center group">
                                <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">{stat.label}</span>
                                <span className="text-white font-mono font-bold group-hover:text-blue-400 transition-colors">{stat.value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="projects"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-8"
                    >
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="space-y-1">
                          <h2 className="text-3xl font-black text-white tracking-tight">Project Portfolio</h2>
                          <p className="text-gray-500 text-sm">Strict records of owned, non-forked repositories.</p>
                        </div>
                        <div className="relative w-full md:w-80">
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                          <input 
                            type="text" 
                            placeholder="Filter original projects..."
                            value={repoSearch}
                            onChange={(e) => setRepoSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredRepos.map((repo, idx) => (
                          <motion.div
                            key={repo.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: Math.min(idx * 0.05, 0.4) }}
                          >
                            <RepoCard repo={repo} />
                          </motion.div>
                        ))}
                      </div>

                      {filteredRepos.length === 0 && (
                        <div className="py-32 text-center glass-card rounded-[3rem] border-dashed border-white/10">
                          <p className="text-gray-500 text-lg">No original projects found for this criteria.</p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.main>
        )}
      </AnimatePresence>

      <footer className="relative z-10 py-12 border-t border-white/5">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 opacity-40 grayscale">
            <Github size={20} />
            <span className="font-bold text-sm tracking-tighter">Powered by GitHub API & Gemini 3</span>
          </div>
          <p className="text-xs text-gray-500">© {new Date().getFullYear()} GitHub Analysis. All rights reserved.</p>
          <div className="flex gap-8 text-xs font-bold uppercase tracking-widest text-gray-600">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Documentation</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
