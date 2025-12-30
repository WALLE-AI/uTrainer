/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts';
import { KpiCard } from './KpiCard';
import { ICONS } from './shared';

export const Dashboard = () => {
    const kpis = [
        { title: '总 Tokens (7d)', value: '1.2B', icon: ICONS.data, iconBgColor: 'bg-blue-500' },
        { title: '训练队列', value: '3 / 10', icon: ICONS.training, iconBgColor: 'bg-green-500' },
        { title: '部署 P95 延迟', value: '128ms', icon: ICONS.inference, iconBgColor: 'bg-purple-500' },
        { title: 'GPU 资源', value: '75% 在用', icon: ICONS.observability, iconBgColor: 'bg-yellow-500' },
        { title: '成本估算 (7d)', value: '¥ 8,192', icon: ICONS.dashboard, iconBgColor: 'bg-red-500' },
    ];

    const trafficData = [
        { name: 'W25', data: 4200, training: 2500, deployment: 1900 },
        { name: 'W26', data: 3800, training: 2100, deployment: 1650 },
        { name: 'W27', data: 5100, training: 3200, deployment: 2400 },
        { name: 'W28', data: 4500, training: 2800, deployment: 2100 },
        { name: 'W29', data: 4800, training: 3000, deployment: 2300 },
        { name: 'W30', data: 3900, training: 2200, deployment: 1700 },
    ];

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-900">看板</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {kpis.map(kpi => <KpiCard key={kpi.title} {...kpi} />)}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 backdrop-blur-sm">
                    <h2 className="font-semibold text-gray-800 mb-4">流量总览 (数据 → 训练 → 部署)</h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={trafficData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={{ stroke: '#d1d5db' }} />
                                <YAxis fontSize={12} tickLine={false} axisLine={false} unit="k" tickFormatter={(value) => `${value / 1000}`} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(243, 244, 246, 0.5)' }}
                                    contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                    backdropFilter: 'blur(4px)',
                                    borderRadius: '0.75rem',
                                    border: '1px solid #e5e7eb',
                                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                                    }}
                                />
                                <Legend iconSize={10} wrapperStyle={{ fontSize: '14px', paddingTop: '10px' }}/>
                                <Bar dataKey="data" name="数据" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="training" name="训练" fill="#84cc16" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="deployment" name="部署" fill="#a855f7" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-4 backdrop-blur-sm">
                    <h2 className="font-semibold text-gray-800">快捷操作</h2>
                    <button className="w-full text-left bg-gray-100 hover:bg-gray-200 p-3 rounded-lg transition-colors text-gray-700">新建数据集</button>
                    <button className="w-full text-left bg-gray-100 hover:bg-gray-200 p-3 rounded-lg transition-colors text-gray-700">创建训练</button>
                    <button className="w-full text-left bg-gray-100 hover:bg-gray-200 p-3 rounded-lg transition-colors text-gray-700">创建服务</button>
                    <button className="w-full text-left bg-gray-100 hover:bg-gray-200 p-3 rounded-lg transition-colors text-gray-700">打开 A/B 调试台</button>
                </div>
            </div>
        </div>
    );
};
