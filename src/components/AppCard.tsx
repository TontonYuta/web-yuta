import React from 'react';
import { motion } from 'motion/react';
import { ExternalLink } from 'lucide-react';
import { AppItem, ViewMode } from '../types';

interface AppCardProps {
  key?: string;
  app: AppItem;
  index: number;
  isSelected: boolean;
  viewMode?: ViewMode;
  onMouseEnter: () => void;
  onOpen: () => void;
}

export default function AppCard({ 
  app, 
  index, 
  isSelected, 
  viewMode = 'grid',
  onMouseEnter, 
  onOpen 
}: AppCardProps) {

  // Chế độ Danh Sách Gọn - Cho phép hiện hết toàn bộ 8 app cùng lúc trên mobile
  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.02 * index }}
        onClick={onOpen}
        onMouseEnter={onMouseEnter}
        className={`w-full group cursor-pointer border transition-all duration-200 p-2 sm:p-2.5 flex items-center justify-between active:scale-[0.99] select-none ${
          isSelected
            ? 'border-green-400 bg-green-900/30 shadow-[0_0_12px_rgba(74,222,128,0.25)]'
            : 'border-green-900/70 bg-black/50 hover:border-green-500 hover:bg-green-900/10'
        }`}
      >
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1 mr-2">
          <div className="p-1.5 sm:p-2 bg-black/60 border border-green-900 text-green-400 group-hover:border-green-400 group-hover:glow-green transition-all shrink-0">
            <app.icon className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-bold text-green-400 group-hover:text-green-300 group-hover:glow-green transition-all truncate">
                {'>'} {app.title}
              </h3>
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0"></span>
              {app.tags[0] && (
                <span className="hidden xs:inline-block text-[9px] px-1.5 py-0.2 bg-black/60 border border-green-900/70 text-green-600 font-semibold uppercase">
                  {app.tags[0]}
                </span>
              )}
            </div>
            <p className="text-[11px] text-gray-500 truncate mt-0.5 hidden xs:block">
              {app.description}
            </p>
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-2">
          <span className="text-[10px] text-green-700 hidden sm:inline font-mono">ID:{app.id}</span>
          <div
            className={`px-2.5 py-1 text-[11px] font-bold border transition-all flex items-center gap-1 uppercase tracking-wider ${
              isSelected
                ? 'border-green-400 bg-green-500 text-black'
                : 'border-green-800 text-green-400 group-hover:border-green-400 group-hover:bg-green-500 group-hover:text-black'
            }`}
          >
            <span>Mở</span>
            <ExternalLink className="w-3 h-3" />
          </div>
        </div>
      </motion.div>
    );
  }

  // Chế độ Lưới Thu Gọn (2 cột trên mobile, 3 cột trên desktop)
  if (viewMode === 'grid') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.03 * index }}
        onClick={onOpen}
        onMouseEnter={onMouseEnter}
        className={`w-full group cursor-pointer border transition-all duration-200 p-2.5 sm:p-4 flex flex-col justify-between active:scale-[0.98] select-none h-full bg-green-950/15 ${
          isSelected
            ? 'border-green-400 shadow-[0_0_15px_rgba(74,222,128,0.3)] bg-green-900/25 scale-[1.01]'
            : 'border-green-900/80 hover:border-green-500 hover:bg-green-900/10'
        }`}
      >
        <div>
          <div className="flex items-start justify-between gap-1.5 mb-1.5 sm:mb-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="p-1 sm:p-1.5 bg-black/60 border border-green-900 text-green-400 group-hover:border-green-400 group-hover:glow-green transition-all shrink-0">
                <app.icon className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs sm:text-sm font-bold text-green-400 group-hover:glow-green group-hover:text-green-300 transition-all truncate" title={app.title}>
                  {app.title}
                </h3>
                <span className="text-[9px] text-gray-500 flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-green-500 inline-block"></span>
                  {app.sysStatus || 'OK'}
                </span>
              </div>
            </div>
          </div>

          <p className="text-gray-400 text-[10px] sm:text-xs mb-2 sm:mb-3 line-clamp-2 leading-relaxed">
            {app.description}
          </p>
        </div>

        <div>
          <div className="flex flex-wrap gap-1 mb-2">
            {app.tags.slice(0, 2).map(tag => (
              <span key={tag} className="text-[8px] sm:text-[9px] px-1 py-0.5 bg-black/60 border border-green-900/60 text-green-600 font-semibold uppercase tracking-wider">
                {tag}
              </span>
            ))}
          </div>

          <div
            className={`w-full flex items-center justify-center px-2 py-1 sm:py-1.5 border transition-all font-bold tracking-widest text-[9px] sm:text-xs uppercase ${
              isSelected
                ? 'border-green-400 bg-green-500 text-black'
                : 'border-green-700 text-green-400 group-hover:bg-green-500 group-hover:text-black group-hover:border-green-400'
            }`}
          >
            <span>Mở app</span>
            <ExternalLink className="w-2.5 h-2.5 sm:w-3 sm:h-3 ml-1 opacity-80" />
          </div>
        </div>
      </motion.div>
    );
  }

  // Chế độ Thẻ Đầy Đủ Chi Tiết (Detail)
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.04 * index }}
      onClick={onOpen}
      onMouseEnter={onMouseEnter}
      className={`bg-green-900/10 border transition-all duration-300 p-4 sm:p-5 group relative overflow-hidden flex flex-col justify-between h-full cursor-pointer active:scale-[0.98] ${
        isSelected 
          ? 'border-green-400 shadow-[0_0_15px_rgba(74,222,128,0.3)] scale-[1.01] z-10 bg-green-900/20' 
          : 'border-green-900 hover:border-green-500'
      }`}
    >
      <div>
        <div className="flex justify-between items-start mb-3 sm:mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-black/50 border border-green-900 text-green-400 group-hover:border-green-500 group-hover:glow-green transition-all">
              <app.icon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-green-400 group-hover:glow-green transition-all truncate max-w-[200px]" title={app.title}>
                {'>'} {app.title}
              </h3>
              <span className="text-[10px] text-gray-500">ID: <span className="text-cyan-400">{app.id}</span></span>
            </div>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 border border-green-900 text-green-600 font-mono hidden xs:inline">
            {app.sysStatus || 'ONLINE'}
          </span>
        </div>

        <p className="text-gray-400 text-xs sm:text-sm mb-4 leading-relaxed">
          {app.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-5">
          {app.tags.map(tag => (
            <span key={tag} className="text-[9px] px-1.5 py-0.5 bg-black/50 border border-green-900 text-green-600 font-bold tracking-wider uppercase">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="pt-3 border-t border-green-900/50 mt-auto">
        <div
          className={`w-full flex items-center justify-center px-3 py-2 border transition-all font-bold tracking-widest text-xs uppercase ${
            isSelected ? 'border-green-400 bg-green-500 text-black' : 'border-green-500 text-green-400 group-hover:bg-green-500 group-hover:text-black'
          }`}
        >
          <span>[ Mở ứng dụng ]</span>
          <ExternalLink className={`w-3 h-3 ml-2 ${isSelected ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`} />
        </div>
      </div>
    </motion.div>
  );
}
