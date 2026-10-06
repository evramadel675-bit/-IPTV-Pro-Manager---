import React from 'react';
import { Code2, Terminal, Cpu, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-slate-800/80 bg-slate-950/90 backdrop-blur-md py-3 sm:py-4 px-3 sm:px-4 md:px-6 text-center">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-2 text-xs">
        <div className="p-1 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          <Code2 className="w-4 h-4" />
        </div>
        <span className="text-slate-400">تم التطوير بواسطة:</span>
        <strong className="text-white font-bold tracking-wide">مهندس إفرام عادل</strong>
        <span className="text-slate-600">|</span>
        <span className="text-emerald-400 font-mono font-semibold" dir="ltr">
          Eng. Evram Adel - IT Support & Systems Engineeer
        </span>
      </div>
    </footer>
  );
};
