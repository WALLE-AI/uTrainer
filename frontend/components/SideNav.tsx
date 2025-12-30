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
                {navItems.map(item => (
                    <a
                        key={item.name}
                        href="#"
                        onClick={(e) => { e.preventDefault(); setActiveView(item.name); }}
                        className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${activeView === item.name ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                            }`}
                    >
                        <Icon path={ICONS[item.icon]} className="w-5 h-5 mr-3" />
                        {item.name}
                    </a>
                ))}
            </nav>
        </aside>
    );
};