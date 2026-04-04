import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Command } from 'lucide-react';
import { apps } from '../data/apps';
import { AppItem } from '../types';

interface TerminalConsoleProps {
  terminalInputRef: React.RefObject<HTMLInputElement | null>;
  onOpenApp: (app: AppItem) => void;
}

export default function TerminalConsole({ terminalInputRef, onOpenApp }: TerminalConsoleProps) {
  const [terminalHistory, setTerminalHistory] = useState<{type: 'command' | 'output' | 'error', text: string}[]>([
    { type: 'output', text: 'YUTA_OS v1.0.0 đã khởi động. Gõ "help" để xem danh sách lệnh.' }
  ]);
  const [commandInput, setCommandInput] = useState('');
  const [pastCommands, setPastCommands] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalHistory]);

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

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandInput.trim()) return;

    const cmd = commandInput.trim().toLowerCase();
    const newHistory = [...terminalHistory, { type: 'command' as const, text: `guest@yuta:~$ ${commandInput}` }];
    
    setPastCommands(prev => [...prev, commandInput.trim()]);
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
- [Ctrl + ~] : Mở/Focus Terminal
- [/]        : Tìm kiếm ứng dụng
- [Alt + N]  : Mở Ghi chú tự do / Tạo ghi chú mới
- [Alt + D]  : Xóa ghi chú hiện tại (trong Ghi chú)
- [Mũi tên]  : Điều hướng ứng dụng / Lịch sử lệnh Terminal
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
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="mt-8 border border-green-900 bg-black/80 flex flex-col h-64 shadow-[0_0_15px_rgba(0,0,0,0.5)]"
    >
      <div className="bg-green-900/30 px-4 py-1.5 border-b border-green-900 flex items-center justify-between">
        <span className="text-xs font-bold text-green-500 flex items-center"><Command className="w-3 h-3 mr-2"/> TERMINAL_CONSOLE</span>
        <span className="text-xs text-green-700">bash</span>
      </div>
      <div className="flex-1 p-4 overflow-y-auto font-mono text-sm space-y-1 scrollbar-thin scrollbar-thumb-green-900 scrollbar-track-transparent">
        {terminalHistory.map((line, idx) => (
          <div key={idx} className={`${
            line.type === 'command' ? 'text-gray-300' : 
            line.type === 'error' ? 'text-red-400' : 'text-green-400'
          } whitespace-pre-wrap`}>
            {line.text}
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>
      <form onSubmit={handleCommandSubmit} className="border-t border-green-900/50 p-2 flex items-center bg-green-900/10">
        <span className="text-green-600 font-bold mr-2">guest@yuta:~$</span>
        <input 
          ref={terminalInputRef}
          type="text"
          value={commandInput}
          onChange={(e) => setCommandInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent border-none outline-none text-green-400 w-full"
          autoComplete="off"
          spellCheck="false"
        />
      </form>
    </motion.div>
  );
}
