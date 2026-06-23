import React, { useState } from 'react';
import { AppState, ViewMode } from '@/types';
import Markdown from 'react-markdown';
import { Fingerprint, Loader2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  state: AppState;
  updateState: (s: Partial<AppState>) => void;
}

export default function DnaAnalysisModule({ state, updateState }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedAsset = state.assets[0]; // For MVP, let's just use the first uploaded asset

  const extractDna = async () => {
    if (!selectedAsset) return;
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch('/api/analyze-dna', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: selectedAsset.url })
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || 'Ошибка анализа');
      updateState({ dnaAnalysisText: data.result });
    } catch (err: any) {
      setError(err.message || 'Сбой на сервере анализа');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      <header className="border-b border-white/10 pb-4">
        <h2 className="text-2xl font-light tracking-tight text-white mb-2 underline decoration-cyan-500 underline-offset-8">
          Style DNA Analysis <span className="text-white/40 decoration-transparent">// Анализ кода</span>
        </h2>
        <p className="text-xs opacity-50 max-w-sm mt-2">Извлечение визуальных смыслов, нарратива и маркетинговых параметров через Vision AI.</p>
      </header>

      {!selectedAsset ? (
        <div className="flex-1 flex items-center justify-center border border-white/5 rounded-2xl bg-[#0a0a0a]">
          <div className="text-center">
             <Sparkles className="w-8 h-8 text-white/20 mx-auto mb-4" />
             <p className="text-white/40 text-xs font-mono">Загрузите ассет в модуле Studio для начала анализа.</p>
             <button 
               onClick={() => updateState({ currentView: 'studio' })}
               className="mt-4 px-4 py-2 border border-white/10 rounded-lg bg-[#0d0d0d] text-sm text-cyan-400 hover:bg-white/5 transition-colors"
             >
               Перейти в Studio
             </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6 flex-1 overflow-hidden">
          {/* Controls */}
          <div className="w-full lg:w-1/3 flex flex-col gap-4">
            <div className="border border-white/5 p-2 rounded-2xl bg-[#0a0a0a]">
               <img src={selectedAsset.url} alt="Target Asset" className="w-full h-auto aspect-video object-cover rounded-xl" />
               <div className="p-2 border-t border-white/5 mt-2 flex justify-between items-center text-[10px] text-white/40">
                  <span>TARGET ASSET</span>
                  <span className="font-mono">{selectedAsset.name}</span>
               </div>
            </div>

            <button 
              onClick={extractDna}
              disabled={loading}
              className="w-full h-12 border border-white/10 hover:border-cyan-500/50 rounded-lg text-xs transition-all uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50 text-cyan-400 bg-white/5"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Fingerprint className="w-5 h-5" />}
              {loading ? 'Анализ...' : 'Синтезировать ДНК'}
            </button>
            {error && <p className="text-red-400 text-xs font-mono">{error}</p>}
          </div>

          {/* Results */}
          <div className="w-full lg:w-2/3 h-full overflow-y-auto border border-white/5 rounded-2xl bg-[#0a0a0a] p-6 shadow-inner">
            {!state.dnaAnalysisText && !loading && (
              <div className="h-full flex flex-col items-center justify-center text-white/20">
                <Sparkles className="w-10 h-10 mb-4 opacity-50" />
                <p className="text-xs font-mono">Ожидание инициализации анализа...</p>
              </div>
            )}
            
            {loading && (
              <div className="h-full flex flex-col items-center justify-center text-cyan-800">
                 <div className="relative">
                   <Fingerprint className="w-16 h-16 animate-pulse opacity-50" />
                   <div className="absolute inset-0 bg-cyan-400 mix-blend-color animate-[scan_1.5s_ease-in-out_infinite]" />
                 </div>
                 <p className="mt-4 font-mono text-sm">ДЕКОНСТРУКЦИЯ СИМВОЛОВ...</p>
                 <style>{`
                   @keyframes scan {
                     0% { transform: translateY(-100%) }
                     100% { transform: translateY(100%) }
                   }
                 `}</style>
              </div>
            )}

            {state.dnaAnalysisText && !loading && (
               <div className="prose prose-invert prose-zinc max-w-none prose-headings:font-mono prose-headings:uppercase prose-headings:text-cyan-400 prose-a:text-cyan-500">
                 <Markdown>{state.dnaAnalysisText}</Markdown>
               </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
