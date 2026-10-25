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
    
    const oldNote = localStorage.getItem('yuta_notes');
    if (oldNote) {
      return [{ id: Date.now().toString(), title: 'Ghi chú cũ', content: oldNote, updatedAt: Date.now() }];
    }
    return [];
  });
  
  const [activeNoteId, setActiveNoteId] = useState<string | null>(notes.length > 0 ? notes[0].id : null);
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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col p-2 sm:p-4 md:p-8">
      <div className="max-w-5xl w-full mx-auto flex flex-col h-full border border-slate-800 bg-slate-900 rounded-xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center text-white font-semibold text-sm sm:text-base min-w-0 mr-2">
            {mobileTab === 'edit' && activeNote && (
              <button 
                type="button"
                onClick={() => setMobileTab('list')}
                className="md:hidden mr-2 p-1.5 rounded border border-slate-700 text-slate-300 hover:bg-slate-800 shrink-0"
                title="Quay lại danh sách"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <Edit3 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-emerald-400 shrink-0" />
            <span className="truncate">Ghi chú ({notes.length})</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Mobile Tab switchers */}
            <div className="flex md:hidden border border-slate-700 rounded overflow-hidden text-xs">
              <button
                type="button"
                onClick={() => setMobileTab('list')}
                className={`px-2.5 py-1 flex items-center gap-1 ${mobileTab === 'list' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-300 bg-slate-800'}`}
              >
                <List className="w-3 h-3" />
                <span>DS</span>
              </button>
              <button
                type="button"
                onClick={() => setMobileTab('edit')}
                className={`px-2.5 py-1 flex items-center gap-1 ${mobileTab === 'edit' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-300 bg-slate-800'}`}
              >
                <Edit3 className="w-3 h-3" />
                <span>Viết</span>
              </button>
            </div>

            <button 
              type="button"
              onClick={onClose} 
              className="text-slate-300 hover:text-white flex items-center bg-slate-800 px-3 py-1.5 rounded border border-slate-700 hover:border-slate-500 text-xs font-medium transition-colors"
            >
              <X className="w-4 h-4 mr-1" />
              <span>Đóng [Esc]</span>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          
          {/* Sidebar: Notes List */}
          <div className={`w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-800 flex-col bg-slate-950/60 h-full ${
            mobileTab === 'list' ? 'flex' : 'hidden md:flex'
          }`}>
            <div className="p-3 border-b border-slate-800">
              <button 
                type="button"
                onClick={handleCreateNote} 
                className="w-full flex items-center justify-center py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-medium text-xs sm:text-sm transition-colors"
              >
                <Plus className="w-4 h-4 mr-1.5" /> Tạo ghi chú mới
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {notes.map(note => (
                <div 
                  key={note.id} 
                  onClick={() => {
                    setActiveNoteId(note.id);
                    setMobileTab('edit');
                  }}
                  className={`p-3 border-b border-slate-800/80 cursor-pointer select-none transition-colors ${
                    activeNoteId === note.id ? 'bg-slate-800 border-l-4 border-l-emerald-400' : 'hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="truncate font-medium text-xs sm:text-sm text-slate-200 pr-2">{note.title}</div>
                    <button 
                      type="button"
                      onClick={(e) => handleDeleteNote(note.id, e)} 
                      className="text-slate-500 hover:text-rose-400 p-1 shrink-0" 
                      title="Xóa ghi chú"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">{new Date(note.updatedAt).toLocaleString('vi-VN')}</div>
                </div>
              ))}
              {notes.length === 0 && (
                <div className="p-6 text-center text-xs text-slate-500">Chưa có ghi chú nào. Hãy tạo ghi chú mới.</div>
              )}
            </div>
          </div>

          {/* Editor */}
          <div className={`flex-1 flex-col relative h-full bg-slate-900 ${
            mobileTab === 'edit' ? 'flex' : 'hidden md:flex'
          }`}>
            {activeNote ? (
              <>
                <textarea
                  autoFocus
                  value={activeNote.content}
                  onChange={(e) => handleUpdateNote(e.target.value)}
                  className="flex-1 w-full bg-transparent p-4 sm:p-6 text-slate-100 font-sans text-sm focus:outline-none resize-none leading-relaxed"
                  placeholder="Nhập nội dung ghi chú ở đây...&#10;Dòng đầu tiên sẽ được dùng làm tiêu đề."
                  spellCheck="false"
                />
                <div className="px-4 py-2 border-t border-slate-800 bg-slate-950 text-slate-400 text-xs flex justify-between items-center">
                  <span className="flex items-center"><Activity className="w-3 h-3 mr-1 text-emerald-400"/> Tự động lưu</span>
                  <span>{activeNote.content.length} ký tự</span>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-400 flex-col p-6 text-center">
                <Edit3 className="w-10 h-10 mb-3 opacity-30 text-slate-500" />
                <p className="text-xs sm:text-sm mb-3">Chưa có ghi chú nào được chọn</p>
                <button
                  type="button"
                  onClick={handleCreateNote}
                  className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors"
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
