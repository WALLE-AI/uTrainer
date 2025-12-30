/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { Icon, ICONS } from './shared';
import { mockTrainingJobs } from '../api/mockData';
import { TrainingJobCard } from './TrainingJobCard';
import { NewTrainingWizard } from './NewTrainingWizard';
import { TrainingJobDetail } from './TrainingJobDetail';

const { useState } = React;

export const Training = () => {
    const [activeFilter, setActiveFilter] = useState('All');
    const [isCreating, setIsCreating] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const filters = ['All', 'Running', 'Completed', 'Failed', 'Pending'];
    
    const filteredJobs = mockTrainingJobs.filter(job => {
        if (activeFilter === 'All') return true;
        return job.status === activeFilter;
    });

    if (selectedJob) {
        return <TrainingJobDetail job={selectedJob} onBack={() => setSelectedJob(null)} />;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">训练任务</h1>
                <p className="mt-2 text-gray-600">管理、监控和分析您的模型训练任务。</p>
            </div>
            
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                     <div className="relative">
                        <Icon path={ICONS.search} className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                        <input type="text" placeholder="搜索训练任务..." className="bg-gray-50 border border-gray-300 rounded-md pl-10 pr-4 py-2 text-sm w-64 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-800"/>
                    </div>
                </div>
                 <button 
                    onClick={() => setIsCreating(true)}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg text-sm shadow-md transition-all duration-200"
                >
                    <Icon path={ICONS.plus} className="w-4 h-4" />
                    创建训练
                </button>
            </div>

            <div className="flex items-center space-x-2 border-b border-gray-200 pb-2">
                <span className="text-sm font-medium text-gray-600">状态:</span>
                {filters.map(filter => (
                    <button 
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
                            activeFilter === filter ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:bg-gray-100'
                        }`}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredJobs.map(job => (
                   <TrainingJobCard key={job.id} job={job} onSelect={() => setSelectedJob(job)} />
                ))}
                 {filteredJobs.length === 0 && (
                    <div className="col-span-full text-center py-12 text-gray-500">
                        <Icon path={ICONS.observability} className="w-12 h-12 mx-auto text-gray-300" />
                        <h3 className="mt-2 text-lg font-medium">没有找到训练任务</h3>
                        <p className="mt-1 text-sm">尝试更改筛选条件或创建一个新的训练任务。</p>
                    </div>
                )}
            </div>
            <NewTrainingWizard isOpen={isCreating} onClose={() => setIsCreating(false)} />
        </div>
    );
};