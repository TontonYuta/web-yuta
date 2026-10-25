import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, 
  Server, 
  Activity, 
  Database, 
  Search, 
  LayoutGrid, 
  List, 
  SlidersHorizontal, 
  X, 
  Edit3 
} from 'lucide-react';
import { apps } from './data/apps';
import TerminalConsole from './components/TerminalConsole';
import AppCard from './components/AppCard';
import NotesApp from './components/NotesApp';
import { AppItem, ViewMode } from './types';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('Tất cả');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  
  // Chế độ hiển thị: ưu tiên 'grid' hoặc 'list' trên mobile
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('yuta_view_mode') as ViewMode | null;
      if (saved && ['grid', 'list', 'detail'].includes(saved)) {
        return saved;
      }
      return window.innerWidth < 768 ? 'list' : 'grid';
    }
    return 'grid';
  });

  const terminalInputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSetViewMode = (mode: ViewMode) => {
    setViewMode(mode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('yuta_view_mode', mode);
    }
  };

  // Mở ứng dụng phù hợp cho cả mobile lẫn desktop
  const openAppFullscreen = (url: string) => {
    const isMobile = typeof window !== 'undefined' && (
      window.innerWidth <= 768 || 
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    );

    if (isMobile) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      const width = window.screen.availWidth;
      const height = window.screen.availHeight;
      window.open(url, '_blank', `width=${width},height=${height},left=0,top=0,menubar=no,toolbar=no,location=no,status=no`);
    }
  };

  const handleOpenApp = (app: AppItem) => {
    if (app.isInternal) {
      setIsEditorOpen(true);
    } else {
      openAppFullscreen(app.url);
    }
  };

  // Danh mục lọc 1 chạm
  const filterCategories = [
    { label: `Tất cả (${apps.length})`, id: 'Tất cả' },
    { label: '📐 Toán học', id: 'Toán học' },
    { label: '🎓 Luyện thi', id: 'Luyện thi' },
    { label: '📄 Công cụ PDF', id: 'Công cụ' },
    { label: '🎮 Focus Game', id: 'Game' }
  ];

  const filteredApps = apps.filter(app => {
    const matchesSearch = 
      app.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      app.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      app.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedTag === 'Tất cả') return true;
    if (selectedTag === 'Toán học') {
      return (
        /toán|math/i.test(app.title) ||
        app.tags.some(t => /toán/i.test(t))
      );
    }
    if (selectedTag === 'Luyện thi') {
      return (
        /luyện thi|hsa|thpt|gdpt/i.test(app.title) ||
        app.tags.some(t => /luyện thi|hsa|thpt|gdpt/i.test(t)) ||
        /luyện thi/i.test(app.description)
      );
    }
    if (selectedTag === 'Công cụ') {
      return (
        /pdf|spacer|công cụ/i.test(app.title) ||
        app.tags.some(t => /công cụ|pdf|in ấn|đề thi/i.test(t))
      );
    }
    if (selectedTag === 'Game') {
      return (
        /game|focus/i.test(app.title) || 
        app.tags.some(t => /game|luyện não|phản xạ|tập trung/i.test(t))
      );
    }
    return true;
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + ~ or Ctrl + ` to focus terminal
      if (e.ctrlKey && (e.key === '`' || e.key === '~')) {
        e.preventDefault();
        terminalInputRef.current?.focus();
        return;
      }

      // Alt + N to open Notes globally
      if (e.altKey && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        setIsEditorOpen(true);
        return;
      }

      if (isEditorOpen) {
        if (e.key === 'Escape') {
          setIsEditorOpen(false);
        }
        return;
      }

      // If typing in an input, don't trigger app navigation
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }

      // '/' to focus search
      if (e.key === '/') {
        e.preventDefault();
        searchInputRef.current?.focus();
        return;
      }

      const appsCount = filteredApps.length;
      if (appsCount === 0) return;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => prev < appsCount - 1 ? prev + 1 : 0);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : appsCount - 1);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < appsCount) {
          handleOpenApp(filteredApps[selectedIndex]);
        }
      } else if (e.key === 'Escape') {
        setSelectedIndex(-1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchQuery, selectedIndex, isEditorOpen, filteredApps]);

  return (
    <div className="min-h-screen bg-[#0a0e17] text-slate-100 font-sans flex flex-col items-center p-3 sm:p-5 md:p-8 pb-safe selection:bg-emerald-500/30 selection:text-emerald-200">
      <div className="max-w-5xl w-full flex flex-col gap-6">
        
        {/* Header */}
        <header className="text-center mt-2 sm:mt-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 flex items-center justify-center tracking-tight">
            <Terminal className="w-7 h-7 sm:w-8 sm:h-8 mr-2.5 text-emerald-400" />
            Kho Ứng Dụng Yuta
          </h1>
          <div className="text-slate-400 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm">
            <span className="flex items-center text-slate-300"><Server className="w-4 h-4 mr-1 text-cyan-400" /> Tác giả: Yuta</span>
            <span className="text-slate-700 hidden xs:inline">•</span>
            <span className="flex items-center text-slate-300"><Activity className="w-4 h-4 mr-1 text-emerald-400" /> Sẵn sàng ({apps.length} ứng dụng)</span>
            <span className="text-slate-700 hidden xs:inline">•</span>
            <button
              type="button"
              onClick={() => setIsEditorOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Ghi chú [Alt+N]</span>
            </button>
          </div>
        </header>

        {/* Search Bar & Quick Categories */}
        <section className="w-full max-w-2xl mx-auto flex flex-col gap-3">
          <div className="bg-slate-900 border border-slate-700/80 rounded-lg p-2.5 sm:p-3 flex items-center focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition-all shadow-sm">
            <span className="text-emerald-400 font-mono font-bold mr-2 text-sm shrink-0">&gt;</span>
            <span className="text-cyan-400 font-mono mr-2 text-xs sm:text-sm shrink-0">find</span>
            <input 
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSelectedIndex(-1);
              }}
              placeholder="Tìm kiếm ứng dụng, từ khóa..."
              className="flex-1 bg-transparent border-none outline-none text-slate-100 placeholder-slate-500 text-xs sm:text-sm w-full font-mono"
              autoComplete="off"
              spellCheck="false"
            />
            {searchQuery ? (
              <button 
                type="button"
                onClick={() => setSearchQuery('')}
                className="p-1 text-slate-400 hover:text-white transition-colors"
                title="Xóa tìm kiếm"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <Search className="w-4 h-4 text-slate-500 mr-1 shrink-0" />
            )}
          </div>

          {/* Quick Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs -mx-1 px-1">
            {filterCategories.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setSelectedTag(cat.id);
                  setSelectedIndex(-1);
                }}
                className={`px-3 py-1.5 rounded-md text-xs whitespace-nowrap font-medium transition-colors ${
                  selectedTag === cat.id
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                    : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </section>

        {/* Main Content: App List */}
        <main className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
            <h2 className="text-sm sm:text-base md:text-lg text-white flex items-center font-semibold">
              <Database className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-emerald-400" />
              Danh sách ứng dụng ({filteredApps.length})
            </h2>

            {/* View Mode Switcher */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 border border-slate-800 rounded-lg text-xs">
              <button 
                type="button"
                onClick={() => handleSetViewMode('list')}
                className={`px-2.5 py-1 flex items-center gap-1 rounded transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-emerald-500 text-slate-950 font-bold' 
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Danh sách gọn"
              >
                <List className="w-3.5 h-3.5" />
                <span className="text-xs">Danh sách</span>
              </button>

              <button 
                type="button"
                onClick={() => handleSetViewMode('grid')}
                className={`px-2.5 py-1 flex items-center gap-1 rounded transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-emerald-500 text-slate-950 font-bold' 
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Lưới 2 cột gọn"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="text-xs">Lưới</span>
              </button>

              <button 
                type="button"
                onClick={() => handleSetViewMode('detail')}
                className={`px-2.5 py-1 flex items-center gap-1 rounded transition-colors ${
                  viewMode === 'detail' 
                    ? 'bg-emerald-500 text-slate-950 font-bold' 
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Thẻ chi tiết"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span className="text-xs hidden xs:inline">Chi tiết</span>
              </button>
            </div>
          </div>
          
          {filteredApps.length === 0 ? (
            <div className="text-center py-12 text-rose-400 border border-slate-800 bg-slate-900/60 rounded-lg text-sm">
              Không tìm thấy ứng dụng nào khớp với từ khóa tìm kiếm.
            </div>
          ) : viewMode === 'list' ? (
            <div className="flex flex-col gap-2">
              {filteredApps.map((app, index) => (
                <AppCard 
                  key={app.id}
                  app={app}
                  index={index}
                  viewMode="list"
                  isSelected={selectedIndex === index}
                  onMouseEnter={() => setSelectedIndex(index)}
                  onOpen={() => handleOpenApp(app)}
                />
              ))}
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              {filteredApps.map((app, index) => (
                <AppCard 
                  key={app.id}
                  app={app}
                  index={index}
                  viewMode="grid"
                  isSelected={selectedIndex === index}
                  onMouseEnter={() => setSelectedIndex(index)}
                  onOpen={() => handleOpenApp(app)}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {filteredApps.map((app, index) => (
                <AppCard 
                  key={app.id}
                  app={app}
                  index={index}
                  viewMode="detail"
                  isSelected={selectedIndex === index}
                  onMouseEnter={() => setSelectedIndex(index)}
                  onOpen={() => handleOpenApp(app)}
                />
              ))}
            </div>
          )}
        </main>

        {/* Terminal Console */}
        <TerminalConsole 
          terminalInputRef={terminalInputRef}
          onOpenApp={handleOpenApp}
        />

        {/* Footer */}
        <footer className="mt-4 sm:mt-6 text-center text-slate-400 text-xs border-t border-slate-800/80 pt-4 pb-6">
          <div className="flex flex-wrap justify-center gap-3 mb-2 font-mono text-[11px] text-slate-400">
            <span>[OK] Kết nối ổn định</span>
            <span>•</span>
            <span>[OK] Tải {apps.length} ứng dụng</span>
            <span>•</span>
            <span>[OK] Sẵn sàng sử dụng</span>
          </div>
          <p className="text-slate-400 text-xs">© {new Date().getFullYear()} Yuta. Chúc bạn học tập thật tốt!</p>
        </footer>

        {/* Editor Modal */}
        {isEditorOpen && (
          <NotesApp onClose={() => setIsEditorOpen(false)} />
        )}

      </div>
    </div>
  );
}
