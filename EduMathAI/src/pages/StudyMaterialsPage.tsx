import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { StudyMaterial, Chapter } from '../types';
import { MaterialModal } from '../components/MaterialModal';
import {
  FileText, Download, Eye, Search, Filter, Clock, BookOpen, Sparkles
} from 'lucide-react';

export const StudyMaterialsPage: React.FC = () => {
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState<StudyMaterial | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [mats, chaps] = await Promise.all([
          api.getMaterials(),
          api.getChapters()
        ]);
        setMaterials(mats);
        setChapters(chaps);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDownload = (mat: StudyMaterial) => {
    window.location.href = `/api/materials/${mat.id}/download`;
  };

  const types = [
    'ALL',
    'Chapter Notes',
    'Formula Sheet',
    'Revision Notes',
    'Important Questions',
    'Examples',
    'Practice Worksheet'
  ];

  const filtered = materials.filter(m => {
    const matchesChapter = selectedChapter === 'ALL' || m.chapterId === selectedChapter;
    const matchesType = selectedType === 'ALL' || m.type === selectedType;
    const matchesSearch = m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.description.toLowerCase().includes(search.toLowerCase());
    return matchesChapter && matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-700/80">
        <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
          Class 9 Academic Library
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
          Study Materials & Revision Notes
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
          Official Class 9 formula sheets, theorem proofs, and chapter notes formatted for quick offline study and exam preparation.
        </p>
      </div>

      {/* Filters Bar */}
      <div className="glass-card p-4 sm:p-5 rounded-2xl border border-slate-700/80 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notes, formulas..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Chapter Filter */}
          <div>
            <select
              value={selectedChapter}
              onChange={(e) => setSelectedChapter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-sky-500"
            >
              <option value="ALL">All Chapters</option>
              {chapters.map(c => (
                <option key={c.id} value={c.id}>
                  Ch {c.number}: {c.title}
                </option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-sky-500"
            >
              {types.map(t => (
                <option key={t} value={t}>
                  {t === 'ALL' ? 'All Material Types' : t}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Materials Grid */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center text-slate-400 glass-card rounded-3xl">
          <BookOpen className="w-8 h-8 mx-auto mb-2 text-slate-500" />
          <p className="text-sm">No study materials found matching your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((mat) => {
            const chapter = chapters.find(c => c.id === mat.chapterId);
            return (
              <div
                key={mat.id}
                className="glass-card p-5 rounded-3xl border border-slate-700/80 flex flex-col justify-between hover:border-sky-500/40 transition group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-sky-500/15 text-sky-400 border border-sky-500/30">
                      {mat.type}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {mat.readTime}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white mb-1.5 group-hover:text-sky-300 transition-colors">
                    {mat.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 mb-4">
                    {mat.description}
                  </p>

                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-4">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{chapter ? `Chapter ${chapter.number}: ${chapter.title}` : 'General Mathematics'}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedMaterial(mat)}
                    className="flex items-center gap-1.5 text-xs font-bold text-sky-400 hover:text-sky-300 transition"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Read Notes</span>
                  </button>
                  <button
                    onClick={() => handleDownload(mat)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reader Modal */}
      <MaterialModal
        material={selectedMaterial}
        onClose={() => setSelectedMaterial(null)}
        onDownload={handleDownload}
      />
    </div>
  );
};
