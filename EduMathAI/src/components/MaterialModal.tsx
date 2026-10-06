import React from 'react';
import { X, Download, FileText, Clock, BookOpen, Check } from 'lucide-react';
import { StudyMaterial } from '../types';

interface MaterialModalProps {
  material: StudyMaterial | null;
  onClose: () => void;
  onDownload: (material: StudyMaterial) => void;
}

export const MaterialModal: React.FC<MaterialModalProps> = ({ material, onClose, onDownload }) => {
  if (!material) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="relative w-full max-w-3xl max-h-[90vh] glass-card rounded-3xl border border-slate-700/80 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-700/80 bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-sky-400 border border-slate-700">
                {material.type}
              </span>
              <h3 className="text-base font-bold text-white mt-1">{material.title}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Subhead info */}
        <div className="flex items-center justify-between px-6 py-2.5 bg-slate-950/40 border-b border-slate-800 text-xs text-slate-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              {material.readTime}
            </span>
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              Class 9 Mathematics
            </span>
          </div>
          <span className="px-2 py-0.5 rounded bg-slate-800 text-[11px] text-slate-300">
            Difficulty: {material.difficulty}
          </span>
        </div>

        {/* Content body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-slate-200 leading-relaxed text-sm">
          {material.keyFormulas && material.keyFormulas.length > 0 && (
            <div className="p-4 rounded-2xl bg-sky-950/30 border border-sky-500/30">
              <h4 className="text-xs font-bold text-sky-300 uppercase tracking-wider mb-2">
                Quick Formula Reference
              </h4>
              <ul className="space-y-1.5">
                {material.keyFormulas.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs font-mono text-sky-200">
                    <Check className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="prose prose-invert max-w-none space-y-3 whitespace-pre-line text-slate-300">
            {material.contentMarkdown}
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between">
          <p className="text-xs text-slate-400">
            Official EduMathAI Class 9 Study Resource
          </p>
          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition"
            >
              Close
            </button>
            <button
              onClick={() => onDownload(material)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white text-xs font-semibold shadow-md shadow-sky-500/20 hover:shadow-sky-500/40 hover:scale-[1.02] transition"
            >
              <Download className="w-4 h-4" />
              Download Resource (.md)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
