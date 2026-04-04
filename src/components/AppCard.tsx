import React from 'react';
import { motion } from 'motion/react';
import { ExternalLink } from 'lucide-react';
import { AppItem } from '../types';

interface AppCardProps {
  app: AppItem;
  index: number;
  isSelected: boolean;
  onMouseEnter: () => void;
  onOpen: () => void;
}

export default function AppCard({ app, index, isSelected, onMouseEnter, onOpen }: AppCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.05 * index }}
      onMouseEnter={onMouseEnter}
      className={`bg-green-900/10 border transition-all duration-300 p-5 group relative overflow-hidden flex flex-col h-full ${
        isSelected 
          ? 'border-green-400 shadow-[0_0_15px_rgba(74,222,128,0.3)] scale-[1.02] z-10' 
          : 'border-green-900 hover:border-green-500'
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-black/50 border border-green-900 text-green-400 group-hover:border-green-500 group-hover:glow-green transition-all">
            <app.icon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-green-400 group-hover:glow-green transition-all truncate max-w-[180px]" title={app.title}>
              {'>'} {app.title}
            </h3>
            <span className="text-[10px] text-gray-500">ID: <span className="text-cyan-400">{app.id}</span></span>
          </div>
        </div>
      </div>

      <p className="text-gray-400 text-sm mb-4 flex-1">
        {app.description}
      </p>

      <div className="flex flex-wrap gap-1.5 mb-5">
        {app.tags.map(tag => (
          <span key={tag} className="text-[9px] px-1.5 py-0.5 bg-black/50 border border-green-900 text-green-600 font-bold tracking-wider uppercase">
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-auto pt-3 border-t border-green-900/50">
        <a
          href={app.url}
          onClick={(e) => {
            e.preventDefault();
            onOpen();
          }}
          className={`w-full flex items-center justify-center px-3 py-2 bg-green-900/20 border transition-all font-bold tracking-widest text-xs group/btn uppercase ${
            isSelected ? 'border-green-400 bg-green-500 text-black' : 'border-green-500 text-green-400 hover:bg-green-500 hover:text-black'
          }`}
        >
          [ Mở ứng dụng ]
          <ExternalLink className={`w-3 h-3 ml-2 ${isSelected ? 'opacity-100' : 'opacity-50 group-hover/btn:opacity-100'}`} />
        </a>
      </div>
    </motion.div>
  );
}
