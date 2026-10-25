import React from 'react';
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
  isSelected, 
  viewMode = 'grid',
  onMouseEnter, 
  onOpen 
}: AppCardProps) {

  // 1. Chế độ Danh Sách Gọn (List)
  if (viewMode === 'list') {
    return (
      <div
        onClick={onOpen}
        onMouseEnter={onMouseEnter}
        className={`w-full group cursor-pointer border rounded-lg transition-colors duration-150 p-3 sm:p-3.5 flex items-center justify-between select-none ${
          isSelected
            ? 'border-emerald-400 bg-slate-800/90 shadow-sm'
            : 'border-slate-800 bg-slate-900/90 hover:border-emerald-500/60 hover:bg-slate-800/70'
        }`}
      >
        <div className="flex items-center gap-3 min-w-0 flex-1 mr-3">
          <div className="p-2 bg-slate-950 border border-slate-700/80 rounded-md text-emerald-400 group-hover:border-emerald-500/60 transition-colors shrink-0">
            <app.icon className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors truncate">
                {app.title}
              </h3>
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
              {app.tags[0] && (
                <span className="hidden xs:inline-block text-[11px] px-2 py-0.5 rounded bg-emerald-950/70 border border-emerald-800/60 text-emerald-300 font-medium">
                  {app.tags[0]}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 truncate mt-0.5 hidden xs:block">
              {app.description}
            </p>
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-2">
          <span className="text-xs text-slate-400 hidden sm:inline font-mono">ID: {app.id}</span>
          <div
            className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition-colors flex items-center gap-1.5 ${
              isSelected
                ? 'border-emerald-400 bg-emerald-500 text-slate-950'
                : 'border-emerald-700/60 bg-emerald-950/40 text-emerald-300 group-hover:bg-emerald-500 group-hover:text-slate-950 group-hover:border-emerald-400'
            }`}
          >
            <span>Mở</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    );
  }

  // 2. Chế độ Lưới Thu Gọn (Grid: 2 cột trên mobile, 3 cột trên desktop)
  if (viewMode === 'grid') {
    return (
      <div
        onClick={onOpen}
        onMouseEnter={onMouseEnter}
        className={`w-full group cursor-pointer border rounded-lg transition-colors duration-150 p-3.5 sm:p-4 flex flex-col justify-between select-none h-full ${
          isSelected
            ? 'border-emerald-400 bg-slate-800/90 shadow-sm'
            : 'border-slate-800 bg-slate-900/90 hover:border-emerald-500/60 hover:bg-slate-800/70'
        }`}
      >
        <div>
          <div className="flex items-start justify-between gap-2 mb-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="p-2 bg-slate-950 border border-slate-700/80 rounded-md text-emerald-400 group-hover:border-emerald-500/60 transition-colors shrink-0">
                <app.icon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors truncate" title={app.title}>
                  {app.title}
                </h3>
                <span className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                  {app.sysStatus || 'Hoạt động'}
                </span>
              </div>
            </div>
          </div>

          <p className="text-slate-300 text-xs mb-3 line-clamp-2 leading-relaxed">
            {app.description}
          </p>
        </div>

        <div>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {app.tags.slice(0, 2).map(tag => (
              <span key={tag} className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/70 border border-emerald-800/60 text-emerald-300 font-medium">
                {tag}
              </span>
            ))}
          </div>

          <div
            className={`w-full flex items-center justify-center px-3 py-1.5 rounded-md border transition-colors font-semibold text-xs ${
              isSelected
                ? 'border-emerald-400 bg-emerald-500 text-slate-950'
                : 'border-emerald-700/60 bg-emerald-950/40 text-emerald-300 group-hover:bg-emerald-500 group-hover:text-slate-950 group-hover:border-emerald-400'
            }`}
          >
            <span>Mở app</span>
            <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
          </div>
        </div>
      </div>
    );
  }

  // 3. Chế độ Thẻ Chi Tiết (Detail)
  return (
    <div
      onClick={onOpen}
      onMouseEnter={onMouseEnter}
      className={`border rounded-lg transition-colors duration-150 p-4 sm:p-5 group relative flex flex-col justify-between h-full cursor-pointer ${
        isSelected 
          ? 'border-emerald-400 bg-slate-800/90 shadow-sm' 
          : 'border-slate-800 bg-slate-900/90 hover:border-emerald-500/60 hover:bg-slate-800/70'
      }`}
    >
      <div>
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-slate-950 border border-slate-700/80 rounded-md text-emerald-400 group-hover:border-emerald-500/60 transition-colors">
              <app.icon className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white group-hover:text-emerald-400 transition-colors truncate max-w-[200px]" title={app.title}>
                {app.title}
              </h3>
              <span className="text-xs text-slate-400 font-mono">ID: <span className="text-emerald-400">{app.id}</span></span>
            </div>
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-emerald-400 font-mono border border-slate-700">
            {app.sysStatus || 'ONLINE'}
          </span>
        </div>

        <p className="text-slate-300 text-xs sm:text-sm mb-4 leading-relaxed">
          {app.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-5">
          {app.tags.map(tag => (
            <span key={tag} className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/70 border border-emerald-800/60 text-emerald-300 font-medium">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="pt-3 border-t border-slate-800 mt-auto">
        <div
          className={`w-full flex items-center justify-center px-4 py-2 rounded-md border transition-colors font-semibold text-xs ${
            isSelected 
              ? 'border-emerald-400 bg-emerald-500 text-slate-950' 
              : 'border-emerald-700/60 bg-emerald-950/40 text-emerald-300 group-hover:bg-emerald-500 group-hover:text-slate-950 group-hover:border-emerald-400'
          }`}
        >
          <span>Mở ứng dụng</span>
          <ExternalLink className="w-3.5 h-3.5 ml-2" />
        </div>
      </div>
    </div>
  );
}
