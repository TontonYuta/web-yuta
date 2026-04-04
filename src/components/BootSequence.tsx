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
        setTimeout(onComplete, 800);
      }
    }, 250);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="crt min-h-screen bg-[#050505] text-green-500 font-mono p-6 selection:bg-green-900 selection:text-green-400">
      <div className="max-w-3xl mx-auto mt-10">
        {bootLines.map((line, idx) => (
          <div key={idx} className="mb-1 text-sm md:text-base">
            <span className="text-gray-500">[{line.time}]</span> {line.text}
          </div>
        ))}
        <div className="animate-pulse mt-2">_</div>
      </div>
    </div>
  );
}
