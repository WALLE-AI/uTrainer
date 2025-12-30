/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { ResponsiveContainer, LineChart, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line, Bar } from 'recharts';
// FIX: KpiCard and MetricChart were incorrectly imported from './shared'. They have their own component files and are now imported from their respective paths.
import { Icon, ICONS, SelectField, InputField } from './shared';
import { KpiCard } from './KpiCard';
import { MetricChart } from './MetricChart';
import { mockTrainingJobs, mockAlerts, mockSystemMetrics, mockLogs } from '../api/mockData';
import { InferenceObservability } from './Observability';
import { TrainingJobDetail } from './TrainingJobDetail';

const { useState, useMemo } = React;

// FIX: Added explicit types for TabButton component props. This resolves an error where TypeScript couldn't assign the 'key' prop during list rendering because the component's props were implicitly typed.
const TabButton: React.FC<{ name: string, activeTab: string, setActiveTab: (name: string) => void, icon: string }> = ({ name, activeTab, setActiveTab, icon }) => (
    <button
        onClick={() => setActiveTab(name)}
        className={`flex items-center whitespace-nowrap py-4 px-3 border-b-2 font-medium text-sm transition-colors
            ${activeTab === name
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
    >
        <Icon path={icon} className="w-5 h-5 mr-2" />
        {name}
    </button>
);

const OverviewDashboard = () => {
    const alertColors = { Critical: 'bg-red-100 text-red-800', Warning: 'bg-yellow-100 text-yellow-800', Info: 'bg-blue-100 text-blue-800' };
    const kpis = [
        { title: '训练中任务', value: mockTrainingJobs.filter(j => j.status === 'Running').length, icon: ICONS.training, iconBgColor: 'bg-blue-500' },
        { title: '健康部署', value: '2 / 3', icon: ICONS.inference, iconBgColor: 'bg-green-500' },
        { title: '平台 GPU 利用率', value: '82%', icon: ICONS.dashboard, iconBgColor: 'bg-purple-500' },
        { title: '告警 (24h)', value: mockAlerts.length, icon: ICONS.bell, iconBgColor: 'bg-red-500' },
    ];
    const combinedData = [
        { name: '10:00', training: 18200, inference: 8500 },
        { name: '11:00', training: 19500, inference: 9200 },
        { name: '12:00', training: 17800, inference: 8800 },
        { name: '13:00', training: 21000, inference: 10500 },
        { name: '14:00', training: 22500, inference: 11200 },
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpis.map(kpi => <KpiCard key={kpi.title} {...kpi} />)}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200">
                    <h2 className="font-semibold text-gray-800 mb-4">平台流量总览 (Tokens/s)</h2>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={combinedData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" fontSize={12} />
                                <YAxis fontSize={12} />
                                <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '0.75rem', border: '1px solid #e5e7eb' }} />
                                <Legend wrapperStyle={{ fontSize: '14px', paddingTop: '10px' }} />
                                <Bar dataKey="training" name="训练吞吐" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="inference" name="推理吞吐" fill="#84cc16" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <h2 className="font-semibold text-gray-800 mb-4">最近告警</h2>
                    <div className="space-y-3">
                        {mockAlerts.slice(0, 4).map(alert => (
                            <div key={alert.id} className="flex items-start gap-3">
                                <span className={`flex-shrink-0 mt-1 w-2 h-2 rounded-full ${alertColors[alert.severity].split(' ')[0]}`}></span>
                                <div>
                                    <p className="text-sm font-medium text-gray-700">{alert.source}: {alert.entity}</p>
                                    <p className="text-xs text-gray-500">{alert.message}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const TrainingObservability = () => {
    const [selectedJobId, setSelectedJobId] = useState(mockTrainingJobs.find(j => j.status === 'Running')?.id);
    const selectedJob = mockTrainingJobs.find(job => job.id === selectedJobId);

    if (!selectedJob) {
        return <div className="text-center py-10 text-gray-500">请选择一个训练任务以查看详情。</div>;
    }

    // A simplified detail view. For a full view, we could reuse TrainingJobDetail.
    return (
        <div className="space-y-6">
             <div className="max-w-xs">
                <SelectField
                    label="选择训练任务"
                    options={mockTrainingJobs.map(j => j.id)}
                    value={selectedJobId}
                    onChange={(e) => setSelectedJobId(e.target.value)}
                />
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h2 className="font-semibold text-gray-800 mb-4">实验追踪 (SwanLab / W&amp;B)</h2>
                <div className="bg-gray-800 text-white p-4 rounded-lg font-mono text-sm h-48 flex items-center justify-center">
                    <p className="text-gray-400">在此处嵌入 SwanLab 面板...</p>
                </div>
            </div>
            <TrainingJobDetail job={selectedJob} onBack={() => {}} />
        </div>
    );
}

const SystemMonitoring = () => {
    const metrics = mockSystemMetrics(20);
    return (
         <div className="space-y-6">
            <div className="bg-white p-4 rounded-xl border border-gray-200 flex items-center justify-between">
                <h2 className="font-semibold text-gray-800">系统监控 (Grafana 面板)</h2>
                <div className="flex items-center gap-2">
                    <SelectField label="" options={['Last 1 hour', 'Last 6 hours', 'Last 24 hours']} />
                    <SelectField label="" options={['Project: All', 'Project: FinanceRL', 'Project: MedicalChat']} />
                    <SelectField label="" options={['Instance: All', 'job-001-worker-0', 'qwen-7b-deployment-a']} />
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <MetricChart title="GPU Utilization (%)" data={metrics} xKey="time" yKey="gpu_util" yUnit="%" stroke="#3b82f6" />
                 <MetricChart title="GPU Memory Usage (%)" data={metrics} xKey="time" yKey="gpu_mem" yUnit="%" stroke="#84cc16" />
                 <MetricChart title="CPU Utilization (%)" data={metrics} xKey="time" yKey="cpu_util" yUnit="%" stroke="#f97316" />
                 <MetricChart title="Network I/O (MB/s)" data={metrics} xKey="time" yKey="net_io" yUnit="MB/s" stroke="#a855f7" />
            </div>
        </div>
    );
};

const LogCenter = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const logLevels = { INFO: 'bg-blue-100 text-blue-800', WARN: 'bg-yellow-100 text-yellow-800', ERROR: 'bg-red-100 text-red-800' };

    const filteredLogs = useMemo(() => {
        return mockLogs.filter(log => log.message.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [searchTerm]);

    return (
        <div className="space-y-4">
             <div className="flex items-center gap-4">
                <div className="flex-grow relative">
                    <Icon path={ICONS.search} className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                    <input 
                        type="text" 
                        placeholder="搜索日志..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-white border border-gray-300 rounded-md pl-10 pr-4 py-2 text-sm w-full focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                </div>
                 <SelectField label="" options={['Source: All', 'Training', 'Inference', 'System', 'Data']} />
                 <SelectField label="" options={['Last 15 minutes', 'Last hour', 'Last 24 hours']} />
            </div>
             <div className="bg-white p-2 rounded-xl border border-gray-200 h-[65vh] overflow-y-auto">
                <table className="w-full text-sm font-mono">
                    <tbody>
                        {filteredLogs.map(log => (
                             <tr key={log.id} className="hover:bg-gray-50">
                                <td className="p-2 text-gray-400 whitespace-nowrap">{log.time}</td>
                                <td className="p-2 whitespace-nowrap">
                                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${logLevels[log.level]}`}>{log.level}</span>
                                </td>
                                <td className="p-2 text-purple-600 whitespace-nowrap">[{log.source}]</td>
                                <td className="p-2 text-gray-700 w-full">{log.message}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


export const ObservabilityPlatform = () => {
    const tabs = ['概览', '训练观测', '推理观测', '系统监控', '日志中心'];
    const tabIcons = {
        '概览': ICONS.dashboard,
        '训练观测': ICONS.training,
        '推理观测': ICONS.inference,
        '系统监控': ICONS.chartBar,
        '日志中心': ICONS.tasks,
    };

    const [activeTab, setActiveTab] = useState(tabs[0]);

    const renderContent = () => {
        switch (activeTab) {
            case '概览': return <OverviewDashboard />;
            case '训练观测': return <TrainingObservability />;
            case '推理观测': return <InferenceObservability />;
            case '系统监控': return <SystemMonitoring />;
            case '日志中心': return <LogCenter />;
            default: return null;
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">统一可观测性平台</h1>
                <p className="mt-2 text-gray-600">统一监控、追踪与分析训练、推理与系统日志。</p>
            </div>

            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-2" aria-label="Tabs">
                    {tabs.map(tab => (
                       <TabButton key={tab} name={tab} icon={tabIcons[tab]} activeTab={activeTab} setActiveTab={setActiveTab} />
                    ))}
                </nav>
            </div>
            
            <div className="pt-4">
                {renderContent()}
            </div>
        </div>
    );
};