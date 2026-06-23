import React from 'react';
import { AppState } from '@/types';
import { FileText, Download } from 'lucide-react';

export default function InfoModule({ state }: { state: AppState, updateState: (s: Partial<AppState>) => void }) {
  
  const handleDownloadPRD = () => {
    const text = `CREATIVE NEXUS PRO - ТЕХНИЧЕСКОЕ ЗАДАНИЕ (PRD)\n\nВЕРСИЯ: 24.0\nДАТА: ${new Date().toLocaleDateString()}\n\n1. АРХИТЕКТУРА И МЕТОДОЛОГИЯ\n- Visual DNA Extraction\n- Recursive Ideation\n- Procedural Synthesis\n\n2. ЦЕЛИ UX\n- Интеллектуальный интерфейс без перегрузки\n- Модульность блоков\n\nВсе системы работают в штатном режиме.`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Nexus_Pro_PRD.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      <header className="border-b border-white/10 pb-4">
        <h2 className="text-2xl font-light tracking-tight text-white mb-2 underline decoration-cyan-500 underline-offset-8">
          About & PRD <span className="text-white/40 decoration-transparent">// Техническое Описание</span>
        </h2>
        <p className="text-xs opacity-50 max-w-sm mt-2">Архитектура, функциональные требования и методология продукта.</p>
      </header>

      <div className="flex-1 overflow-y-auto">
         <div className="max-w-3xl space-y-8">
            <div className="flex items-start gap-6 border border-white/5 bg-[#0a0a0a] p-6 rounded-2xl shadow-inner">
               <div className="p-4 bg-cyan-500/10 rounded-xl text-cyan-400">
                  <FileText className="w-8 h-8" />
               </div>
               <div>
                  <h3 className="text-lg font-bold text-white mb-2">Техническое ТЗ (PRD)</h3>
                  <p className="text-xs text-white/50 leading-relaxed font-mono whitespace-pre-line mb-6">
                    Это приложение создано для деконструкции эстетики, брендинга и визуального языка через инструменты ИИ и шейдеров.
                    Поддерживает Canvas, WebGL, Gemini Integration и Mind Mapping.
                  </p>
                  <button 
                    onClick={handleDownloadPRD}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded uppercase text-[10px] tracking-widest font-mono hover:bg-white/10 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Скачать Nexus_Pro_PRD.txt
                  </button>
               </div>
            </div>

            <div className="border-t border-white/10 pt-8 mt-8">
               <h3 className="text-[10px] text-white/40 font-mono tracking-widest uppercase mb-6">Журнал Изменений (Changelog)</h3>
               <div className="space-y-4">
                  {[
                    { v: 'v24.0', title: 'FULL ARCHIVE IMPLEMENTATION', desc: 'Added Canvas, Code Export, Reports, Info tab and completely new layout.' },
                    { v: 'v23.0', title: 'PROJECT BRAIN UPGRADE', desc: 'Recursive Mind Mapping and Commercial Manifesto module.' },
                    { v: 'v12.0', title: 'NANO BANANA INTRODUCED', desc: 'Support for Nano Banana generation workflows via AI engine.' },
                    { v: 'v1.0', title: 'INITIAL BUILD', desc: 'Core UI established with D3 integration.' }
                  ].map(log => (
                     <div key={log.v} className="flex gap-4 items-start">
                        <div className="w-16 py-1 text-[10px] font-mono text-fuchsia-400 border border-fuchsia-500/30 bg-fuchsia-500/10 text-center rounded">{log.v}</div>
                        <div>
                           <h4 className="text-sm font-bold text-white tracking-tight">{log.title}</h4>
                           <p className="text-xs text-white/40 mt-1">{log.desc}</p>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
