import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Command, ChevronDown, ChevronUp } from 'lucide-react';
import { apps } from '../data/apps';
import { AppItem } from '../types';

interface TerminalConsoleProps {
  terminalInputRef: React.RefObject<HTMLInputElement | null>;
  onOpenApp: (app: AppItem) => void;
}

export default function TerminalConsole({ terminalInputRef, onOpenApp }: TerminalConsoleProps) {
  const [terminalHistory, setTerminalHistory] = useState<{type: 'command' | 'output' | 'error', text: string}[]>([
    { type: 'output', text: 'YUTA_OS v1.0.0 đã sẵn sàng. Gõ "help" hoặc chạm các nút lệnh nhanh.' }
  ]);
  const [commandInput, setCommandInput] = useState('');
  const [pastCommands, setPastCommands] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isCollapsed, setIsCollapsed] = useState(() => {
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
- run <id>: Mở ứng dụng (vd: run focus-game)
- clear: Xóa màn hình terminal
- whoami: Thông tin tác giả
- date: Xem ngày giờ hệ thống` });
    } else if (cmd === 'ls') {
      const appList = apps.map(a => `  ${a.id.padEnd(15)} | ${a.title}`).join('\n');
      newHistory.push({ type: 'output', text: `Danh sách module:\n${appList}` });
    } else if (cmd === 'clear') {
      setTerminalHistory([]);
      setCommandInput('');
      return;
    } else if (cmd === 'whoami') {
      newHistory.push({ type: 'output', text: 'Yuta - Nhà phát triển phần mềm giáo dục và công nghệ.' });
    } else if (cmd === 'date') {
      newHistory.push({ type: 'output', text: new Date().toString() });
    } else if (cmd.startsWith('run ')) {
      const targetId = cmd.split(' ')[1];
      const app = apps.find(a => a.id === targetId);
      if (app) {
        newHistory.push({ type: 'output', text: `Đang mở [${app.title}]...` });
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
    <div className="mt-6 border border-slate-800 bg-slate-900/90 rounded-lg flex flex-col shadow-sm overflow-hidden">
      {/* Header bar with collapse toggle */}
      <div 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="bg-slate-950/70 px-3 sm:px-4 py-2.5 border-b border-slate-800 flex items-center justify-between cursor-pointer hover:bg-slate-800/50 select-none transition-colors"
      >
        <span className="text-xs font-semibold text-emerald-400 flex items-center">
          <Command className="w-3.5 h-3.5 mr-2 text-emerald-400"/> 
          Terminal Console
          <span className="ml-2 text-[10px] text-slate-500 font-mono hidden sm:inline">[bash]</span>
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">
            {isCollapsed ? '[ + Mở rộng ]' : '[ - Thu gọn ]'}
          </span>
          {isCollapsed ? (
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          ) : (
            <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
          )}
        </div>
      </div>

      {!isCollapsed && (
        <div className="flex flex-col">
          {/* Terminal output */}
          <div className="h-40 sm:h-52 p-3 sm:p-4 overflow-y-auto font-mono text-xs sm:text-sm space-y-1 bg-slate-950/90">
            {terminalHistory.map((line, idx) => (
              <div key={idx} className={`${
                line.type === 'command' ? 'text-slate-200 font-semibold' : 
                line.type === 'error' ? 'text-rose-400' : 'text-emerald-400'
              } whitespace-pre-wrap leading-relaxed`}>
                {line.text}
              </div>
            ))}
            <div ref={terminalEndRef} />
          </div>

          {/* Quick command buttons */}
          <div className="flex flex-wrap items-center gap-1.5 px-3 py-2 border-t border-slate-800 bg-slate-900 text-xs">
            <span className="text-slate-400 text-xs mr-1 hidden sm:inline">Lệnh nhanh:</span>
            {quickCommands.map(cmd => (
              <button
                key={cmd}
                type="button"
                onClick={() => executeCommand(cmd)}
                className="px-2.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 hover:text-emerald-300 hover:border-emerald-500 font-mono text-xs transition-colors"
              >
                ${cmd}
              </button>
            ))}
          </div>

          {/* Command input form */}
          <form onSubmit={handleCommandSubmit} className="border-t border-slate-800 p-2.5 flex items-center bg-slate-950">
            <span className="text-emerald-400 font-semibold mr-2 text-xs sm:text-sm shrink-0">guest@yuta:~$</span>
            <input 
              ref={terminalInputRef}
              type="text"
              value={commandInput}
              onChange={(e) => setCommandInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Gõ lệnh (help, ls, run <id>)..."
              className="flex-1 bg-transparent border-none outline-none text-slate-200 placeholder-slate-600 text-xs sm:text-sm w-full font-mono"
              autoComplete="off"
              spellCheck="false"
            />
          </form>
        </div>
      )}
    </div>
  );
}
