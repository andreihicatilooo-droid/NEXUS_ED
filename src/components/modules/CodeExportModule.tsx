import React from 'react';
import { AppState } from '@/types';
import { Code2, Copy, CheckCircle2 } from 'lucide-react';

export default function CodeExportModule({ state }: { state: AppState, updateState: (s: Partial<AppState>) => void }) {
  const [copiedText, setCopiedText] = React.useState<string | null>(null);
  const selectedAsset = state.assets[0];

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const getSvgCode = () => {
    if (!selectedAsset) return `<svg width="100" height="100"></svg>`;
    return `<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
  <image href="${selectedAsset.url}" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />
</svg>`;
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      <header className="border-b border-white/10 pb-4">
        <h2 className="text-2xl font-light tracking-tight text-white mb-2 underline decoration-cyan-500 underline-offset-8">
          Code Export <span className="text-white/40 decoration-transparent">// Экспорт для Web</span>
        </h2>
        <p className="text-xs opacity-50 max-w-sm mt-2">Генерация Base64 и SVG оберток для быстрого внедрения в код.</p>
      </header>

      <div className="flex-1 flex flex-col gap-6 overflow-hidden">
        {!selectedAsset ? (
           <div className="flex-1 flex items-center justify-center border border-white/5 rounded-2xl bg-[#0a0a0a]">
             <div className="text-center">
               <Code2 className="w-8 h-8 text-white/20 mx-auto mb-4" />
               <p className="text-white/40 font-mono text-xs">Загрузите изображение для генерации кода.</p>
             </div>
           </div>
        ) : (
          <div className="flex flex-col gap-6 h-full">
            {/* SVG Container */}
            <div className="flex-1 flex flex-col border border-white/5 rounded-2xl bg-[#0a0a0a] overflow-hidden">
               <div className="flex justify-between items-center p-4 border-b border-white/5 bg-[#050505]">
                  <span className="font-mono text-xs text-white/60 uppercase tracking-widest">SVG Wrapper Code</span>
                  <button 
                    onClick={() => handleCopy(getSvgCode(), 'svg')}
                    className="flex items-center gap-2 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    {copiedText === 'svg' ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copiedText === 'svg' ? 'Скопировано!' : 'Копировать'}
                  </button>
               </div>
               <div className="flex-1 p-4 overflow-y-auto">
                 <pre className="text-[10px] sm:text-xs font-mono text-white/70 whitespace-pre-wrap break-all leading-relaxed">
                    {getSvgCode()}
                 </pre>
               </div>
            </div>

            {/* Base64 Container */}
            <div className="flex-1 flex flex-col border border-white/5 rounded-2xl bg-[#0a0a0a] overflow-hidden">
               <div className="flex justify-between items-center p-4 border-b border-white/5 bg-[#050505]">
                  <span className="font-mono text-xs text-white/60 uppercase tracking-widest">Base64 Data String</span>
                  <button 
                    onClick={() => handleCopy(selectedAsset.url, 'base64')}
                    className="flex items-center gap-2 text-xs text-fuchsia-400 hover:text-fuchsia-300 transition-colors"
                  >
                    {copiedText === 'base64' ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copiedText === 'base64' ? 'Скопировано!' : 'Копировать'}
                  </button>
               </div>
               <div className="flex-1 p-4 overflow-y-auto">
                 <pre className="text-[10px] font-mono text-white/40 whitespace-pre-wrap break-all">
                    {selectedAsset.url.substring(0, 1000)}...
                    {/* Only showing first 1000 chars for preview purposes */}
                 </pre>
               </div>
               <div className="p-2 border-t border-white/5 bg-black/40 text-center text-[10px] text-white/30 font-mono">
                  ПОКАЗАНО 1000 СИМВОЛОВ ИЗ {selectedAsset.url.length}. ПРИ КОПИРОВАНИИ ЗАХВАТЫВАЕТСЯ ВЕСЬ ТЕКСТ.
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
