/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { EnginesAndInstances } from './EnginesAndInstances';
import { Playground } from './Playground';
import { InferenceObservability } from './Observability';
import { NewDeploymentModal } from './NewDeploymentModal';
import { Icon, ICONS } from './shared';

const { useState } = React;

export const InferenceDeployment = () => {
    const tabs = ['引擎与实例', '调试台', '可观测性'];
    const tabIcons = {
        '引擎与实例': ICONS.cog,
        '调试台': ICONS.chatBubble,
        '可观测性': ICONS.chartBar,
    };
    const [activeTab, setActiveTab] = useState(tabs[0]);
    const [isCreating, setIsCreating] = useState(false);

    const renderTabContent = () => {
        switch (activeTab) {
            case '引擎与实例':
                return <EnginesAndInstances openCreationModal={() => setIsCreating(true)} />;
            case '调试台':
                return <Playground />;
            case '可观测性':
                return <InferenceObservability />;
            default:
                return null;
        }
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">推理与部署</h1>
            
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex items-center whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                                ${activeTab === tab 
                                    ? 'border-indigo-500 text-indigo-600' 
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            <Icon path={tabIcons[tab]} className="w-5 h-5 mr-2" />
                            {tab}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="pt-4">
                {renderTabContent()}
            </div>
            <NewDeploymentModal isOpen={isCreating} onClose={() => setIsCreating(false)} />
        </div>
    );
};