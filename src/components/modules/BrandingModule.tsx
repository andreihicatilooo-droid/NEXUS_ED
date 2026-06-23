import React from 'react';
import { AppState } from '@/types';
import { Scan, LayoutTemplate, Layers } from 'lucide-react';

interface Props {
  state: AppState;
  updateState: (s: Partial<AppState>) => void;
}

export default function BrandingModule({ state }: Props) {
  const selectedAsset = state.assets[0];

  const presets = [
    { label: 'Instagram Post', aspect: 'aspect-square', w: 1080, h: 1080, css: 'aspect-[1/1]' },
    { label: 'TG / Telegram', aspect: 'aspect-video', w: 1920, h: 1080, css: 'aspect-[16/9]' },
    { label: 'Instagram Stories', aspect: 'aspect-[9/16]', w: 1080, h: 1920, css: 'aspect-[9/16]' },
  ];

  return (
    <div className="h-full flex flex-col space-y-6">
      <header className="border-b border-white/10 pb-4">
        <h2 className="text-2xl font-light tracking-tight text-white mb-2 underline decoration-cyan-500 underline-offset-8">
          Branding <span className="text-white/40 decoration-transparent">// Кроп & Генерация Ассетов</span>
        </h2>
        <p className="text-xs opacity-50 max-w-sm mt-2">Автоматическая адаптация выбранного контента под ключевые медиа-форматы.</p>
      </header>

      {!selectedAsset ? (
        <div className="flex-1 flex items-center justify-center border border-white/5 rounded-2xl bg-[#0a0a0a]">
           <div className="text-center">
             <LayoutTemplate className="w-8 h-8 text-white/20 mx-auto mb-4" />
             <p className="text-white/40 text-xs font-mono">Загрузите изображения в Studio.</p>
           </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto pr-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {presets.map(preset => (
               <div key={preset.label} className="flex flex-col gap-4">
                 <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest text-cyan-400 border-b border-white/5 pb-2">
                    <span className="flex items-center gap-2"><Scan className="w-3 h-3"/> {preset.label}</span>
                    <span className="text-white/40">{preset.w}x{preset.h}</span>
                 </div>
                 <div className="flex items-center justify-center bg-[#0d0d0d] rounded-2xl border border-white/5 p-4 shadow-inner">
                    {/* The crop container */}
                    <div className={`w-full ${preset.css} relative overflow-hidden bg-[#050505] flex items-center justify-center rounded-xl group shadow-lg`}>
                       <img 
                         src={selectedAsset.url} 
                         className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                         alt="cropped asset"
                       />
                       <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent to-black/60 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                 </div>
               </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
