
import React from 'react';
import { GitHubUser } from '../types';
import { MapPin, Link as LinkIcon, Twitter, Bookmark, Calendar, Github } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProfileHeaderProps {
  user: GitHubUser;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
  const joinDate = new Date(user.created_at).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card rounded-[2.5rem] p-8 md:p-12 flex flex-col md:flex-row gap-12 items-center md:items-start relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] pointer-events-none group-hover:bg-blue-500/10 transition-all duration-1000" />
      
      <div className="relative shrink-0">
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="relative"
        >
          <img 
            src={user.avatar_url} 
            alt={user.login} 
            className="w-40 h-40 md:w-56 md:h-56 rounded-[2rem] object-cover border-4 border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-10 relative"
          />
          <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-tr from-blue-500/20 to-transparent pointer-events-none" />
        </motion.div>
        <div className="absolute -bottom-4 -right-4 bg-white p-3 rounded-2xl shadow-2xl border border-white/10 group-hover:rotate-12 transition-transform">
          <Github className="w-6 h-6 text-[#0d1117]" />
        </div>
      </div>
      
      <div className="flex-1 space-y-6 w-full text-center md:text-left">
        <div className="space-y-2">
          <div className="flex flex-col md:flex-row md:items-end gap-3 justify-center md:justify-start">
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter">
              {user.name || user.login}
            </h1>
            <a 
              href={user.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xl text-blue-400 font-semibold hover:text-blue-300 transition-colors"
            >
              @{user.login}
            </a>
          </div>
          {user.company && (
            <p className="text-lg text-gray-400 font-medium">
              at <span className="text-white">{user.company}</span>
            </p>
          )}
        </div>

        {user.bio && (
          <p className="text-gray-300 text-xl leading-relaxed max-w-2xl font-light italic">
            "{user.bio}"
          </p>
        )}

        <div className="flex flex-wrap justify-center md:justify-start gap-x-8 gap-y-4 text-sm text-gray-500">
          {user.location && (
            <div className="flex items-center gap-2 group/item">
              <MapPin size={16} className="group-hover/item:text-blue-400 transition-colors" />
              <span>{user.location}</span>
            </div>
          )}
          {user.blog && (
            <div className="flex items-center gap-2 group/item">
              <LinkIcon size={16} className="group-hover/item:text-blue-400 transition-colors" />
              <a href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                {user.blog.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
          {user.twitter_username && (
            <div className="flex items-center gap-2 group/item">
              <Twitter size={16} className="group-hover/item:text-blue-400 transition-colors" />
              <a href={`https://twitter.com/${user.twitter_username}`} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                @{user.twitter_username}
              </a>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            <span>Joined {joinDate}</span>
          </div>
        </div>

        <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-6 border-t border-white/5">
          <div className="px-6 py-3 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
            <div className="text-2xl font-black text-white">{user.public_repos}</div>
            <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Repositories</div>
          </div>
          <div className="px-6 py-3 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
            <div className="text-2xl font-black text-white">{user.followers}</div>
            <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Followers</div>
          </div>
          <div className="px-6 py-3 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
            <div className="text-2xl font-black text-white">{user.following}</div>
            <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Following</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileHeader;
