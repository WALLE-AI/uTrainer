/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { Icon, ICONS, SelectField, InputField } from './shared';
const { useState, useEffect } = React;

const processingSteps = [
    { name: '过滤', icon: ICONS.filter, description: '根据条件过滤行' },
    { name: '转换', icon: ICONS.transform, description: '修改数据格式或结构' },
    { name: '去重', icon: ICONS.deduplicate, description: '删除完全重复的样本' },
    { name: '翻译', icon: ICONS.translate, description: '将文本翻译成不同语言' },
    { name: '聚类', icon: ICONS.cluster, description: '根据相似性对数据进行分组' },
    { name: '增强', icon: ICONS.augment, description: '通过改写或生成来增加数据' },
    { name: '模型', icon: ICONS.inference, description: '使用大语言模型处理数据' },
];

const renderStepConfiguration = (step) => {
    if (!step) {
        return (
            <div className="flex items-center justify-center h-full text-center text-gray-500">
                <p>点击流水线中的步骤以进行配置</p>
            </div>
        );
    }

    const StepConfigWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
        <div className="space-y-4">
            <h3 className="font-bold text-gray-700">{step.name}</h3>
            <p className="text-sm text-gray-500">{step.description}</p>
            <div className="pt-4 border-t border-gray-200 space-y-4">
                {children}
            </div>
        </div>
    );

    switch (step.name) {
        case '过滤':
            return <StepConfigWrapper><InputField label="过滤条件" placeholder="e.g., length(text) > 100 AND lang == 'en'" description="使用类 SQL 语法进行过滤。"/></StepConfigWrapper>;
        case '转换':
            return <StepConfigWrapper><SelectField label="目标格式" options={['JSONL', 'Alpaca', 'ShareGPT']} description="选择数据转换的目标格式。"/></StepConfigWrapper>;
        case '去重':
             return <StepConfigWrapper><SelectField label="去重列" options={['全部列', 'instruction', 'output']} description="选择用于判断重复的列。"/></StepConfigWrapper>;
        case '翻译':
            return (
                <StepConfigWrapper>
                    <SelectField label="源语言" options={['自动检测', '中文 (zh)', '英文 (en)']} />
                    <SelectField label="目标语言" options={['英文 (en)', '中文 (zh)', '日文 (ja)', '法文 (fr)']} />
                </StepConfigWrapper>
            );
        case '聚类':
            return (
                <StepConfigWrapper>
                    <SelectField label="聚类算法" options={['K-Means', 'DBSCAN', 'Agglomerative']} />
                    <InputField label="特征列" placeholder="e.g., text_embedding" description="用于聚类的向量列。" />
                    <InputField label="聚类数量 (K)" type="number" placeholder="5" />
                </StepConfigWrapper>
            );
        case '增强':
            return <StepConfigWrapper><SelectField label="增强方法" options={['同义词替换', '回译', '随机插入']} /></StepConfigWrapper>;
        case '模型':
            return (
                <StepConfigWrapper>
                    <SelectField 
                        label="选择模型" 
                        options={['gemini-2.5-flash', 'qwen-72b-chat', 'llama3-70b-instruct']} 
                        description="选择一个模型来处理数据行。"
                    />
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">Prompt 模板</label>
                        <textarea 
                            // FIX: Changed the 'rows' prop on the textarea from a string to a number to match the expected type and resolve the TypeScript error.
                            rows={8} 
                            placeholder="例如：&#10;请根据以下输入，生成一个更详细的指令。&#10;&#10;输入：{column_name}&#10;输出："
                            className="w-full bg-gray-50 border border-gray-300 rounded-md p-2.5 text-sm font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-800"
                        />
                         <p className="mt-1 text-xs text-gray-500">使用 `{'{column_name}'}` 来引用数据列。</p>
                    </div>
                </StepConfigWrapper>
            );
        default:
            return <div className="text-center text-gray-500">暂无可用配置</div>;
    }
};

const Spinner = () => (
    <svg className="animate-spin h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const statusConfig = {
    pending: { icon: ICONS.clock, color: 'text-gray-500', label: '等待中' },
    running: { icon: null, color: 'text-indigo-600', label: '运行中' },
    completed: { icon: ICONS.shield, color: 'text-green-600', label: '完成' },
    failed: { icon: ICONS.close, color: 'text-red-600', label: '失败' },
};

const ProcessingProgressModal = ({ isOpen, pipeline, stepStatuses, progress, onClose, onRetry }) => {
    if (!isOpen) return null;

    const hasFailed = pipeline.some(step => stepStatuses[step.id]?.status === 'failed');
    const isComplete = !hasFailed && progress >= 100;

    let title = '正在运行流水线...';
    if (hasFailed) title = '流水线处理失败';
    if (isComplete) title = '流水线处理完成';

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
                <header className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                </header>
                <main className="p-8 space-y-6">
                    <div>
                        <div className="flex justify-between mb-1">
                            <span className="text-base font-medium text-indigo-700">总进度</span>
                            <span className="text-sm font-medium text-indigo-700">{Math.round(progress)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>
                    <div className="space-y-3 max-h-80 overflow-y-auto p-1">
                        {pipeline.map(step => {
                            const statusInfo = stepStatuses[step.id] || { status: 'pending' };
                            const status = statusInfo.status;
                            const error = statusInfo.error;
                            const config = statusConfig[status];
                            return (
                                <div key={step.id}>
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                                        <div className="flex items-center gap-3">
                                            <Icon path={step.icon} className="w-5 h-5 text-gray-600"/>
                                            <span className="font-medium text-gray-800">{step.name}</span>
                                        </div>
                                        <div className={`flex items-center gap-2 text-sm font-semibold ${config.color}`}>
                                            {status === 'running' ? <Spinner /> : <Icon path={config.icon} className="w-5 h-5"/>}
                                            {config.label}
                                        </div>
                                    </div>
                                    {status === 'failed' && error && (
                                        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex gap-2">
                                            <Icon path={ICONS.close} className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <span className="font-semibold">错误:</span> {error}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </main>
                <footer className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
                    {hasFailed ? (
                        <>
                            <button onClick={onClose} className="text-sm font-semibold text-gray-600 bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100">停止</button>
                            <button onClick={onRetry} className="text-sm font-semibold text-white bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-700 shadow-sm">重试</button>
                        </>
                    ) : (
                        <button 
                            onClick={onClose} 
                            className={`text-sm font-semibold px-4 py-2 rounded-lg transition-colors ${
                                isComplete 
                                    ? 'text-white bg-indigo-600 hover:bg-indigo-700' 
                                    : 'text-gray-600 bg-white border border-gray-300 hover:bg-gray-100'
                            }`}
                        >
                            {isComplete ? '关闭' : '取消'}
                        </button>
                    )}
                </footer>
            </div>
        </div>
    );
};

export const DataPreprocessing = ({ datasets, selectedDataset, setSelectedDataset }) => {
    const [pipeline, setPipeline] = useState([]);
    const [selectedStep, setSelectedStep] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingProgress, setProcessingProgress] = useState(0);
    const [stepStatuses, setStepStatuses] = useState({});

    useEffect(() => {
        setPipeline([]);
        setSelectedStep(null);
    }, [selectedDataset]);

    const addStepToPipeline = (step) => {
        if (!selectedDataset) return;
        const newStep = { ...step, id: Date.now() };
        setPipeline([...pipeline, newStep]);
        setSelectedStep(newStep);
    };

    const handleRemoveStep = (stepIdToRemove) => {
        setPipeline(prev => prev.filter(step => step.id !== stepIdToRemove));
        if (selectedStep && selectedStep.id === stepIdToRemove) {
            setSelectedStep(null);
        }
    };

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const runPipelineLogic = async (startingStepIndex = 0) => {
        const stepsToRun = pipeline.slice(startingStepIndex);
        let completedSteps = startingStepIndex;

        for (const step of stepsToRun) {
            setStepStatuses(prev => ({ ...prev, [step.id]: { status: 'running', error: null } }));
            await sleep(1500); // Simulate work

            // Simulate failure
            if (Math.random() < 0.3) {
                const errorMessage = `CUDA out of memory during ${step.name} operation.`;
                setStepStatuses(prev => ({ ...prev, [step.id]: { status: 'failed', error: errorMessage } }));
                return; // Stop the pipeline
            }

            completedSteps++;
            setProcessingProgress((completedSteps / pipeline.length) * 100);
            setStepStatuses(prev => ({ ...prev, [step.id]: { status: 'completed', error: null } }));
        }
    };

    const handleRunPipeline = async () => {
        if (!selectedDataset || pipeline.length === 0) return;

        setIsProcessing(true);
        setProcessingProgress(0);

        const initialStatuses = pipeline.reduce((acc, step) => {
            acc[step.id] = { status: 'pending', error: null };
            return acc;
        }, {});
        setStepStatuses(initialStatuses);
        
        await runPipelineLogic();
    };

    const handleRetry = async () => {
        const failedStepIndex = pipeline.findIndex(step => stepStatuses[step.id]?.status === 'failed');
        if (failedStepIndex === -1) return;

        // Reset statuses from the failed step onwards
        const newStatuses = { ...stepStatuses };
        for (let i = failedStepIndex; i < pipeline.length; i++) {
            newStatuses[pipeline[i].id] = { status: 'pending', error: null };
        }
        setStepStatuses(newStatuses);
        
        await runPipelineLogic(failedStepIndex);
    };
    
    const closeProcessingModal = () => {
        setIsProcessing(false);
    }

    return (
        <div className="flex gap-6 h-[75vh] pt-4">
            <ProcessingProgressModal 
                isOpen={isProcessing} 
                pipeline={pipeline}
                stepStatuses={stepStatuses}
                progress={processingProgress}
                onClose={closeProcessingModal}
                onRetry={handleRetry}
            />
            {/* Column 1: Source Datasets */}
            <div className="w-1/4 flex flex-col bg-white border border-gray-200 rounded-xl shadow-sm">
                <h2 className="text-lg font-semibold text-gray-800 p-4 border-b border-gray-200 flex-shrink-0">1. 源数据选择</h2>
                <div className="overflow-y-auto p-2">
                    {datasets.map(d => (
                        <div 
                            key={d.name} 
                            onClick={() => setSelectedDataset(d)}
                            className={`p-3 rounded-lg cursor-pointer transition-colors text-sm ${selectedDataset?.name === d.name ? 'bg-indigo-100 text-indigo-800 font-semibold' : 'hover:bg-gray-100'}`}
                        >
                            <p className="truncate">{d.name}</p>
                            <p className="text-xs text-gray-500">{d.samples} samples</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Column 2: Processing Pipeline */}
            <div className="w-1/2 flex flex-col bg-white border border-gray-200 rounded-xl shadow-sm">
                <h2 className="text-lg font-semibold text-gray-800 p-4 border-b border-gray-200">2. 预处理流水线</h2>
                <div className="flex-1 flex p-4 gap-4 overflow-hidden">
                    {/* Toolbox */}
                    <div className="w-1/3 border-r border-gray-200 pr-4 space-y-2 overflow-y-auto">
                        <h3 className="text-sm font-semibold text-gray-600 mb-2">工具箱</h3>
                        {processingSteps.map(step => (
                            <button 
                                key={step.name} 
                                onClick={() => addStepToPipeline(step)}
                                disabled={!selectedDataset}
                                className="w-full flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 text-sm text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-gray-200"
                            >
                                <Icon path={step.icon} className="w-5 h-5 text-indigo-500"/> 
                                <span className="font-medium">{step.name}</span>
                            </button>
                        ))}
                    </div>
                    {/* Canvas */}
                    <div className="w-2/3 bg-gray-50/70 border border-dashed border-gray-300 rounded-lg p-4 space-y-2 overflow-y-auto">
                        {pipeline.length === 0 ? (
                            <div className="flex items-center justify-center h-full text-center text-gray-500">
                                <p className="max-w-xs">{selectedDataset ? '从左侧工具箱选择一个步骤以开始' : '请先从左侧选择一个数据集'}</p>
                            </div>
                        ) : (
                            pipeline.map((step, index) => (
                                <div key={step.id} className="flex flex-col items-center group">
                                    <div 
                                        onClick={() => setSelectedStep(step)}
                                        className={`relative w-full p-3 bg-white rounded-lg border-2 shadow-sm text-center cursor-pointer transition-all ${selectedStep?.id === step.id ? 'border-indigo-500 shadow-indigo-100' : 'border-gray-200 hover:border-gray-300'}`}
                                    >
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handleRemoveStep(step.id); }}
                                            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-md opacity-0 group-hover:opacity-100"
                                            aria-label={`Remove ${step.name} step`}
                                        >
                                            <Icon path={ICONS.close} className="w-3 h-3" />
                                        </button>
                                        <div className="flex items-center justify-center gap-2">
                                            <Icon path={step.icon} className="w-5 h-5 text-indigo-600"/>
                                            <span className="font-semibold text-gray-800">{step.name}</span>
                                        </div>
                                    </div>
                                    {index < pipeline.length - 1 && <div className="h-4 w-0.5 bg-gray-300 my-1"></div>}
                                </div>
                            ))
                        )}
                    </div>
                </div>
                <div className="p-4 border-t border-gray-200 bg-gray-50/50 flex justify-end gap-3">
                    <button className="text-sm font-semibold text-gray-600 bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100">保存模板</button>
                    <button 
                        onClick={handleRunPipeline}
                        disabled={pipeline.length === 0 || isProcessing}
                        className="text-sm font-semibold text-white bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-700 shadow-sm disabled:bg-indigo-300 disabled:cursor-not-allowed"
                    >
                        运行流水线
                    </button>
                </div>
            </div>

            {/* Column 3: Configuration */}
            <div className="w-1/4 flex flex-col bg-white border border-gray-200 rounded-xl shadow-sm">
                <h2 className="text-lg font-semibold text-gray-800 p-4 border-b border-gray-200">3. 参数配置</h2>
                <div className="flex-1 p-4 overflow-y-auto">
                    {renderStepConfiguration(selectedStep)}
                </div>
            </div>
        </div>
    );
};