import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Terminal, Server, Activity, Database, Search } from 'lucide-react';
import { apps } from './data/apps';
import BootSequence from './components/BootSequence';
import TerminalConsole from './components/TerminalConsole';
import AppCard from './components/AppCard';
import NotesApp from './components/NotesApp';
import { AppItem } from './types';

export default function App() {
  const [isBooting, setIsBooting] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  
  const terminalInputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Mở ứng dụng dạng cửa sổ popup tối đa kích thước (giả lập fullscreen)
  const openAppFullscreen = (url: string) => {
    const width = window.screen.availWidth;
    const height = window.screen.availHeight;
    window.open(url, '_blank', `width=${width},height=${height},left=0,top=0,menubar=no,toolbar=no,location=no,status=no`);
  };

  const handleOpenApp = (app: AppItem) => {
    if (app.isInternal) {
      setIsEditorOpen(true);
    } else {
      openAppFullscreen(app.url);
    }
  };

  const filteredApps = apps.filter(app => 
    app.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    app.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
    app.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    <div className="crt min-h-screen bg-[#050505] text-green-500 font-mono flex flex-col items-center p-4 md:p-6 selection:bg-green-900 selection:text-green-400">
      <div className="max-w-6xl w-full flex flex-col gap-8">
        
        {/* Header */}
        <div className="text-center mt-4 md:mt-8">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-green-400 glow-green mb-4 flex items-center justify-center uppercase"
          >
            <Terminal className="w-10 h-10 md:w-12 md:h-12 mr-4" />
            Kho Ứng Dụng
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 flex flex-wrap items-center justify-center gap-4 text-sm md:text-base"
          >
            <span className="flex items-center"><Server className="w-4 h-4 mr-2" /> Tác giả: Yuta</span>
            <span className="flex items-center"><Activity className="w-4 h-4 mr-2" /> Trạng thái: Sẵn sàng</span>
          </motion.p>
        </div>

        {/* Search Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full max-w-2xl mx-auto bg-green-900/10 border border-green-900 p-2 flex items-center focus-within:border-green-500 focus-within:glow-green transition-all"
        >
          <span className="text-green-600 font-bold mr-2 ml-2">guest@yuta:~$</span>
          <span className="text-cyan-400 mr-2">find</span>
          <input 
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSelectedIndex(-1); // Reset selection on search
            }}
            placeholder="Nhập tên ứng dụng hoặc từ khóa... (Nhấn '/' để tìm kiếm)"
            className="flex-1 bg-transparent border-none outline-none text-green-400 placeholder-green-900 w-full"
            autoComplete="off"
            spellCheck="false"
          />
          <Search className="w-5 h-5 text-green-700 mr-2" />
        </motion.div>

        {/* Main Content */}
        <div className="space-y-6">
          <h2 className="text-xl border-b border-green-900 pb-2 text-cyan-400 glow-cyan flex items-center">
            <Database className="w-5 h-5 mr-2" />
            Danh sách ứng dụng ({filteredApps.length})
          </h2>
          
          {filteredApps.length === 0 ? (
            <div className="text-center py-12 text-red-400 border border-red-900/50 bg-red-900/10">
              [ LỖI ] Không tìm thấy module nào khớp với truy vấn.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredApps.map((app, index) => (
                <AppCard 
                  key={app.id}
                  app={app}
                  index={index}
                  isSelected={selectedIndex === index}
                  onMouseEnter={() => setSelectedIndex(index)}
                  onOpen={() => handleOpenApp(app)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Interactive Terminal */}
        <TerminalConsole 
          terminalInputRef={terminalInputRef}
          onOpenApp={handleOpenApp}
        />

        {/* Footer */}
        <div className="mt-8 text-center text-gray-600 text-xs font-mono border-t border-green-900/30 pt-6 pb-8">
          <p className="mb-2 tracking-widest text-green-900 uppercase">Thông báo hệ thống</p>
          <div className="flex flex-wrap justify-center gap-4 opacity-70 mb-4">
            <span>[OK] Kết nối ổn định</span>
            <span>[OK] Tải dữ liệu thành công</span>
            <span>[OK] Sẵn sàng sử dụng</span>
          </div>
          <p className="opacity-40">© {new Date().getFullYear()} Yuta. Chúc bạn học tập thật tốt!</p>
        </div>

        {/* Editor Modal */}
        {isEditorOpen && (
          <NotesApp onClose={() => setIsEditorOpen(false)} />
        )}

      </div>
    </div>
  );
}
