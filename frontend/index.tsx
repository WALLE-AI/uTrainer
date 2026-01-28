/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import ReactDOM from 'react-dom/client';

import { SideNav } from './components/SideNav';
import { TopBar } from './components/TopBar';
import { Dashboard } from './components/Dashboard';
import { DataPlatform } from './components/DataPlatform';
import { InferenceDeployment } from './components/InferenceDeployment';
import { Training } from './components/Training';
import { ObservabilityPlatform } from './components/ObservabilityPlatform';
import { ModelBenchmark } from './components/ModelBenchmark';

const { useState } = React;

const App = () => {
    const [activeView, setActiveView] = useState('看板');
    const [navigationParams, setNavigationParams] = useState<any>(null);

    const handleNavigate = (view: string, params: any = null) => {
        setActiveView(view);
        setNavigationParams(params);
    };

    const renderContent = () => {
        switch (activeView) {
            case '看板':
                return <Dashboard onNavigate={handleNavigate} />;
            case '数据平台':
            case '数据中心':
                return <DataPlatform params={{ ...navigationParams, initialView: 'library' }} onNavigate={handleNavigate} />;
            case '数据构建工作室':
                return <DataPlatform params={{ ...navigationParams, initialView: 'lab' }} onNavigate={handleNavigate} />;
            case '训练':
                return <Training params={navigationParams} onNavigate={handleNavigate} />;
            case '推理与部署':
                return <InferenceDeployment />;
            case '模型 Benchmark':
                return <ModelBenchmark />;
            case '可观测性':
                return <ObservabilityPlatform />;
            default:
                return (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">敬请期待</h1>
                            <p className="text-gray-500">正在建设【{activeView}】页面。</p>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div
            className="flex h-screen bg-gray-100 text-gray-800 font-sans"
        >
            <SideNav activeView={activeView} setActiveView={(view: string) => handleNavigate(view)} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <TopBar />
                <main className="flex-1 overflow-y-auto p-8">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

// --- Mount App ---
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<React.StrictMode><App /></React.StrictMode>);