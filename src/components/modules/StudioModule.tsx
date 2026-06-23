import React, { useRef } from 'react';
import { AppState, FileAsset, generateId } from '@/types';
import { fileToBase64 } from '@/lib/utils';
import { UploadCloud, X, FileImage } from 'lucide-react';

interface Props {
  state: AppState;
  updateState: (s: Partial<AppState>) => void;
}

export default function StudioModule({ state, updateState }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    const fileList = Array.from(files);
    const newAssets: FileAsset[] = [];

    for (const file of fileList) {
      if (!file.type.startsWith('image/')) continue;
      const base64 = await fileToBase64(file);
      newAssets.push({
        id: generateId(),
        name: file.name,
        url: base64
      });
    }

    if (newAssets.length > 0) {
      updateState({ assets: [...state.assets, ...newAssets] });
    }
  };

  const removeAsset = (id: string) => {
    updateState({ assets: state.assets.filter(a => a.id !== id) });
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      <header className="border-b border-white/10 pb-4">
        <h2 className="text-2xl font-light tracking-tight text-white mb-2 underline decoration-cyan-500 underline-offset-8">
          Studio <span className="text-white/40 decoration-transparent">// Загрузка Ассетов</span>
        </h2>
        <p className="text-xs opacity-50 max-w-sm mt-2">Загрузите базовые изображения для дальнейшего синтеза и анализа.</p>
      </header>

      <div 
        onClick={() => fileInputRef.current?.click()}
        className="flex flex-col items-center justify-center p-12 border border-white/10 rounded-2xl bg-[#0a0a0a] hover:bg-white/5 transition-colors cursor-pointer group shadow-inner"
      >
        <UploadCloud className="w-12 h-12 text-white/20 group-hover:text-cyan-400 transition-colors mb-4" />
        <p className="text-white/80 font-medium">Кликните или перетащите изображения для загрузки</p>
        <p className="text-white/40 text-[10px] uppercase mt-2 font-mono">JPEG, PNG, WEBP (max 10MB)</p>
        <input 
          type="file" 
          multiple 
          accept="image/*" 
          className="hidden" 
          ref={fileInputRef}
          onChange={handleFileUpload}
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        <h3 className="text-[10px] text-white/40 uppercase mb-4 font-mono">Активные ассеты ({state.assets.length})</h3>
        
        {state.assets.length === 0 ? (
          <div className="text-center p-12 border border-white/5 rounded-2xl bg-[#0d0d0d]">
            <FileImage className="w-8 h-8 text-white/10 mx-auto mb-3" />
            <p className="text-white/40 font-mono text-xs">Нет загруженных ассетов</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {state.assets.map(asset => (
              <div key={asset.id} className="relative group border border-white/5 rounded-2xl overflow-hidden bg-[#080808] shadow-inner">
                <img src={asset.url} alt={asset.name} className="w-full h-40 object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/90 to-transparent flex flex-col justify-end p-3">
                  <p className="text-[10px] font-mono text-white/60 truncate">{asset.name}</p>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); removeAsset(asset.id); }}
                  className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
