/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { ResponsiveContainer, LineChart, Line } from 'recharts';
import { Icon, ICONS, Tag } from './shared';

const statusStyles = {
    Running: { color: 'bg-blue-100 text-blue-800' },
    Completed: { color: 'bg-green-100 text-green-800' },
    Failed: { color: 'bg-red-100 text-red-800' },
    Pending: { color: 'bg-yellow-100 text-yellow-800' },
};

const Metric = ({ icon, label, value }) => (
    <div className="flex items-center gap-2 text-sm">
        <Icon path={icon} className="w-4 h-4 text-gray-400" />
        <div>
            <p className="text-xs text-gray-500">{label}</p>
            <p className="font-medium text-gray-800">{value}</p>
        </div>
    </div>
);

const Sparkline = ({ data, dataKey, stroke }) => (
    <div className="w-full h-10">
        <ResponsiveContainer>
            <LineChart data={data}>
                <Line type="monotone" dataKey={dataKey} stroke={stroke} strokeWidth={2} dot={false} />
            </LineChart>
        </ResponsiveContainer>
    </div>
);

// Fix: Use React.FC to correctly type the component for use in lists with a 'key' prop.
export const TrainingJobCard: React.FC<{ job: any; onSelect: () => void; }> = ({ job, onSelect }) => {
    const status = statusStyles[job.status] || { color: 'bg-gray-100 text-gray-800' };

    return (
        <div 
            onClick={onSelect}
            className="bg-white border border-gray-200 rounded-xl shadow-sm transition-all duration-300 hover:shadow-lg hover:border-indigo-500 transform hover:-translate-y-1 cursor-pointer group flex flex-col"
        >
            <header className="p-4 border-b border-gray-200 flex justify-between items-start">
                <div>
                    <h3 className="font-bold text-lg text-gray-800 group-hover:text-indigo-600 truncate max-w-[200px]">{job.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">Created on {job.createdAt}</p>
                </div>
                <Tag text={job.status} color={status.color} />
            </header>
            <main className="p-4 space-y-4 flex-1">
                <div className="text-sm space-y-2">
                    <div className="flex items-center gap-2">
                        <Icon path={ICONS.cog} className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-500">Base Model:</span>
                        <span className="font-medium text-gray-800 truncate">{job.baseModel}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Icon path={ICONS.data} className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-500">Dataset:</span>
                        <span className="font-medium text-gray-800 truncate">{job.dataset}</span>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-2 border-t border-gray-100">
                    <Metric icon={ICONS.inference} label="GPUs" value={job.gpus} />
                    <Metric icon={ICONS.clock} label="Duration" value={job.duration} />
                </div>
                 {job.history && job.history.length > 0 && (
                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                        <div>
                             <div className="flex items-center gap-2 text-sm">
                                <Icon path={ICONS.chartBar} className="w-4 h-4 text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-500">Loss</p>
                                    <p className="font-medium text-gray-800">{job.loss}</p>
                                </div>
                            </div>
                            <Sparkline data={job.history} dataKey="loss" stroke="#ef4444" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 text-sm">
                                <Icon path={ICONS.dashboard} className="w-4 h-4 text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-500">Tokens/s</p>
                                    <p className="font-medium text-gray-800">{job.throughput.replace(' tokens/s', '')}</p>
                                </div>
                            </div>
                            <Sparkline data={job.history} dataKey="throughput" stroke="#3b82f6" />
                        </div>
                    </div>
                )}
            </main>
            <footer className="p-3 bg-gray-50/70 border-t border-gray-200 flex justify-end items-center text-xs gap-2">
                <button onClick={(e) => { e.stopPropagation(); alert('Viewing logs...'); }} className="text-sm font-semibold text-gray-600 px-3 py-1 rounded-md hover:bg-gray-200">View Logs</button>
                <button onClick={(e) => { e.stopPropagation(); alert('Stopping job...'); }} className="text-sm font-semibold text-gray-600 px-3 py-1 rounded-md hover:bg-gray-200">Stop</button>
            </footer>
        </div>
    );
};