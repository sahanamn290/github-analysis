
import React from 'react';
import { GitHubRepo } from '../types';
import { Star, GitFork, ExternalLink, Code2, Folder } from 'lucide-react';
import { motion } from 'framer-motion';

interface RepoCardProps {
  repo: GitHubRepo;
}

const RepoCard: React.FC<RepoCardProps> = ({ repo }) => {
  return (
    <motion.div 
      whileHover={{ y: -5, x: 2 }}
      className="glass-card rounded-[2rem] p-6 hover:border-blue-500/30 transition-all duration-300 group flex flex-col h-full relative"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-xl group-hover:bg-blue-500/20 transition-colors">
            <Folder size={18} className="text-blue-400" />
          </div>
          <h3 className="text-lg font-bold text-white group-hover:text-blue-400 truncate transition-colors max-w-[150px]">
            {repo.name}
          </h3>
        </div>
        <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <ExternalLink size={16} className="text-gray-500 hover:text-white transition-colors" />
        </a>
      </div>
      
      <p className="text-sm text-gray-400 mb-6 line-clamp-2 flex-grow font-light leading-relaxed">
        {repo.description || 'No description available for this repository.'}
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        {repo.topics.slice(0, 3).map(topic => (
          <span key={topic} className="px-3 py-1 bg-white/5 border border-white/5 text-gray-300 text-[10px] font-bold uppercase tracking-wider rounded-lg hover:border-blue-500/20 transition-colors">
            {topic}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-5 text-xs text-gray-500 mt-auto pt-5 border-t border-white/5 font-medium">
        {repo.language && (
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
            <span>{repo.language}</span>
          </div>
        )}
        <div className="flex items-center gap-1 group/stat">
          <Star size={14} className="text-yellow-500 group-hover:scale-110 transition-transform" />
          <span>{repo.stargazers_count}</span>
        </div>
        <div className="flex items-center gap-1 group/stat">
          <GitFork size={14} className="text-gray-500 group-hover:scale-110 transition-transform" />
          <span>{repo.forks_count}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default RepoCard;
