/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { Icon, ICONS, Tag, Toggle } from './shared';
const { useState } = React;


// Fix: Use React.FC to correctly type the component for use in lists with a 'key' prop.
export const ModelCard: React.FC<{ deployment: any }> = ({ deployment }) => {
    const [isOpen, setIsOpen] = useState(false);
    const statusClass = deployment.status === 'Healthy' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800';
    
    // Fix: Used React.FC to correctly type the component and its children prop.
    const DetailSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
        <div>
            <h4 className="font-semibold text-gray-600 mb-3">{title}</h4>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">{children}</div>
        </div>
    );
    // Fix: Add explicit prop types for DetailItem component using React.FC for consistency.
    const DetailItem: React.FC<{ label: React.ReactNode; value: React.ReactNode; }> = ({ label, value }) => (
        <div className="flex justify-between items-center">
            <span className="text-gray-500">{label}</span>
            <span className="font-medium text-gray-800">{value}</span>
        </div>
    );

    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm transition-all duration-300">
            <div className="p-4 cursor-pointer hover:bg-gray-50 rounded-t-xl" onClick={() => setIsOpen(!isOpen)}>
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center"><Icon path={ICONS.inference} className="w-6 h-6 text-indigo-600"/></div>
                        <div>
                            <h3 className="font-bold text-lg text-gray-800">{deployment.name}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                <Tag text={deployment.runtime} color="bg-gray-200 text-gray-700" />
                                <span className="truncate" title={deployment.model}>{deployment.model}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="text-right">
                             <p className="text-sm font-medium text-gray-800">{deployment.metrics.qps} QPS</p>
                             <p className="text-xs text-gray-500">P95: {deployment.metrics.p95}</p>
                        </div>
                        <Tag text={deployment.status} color={statusClass} />
                        <Icon path={isOpen ? ICONS.chevronUp : ICONS.chevronDown} className="w-5 h-5 text-gray-400" />
                    </div>
                </div>
            </div>
            {isOpen && (
                <div className="p-6 border-t border-gray-200 bg-gray-50/70 space-y-6">
                    <DetailSection title="实例参数">
                        <DetailItem label="运行时" value={deployment.runtime} />
                        <DetailItem label="并发上限" value={deployment.params.concurrency} />
                        <DetailItem label="批处理" value={deployment.params.batching} />
                        <DetailItem label="KV Cache" value={deployment.params.kvCache} />
                        <DetailItem label="Tensor Parallel" value={deployment.params.tensorParallel} />
                        <div className="flex justify-between items-center col-span-1">
                            <span className="text-gray-500">Speculative Decoding</span>
                            <Toggle enabled={deployment.params.speculativeDecoding} setEnabled={() => {}}/>
                        </div>
                    </DetailSection>
                     <DetailSection title="路由">
                        <DetailItem label="权重" value={`${deployment.routing.weight}%`} />
                        <DetailItem label="健康检查" value={deployment.routing.healthCheck} />
                        <DetailItem label="A/B/灰度" value={deployment.routing.abTest} />
                        <DetailItem label="限流" value={deployment.routing.rateLimit} />
                         <div className="flex justify-between items-center col-span-1">
                            <span className="text-gray-500">熔断与重试</span>
                            <Toggle enabled={deployment.routing.circuitBreaker} setEnabled={() => {}}/>
                        </div>
                    </DetailSection>
                    <div className="flex justify-end pt-4 gap-3">
                         <button className="text-sm font-semibold text-gray-600 bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50">删除</button>
                         <button className="text-sm font-semibold text-white bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-700">保存修改</button>
                    </div>
                </div>
            )}
        </div>
    );
};