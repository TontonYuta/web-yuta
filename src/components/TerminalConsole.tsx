import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Command, ChevronDown, ChevronUp } from 'lucide-react';
import { apps } from '../data/apps';
import { AppItem } from '../types';

interface TerminalConsoleProps {
  terminalInputRef: React.RefObject<HTMLInputElement | null>;
  onOpenApp: (app: AppItem) => void;
}

export default function TerminalConsole({ terminalInputRef, onOpenApp }: TerminalConsoleProps) {
  const [terminalHistory, setTerminalHistory] = useState<{type: 'command' | 'output' | 'error', text: string}[]>([
    { type: 'output', text: 'YUTA_OS v1.0.0 đã khởi động. Gõ "help" hoặc chạm các nút lệnh nhanh bên dưới.' }
  ]);
  const [commandInput, setCommandInput] = useState('');
  const [pastCommands, setPastCommands] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    // Tự động thu gọn trên màn hình điện thoại để ưu tiên hiển thị trọn vẹn danh sách app
    return typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  });
  
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isCollapsed) {
      terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalHistory, isCollapsed]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (pastCommands.length > 0) {
        const newIdx = historyIndex < pastCommands.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIdx);
        setCommandInput(pastCommands[pastCommands.length - 1 - newIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIdx = historyIndex - 1;
        setHistoryIndex(newIdx);
        setCommandInput(pastCommands[pastCommands.length - 1 - newIdx]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCommandInput('');
      }
    }
  };

  const executeCommand = useCallback((rawCmd: string) => {
    if (!rawCmd.trim()) return;

    const cmd = rawCmd.trim().toLowerCase();
    const newHistory = [...terminalHistory, { type: 'command' as const, text: `guest@yuta:~$ ${rawCmd.trim()}` }];
    
    setPastCommands(prev => [...prev, rawCmd.trim()]);
    setHistoryIndex(-1);

    if (cmd === 'help') {
      newHistory.push({ type: 'output', text: `Các lệnh khả dụng:
- help: Xem danh sách lệnh
- ls: Liệt kê các ứng dụng
- run <id>: Mở ứng dụng (vd: run memory-game)
- clear: Xóa màn hình terminal
- whoami: Thông tin tác giả
- date: Xem ngày giờ hệ thống

Phím tắt hệ thống (Hotkeys):
- [/]        : Tìm kiếm ứng dụng
- [Enter]    : Mở ứng dụng đang chọn
- [Esc]      : Đóng cửa sổ / Bỏ chọn` });
    } else if (cmd === 'ls') {
      const appList = apps.map(a => `  ${a.id.padEnd(15)} | ${a.title}`).join('\n');
      newHistory.push({ type: 'output', text: `Danh sách module:\n${appList}` });
    } else if (cmd === 'clear') {
      setTerminalHistory([]);
      setCommandInput('');
      return;
    } else if (cmd === 'whoami') {
      newHistory.push({ type: 'output', text: 'Yuta - Nhà phát triển phần mềm đam mê giáo dục và công nghệ.' });
    } else if (cmd === 'date') {
      newHistory.push({ type: 'output', text: new Date().toString() });
    } else if (cmd.startsWith('run ')) {
      const targetId = cmd.split(' ')[1];
      const app = apps.find(a => a.id === targetId);
      if (app) {
        newHistory.push({ type: 'output', text: `Đang khởi chạy [${app.title}]...` });
        onOpenApp(app);
      } else {
        newHistory.push({ type: 'error', text: `Lỗi: Không tìm thấy module '${targetId}'. Gõ 'ls' để xem danh sách.` });
      }
    } else {
      newHistory.push({ type: 'error', text: `Lỗi: Không nhận diện được lệnh '${cmd}'. Gõ 'help' để xem danh sách lệnh.` });
    }

    setTerminalHistory(newHistory);
    setCommandInput('');
  }, [terminalHistory, onOpenApp]);

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeCommand(commandInput);
  };

  const quickCommands = ['help', 'ls', 'whoami', 'clear'];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mt-6 border border-green-900 bg-black/80 flex flex-col shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-all overflow-hidden"
    >
      {/* Header bar with collapse toggle */}
      <div 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="bg-green-900/30 px-3 sm:px-4 py-2 border-b border-green-900 flex items-center justify-between cursor-pointer hover:bg-green-900/40 select-none transition-colors"
      >
        <span className="text-xs font-bold text-green-500 flex items-center">
          <Command className="w-3.5 h-3.5 mr-2 text-green-400"/> 
          TERMINAL_CONSOLE
          <span className="ml-2 text-[10px] text-green-700 font-mono hidden sm:inline">[bash]</span>
        </span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-green-600 font-mono">
            {isCollapsed ? '[ + Mở rộng ]' : '[ - Thu gọn ]'}
          </span>
          {isCollapsed ? (
            <ChevronDown className="w-3.5 h-3.5 text-green-500" />
          ) : (
            <ChevronUp className="w-3.5 h-3.5 text-green-500" />
          )}
        </div>
      </div>

      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col overflow-hidden"
          >
            {/* Terminal output */}
            <div className="h-44 sm:h-56 p-3 sm:p-4 overflow-y-auto font-mono text-xs sm:text-sm space-y-1 scrollbar-thin scrollbar-thumb-green-900 scrollbar-track-transparent">
              {terminalHistory.map((line, idx) => (
                <div key={idx} className={`${
                  line.type === 'command' ? 'text-gray-300' : 
                  line.type === 'error' ? 'text-red-400' : 'text-green-400'
                } whitespace-pre-wrap leading-relaxed`}>
                  {line.text}
                </div>
              ))}
              <div ref={terminalEndRef} />
            </div>

            {/* Quick command buttons for mobile touch */}
            <div className="flex flex-wrap items-center gap-1.5 px-3 py-1.5 border-t border-green-900/40 bg-black/60 text-[11px]">
              <span className="text-gray-500 text-[10px] mr-1 hidden sm:inline">Lệnh nhanh:</span>
              {quickCommands.map(cmd => (
                <button
                  key={cmd}
                  type="button"
                  onClick={() => executeCommand(cmd)}
                  className="px-2 py-0.5 bg-green-950/40 border border-green-900/80 hover:border-green-500 text-green-400 hover:bg-green-500 hover:text-black transition-all rounded-none font-mono text-[11px] active:scale-95"
                >
                  ${cmd}
                </button>
              ))}
            </div>

            {/* Command input form */}
            <form onSubmit={handleCommandSubmit} className="border-t border-green-900/50 p-2 sm:p-2.5 flex items-center bg-green-900/10">
              <span className="text-green-600 font-bold mr-1.5 text-xs sm:text-sm shrink-0">guest@yuta:~$</span>
              <input 
                ref={terminalInputRef}
                type="text"
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Gõ lệnh (help, ls, run <id>)..."
                className="flex-1 bg-transparent border-none outline-none text-green-400 placeholder-green-800 text-xs sm:text-sm w-full font-mono"
                autoComplete="off"
                spellCheck="false"
              />
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
