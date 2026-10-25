import { GraduationCap, Calculator, Brain, FileText } from 'lucide-react';
import { AppItem } from '../types';

export const apps: AppItem[] = [
  {
    id: 'hsa-toan',
    title: 'Toán HSA & THPTQG',
    url: 'https://hsayuta.vercel.app/',
    isInternal: false,
    description: 'Hệ thống luyện thi Đánh giá năng lực ĐHQGHN (HSA) và Tốt nghiệp THPT Quốc Gia môn Toán học GDPT 2018 với 12 chuyên đề và bộ đề thực chiến phong phú.',
    icon: GraduationCap,
    tags: ['Toán học', 'Luyện thi', 'HSA', 'THPTQG'],
    sysStatus: 'Hoạt động',
  },
  {
    id: 'toan7-yuta',
    title: 'Toán 7 - GDPT 2018',
    url: 'https://toan7-yuta.vercel.app/',
    isInternal: false,
    description: 'Hệ thống học tập & luyện thi môn Toán 7 chuẩn chương trình GDPT 2018 (Kết nối tri thức, Cánh diều) và Bứt phá 9+ Học sinh giỏi.',
    icon: Calculator,
    tags: ['Toán 7', 'Luyện thi', 'GDPT 2018', 'Học sinh giỏi'],
    sysStatus: 'Hoạt động',
  },
  {
    id: 'focus-game',
    title: 'FocusGame',
    url: 'https://focus-game-bice.vercel.app/',
    isInternal: false,
    description: 'Trò chơi rèn luyện nhận thức 4 trong 1: Luyện mắt mở rộng thị giác ngoại vi, tính nhẩm thần tốc, phản xạ từ vựng tiếng Anh CEFR và phản xạ ngón tay.',
    icon: Brain,
    tags: ['Game', 'Luyện não', 'Phản xạ', 'Tập trung'],
    sysStatus: 'Hoạt động',
  },
  {
    id: 'pdf-spacer',
    title: 'PDF Exam Spacer',
    url: 'https://add-space-to-pdf-yuta.vercel.app/',
    isInternal: false,
    description: 'Công cụ tự động cắt khối câu hỏi đề thi và chèn khoảng trống làm bài chuẩn in ấn A4.',
    icon: FileText,
    tags: ['Công cụ', 'PDF', 'Đề thi', 'In ấn'],
    sysStatus: 'Hoạt động',
  }
];
