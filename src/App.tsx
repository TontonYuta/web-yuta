import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
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
import BootSequence from './components/BootSequence';
import TerminalConsole from './components/TerminalConsole';
import AppCard from './components/AppCard';
import NotesApp from './components/NotesApp';
import { AppItem, ViewMode } from './types';

export default function App() {
  const [isBooting, setIsBooting] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('Tất cả');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  
  // Chế độ hiển thị: ưu tiên 'list' (danh sách gọn hiện trọn vẹn trên 1 màn hình) hoặc 'grid' (lưới 2 cột) trên mobile
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

  // Danh mục tag nhanh giúp người dùng mobile lọc chỉ với 1 chạm
  const filterCategories = [
    { label: 'Tất cả', id: 'Tất cả' },
    { label: '📐 Toán học', id: 'Toán học' },
    { label: '🎓 Luyện thi', id: 'Luyện thi' },
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

  if (isBooting) {
    return <BootSequence onComplete={() => setIsBooting(false)} />;
  }

  return (
    <div className="crt min-h-screen bg-[#050505] text-green-500 font-mono flex flex-col items-center p-3 sm:p-5 md:p-6 pb-safe selection:bg-green-900 selection:text-green-400">
      <div className="max-w-6xl w-full flex flex-col gap-5 sm:gap-7">
        
        {/* Header */}
        <div className="text-center mt-2 sm:mt-6">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl sm:text-4xl md:text-5xl font-bold text-green-400 glow-green mb-2 sm:mb-3 flex items-center justify-center uppercase tracking-wide"
          >
            <Terminal className="w-6 h-6 sm:w-10 sm:h-10 md:w-12 md:h-12 mr-2.5 sm:mr-4 shrink-0 text-green-400" />
            Kho Ứng Dụng
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="text-gray-400 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm"
          >
            <span className="flex items-center"><Server className="w-3.5 h-3.5 mr-1 text-cyan-400" /> Tác giả: Yuta</span>
            <span className="text-green-800 hidden xs:inline">•</span>
            <span className="flex items-center"><Activity className="w-3.5 h-3.5 mr-1 text-green-400" /> Sẵn sàng ({apps.length} app)</span>
            <span className="text-green-800 hidden xs:inline">•</span>
            <button
              type="button"
              onClick={() => setIsEditorOpen(true)}
              className="flex items-center gap-1 px-2 py-0.5 bg-green-950/40 border border-green-800 hover:border-green-400 text-green-400 hover:bg-green-500 hover:text-black transition-all text-[11px] font-bold active:scale-95"
            >
              <Edit3 className="w-3 h-3" />
              <span>Ghi chú [Alt+N]</span>
            </button>
          </motion.div>
        </div>

        {/* Search Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-2xl mx-auto flex flex-col gap-2.5"
        >
          <div className="bg-green-900/10 border border-green-900 p-2 sm:p-2.5 flex items-center focus-within:border-green-500 focus-within:glow-green transition-all">
            <span className="text-green-600 font-bold mr-1.5 ml-1 text-xs sm:text-sm shrink-0">&gt;</span>
            <span className="text-cyan-400 mr-2 text-xs sm:text-sm shrink-0">find</span>
            <input 
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSelectedIndex(-1);
              }}
              placeholder="Tìm kiếm ứng dụng, từ khóa..."
              className="flex-1 bg-transparent border-none outline-none text-green-400 placeholder-green-800 text-xs sm:text-sm w-full font-mono"
              autoComplete="off"
              spellCheck="false"
            />
            {searchQuery ? (
              <button 
                type="button"
                onClick={() => setSearchQuery('')}
                className="p-1 text-gray-500 hover:text-green-400 transition-colors"
                title="Xóa tìm kiếm"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <Search className="w-4 h-4 text-green-700 mr-1 shrink-0" />
            )}
          </div>

          {/* Quick Category Chips for Mobile */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs -mx-1 px-1">
            {filterCategories.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setSelectedTag(cat.id);
                  setSelectedIndex(-1);
                }}
                className={`px-2.5 py-1 text-[11px] whitespace-nowrap border transition-all active:scale-95 font-semibold ${
                  selectedTag === cat.id
                    ? 'border-green-400 bg-green-500 text-black font-bold shadow-[0_0_8px_rgba(74,222,128,0.3)]'
                    : 'border-green-900/70 bg-black/40 text-gray-400 hover:border-green-600 hover:text-green-300'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Main Content: App List */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-green-900/80 pb-2">
            <h2 className="text-sm sm:text-base md:text-lg text-cyan-400 glow-cyan flex items-center font-bold">
              <Database className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 text-cyan-400" />
              Danh sách ứng dụng ({filteredApps.length})
            </h2>

            {/* View Mode Switcher */}
            <div className="flex items-center gap-1 bg-green-950/40 p-0.5 border border-green-900 text-xs">
              <button 
                type="button"
                onClick={() => handleSetViewMode('list')}
                className={`px-2 py-1 flex items-center gap-1 transition-all rounded-none text-xs ${
                  viewMode === 'list' 
                    ? 'bg-green-500 text-black font-bold shadow-[0_0_8px_rgba(74,222,128,0.4)]' 
                    : 'text-green-400 hover:text-green-200'
                }`}
                title="Danh sách gọn - Hiện hết toàn bộ app trên 1 màn hình"
              >
                <List className="w-3.5 h-3.5" />
                <span className="text-[10px] sm:text-xs">Danh sách</span>
              </button>

              <button 
                type="button"
                onClick={() => handleSetViewMode('grid')}
                className={`px-2 py-1 flex items-center gap-1 transition-all rounded-none text-xs ${
                  viewMode === 'grid' 
                    ? 'bg-green-500 text-black font-bold shadow-[0_0_8px_rgba(74,222,128,0.4)]' 
                    : 'text-green-400 hover:text-green-200'
                }`}
                title="Lưới 2 cột gọn gàng"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="text-[10px] sm:text-xs">Lưới</span>
              </button>

              <button 
                type="button"
                onClick={() => handleSetViewMode('detail')}
                className={`px-2 py-1 flex items-center gap-1 transition-all rounded-none text-xs ${
                  viewMode === 'detail' 
                    ? 'bg-green-500 text-black font-bold shadow-[0_0_8px_rgba(74,222,128,0.4)]' 
                    : 'text-green-400 hover:text-green-200'
                }`}
                title="Thẻ chi tiết"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span className="text-[10px] sm:text-xs hidden xs:inline">Chi tiết</span>
              </button>
            </div>
          </div>
          
          {filteredApps.length === 0 ? (
            <div className="text-center py-10 text-red-400 border border-red-900/50 bg-red-900/10 text-xs sm:text-sm">
              [ LỖI ] Không tìm thấy module nào khớp với truy vấn hoặc bộ lọc hiện tại.
            </div>
          ) : viewMode === 'list' ? (
            /* Chế độ Danh Sách Gọn - 8 app hiện hết trong 1 màn hình không cần cuộn */
            <div className="flex flex-col gap-1.5 sm:gap-2">
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
            /* Chế độ Lưới Thu Gọn (2 cột trên mobile, 3 cột trên desktop) */
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3.5 md:gap-5">
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
            /* Chế độ Thẻ Đầy Đủ Chi Tiết */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
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
        </div>

        {/* Interactive Terminal (Thu gọn / mở rộng tiện lợi trên mobile) */}
        <TerminalConsole 
          terminalInputRef={terminalInputRef}
          onOpenApp={handleOpenApp}
        />

        {/* Footer */}
        <div className="mt-4 sm:mt-6 text-center text-gray-600 text-xs font-mono border-t border-green-900/30 pt-4 pb-6">
          <p className="mb-1.5 tracking-widest text-green-800 uppercase text-[11px]">Thông báo hệ thống</p>
          <div className="flex flex-wrap justify-center gap-3 opacity-70 mb-3 text-[11px]">
            <span>[OK] Kết nối ổn định</span>
            <span>[OK] Tải {apps.length} modules</span>
            <span>[OK] Sẵn sàng</span>
          </div>
          <p className="opacity-40 text-[11px]">© {new Date().getFullYear()} Yuta. Chúc bạn học tập thật tốt!</p>
        </div>

        {/* Editor Modal */}
        {isEditorOpen && (
          <NotesApp onClose={() => setIsEditorOpen(false)} />
        )}

      </div>
    </div>
  );
}
