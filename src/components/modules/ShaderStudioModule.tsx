import React, { useState } from 'react';
import { AppState } from '@/types';
import ShaderCanvas from '../ShaderCanvas';
import { Zap, Monitor } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  state: AppState;
  updateState: (s: Partial<AppState>) => void;
}

export default function ShaderStudioModule({ state, updateState }: Props) {
  const [shaderMode, setShaderMode] = useState<'normal' | 'glitch' | 'neon'>('normal');
  const selectedAsset = state.assets[0];

  return (
    <div className="h-full flex flex-col space-y-6">
      <header className="border-b border-white/10 pb-4">
        <h2 className="text-2xl font-light tracking-tight text-white mb-2 underline decoration-fuchsia-500 underline-offset-8">
          Shader Studio <span className="text-white/40 decoration-transparent">// Процедурная обработка </span>
        </h2>
        <p className="text-xs opacity-50 max-w-sm mt-2">GLSL эффекты реального времени (Glitch, VHS, Neon Edge).</p>
      </header>

      {!selectedAsset ? (
        <div className="flex-1 flex items-center justify-center border border-white/5 rounded-2xl bg-[#0a0a0a]">
           <div className="text-center">
             <Monitor className="w-8 h-8 text-white/20 mx-auto mb-4" />
             <p className="text-white/40 font-mono text-xs">Загрузите изображения в Studio для манипуляции.</p>
           </div>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6 flex-1 overflow-hidden">
          {/* Controls */}
          <div className="w-full lg:w-1/4 flex flex-col gap-4">
            <h3 className="font-mono text-fuchsia-400 text-[10px] tracking-widest uppercase mb-2">Настройки Эффектов</h3>
            {(['normal', 'glitch', 'neon'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => setShaderMode(mode)}
                className={cn(
                  "p-4 text-left border rounded-xl transition-all uppercase font-mono tracking-wider text-xs",
                  shaderMode === mode 
                    ? "bg-fuchsia-950/40 border-fuchsia-500/50 text-fuchsia-300 shadow-[0_0_15px_rgba(217,70,239,0.1)]" 
                    : "bg-[#0d0d0d] border-white/5 text-white/40 hover:border-white/20 hover:text-white/80"
                )}
              >
                {mode === 'normal' ? '01. RAW NORMAL' : mode === 'glitch' ? '02. DATA GLITCH' : '03. NEON WIREFRAME'}
              </button>
            ))}
          </div>

          {/* Canvas Viewport */}
          <div className="w-full lg:w-3/4 flex-1 border border-white/5 rounded-2xl overflow-hidden relative shadow-inner bg-gradient-to-br from-[#111] to-[#080808]">
             <div className="absolute top-4 left-4 z-10 text-[10px] font-mono text-white/20 uppercase tracking-[0.2em] pointer-events-none">
               Real-time Rendering Enabled
             </div>
             <div className="w-full h-full p-8 flex items-center justify-center">
                 <ShaderCanvas imageUrl={selectedAsset.url} shaderMode={shaderMode} time={0} />
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
