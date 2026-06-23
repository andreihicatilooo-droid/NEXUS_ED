import React, { useRef, useState, useEffect } from 'react';
import { AppState } from '@/types';
import { Pen, Eraser, Download, ImagePlus, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CanvasModule({ state, updateState }: { state: AppState, updateState: (s: Partial<AppState>) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
  const [color, setColor] = useState('#fuchsia');
  
  const selectedAsset = state.assets[0];

  useEffect(() => {
    if (selectedAsset && canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
        };
        img.src = selectedAsset.url;
    }
  }, [selectedAsset]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    ctx.beginPath();
    ctx.moveTo((e.clientX - rect.left) * scaleX, (e.clientY - rect.top) * scaleY);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    ctx.lineTo((e.clientX - rect.left) * scaleX, (e.clientY - rect.top) * scaleY);
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
    ctx.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over';
    ctx.lineWidth = tool === 'eraser' ? 20 : 5;
    ctx.lineCap = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const saveEditedImage = () => {
     if (!canvasRef.current) return;
     const dataUrl = canvasRef.current.toDataURL('image/png');
     const newId = Math.random().toString(36).substring(2,9);
     updateState({
         assets: [{id: newId, url: dataUrl, name: 'Markup_Edit.png'}, ...state.assets]
     });
     alert('Изображение с метками сохранено в Студию!');
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      <header className="border-b border-white/10 pb-4">
        <h2 className="text-2xl font-light tracking-tight text-white mb-2 underline decoration-cyan-500 underline-offset-8">
          Markup Canvas <span className="text-white/40 decoration-transparent">// Визуальные метки</span>
        </h2>
        <p className="text-xs opacity-50 max-w-sm mt-2">Рисование прямо на изображении для выделения областей и I2I.</p>
      </header>

      {!selectedAsset ? (
        <div className="flex-1 flex items-center justify-center border border-white/5 rounded-2xl bg-[#0a0a0a]">
           <div className="text-center">
             <ImagePlus className="w-8 h-8 text-white/20 mx-auto mb-4" />
             <p className="text-white/40 font-mono text-xs">Загрузите изображения в Studio.</p>
           </div>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6 flex-1 overflow-hidden">
          {/* Toolbar */}
          <div className="w-full lg:w-16 flex lg:flex-col gap-2 items-center justify-start border border-white/5 rounded-2xl bg-[#0a0a0a] p-2">
             <button title="Pen" onClick={() => setTool('pen')} className={cn("p-3 rounded-xl transition-all", tool === 'pen' ? "bg-white/10 text-fuchsia-400" : "text-white/40 hover:bg-white/5")}>
                 <Pen className="w-5 h-5" />
             </button>
             <button title="Eraser" onClick={() => setTool('eraser')} className={cn("p-3 rounded-xl transition-all", tool === 'eraser' ? "bg-white/10 text-cyan-400" : "text-white/40 hover:bg-white/5")}>
                 <Eraser className="w-5 h-5" />
             </button>
             
             <div className="w-full h-px bg-white/10 my-2 lg:my-2 hidden lg:block" />
             
             {['#d946ef', '#22d3ee', '#fbbf24', '#f87171', '#4ade80'].map(c => (
                 <button key={c} onClick={() => {setTool('pen'); setColor(c);}} className="w-8 h-8 rounded-full border-2 border-[#050505] shadow-sm transform hover:scale-110 transition-transform" style={{backgroundColor: c}} />
             ))}

             <div className="flex-1" />
             <button title="Save to Studio" onClick={saveEditedImage} className="p-3 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-colors">
                 <Download className="w-5 h-5" />
             </button>
          </div>
          
          {/* Canvas */}
          <div className="flex-1 border border-white/5 rounded-2xl overflow-hidden bg-[#0d0d0d] shadow-inner relative flex items-center justify-center overflow-auto p-4 cursor-crosshair">
              <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseOut={stopDrawing}
                className="max-w-full max-h-full object-contain shadow-2xl rounded-xl border border-white/10"
              />
              <div className="absolute top-4 right-4 bg-black/50 px-2 py-1 text-[10px] font-mono uppercase tracking-widest text-white/50 rounded pointer-events-none">
                  MODE: {tool.toUpperCase()}
              </div>
          </div>
        </div>
      )}
    </div>
  );
}
