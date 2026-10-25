import React, { useState, useEffect, useCallback } from 'react';
import { Edit3, X, Plus, Trash2, Activity, ArrowLeft, List } from 'lucide-react';
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
  // Quản lý tab trên mobile: 'list' (xem danh sách ghi chú) hoặc 'edit' (soạn thảo)
  const [mobileTab, setMobileTab] = useState<'list' | 'edit'>(notes.length > 0 ? 'edit' : 'list');

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
    setMobileTab('edit');
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
        const nextActive = newNotes.length > 0 ? newNotes[0].id : null;
        setActiveNoteId(nextActive);
        if (!nextActive) {
          setMobileTab('list');
        }
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
    <div className="fixed inset-0 z-50 bg-[#050505]/95 backdrop-blur-sm flex flex-col p-2 sm:p-4 md:p-8 crt">
      <div className="max-w-6xl w-full mx-auto flex flex-col h-full border border-green-900 bg-black/90 shadow-[0_0_30px_rgba(74,222,128,0.1)] overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center p-3 sm:p-4 border-b border-green-900 bg-green-900/20">
          <div className="flex items-center text-green-400 font-bold text-sm sm:text-lg glow-green min-w-0 mr-2">
            {mobileTab === 'edit' && activeNote && (
              <button 
                type="button"
                onClick={() => setMobileTab('list')}
                className="md:hidden mr-2 p-1 border border-green-800 text-green-400 hover:bg-green-900/30 active:scale-95 shrink-0"
                title="Quay lại danh sách"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <Edit3 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 shrink-0" />
            <span className="truncate">Ghi chú ({notes.length})</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Mobile Tab switchers */}
            <div className="flex md:hidden border border-green-900 text-[11px]">
              <button
                type="button"
                onClick={() => setMobileTab('list')}
                className={`px-2 py-1 flex items-center gap-1 ${mobileTab === 'list' ? 'bg-green-500 text-black font-bold' : 'text-green-500'}`}
              >
                <List className="w-3 h-3" />
                <span>DS</span>
              </button>
              <button
                type="button"
                onClick={() => setMobileTab('edit')}
                className={`px-2 py-1 flex items-center gap-1 ${mobileTab === 'edit' ? 'bg-green-500 text-black font-bold' : 'text-green-500'}`}
              >
                <Edit3 className="w-3 h-3" />
                <span>Viết</span>
              </button>
            </div>

            <button 
              type="button"
              onClick={onClose} 
              className="text-green-400 hover:text-green-200 flex items-center bg-green-900/40 px-2.5 py-1 border border-green-700 hover:border-green-400 transition-all text-xs font-bold active:scale-95"
            >
              <X className="w-4 h-4 mr-1" />
              <span className="text-[11px] font-bold">[ĐÓNG]</span>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          
          {/* Sidebar: Notes List */}
          <div className={`w-full md:w-64 border-b md:border-b-0 md:border-r border-green-900 flex-col bg-green-900/5 h-full ${
            mobileTab === 'list' ? 'flex' : 'hidden md:flex'
          }`}>
            <div className="p-2.5 sm:p-3 border-b border-green-900">
              <button 
                type="button"
                onClick={handleCreateNote} 
                className="w-full flex items-center justify-center py-2 bg-green-900/30 border border-green-500 text-green-400 hover:bg-green-500 hover:text-black transition-all text-xs sm:text-sm font-bold active:scale-95"
              >
                <Plus className="w-4 h-4 mr-1.5" /> TẠO GHI CHÚ
              </button>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-green-900">
              {notes.map(note => (
                <div 
                  key={note.id} 
                  onClick={() => {
                    setActiveNoteId(note.id);
                    setMobileTab('edit');
                  }}
                  className={`p-3 border-b border-green-900/50 cursor-pointer group transition-all select-none ${
                    activeNoteId === note.id ? 'bg-green-900/40 border-l-2 border-l-green-400' : 'hover:bg-green-900/20'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="truncate font-bold text-xs sm:text-sm text-green-400 pr-2">{note.title}</div>
                    <button 
                      type="button"
                      onClick={(e) => handleDeleteNote(note.id, e)} 
                      className="text-gray-500 hover:text-red-400 p-1 transition-opacity flex-shrink-0" 
                      title="Xóa ghi chú"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="text-[10px] text-gray-500 mt-1">{new Date(note.updatedAt).toLocaleString('vi-VN')}</div>
                </div>
              ))}
              {notes.length === 0 && (
                <div className="p-6 text-center text-xs text-gray-500">Chưa có ghi chú nào. Hãy bấm "TẠO GHI CHÚ" để bắt đầu.</div>
              )}
            </div>
          </div>

          {/* Editor: Active Note */}
          <div className={`flex-1 flex-col relative h-full bg-black/60 ${
            mobileTab === 'edit' ? 'flex' : 'hidden md:flex'
          }`}>
            {activeNote ? (
              <>
                <textarea
                  autoFocus
                  value={activeNote.content}
                  onChange={(e) => handleUpdateNote(e.target.value)}
                  className="flex-1 w-full bg-transparent p-3 sm:p-5 text-green-400 font-mono text-xs sm:text-sm focus:outline-none resize-none leading-relaxed"
                  placeholder="Nhập nội dung ghi chú ở đây...&#10;Dòng đầu tiên sẽ được dùng làm tiêu đề."
                  spellCheck="false"
                />
                <div className="p-2 border-t border-green-900 bg-green-900/10 text-gray-400 text-[11px] flex justify-between items-center">
                  <span className="flex items-center"><Activity className="w-3 h-3 mr-1 text-green-500"/> Tự động lưu</span>
                  <span>{activeNote.content.length} ký tự</span>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500 flex-col p-6 text-center">
                <Edit3 className="w-10 h-10 mb-3 opacity-20" />
                <p className="text-xs sm:text-sm mb-3">Chưa có ghi chú nào được chọn</p>
                <button
                  type="button"
                  onClick={handleCreateNote}
                  className="px-3 py-1.5 bg-green-900/30 border border-green-600 text-green-400 hover:bg-green-500 hover:text-black text-xs font-bold transition-all"
                >
                  + Tạo ghi chú ngay
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
