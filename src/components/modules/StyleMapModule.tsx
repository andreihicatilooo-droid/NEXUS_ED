import React, { useState } from 'react';
import { AppState } from '@/types';
import { Layers, Rocket, Ghost, Sparkles, Terminal } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function StyleMapModule({ state, updateState }: { state: AppState, updateState: (s: Partial<AppState>) => void }) {
  const presets = [
    { id: 'cyberpunk', icon: <Terminal className="w-6 h-6"/>, title: 'Cyberpunk 2077', desc: 'Neons, high tech, low life, chromatic aberration', color: 'from-cyan-500 to-blue-600' },
    { id: 'brutalist', icon: <Layers className="w-6 h-6"/>, title: 'Brutalist Web', desc: 'Raw unstyled HTML look, bold typography, harsh contrast', color: 'from-zinc-500 to-zinc-800' },
    { id: 'vaporwave', icon: <Ghost className="w-6 h-6"/>, title: 'Vaporwave aesthetics', desc: '80s retro, synthwave, grids, magenta and cyan', color: 'from-fuchsia-500 to-purple-600' },
    { id: 'solarpunk', icon: <Sparkles className="w-6 h-6"/>, title: 'Solarpunk Utopia', desc: 'Bright, green, optimistic future, organic shapes', color: 'from-green-400 to-emerald-600' },
    { id: 'minimal', icon: <Rocket className="w-6 h-6"/>, title: 'Corporate Minimal', desc: 'Sleek, lots of white space, Helvetica, monotone', color: 'from-slate-400 to-slate-600' },
  ];

  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="h-full flex flex-col space-y-6">
      <header className="border-b border-white/10 pb-4">
        <h2 className="text-2xl font-light tracking-tight text-white mb-2 underline decoration-cyan-500 underline-offset-8">
          Style Map <span className="text-white/40 decoration-transparent">// Предустановки</span>
        </h2>
        <p className="text-xs opacity-50 max-w-sm mt-2">Ментальная карта визуальных направлений. Выбирайте эстетический вектор без лишних настроек.</p>
      </header>

      <div className="flex-1 overflow-y-auto w-full p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {presets.map(p => (
                  <div 
                      key={p.id}
                      onClick={() => setActive(p.id)}
                      className={cn(
                          "relative overflow-hidden border rounded-2xl p-6 cursor-pointer group transition-all duration-300",
                          active === p.id ? "border-cyan-500 bg-white/5 shadow-[0_0_20px_rgba(34,211,238,0.1)]" : "border-white/5 bg-[#0a0a0a] hover:border-white/20"
                      )}
                  >
                      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${p.color} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`} />
                      <div className="relative z-10">
                          <div className={cn("text-white/50 mb-4 transition-colors", active === p.id && "text-cyan-400")}>
                              {p.icon}
                          </div>
                          <h3 className="text-xl font-bold text-white mb-2 tracking-tight">{p.title}</h3>
                          <p className="text-xs text-white/40 font-mono leading-relaxed">{p.desc}</p>
                      </div>
                  </div>
              ))}
          </div>
          
          <div className="mt-12 p-8 border border-white/5 rounded-2xl bg-[#080808] relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/[0.02] via-transparent to-transparent pointer-events-none" />
              <div className="flex justify-between items-center relative z-10">
                  <div>
                      <h4 className="font-mono text-cyan-400 text-sm uppercase tracking-widest mb-1">Стиль активирован</h4>
                      <p className="text-white/40 text-xs">Все последующие генерации будут наследовать этот эстетический профиль.</p>
                  </div>
                  <button className="px-6 py-2 bg-white text-black font-bold uppercase tracking-tighter text-xs rounded shadow-lg shadow-white/10 hover:bg-white/80 transition-colors">
                      Применить Глобально
                  </button>
              </div>
          </div>
      </div>
    </div>
  );
}
