import React, { useState, useEffect, useCallback } from 'react';
import { Edit3, X, Plus, Trash2, Activity } from 'lucide-react';
import { Note } from '../types';

interface NotesAppProps {
  onClose: () => void;
}

export default function NotesApp({ onClose }: NotesAppProps) {
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('yuta_multi_notes');
    if (saved) return JSON.parse(saved);
    
    // Migrate old single note if it exists
    const oldNote = localStorage.getItem('yuta_notes');
    if (oldNote) {
      return [{ id: Date.now().toString(), title: 'Ghi chú cũ', content: oldNote, updatedAt: Date.now() }];
    }
    return [];
  });
  
  const [activeNoteId, setActiveNoteId] = useState<string | null>(notes.length > 0 ? notes[0].id : null);

  useEffect(() => {
    localStorage.setItem('yuta_multi_notes', JSON.stringify(notes));
  }, [notes]);

  const activeNote = notes.find(n => n.id === activeNoteId);

  const handleCreateNote = useCallback(() => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'Ghi chú mới',
      content: '',
      updatedAt: Date.now()
    };
    setNotes(prev => [newNote, ...prev]);
    setActiveNoteId(newNote.id);
  }, []);

  const handleUpdateNote = (content: string) => {
    if (!activeNoteId) return;
    const lines = content.split('\n');
    const title = lines[0].trim() || 'Ghi chú không tên';
    setNotes(notes.map(n => n.id === activeNoteId ? { ...n, content, title, updatedAt: Date.now() } : n));
  };

  const handleDeleteNote = useCallback((id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setNotes(prev => {
      const newNotes = prev.filter(n => n.id !== id);
      if (activeNoteId === id) {
        setActiveNoteId(newNotes.length > 0 ? newNotes[0].id : null);
      }
      return newNotes;
    });
  }, [activeNoteId]);

  // Hotkeys for Notes App
  useEffect(() => {
    const handleNotesKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        handleCreateNote();
      } else if (e.altKey && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        if (activeNoteId) {
          handleDeleteNote(activeNoteId);
        }
      }
    };
    window.addEventListener('keydown', handleNotesKeyDown);
    return () => window.removeEventListener('keydown', handleNotesKeyDown);
  }, [handleCreateNote, handleDeleteNote, activeNoteId]);

  return (
    <div className="fixed inset-0 z-50 bg-[#050505]/95 backdrop-blur-sm flex flex-col p-4 md:p-8 crt">
      <div className="max-w-6xl w-full mx-auto flex flex-col h-full border border-green-900 bg-black/80 shadow-[0_0_30px_rgba(74,222,128,0.1)]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-green-900 bg-green-900/20">
          <div className="flex items-center text-green-400 font-bold text-lg glow-green">
            <Edit3 className="w-5 h-5 mr-3" />
            Hệ thống Ghi chú (Multi-notes)
          </div>
          <button onClick={onClose} className="text-green-500 hover:text-green-300 flex items-center bg-green-900/30 px-3 py-1 border border-green-900 hover:border-green-500 transition-all">
            <X className="w-4 h-4 mr-2" />
            <span className="text-xs font-bold">[ESC] ĐÓNG</span>
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          
          {/* Sidebar */}
          <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-green-900 flex flex-col bg-green-900/5 h-1/3 md:h-full">
            <div className="p-3 border-b border-green-900">
              <button onClick={handleCreateNote} className="w-full flex items-center justify-center py-2 bg-green-900/30 border border-green-500 text-green-400 hover:bg-green-500 hover:text-black transition-all text-sm font-bold">
                <Plus className="w-4 h-4 mr-2" /> TẠO GHI CHÚ <span className="ml-2 text-[10px] opacity-70 font-normal">[Alt+N]</span>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-green-900">
              {notes.map(note => (
                <div 
                  key={note.id} 
                  onClick={() => setActiveNoteId(note.id)}
                  className={`p-3 border-b border-green-900/50 cursor-pointer group transition-all ${activeNoteId === note.id ? 'bg-green-900/40 border-l-2 border-l-green-400' : 'hover:bg-green-900/20'}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="truncate font-bold text-sm text-green-400 pr-2">{note.title}</div>
                    <button onClick={(e) => handleDeleteNote(note.id, e)} className="text-gray-500 hover:text-red-400 md:opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" title="Xóa ghi chú [Alt+D]">
                      <Trash2 className="w-4 h-4 md:w-3 md:h-3" />
                    </button>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{new Date(note.updatedAt).toLocaleString('vi-VN')}</div>
                </div>
              ))}
              {notes.length === 0 && (
                <div className="p-4 text-center text-xs text-gray-500">Chưa có ghi chú nào.</div>
              )}
            </div>
          </div>

          {/* Editor */}
          <div className="flex-1 flex flex-col relative h-2/3 md:h-full">
            {activeNote ? (
              <>
                <textarea
                  autoFocus
                  value={activeNote.content}
                  onChange={(e) => handleUpdateNote(e.target.value)}
                  className="flex-1 w-full bg-transparent p-4 md:p-6 text-green-400 font-mono focus:outline-none resize-none leading-relaxed"
                  placeholder="Nhập nội dung ghi chú ở đây...&#10;Dòng đầu tiên sẽ được dùng làm tiêu đề.&#10;&#10;Phím tắt:&#10;- [Alt + N]: Tạo ghi chú mới&#10;- [Alt + D]: Xóa ghi chú hiện tại"
                  spellCheck="false"
                />
                <div className="p-2 border-t border-green-900 bg-green-900/10 text-gray-500 text-xs flex justify-between items-center">
                  <span className="flex items-center"><Activity className="w-3 h-3 mr-1 text-green-500"/> Tự động lưu</span>
                  <span>{activeNote.content.length} ký tự | {activeNote.content.split(/\s+/).filter(w => w.length > 0).length} từ</span>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500 flex-col">
                <Edit3 className="w-12 h-12 mb-4 opacity-20" />
                <p>Chọn một ghi chú hoặc tạo mới [Alt + N]</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
