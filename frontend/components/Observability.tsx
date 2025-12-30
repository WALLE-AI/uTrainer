/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts';
import { mockDeployments } from '../api/mockData';
import { Icon, ICONS } from './shared';
const { useState } = React;

const ReplayModal = ({ request, onClose }) => {
    if (!request) return null;
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
                <header className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900">请求回放</h2>
                    <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500"><Icon path={ICONS.close} className="w-5 h-5" /></button>
                </header>
                <main className="p-8 space-y-4">
                    <div>
                        <label className="text-sm font-semibold text-gray-500">时间</label>
                        <p className="mt-1 p-2 bg-gray-100 rounded-md font-mono text-sm">{request.time}</p>
                    </div>
                     <div>
                        <label className="text-sm font-semibold text-gray-500">错误详情</label>
                        <p className="mt-1 p-2 bg-red-50 text-red-800 rounded-md font-mono text-sm">{request.code}: {request.msg}</p>
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-gray-500">Prompt</label>
                        <div className="mt-1 p-3 bg-gray-100 rounded-md max-h-60 overflow-y-auto">
                            <p className="text-sm whitespace-pre-wrap">{request.prompt}</p>
                        </div>
                    </div>
                </main>
                 <footer className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
                    <button onClick={onClose} className="text-sm font-semibold text-gray-600 bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100">关闭</button>
                    <button onClick={() => alert('已导出为业务测试集！')} className="text-sm font-semibold text-white bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-700 shadow-sm">导出为测试集</button>
                </footer>
            </div>
        </div>
    );
};


export const InferenceObservability = () => {
    const [replayRequest, setReplayRequest] = useState(null);

    const perfData = [
        {time: '14:00', qps: 110, latency: 88},
        {time: '14:05', qps: 125, latency: 82},
        {time: '14:10', qps: 122, latency: 85},
        {time: '14:15', qps: 130, latency: 79},
        {time: '14:20', qps: 118, latency: 91},
        {time: '14:25', qps: 128, latency: 84},
    ];
    
    const errors = [
        { id: 1, time: '14:25:10', code: '503', msg: 'CUDA out of memory', prompt: '"请帮我总结一下这篇一万字的文章，并提取其中的关键观点、数据和结论。文章探讨了人工智能在未来十年对全球经济的潜在影响，分析了不同行业的变革，并对就业市场提出了预测。..."' },
        { id: 2, time: '14:22:05', code: '499', msg: 'Client closed request', prompt: '"写一个无限循环的故事"' },
        { id: 3, time: '14:18:40', code: '500', msg: 'Internal server error', prompt: '"解释一下爱因斯坦的相对论"' },
    ];
    
    const selectedDeployment = mockDeployments[0];
    
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-5 rounded-xl border border-gray-200">
                    <p className="text-sm text-gray-500">QPS (每秒查询)</p>
                    <p className="text-3xl font-bold mt-1 text-gray-800">{selectedDeployment.metrics.qps}</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-gray-200">
                    <p className="text-sm text-gray-500">P95 延迟</p>
                    <p className="text-3xl font-bold mt-1 text-gray-800">{selectedDeployment.metrics.p95}</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-gray-200">
                    <p className="text-sm text-gray-500">Token 吞吐</p>
                    <p className="text-3xl font-bold mt-1 text-gray-800">{selectedDeployment.metrics.throughput}</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-gray-200">
                    <p className="text-sm text-gray-500">错误率</p>
                    <p className="text-3xl font-bold mt-1 text-red-500">{selectedDeployment.metrics.errorRate}</p>
                </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-200">
                 <h2 className="font-semibold text-gray-800 mb-4">性能曲线 (QPS / 延迟)</h2>
                <div className="h-72">
                     <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={perfData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="time" fontSize={12} tickLine={false} />
                            <YAxis yAxisId="left" fontSize={12} tickLine={false} unit=" QPS" />
                            <YAxis yAxisId="right" orientation="right" fontSize={12} tickLine={false} unit="ms" />
                            <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '0.75rem', border: '1px solid #e5e7eb' }} />
                            <Legend wrapperStyle={{ fontSize: '14px', paddingTop: '10px' }} />
                            <Line yAxisId="left" type="monotone" dataKey="qps" name="QPS" stroke="#3b82f6" strokeWidth={2} />
                            <Line yAxisId="right" type="monotone" dataKey="latency" name="延迟" stroke="#84cc16" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
            
             <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h2 className="font-semibold text-gray-800 mb-4">Top 错误示例回放</h2>
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-600">
                        <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                            <tr>
                                <th className="p-3">时间</th>
                                <th className="p-3">错误码</th>
                                <th className="p-3">错误信息</th>
                                <th className="p-3">Prompt (截断)</th>
                                <th className="p-3 text-right">操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            {errors.map((e) => (
                                <tr key={e.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3 font-mono text-xs">{e.time}</td>
                                    <td className="p-3"><span className="bg-red-100 text-red-800 px-2 py-0.5 rounded-full font-semibold">{e.code}</span></td>
                                    <td className="p-3">{e.msg}</td>
                                    <td className="p-3 font-mono text-xs max-w-xs truncate">{e.prompt}</td>
                                    <td className="p-3 text-right">
                                        <button onClick={() => setReplayRequest(e)} className="text-indigo-600 hover:text-indigo-800 font-semibold">回放</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                 </div>
            </div>
            <ReplayModal request={replayRequest} onClose={() => setReplayRequest(null)} />
        </div>
    );
};