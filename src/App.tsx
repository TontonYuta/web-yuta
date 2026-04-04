import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Terminal, Brain, Languages, FileText, Calculator, ExternalLink, Server, Activity, Database, Code, BookOpen, Keyboard, Search, Command } from 'lucide-react';

const apps = [
  {
    id: 'memory-game',
    title: 'Memory Game',
    url: 'https://memory-game-yuta.vercel.app',
    description: 'Trò chơi rèn luyện trí nhớ qua các thẻ bài sinh động. Yêu cầu ghi nhớ và lật các cặp thẻ giống nhau trong thời gian ngắn nhất.',
    icon: Brain,
    tags: ['Trí nhớ', 'Giải đố', 'Tập trung'],
    sysStatus: 'Hoạt động',
  },
  {
    id: 'english-game',
    title: 'English Game',
    url: 'https://english-game-yuta.vercel.app',
    description: 'Học tiếng Anh hiệu quả và thú vị qua các trò chơi tương tác. Cải thiện từ vựng và ngữ pháp.',
    icon: Languages,
    tags: ['Tiếng Anh', 'Từ vựng', 'Tương tác'],
    sysStatus: 'Hoạt động',
  },
  {
    id: 'soan-tai-lieu',
    title: 'Soạn Tài Liệu',
    url: 'https://soan-tai-lieu.vercel.app',
    description: 'Công cụ hỗ trợ soạn thảo và quản lý tài liệu học tập nhanh chóng. Tối ưu hóa quy trình học tập.',
    icon: FileText,
    tags: ['Công cụ', 'Ghi chú', 'Học tập'],
    sysStatus: 'Hoạt động',
  },
  {
    id: 'mathheads',
    title: 'Math Heads',
    url: 'https://mathheads.net',
    description: 'Thử thách tư duy toán học với các bài toán và câu đố hấp dẫn. Nâng cao khả năng tính toán.',
    icon: Calculator,
    tags: ['Toán học', 'Tư duy', 'Logic'],
    sysStatus: 'Hoạt động',
  },
  {
    id: 'devflow',
    title: 'DevFlow',
    url: 'https://devflow-yuta.vercel.app',
    description: 'Nền tảng hỏi đáp và chia sẻ kiến thức dành cho cộng đồng lập trình viên.',
    icon: Code,
    tags: ['Lập trình', 'Cộng đồng', 'Hỏi đáp'],
    sysStatus: 'Hoạt động',
  },
  {
    id: 'toeic-game',
    title: 'TOEIC Game',
    url: 'https://toeic-game-yuta.vercel.app',
    description: 'Trò chơi luyện thi TOEIC giúp nâng cao vốn từ vựng và kỹ năng làm bài.',
    icon: BookOpen,
    tags: ['TOEIC', 'Tiếng Anh', 'Luyện thi'],
    sysStatus: 'Hoạt động',
  },
  {
    id: 'typing-game',
    title: 'Typing Game',
    url: 'https://typing-game-yuta.vercel.app',
    description: 'Luyện gõ phím nhanh và chính xác với nhiều chế độ thử thách đa dạng.',
    icon: Keyboard,
    tags: ['Gõ phím', 'Tốc độ', 'Kỹ năng'],
    sysStatus: 'Hoạt động',
  }
];

export default function App() {
  const [isBooting, setIsBooting] = useState(true);
  const [bootText, setBootText] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Terminal State
  const [terminalHistory, setTerminalHistory] = useState<{type: 'command' | 'output' | 'error', text: string}[]>([
    { type: 'output', text: 'YUTA_OS v1.0.0 đã khởi động. Gõ "help" để xem danh sách lệnh.' }
  ]);
  const [commandInput, setCommandInput] = useState('');
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Mở ứng dụng dạng cửa sổ popup tối đa kích thước (giả lập fullscreen)
  const openAppFullscreen = (url: string, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    const width = window.screen.availWidth;
    const height = window.screen.availHeight;
    window.open(url, '_blank', `width=${width},height=${height},left=0,top=0,menubar=no,toolbar=no,location=no,status=no`);
  };

  // Boot Sequence Logic
  useEffect(() => {
    const bootSequence = [
      "Khởi tạo hệ thống YUTA_OS...",
      "Đang tải kernel_v9.4.2...",
      "Kiểm tra bộ nhớ: OK (640K RAM SYSTEM GOOD)",
      "Mounting file system: /dev/sda1 OK",
      "Đang tải các module ứng dụng...",
      "Kết nối mạng: ĐÃ THIẾT LẬP (192.168.1.104)",
      "Khởi động giao diện người dùng..."
    ];
    
    let i = 0;
    const interval = setInterval(() => {
      if (i < bootSequence.length) {
        setBootText(prev => [...prev, bootSequence[i]]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => setIsBooting(false), 800);
      }
    }, 250);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll terminal
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalHistory]);

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandInput.trim()) return;

    const cmd = commandInput.trim().toLowerCase();
    const newHistory = [...terminalHistory, { type: 'command' as const, text: `guest@yuta:~$ ${commandInput}` }];

    if (cmd === 'help') {
      newHistory.push({ type: 'output', text: 'Các lệnh khả dụng:\n- help: Xem danh sách lệnh\n- ls: Liệt kê các ứng dụng\n- run <id>: Mở ứng dụng (vd: run memory-game)\n- clear: Xóa màn hình terminal\n- whoami: Thông tin tác giả\n- date: Xem ngày giờ hệ thống' });
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
        openAppFullscreen(app.url);
      } else {
        newHistory.push({ type: 'error', text: `Lỗi: Không tìm thấy module '${targetId}'. Gõ 'ls' để xem danh sách.` });
      }
    } else {
      newHistory.push({ type: 'error', text: `Lỗi: Không nhận diện được lệnh '${cmd}'. Gõ 'help' để xem danh sách lệnh.` });
    }

    setTerminalHistory(newHistory);
    setCommandInput('');
  };

  const filteredApps = apps.filter(app => 
    app.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    app.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
    app.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isBooting) {
    return (
      <div className="crt min-h-screen bg-[#050505] text-green-500 font-mono p-6 selection:bg-green-900 selection:text-green-400">
        <div className="max-w-3xl mx-auto mt-10">
          {bootText.map((text, idx) => (
            <div key={idx} className="mb-1 text-sm md:text-base">
              <span className="text-gray-500">[{new Date().toISOString().split('T')[1].slice(0,8)}]</span> {text}
            </div>
          ))}
          <div className="animate-pulse mt-2">_</div>
        </div>
      </div>
    );
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
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Nhập tên ứng dụng hoặc từ khóa..."
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
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.05 * index }}
                  className="bg-green-900/10 border border-green-900 hover:border-green-500 transition-all duration-300 p-5 group relative overflow-hidden flex flex-col h-full"
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
                      onClick={(e) => openAppFullscreen(app.url, e)}
                      className="w-full flex items-center justify-center px-3 py-2 bg-green-900/20 border border-green-500 text-green-400 hover:bg-green-500 hover:text-black transition-all font-bold tracking-widest text-xs group/btn uppercase"
                    >
                      [ Mở ứng dụng ]
                      <ExternalLink className="w-3 h-3 ml-2 opacity-50 group-hover/btn:opacity-100" />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Interactive Terminal */}
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
              type="text"
              value={commandInput}
              onChange={(e) => setCommandInput(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-green-400 w-full"
              autoComplete="off"
              spellCheck="false"
            />
          </form>
        </motion.div>

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

      </div>
    </div>
  );
}
