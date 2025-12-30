/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts';
import { Icon, ICONS, SelectField, InputField } from './shared';

const { useState, useMemo } = React;

const benchmarkData = [
  { name: 'GPT-4o', org: 'OpenAI', type: '闭源', mmlu: 88.7, mt_bench: 9.55, humaneval: 90.2, gsm8k: 97.4, vbench_score: 1.35 },
  { name: 'Qwen2-72B-Instruct', org: 'Alibaba', type: '开源', mmlu: 82.5, mt_bench: 9.35, humaneval: 88.2, gsm8k: 91.6, vbench_score: 1.21 },
  { name: 'Llama3-70B-Instruct', org: 'Meta', type: '开源', mmlu: 82.0, mt_bench: 9.32, humaneval: 85.1, gsm8k: 94.1, vbench_score: 1.15 },
  { name: 'Gemini-1.5-Pro', org: 'Google', type: '闭源', mmlu: 85.9, mt_bench: 9.30, humaneval: 84.3, gsm8k: 95.5, vbench_score: 1.42 },
  { name: 'Claude-3-Opus', org: 'Anthropic', type: '闭源', mmlu: 86.8, mt_bench: 9.40, humaneval: 84.9, gsm8k: 95.0, vbench_score: 1.31 },
  { name: 'Yi-1.5-34B-Chat', org: '01.AI', type: '开源', mmlu: 78.1, mt_bench: 9.05, humaneval: 79.4, gsm8k: 88.5, vbench_score: 1.12 },
  { name: 'Mixtral-8x22B-Instruct', org: 'Mistral', type: '开源', mmlu: 79.5, mt_bench: 9.21, humaneval: 77.8, gsm8k: 93.4, vbench_score: 1.08 },
];

const benchmarkMapping = {
    'MMLU (综合知识)': 'mmlu',
    'MT-Bench (对话)': 'mt_bench',
    'HumanEval (代码)': 'humaneval',
    'GSM8K (数学)': 'gsm8k',
    'VBench (视频)': 'vbench_score',
};
const modelTypes = ['全部', '开源', '闭源'];

const BenchmarkChart = ({ data, dataKey, name }) => (
    <div className="bg-white p-6 rounded-xl border border-gray-200 h-[60vh]">
        <h2 className="font-semibold text-gray-800 mb-4">{name} - 模型性能对比</h2>
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
                <YAxis type="category" dataKey="name" width={150} tick={{ fontSize: 12 }} />
                <Tooltip
                    cursor={{ fill: 'rgba(243, 244, 246, 0.5)' }}
                    contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        borderRadius: '0.75rem',
                        border: '1px solid #e5e7eb',
                    }}
                />
                <Legend wrapperStyle={{ fontSize: '14px', paddingTop: '10px' }} />
                <Bar dataKey={dataKey} name="得分" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
            </BarChart>
        </ResponsiveContainer>
    </div>
);

const LeaderboardTable = ({ data, dataKey }) => (
    <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h2 className="font-semibold text-gray-800 mb-4">排行榜详情</h2>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600">
                <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                    <tr>
                        <th className="p-3">排名</th>
                        <th className="p-3">模型名称</th>
                        <th className="p-3">机构</th>
                        <th className="p-3">类型</th>
                        <th className="p-3 text-right font-bold text-indigo-600">得分</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {data.map((model, index) => (
                        <tr key={model.name} className="hover:bg-gray-50">
                            <td className="p-3 font-medium text-gray-800">
                                <div className="flex items-center gap-2">
                                    {index < 3 ? <Icon path={ICONS.trophy} className={`w-5 h-5 ${['text-yellow-400', 'text-gray-400', 'text-yellow-600'][index]}`} /> : <span>{index + 1}</span>}
                                </div>
                            </td>
                            <td className="p-3 font-semibold text-gray-900">{model.name}</td>
                            <td className="p-3">{model.org}</td>
                            <td className="p-3">{model.type}</td>
                            <td className="p-3 text-right font-mono font-bold text-indigo-600">{model[dataKey]?.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

export const ModelBenchmark = () => {
    const [selectedBenchmark, setSelectedBenchmark] = useState(Object.keys(benchmarkMapping)[0]);
    const [selectedModelType, setSelectedModelType] = useState('全部');

    const displayedData = useMemo(() => {
        const dataKey = benchmarkMapping[selectedBenchmark];
        return benchmarkData
            .filter(d => selectedModelType === '全部' || d.type === selectedModelType)
            .sort((a, b) => b[dataKey] - a[dataKey]);
    }, [selectedBenchmark, selectedModelType]);
    
    const dataKey = benchmarkMapping[selectedBenchmark];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">模型 Benchmark</h1>
                <p className="mt-2 text-gray-600">可视化与比较 SOTA 模型的公开评测基准得分。</p>
            </div>
            
            <div className="bg-white p-4 rounded-xl border border-gray-200 flex items-center gap-4">
                <div className="flex-1">
                    <SelectField 
                        label="评测基准"
                        options={Object.keys(benchmarkMapping)}
                        value={selectedBenchmark}
                        onChange={(e) => setSelectedBenchmark(e.target.value)}
                    />
                </div>
                <div className="flex-1">
                    <SelectField 
                        label="模型类型"
                        options={modelTypes}
                        value={selectedModelType}
                        onChange={(e) => setSelectedModelType(e.target.value)}
                    />
                </div>
                <div className="flex-1">
                    <InputField label="搜索模型" placeholder="例如: Llama3, Qwen2..." />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <BenchmarkChart data={displayedData} dataKey={dataKey} name={selectedBenchmark} />
                <LeaderboardTable data={displayedData} dataKey={dataKey} />
            </div>
        </div>
    );
};
