import React, { useState } from 'react';
import { AppState, FileAsset, MindMapNode, ViewMode, generateId } from '@/types';
import { BrainCircuit, Settings, Search, ShoppingBag, Folder, Target, Eye, Maximize } from 'lucide-react';
import { cn } from '@/lib/utils';
import StudioModule from '../modules/StudioModule';
import DnaAnalysisModule from '../modules/DnaAnalysisModule';
import ShaderStudioModule from '../modules/ShaderStudioModule';
import MindMapModule from '../modules/MindMapModule';
import BrandingModule from '../modules/BrandingModule';
import ManifestoModule from '../modules/ManifestoModule';
import CanvasModule from '../modules/CanvasModule';
import StyleMapModule from '../modules/StyleMapModule';
import CodeExportModule from '../modules/CodeExportModule';
import InfoModule from '../modules/InfoModule';

export default function AppLayout() {
  const [state, setState] = useState<AppState>({
    currentView: 'studio',
    assets: [],
    dnaAnalysisText: null,
    mindMapNodes: [
      { id: 'root', label: 'Ядро Проекта', description: 'Основная концепция' }
    ],
    manifestoText: null,
  });

  const updateState = (updates: Partial<AppState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const navGroups = [
    {
      title: 'Studio',
      icon: <Settings className="w-4 h-4" />,
      items: [
        { id: 'studio' as ViewMode, label: 'Генератор & База' },
        { id: 'canvas' as ViewMode, label: 'Markup Canvas' }
      ]
    },
    {
      title: 'Intelligence',
      icon: <Search className="w-4 h-4" />,
      items: [
        { id: 'dna' as ViewMode, label: 'ДНК Анализ' },
        { id: 'mindmap' as ViewMode, label: 'Mind Map' },
        { id: 'stylemap' as ViewMode, label: 'Карта Стилей' }
      ]
    },
    {
      title: 'Publishing',
      icon: <ShoppingBag className="w-4 h-4" />,
      items: [
        { id: 'branding' as ViewMode, label: 'Бренд Форматы' },
        { id: 'shader' as ViewMode, label: 'Shader Studio' }
      ]
    },
    {
      title: 'Library',
      icon: <Folder className="w-4 h-4" />,
      items: [
        { id: 'manifesto' as ViewMode, label: 'Центр Отчетов' },
        { id: 'code' as ViewMode, label: 'Экспорт Кода' },
        { id: 'info' as ViewMode, label: 'PRD & О проекте' }
      ]
    }
  ];

  return (
    <div className="flex h-screen bg-[#050505] text-[#e0e0e0] font-sans overflow-hidden select-none">
      {/* Sidebar Navigation */}
      <aside className="w-64 flex-shrink-0 border-r border-white/10 flex flex-col bg-[#080808] z-10">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-tr from-cyan-500 to-fuchsia-600 rounded-lg">
               <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tighter text-white">NEXUS <span className="text-xs font-mono font-normal opacity-50">PRO</span></h1>
          </div>
          
          <nav className="space-y-6 overflow-y-auto">
            {navGroups.map(group => (
               <div key={group.title}>
                 <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/30 mb-3 px-2">
                    {group.icon}
                    {group.title}
                 </div>
                 <div className="space-y-1">
                   {group.items.map(item => (
                      <button
                        key={item.id}
                        onClick={() => updateState({ currentView: item.id })}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group",
                          state.currentView === item.id 
                            ? "bg-white/5 text-cyan-400 border border-white/10 shadow-lg shadow-cyan-500/5 cursor-default" 
                            : "hover:bg-white/5 text-white/60 hover:text-white"
                        )}
                      >
                        <span className={cn("w-1.5 h-1.5 rounded-full", state.currentView === item.id ? "bg-cyan-400" : "bg-white/20 group-hover:bg-white/40")} />
                        <span className="text-sm">
                          {item.label}
                        </span>
                      </button>
                   ))}
                 </div>
               </div>
            ))}
          </nav>
        </div>
        
        <div className="mt-auto p-6 border-t border-white/5 bg-black/20">
          <div className="text-[10px] text-white/40 mb-2 font-mono">ENGINE: FLOW SDK 2.4</div>
          <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
            <div className="h-full w-2/3 bg-gradient-to-r from-cyan-500 to-fuchsia-500"></div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-[#050505]">
        {/* Top Header Bar */}
        <header className="h-16 flex-shrink-0 border-b border-white/10 flex items-center justify-between px-8 bg-[#0a0a0a]">
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono opacity-40">PROJECT: ALPHA_V2</span>
            <span className="h-4 w-[1px] bg-white/10"></span>
            <span className="text-xs font-mono opacity-40">SESSION: 04:21:12</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-white/80">Nano Banana Pro: Active</span>
            </div>
            <button className="px-4 py-1.5 bg-fuchsia-600 hover:bg-fuchsia-500 text-white rounded text-xs font-bold uppercase tracking-tighter shadow-lg shadow-fuchsia-600/20">Экспорт Ассетов</button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto w-full h-full">
          <div className="min-h-full p-8">
            {state.currentView === 'studio' && (
              <StudioModule state={state} updateState={updateState} />
            )}
            {state.currentView === 'canvas' && (
              <CanvasModule state={state} updateState={updateState} />
            )}
            {state.currentView === 'dna' && (
              <DnaAnalysisModule state={state} updateState={updateState} />
            )}
            {state.currentView === 'shader' && (
               <ShaderStudioModule state={state} updateState={updateState} />
            )}
            {state.currentView === 'mindmap' && (
               <MindMapModule state={state} updateState={updateState} />
            )}
            {state.currentView === 'stylemap' && (
               <StyleMapModule state={state} updateState={updateState} />
            )}
            {state.currentView === 'branding' && (
               <BrandingModule state={state} updateState={updateState} />
            )}
            {state.currentView === 'manifesto' && (
               <ManifestoModule state={state} updateState={updateState} />
            )}
            {state.currentView === 'code' && (
               <CodeExportModule state={state} updateState={updateState} />
            )}
            {state.currentView === 'info' && (
               <InfoModule state={state} updateState={updateState} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

