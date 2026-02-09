
import React from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

interface AIInsightPanelProps {
  insight: string | null;
  loading: boolean;
  onGenerate: () => void;
}

const AIInsightPanel: React.FC<AIInsightPanelProps> = ({ insight, loading, onGenerate }) => {
  return (
    <div className="glass-card rounded-3xl p-6 md:p-8 relative overflow-hidden h-full">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-[60px] pointer-events-none" />
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600/20 rounded-lg">
            <Sparkles className="w-6 h-6 text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">AI Persona Analysis</h2>
        </div>
        {!insight && !loading && (
          <button
            onClick={onGenerate}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-blue-900/20"
          >
            Generate Insight
          </button>
        )}
      </div>

      <div className="prose prose-invert prose-blue max-w-none">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
            <p className="text-gray-400 font-medium">Gemini is analyzing the code base...</p>
          </div>
        ) : insight ? (
          <div className="text-gray-300 space-y-4 animate-in fade-in duration-700">
            {insight.split('\n').map((line, i) => {
              if (line.startsWith('#')) return <h3 key={i} className="text-xl font-bold text-white mt-4">{line.replace(/#/g, '').trim()}</h3>;
              if (line.startsWith('-') || line.startsWith('*')) return <li key={i} className="ml-4">{line.substring(1).trim()}</li>;
              return <p key={i} className="leading-relaxed">{line}</p>;
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-gray-500 max-w-sm mb-6">
              Unlock the power of Gemini AI to understand this developer's technical DNA based on their repositories and activity.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIInsightPanel;
