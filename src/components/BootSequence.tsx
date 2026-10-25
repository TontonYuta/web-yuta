import React, { useState, useEffect } from 'react';

interface BootSequenceProps {
  onComplete: () => void;
}

export default function BootSequence({ onComplete }: BootSequenceProps) {
  const [bootLines, setBootLines] = useState<{time: string, text: string}[]>([]);

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
        const now = new Date();
        const timeString = now.getHours().toString().padStart(2, '0') + ':' + 
                           now.getMinutes().toString().padStart(2, '0') + ':' + 
                           now.getSeconds().toString().padStart(2, '0');
        
        const text = bootSequence[i];
        setBootLines(prev => [...prev, { time: timeString, text }]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(onComplete, 600);
      }
    }, 220);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div 
      onClick={onComplete}
      className="crt min-h-screen bg-[#050505] text-green-500 font-mono p-4 sm:p-6 selection:bg-green-900 selection:text-green-400 cursor-pointer flex flex-col justify-between"
    >
      <div className="max-w-3xl w-full mx-auto mt-4 sm:mt-10">
        <div className="flex justify-between items-center pb-2.5 mb-4 border-b border-green-900/60 text-xs">
          <span className="text-green-600">[YUTA_BOOT_LOADER]</span>
          <button 
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onComplete();
            }}
            className="px-2.5 py-1 bg-green-900/30 border border-green-600 hover:border-green-400 text-green-400 hover:bg-green-500 hover:text-black transition-all text-xs font-bold active:scale-95"
          >
            [ Bỏ qua &gt;&gt; ]
          </button>
        </div>
        {bootLines.map((line, idx) => (
          <div key={idx} className="mb-1 text-xs sm:text-sm md:text-base leading-relaxed">
            <span className="text-gray-500">[{line.time}]</span> {line.text}
          </div>
        ))}
        <div className="animate-pulse mt-2 text-green-400">_</div>
      </div>
      <div className="text-center text-[11px] sm:text-xs text-green-700/80 pb-4 tracking-wider">
        [ Chạm bất kỳ đâu trên màn hình để vào nhanh ]
      </div>
    </div>
  );
}
