/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { Icon, ICONS } from './shared';
import { mockDeployments } from '../api/mockData';
const { useState } = React;

export const Playground = () => {
    const [params, setParams] = useState({ temp: 0.7, topP: 0.9, maxTokens: 1024 });
    const prompts = ["写一首关于夏天的诗", "解释什么是黑洞", "用 Python 写一个快排", "给我讲个冷笑话"];

    const ParameterSlider = ({ label, value, min, max, step, onChange }) => (
        <div>
            <div className="flex justify-between text-sm mb-1">
                <label className="font-medium text-gray-700">{label}</label>
                <span className="text-gray-500">{value}</span>
            </div>
            <input type="range" min={min} max={max} step={step} value={value} onChange={onChange} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"/>
        </div>
    );
    
    const ChatPanel = ({ deployment }) => (
        <div className="flex flex-col bg-white border border-gray-200 rounded-xl h-[60vh]">
            <div className="p-3 border-b border-gray-200">
                <p className="text-sm font-semibold text-gray-800 text-center">{deployment.name}</p>
            </div>
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                {/* Chat messages would go here */}
                 <div className="text-center text-gray-400 text-sm pt-20">对话记录为空</div>
            </div>
            <div className="p-3 border-t border-gray-200 bg-white">
                <div className="relative">
                    <input type="text" placeholder={`与 ${deployment.model.split('/')[1]} 对话...`} className="w-full bg-gray-100 border-gray-300 rounded-lg pl-4 pr-12 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"/>
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-500 hover:text-indigo-600 rounded-full hover:bg-gray-200">
                        <Icon path={ICONS.play} className="w-5 h-5 transform rotate-90"/>
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="grid grid-cols-12 gap-6">
            <div className="col-span-3 space-y-6">
                <div className="bg-white p-5 rounded-xl border border-gray-200">
                    <h3 className="font-semibold text-gray-800 mb-4">模型参数</h3>
                    <div className="space-y-4">
                        <ParameterSlider label="Temperature" value={params.temp} min={0} max={1} step={0.1} onChange={(e) => setParams({...params, temp: parseFloat(e.target.value)})} />
                        <ParameterSlider label="Top-P" value={params.topP} min={0} max={1} step={0.1} onChange={(e) => setParams({...params, topP: parseFloat(e.target.value)})} />
                        <div>
                             <div className="flex justify-between text-sm mb-1">
                                <label className="font-medium text-gray-700">Max Tokens</label>
                                <span className="text-gray-500">{params.maxTokens}</span>
                            </div>
                            <input type="number" value={params.maxTokens} onChange={(e) => setParams({...params, maxTokens: parseInt(e.target.value, 10) || 0})} className="w-full bg-gray-50 border-gray-300 rounded-md p-2 text-sm"/>
                        </div>
                    </div>
                </div>
                 <div className="bg-white p-5 rounded-xl border border-gray-200">
                    <h3 className="font-semibold text-gray-800 mb-4">Prompt 收藏</h3>
                     <div className="space-y-2">
                         {prompts.map(p => (
                             <button key={p} className="w-full text-left text-sm text-gray-600 p-2 rounded-md hover:bg-gray-100 truncate">{p}</button>
                         ))}
                     </div>
                </div>
            </div>
            <div className="col-span-9 grid grid-cols-2 gap-6">
                <ChatPanel deployment={mockDeployments[0]} />
                <ChatPanel deployment={mockDeployments[1]} />
            </div>
        </div>
    );
};
