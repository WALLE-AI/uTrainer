/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';
import { Icon, ICONS, Tag, tagColors, statusColors } from './shared';

export const DatasetDetail = ({ dataset, onBack, onUpdate, onStartPreprocessing }) => {
    const qualityData = [{ name: 'quality', value: dataset.quality }];

    const handleRemoveTag = (tagToRemove) => {
        const newTags = dataset.tags.filter(tag => tag !== tagToRemove);
        onUpdate({ ...dataset, tags: newTags });
    };

    const handleTagKeyDown = (e) => {
        if (e.key === 'Enter' && e.target.value) {
            e.preventDefault();
            const newTag = e.target.value.trim();
            if (newTag && !dataset.tags.includes(newTag)) {
                const newTags = [...dataset.tags, newTag];
                onUpdate({ ...dataset, tags: newTags });
            }
            e.target.value = '';
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <button onClick={onBack} className="flex items-center space-x-2 text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors mb-4">
                    <Icon path={ICONS.arrowLeft} className="w-4 h-4"/>
                    <span>返回数据集列表</span>
                </button>
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">{dataset.name}</h1>
                    <button 
                        onClick={() => onStartPreprocessing(dataset)}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg text-sm shadow-md transition-all duration-200"
                    >
                        <Icon path={ICONS.pipeline} className="w-4 h-4" />
                        预处理数据
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-5 rounded-xl border border-gray-200">
                    <p className="text-sm text-gray-500">版本</p>
                    <p className="text-xl font-bold mt-1 text-gray-800">{dataset.version}</p>
                </div>
                 <div className="bg-white p-5 rounded-xl border border-gray-200">
                    <p className="text-sm text-gray-500">样本/大小</p>
                    <p className="text-xl font-bold mt-1 text-gray-800">{dataset.samples} / {dataset.size}</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-gray-200">
                    <p className="text-sm text-gray-500">状态</p>
                    <p className="mt-2"><Tag color={statusColors[dataset.status]} text={dataset.status}/></p>
                </div>
                 <div className="bg-white p-5 rounded-xl border border-gray-200">
                    <p className="text-sm text-gray-500">创建者</p>
                    <p className="text-xl font-bold mt-1 text-gray-800">{dataset.creator}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 backdrop-blur-sm">
                    <h2 className="font-semibold text-gray-800 mb-2">描述</h2>
                    <p className="text-gray-600 leading-relaxed">这是一个关于 {dataset.name} 的详细描述。该数据集主要用于 {dataset.tags.join(', ')} 任务。Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                     <h2 className="font-semibold text-gray-800 mt-6 mb-2">标签</h2>
                     <div className="flex flex-wrap items-center gap-2 p-2 rounded-lg border border-gray-200 bg-gray-50/50">
                        {dataset.tags.map(tag => (
                            <span key={tag} className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800">
                                {tag}
                                <button onClick={() => handleRemoveTag(tag)} className="text-indigo-600 hover:text-indigo-900 focus:outline-none" aria-label={`Remove ${tag} tag`}>
                                    <Icon path={ICONS.close} className="w-3 h-3"/>
                                </button>
                            </span>
                        ))}
                        <input
                            type="text"
                            placeholder="添加标签..."
                            onKeyDown={handleTagKeyDown}
                            className="bg-transparent outline-none text-sm p-1 flex-1 min-w-[100px]"
                            aria-label="Add new tag"
                        />
                    </div>
                </div>
                 <div className="bg-white p-6 rounded-xl border border-gray-200 flex flex-col items-center justify-center">
                    <h2 className="font-semibold text-gray-800 mb-2">质量分</h2>
                     <ResponsiveContainer width="100%" height={160}>
                        <RadialBarChart 
                            innerRadius="70%" 
                            outerRadius="90%" 
                            data={qualityData} 
                            startAngle={90} 
                            endAngle={-270}
                        >
                            <PolarAngleAxis
                                type="number"
                                domain={[0, 100]}
                                angleAxisId={0}
                                tick={false}
                            />
                            <RadialBar 
                                background 
                                clockWise 
                                dataKey='value' 
                                cornerRadius={10} 
                                fill="#3b82f6" 
                            />
                             <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-3xl font-bold fill-gray-800">
                                {dataset.quality}
                            </text>
                            <text x="50%" y="65%" textAnchor="middle" dominantBaseline="middle" className="text-sm fill-gray-500">
                                / 100
                            </text>
                        </RadialBarChart>
                    </ResponsiveContainer>
                </div>
            </div>
             <div className="bg-white p-6 rounded-xl border border-gray-200 backdrop-blur-sm">
                <h2 className="font-semibold text-gray-800 mb-4">数据预览</h2>
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-600">
                        <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                            <tr>
                                <th className="p-3">Instruction</th>
                                <th className="p-3">Input</th>
                                <th className="p-3">Output</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b"><td className="p-3">"天空为什么是蓝色的？"</td><td className="p-3">""</td><td className="p-3">"因为瑞利散射..."</td></tr>
                             <tr className="border-b"><td className="p-3">"写一首关于春天的诗"</td><td className="p-3">""</td><td className="p-3">"春风拂面绿意浓..."</td></tr>
                             <tr><td className="p-3">"如何制作巧克力蛋糕？"</td><td className="p-3">""</td><td className="p-3">"首先，你需要准备..."</td></tr>
                        </tbody>
                    </table>
                 </div>
            </div>
        </div>
    );
};