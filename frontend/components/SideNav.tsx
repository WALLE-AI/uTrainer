/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { Icon, ICONS } from './shared';

export const SideNav = ({ activeView, setActiveView }) => {
    const navItems = [
        { name: '看板', icon: 'dashboard' },
        { name: '数据平台', icon: 'data' },
        { name: '训练', icon: 'training' },
        { name: '推理与部署', icon: 'inference' },
        { name: '模型 Benchmark', icon: 'beaker' },
        { name: '可观测性', icon: 'observability' },
    ];

    return (
        <aside className="w-64 flex-shrink-0 bg-white/80 border-r border-gray-200 flex flex-col backdrop-blur-lg">
            <div className="h-16 flex items-center justify-center text-xl font-bold border-b border-gray-200 text-gray-800">
                训推一体化平台
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2">
                {navItems.map(item => {
                    const isDataPlatform = item.name === '数据平台';
                    const isActive = activeView === item.name || (isDataPlatform && (activeView === '数据中心' || activeView === '数据构建工作室'));

                    return (
                        <div key={item.name} className="space-y-1">
                            <a
                                href="#"
                                onClick={(e) => { e.preventDefault(); setActiveView(item.name); }}
                                className={`flex items-center px-4 py-2.5 text-sm font-black rounded-xl transition-all duration-300 group ${isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <div className={`p-1.5 rounded-lg mr-3 transition-colors ${isActive ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-indigo-50 group-hover:text-indigo-600'}`}>
                                    <Icon path={ICONS[item.icon]} className="w-4 h-4" />
                                </div>
                                <span className="flex-1 tracking-tight">{item.name}</span>
                                {isDataPlatform && (
                                    <Icon path={ICONS.arrowLeft} className={`w-3 h-3 transition-transform duration-500 ${isActive ? '-rotate-90' : 'rotate-180'} ${isActive ? 'text-white/50' : 'text-gray-300'}`} />
                                )}
                            </a>

                            {isDataPlatform && isActive && (
                                <div className="ml-7 mt-1 border-l-2 border-indigo-100 pl-4 space-y-1 animate-slide-in-right relative">
                                    <button
                                        onClick={() => setActiveView('数据中心')}
                                        className={`w-full text-left px-3 py-2 text-xs font-bold rounded-xl transition-all relative ${activeView === '数据中心' ? 'text-indigo-600 bg-indigo-50/80 shadow-sm' : 'text-gray-400 hover:text-gray-800 hover:bg-gray-50'}`}
                                    >
                                        {activeView === '数据中心' && (
                                            <div className="absolute left-[-18px] top-1/2 -translate-y-1/2 w-2 h-2 bg-indigo-600 rounded-full shadow-[0_0_8px_rgba(79,70,229,0.5)]"></div>
                                        )}
                                        数据中心
                                    </button>
                                    <button
                                        onClick={() => setActiveView('数据构建工作室')}
                                        className={`w-full text-left px-3 py-2 text-xs font-bold rounded-xl transition-all relative ${activeView === '数据构建工作室' ? 'text-indigo-600 bg-indigo-50/80 shadow-sm' : 'text-gray-400 hover:text-gray-800 hover:bg-gray-50'}`}
                                    >
                                        {activeView === '数据构建工作室' && (
                                            <div className="absolute left-[-18px] top-1/2 -translate-y-1/2 w-2 h-2 bg-indigo-600 rounded-full shadow-[0_0_8px_rgba(79,70,229,0.5)]"></div>
                                        )}
                                        数据构建工作室
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>
        </aside>
    );
};