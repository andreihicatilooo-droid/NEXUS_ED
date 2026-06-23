import React, { useState } from 'react';
import { AppState, MindMapNode, generateId } from '@/types';
import { Plus, Target, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  state: AppState;
  updateState: (s: Partial<AppState>) => void;
}

export default function MindMapModule({ state, updateState }: Props) {
  const [newLabel, setNewLabel] = useState('');

  const addNode = (parentId?: string) => {
    if (!newLabel.trim()) return;
    updateState({
      mindMapNodes: [...state.mindMapNodes, {
        id: generateId(),
        label: newLabel,
        parentId,
      }]
    });
    setNewLabel('');
  };

  const removeNode = (id: string) => {
    if (id === 'root') return; // protect root
    updateState({
      mindMapNodes: state.mindMapNodes.filter(n => n.id !== id && n.parentId !== id)
    });
  };

  const toggleRoi = (id: string) => {
    updateState({
      mindMapNodes: state.mindMapNodes.map(n => 
        n.id === id ? { ...n, roi: !n.roi } : n
      )
    });
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      <header className="border-b border-white/10 pb-4">
        <h2 className="text-2xl font-light tracking-tight text-white mb-2 underline decoration-cyan-500 underline-offset-8">
          Mind Map <span className="text-white/40 decoration-transparent">// Архитектура Концепта</span>
        </h2>
        <p className="text-xs opacity-50 max-w-sm mt-2">Рекурсивное планирование идей. Отмечайте ветки как ROI (Region of Interest) для манифеста.</p>
      </header>

      <div className="flex-1 flex flex-col gap-6 overflow-hidden">
        {/* Quick Add */}
        <div className="flex gap-2 items-center">
          <input 
            type="text" 
            value={newLabel}
            onChange={e => setNewLabel(e.target.value)}
            placeholder="Введите концепт, идею или ветку..."
            className="flex-1 bg-[#0d0d0d] border border-white/10 text-white rounded-lg px-4 py-3 font-mono text-xs focus:outline-none focus:border-cyan-500/50 transition-colors"
            onKeyDown={e => e.key === 'Enter' && addNode()}
          />
          <button 
            onClick={() => addNode('root')}
            className="bg-cyan-950/30 text-cyan-400 p-3 rounded-lg border border-cyan-900/50 hover:bg-cyan-900/40 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Nodes Grid view simpler than d3 tree for standard layouts */}
        <div className="flex-1 overflow-y-auto bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 shadow-inner">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-max items-start">
             {state.mindMapNodes.map(node => (
               <div 
                 key={node.id} 
                 className={cn(
                   "p-4 rounded-xl border transition-all relative group",
                   node.id === 'root' ? "border-cyan-500/50 bg-cyan-950/20 col-span-full shadow-[0_0_15px_rgba(34,211,238,0.1)]" :
                   node.roi ? "border-fuchsia-500/50 bg-fuchsia-950/20 shadow-[0_0_10px_rgba(217,70,239,0.1)]" : "border-white/5 bg-[#0d0d0d] hover:border-white/20"
                 )}
               >
                 <div className="flex justify-between items-start mb-2">
                   <h4 className={cn("font-mono text-xs tracking-widest uppercase", node.id === 'root' ? 'text-cyan-400 font-bold' : node.roi ? 'text-fuchsia-400' : 'text-white/80')}>
                      {node.label}
                   </h4>
                   {node.id !== 'root' && (
                     <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button onClick={() => toggleRoi(node.id)} className="p-1 text-white/40 hover:text-fuchsia-400 transition-colors" title="Включить в ROI (Манифест)">
                         <Target className="w-4 h-4" />
                       </button>
                       <button onClick={() => removeNode(node.id)} className="p-1 text-white/40 hover:text-red-400 transition-colors">
                         <Trash2 className="w-4 h-4" />
                       </button>
                     </div>
                   )}
                 </div>
                 {node.description && <p className="text-[10px] text-white/40">{node.description}</p>}
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
}
