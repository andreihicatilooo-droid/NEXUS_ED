import React, { useState } from 'react';
import { AppState } from '@/types';
import Markdown from 'react-markdown';
import { Hexagon, Loader2, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  state: AppState;
  updateState: (s: Partial<AppState>) => void;
}

export default function ManifestoModule({ state, updateState }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateManifesto = async () => {
    setLoading(true);
    setError(null);
    let context = "";
    
    // Gather context
    const roiNodes = state.mindMapNodes.filter(n => n.roi || n.id === 'root').map(n => n.label).join(", ");
    context += `Предметные области интереса (ROI): ${roiNodes}.\n\n`;
    if (state.dnaAnalysisText) {
      context += `Архитектура ДНК эстетики: ${state.dnaAnalysisText}\n\n`;
    }

    try {
      const resp = await fetch('/api/manifesto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context })
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || 'Ошибка генерации манифеста');
      updateState({ manifestoText: data.result });
    } catch (err: any) {
      setError(err.message || 'Сбой генерации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      <header className="border-b border-white/10 pb-4 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-light tracking-tight text-white mb-2 underline decoration-cyan-500 underline-offset-8">
            Manifesto <span className="text-white/40 decoration-transparent">// Компиляция Стратегии</span>
          </h2>
          <p className="text-xs opacity-50 max-w-sm mt-2">Генерация финального стратегического документа на базе ДНК Анализа и Mind Map ROI.</p>
        </div>
        <button 
          onClick={generateManifesto}
          disabled={loading}
          className="px-6 py-2 rounded-lg bg-cyan-950/30 text-cyan-400 border border-cyan-900/50 hover:bg-cyan-900/40 transition-all font-mono uppercase text-xs tracking-wider flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
          {loading ? 'Компиляция...' : 'Синтезировать Manifesto'}
        </button>
      </header>

      <div className="flex-1 overflow-hidden flex">
        <div className="w-full h-full overflow-y-auto border border-white/5 rounded-2xl bg-[#0a0a0a] p-8 manifesto-glow shadow-inner">
          {!state.manifestoText && !loading && (
             <div className="h-full flex flex-col items-center justify-center text-white/20">
                <Hexagon className="w-12 h-12 mb-4 opacity-50" />
                <p className="text-xs font-mono">Нажмите 'Синтезировать Manifesto' для генерации стратегии.</p>
             </div>
          )}

          {loading && (
             <div className="h-full flex flex-col items-center justify-center text-cyan-700">
                <Hexagon className="w-16 h-16 animate-spin-slow opacity-50 mb-4" />
                <p className="font-mono text-sm tracking-widest uppercase">Системная компиляция...</p>
             </div>
          )}

          {state.manifestoText && !loading && (
             <div className="prose prose-invert prose-zinc max-w-none prose-headings:font-mono prose-headings:uppercase prose-h1:text-cyan-400 prose-h2:text-zinc-200 prose-a:text-cyan-500">
               <Markdown>{state.manifestoText}</Markdown>
             </div>
          )}
          {error && <p className="text-red-400 text-sm mt-4 font-mono">{error}</p>}
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        .manifesto-glow {
          box-shadow: inset 0 0 50px rgba(34,211,238,0.02);
        }
      `}} />
    </div>
  );
}
