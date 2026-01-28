import React from 'react';
import { Icon, ICONS, FormSection, InputField, SelectField, Tag, tagColors } from './shared';

const { useState, useEffect } = React;

const STAGES = [
    { id: 1, name: '任务规格', desc: '能力目标定义' },
    { id: 2, name: '智能导入', desc: '多源数据接入' },
    { id: 3, name: '算力增强', desc: 'AI 预处理' },
    { id: 4, name: '精修工坊', desc: '多模态编辑' },
    { id: 5, name: '质量体检', desc: '自动化审计' },
    { id: 6, name: '发布入库', desc: '正式导出' },
];

const ProgressTracker = ({ currentStage }) => (
    <div className="flex items-start justify-between mb-8 px-4">
        {STAGES.map((s, idx) => (
            <div key={s.id} className="flex flex-col items-center flex-1 relative">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold z-10 transition-all duration-300 ${s.id < currentStage ? 'bg-green-500 text-white shadow-lg' :
                    s.id === currentStage ? 'bg-indigo-600 text-white ring-4 ring-indigo-100' :
                        'bg-white border-2 border-gray-200 text-gray-400'
                    }`}>
                    {s.id < currentStage ? <Icon path={ICONS.plus} className="w-5 h-5 rotate-45" /> : s.id}
                </div>
                <div className="mt-2 text-center">
                    <p className={`text-[10px] font-bold uppercase transition-colors ${s.id <= currentStage ? 'text-gray-900' : 'text-gray-400'}`}>{s.name}</p>
                    <p className="text-[9px] text-gray-400 hidden md:block">{s.desc}</p>
                </div>
                {idx < STAGES.length - 1 && (
                    <div className={`absolute top-4 left-1/2 w-full h-0.5 -z-0 ${s.id < currentStage ? 'bg-green-500' : 'bg-gray-100'}`}></div>
                )}
            </div>
        ))}
    </div>
);

// --- Stage Components ---

const Stage1_Spec = ({ data, setData }) => (
    <div className="space-y-6">
        <FormSection title="核心规格定义">
            <InputField label="工作空间名称" placeholder="e.g., Llama-3-Vision-Studio" value={data.name} onChange={e => setData({ ...data, name: e.target.value })} />
            <SelectField label="预期模型能力" options={['复杂逻辑推理', '图文多模态对齐', '长视频时序理解', '金融实体提取']} value={data.capability} onChange={e => setData({ ...data, capability: e.target.value })} colSpan="col-span-1" />
            <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-3">目标模态组合</label>
                <div className="grid grid-cols-3 gap-4">
                    {['Text', 'Image', 'Video'].map(m => (
                        <div
                            key={m}
                            onClick={() => setData({ ...data, modality: m })}
                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${data.modality === m ? 'border-indigo-600 bg-indigo-50 shadow-md' : 'border-gray-100 bg-white hover:border-gray-300'}`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${data.modality === m ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                    <Icon path={m === 'Text' ? ICONS.data : (m === 'Image' ? ICONS.observability : ICONS.play)} className="w-5 h-5" />
                                </div>
                                <span className={`font-bold ${data.modality === m ? 'text-indigo-900' : 'text-gray-700'}`}>{m === 'Text' ? '纯文本' : (m === 'Image' ? '图文多模态' : '视频多模态')}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </FormSection>
    </div>
);

const Stage2_Ingest = ({ data, setData }) => (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <Icon path={ICONS.upload} className="w-8 h-8 text-indigo-500 mb-4" />
                <h3 className="font-bold text-gray-800">本地上传</h3>
                <p className="text-xs text-gray-500 mt-1">支持 JSONL, Parquet 及多媒体压缩包。</p>
                <button className="mt-4 w-full bg-gray-50 hover:bg-gray-100 py-2 rounded-lg text-sm font-semibold transition-colors">浏览文件</button>
            </div>
            <div className="p-6 bg-white rounded-2xl border border-indigo-100 shadow-md ring-2 ring-indigo-500 ring-opacity-10">
                <Icon path={ICONS.beaker} className="w-8 h-8 text-pink-500 mb-4" />
                <h3 className="font-bold text-gray-800">AI 合成注入</h3>
                <p className="text-xs text-gray-500 mt-1">基于 LLM/Diffusion 生成种子数据。</p>
                <button className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-sm font-semibold transition-colors">设置合成策略</button>
            </div>
            <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow opacity-60">
                <Icon path={ICONS.search} className="w-8 h-8 text-green-500 mb-4" />
                <h3 className="font-bold text-gray-800">外部检索 (Coming)</h3>
                <p className="text-xs text-gray-500 mt-1">从 HuggingFace 或企业库直接拉取。</p>
                <button className="mt-4 w-full bg-gray-50 py-2 rounded-lg text-sm font-semibold cursor-not-allowed" disabled>暂不可用</button>
            </div>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 font-mono text-xs text-green-400 overflow-hidden shadow-inner">
            <p># Ingestion Stream Status</p>
            <p className="mt-1 text-gray-500">[2024-07-30 14:22:01] Initializing multi-source pipeline...</p>
            <p className="text-gray-500">[2024-07-30 14:22:02] Waiting for user input...</p>
        </div>
    </div>
);

const Stage3_Augment = () => {
    const [selectedOps, setSelectedOps] = useState(['cleaning']);
    const ops = [
        { id: 'cleaning', name: '全向清洗', icon: ICONS.shield, desc: '自动修复格式错误、删除乱码字符。' },
        { id: 'dedup', name: '智能去重', icon: ICONS.deduplicate, desc: '基于语义嵌入删除高相似度样本。' },
        { id: 'anon', name: '非对称加密', icon: ICONS.shield, desc: 'PII 信息自动识别并进行掩码处理。' },
        { id: 'tagging', name: '多模态打标', icon: ICONS.beaker, desc: 'AI 自动为图片/视频生成描述词。' },
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                {ops.map(op => (
                    <div
                        key={op.id}
                        onClick={() => setSelectedOps(prev => prev.includes(op.id) ? prev.filter(i => i !== op.id) : [...prev, op.id])}
                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-4 ${selectedOps.includes(op.id) ? 'border-indigo-600 bg-indigo-50 shadow-md' : 'border-gray-100 bg-white hover:border-gray-300'}`}
                    >
                        <div className={`p-2 rounded-xl ${selectedOps.includes(op.id) ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                            <Icon path={op.icon} className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="font-black text-gray-800 text-sm">{op.name}</p>
                            <p className="text-[10px] text-gray-500 mt-1">{op.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-gray-900 rounded-2xl p-6 overflow-hidden relative">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">实时处理预览 / Step View</span>
                    <span className="text-[10px] text-gray-500">24/500 Samples Processed</span>
                </div>
                <div className="grid grid-cols-2 gap-8 text-[11px] font-mono">
                    <div className="space-y-2 opacity-40">
                        <p className="text-gray-500">// BEFORE</p>
                        <p className="text-white line-through bg-red-900/20 px-1">"User: 帮我查询13800138000的账单..."</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-gray-500">// AFTER (Anonymized)</p>
                        <p className="text-green-400 bg-green-900/20 px-1">"User: 帮我查询[PHONE_ID]的账单..."</p>
                    </div>
                </div>
                <div className="absolute inset-x-0 bottom-0 h-1 bg-indigo-600 animate-shimmer" style={{ backgroundSize: '200% 100%' }}></div>
            </div>
        </div>
    );
};

const Stage4_Refine = ({ modality }) => {
    const [mockItems, setMockItems] = useState([
        { id: 1, content: "请描述这张图", status: "Ready" },
        { id: 2, content: "总结这段视频的核心情节", status: "Edited" },
    ]);

    return (
        <div className="flex h-[400px] border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-lg">
            <div className="w-64 border-r border-gray-100 overflow-y-auto bg-gray-50/50">
                <div className="p-4 border-b border-gray-100 bg-white">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">数据项列表</span>
                </div>
                {mockItems.map(item => (
                    <div key={item.id} className="p-4 border-b border-gray-100 hover:bg-white cursor-pointer transition-colors flex justify-between items-center group">
                        <span className="text-sm text-gray-700 font-medium">Item #{item.id}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${item.status === 'Ready' ? 'bg-green-100 text-green-700' : 'bg-indigo-100 text-indigo-700'}`}>{item.status}</span>
                    </div>
                ))}
            </div>
            <div className="flex-1 flex flex-col">
                <header className="h-14 border-b border-gray-100 flex items-center justify-between px-6 bg-white">
                    <div className="flex items-center gap-4">
                        <h4 className="font-bold text-gray-800">编辑 Item #1</h4>
                        <div className="flex gap-2">
                            <Tag text="Auto-Captioning" color="bg-indigo-50 text-indigo-600" />
                            <Tag text="QA Passed" color="bg-green-50 text-green-600" />
                        </div>
                    </div>
                    <button className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-xs font-bold shadow-sm hover:bg-indigo-700">保存编辑</button>
                </header>
                <div className="flex-1 p-6 overflow-y-auto">
                    {modality === 'Image' ? (
                        <div className="space-y-4">
                            <div className="aspect-video bg-gray-100 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-200">
                                <Icon path={ICONS.observability} className="w-12 h-12 text-gray-300" />
                                <span className="ml-2 text-sm text-gray-400">Preview Area (Multi-Image Gallery)</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="text-xs font-bold text-gray-500 mb-1 block">USER (Prompt)</label><textarea className="w-full text-sm p-3 bg-gray-50 border-0 rounded-xl h-24 focus:ring-2 focus:ring-indigo-100 resize-none">请描述图中的建筑风格。</textarea></div>
                                <div><label className="text-xs font-bold text-gray-500 mb-1 block">ASSISTANT (Output)</label><textarea className="w-full text-sm p-3 bg-gray-50 border-0 rounded-xl h-24 focus:ring-2 focus:ring-indigo-100 resize-none">此建筑采用了典型的高科技派（High-tech architecture）风格，强调结构部件的外部显露...</textarea></div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400 italic">
                            选择左侧数据项开始对 {modality} 模态进行高级精修
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export const DatasetBuilder = ({ onCancel, onComplete }) => {
    const [currentStage, setCurrentStage] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        capability: '图文多模态对齐',
        modality: 'Image',
        description: ''
    });

    const handleNext = () => {
        if (currentStage < STAGES.length) setCurrentStage(currentStage + 1);
        else onComplete();
    };

    const renderStageContent = () => {
        switch (currentStage) {
            case 1: return <Stage1_Spec data={formData} setData={setFormData} />;
            case 2: return <Stage2_Ingest data={formData} setData={setFormData} />;
            case 3: return <Stage3_Augment />;
            case 4: return <Stage4_Refine modality={formData.modality} />;
            default: return (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                    <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                    <p className="font-bold text-gray-800">正在进入 {STAGES[currentStage - 1].name}...</p>
                    <p className="text-sm mt-1">{STAGES[currentStage - 1].desc}</p>
                </div>
            );
        }
    };

    return (
        <div className="space-y-8 animate-slide-in-right">
            <header className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-indigo-200 shadow-xl">
                            <Icon path={ICONS.beaker} className="w-6 h-6 text-white" />
                        </div>
                        数据构建工作室
                    </h2>
                    <p className="text-gray-500 mt-2 font-medium">当前阶段: <span className="text-gray-900">{STAGES[currentStage - 1].name}</span> — {STAGES[currentStage - 1].desc}</p>
                </div>
                <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 group transition-all">
                    <Icon path={ICONS.close} className="w-7 h-7 group-hover:rotate-90 duration-300" />
                </button>
            </header>

            <ProgressTracker currentStage={currentStage} />

            <main className="bg-gray-50/50 p-8 rounded-3xl border border-gray-100 min-h-[500px] shadow-inner relative overflow-hidden">
                <div className="relative z-10">
                    {renderStageContent()}
                </div>

                {/* Background Decor */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-indigo-50 rounded-full blur-3xl opacity-50 -z-0"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-pink-50 rounded-full blur-3xl opacity-50 -z-0"></div>
            </main>

            <footer className="flex justify-between items-center bg-white p-6 rounded-2xl border border-gray-100 shadow-xl">
                <button
                    onClick={() => currentStage > 1 && setCurrentStage(currentStage - 1)}
                    disabled={currentStage === 1}
                    className="flex items-center gap-2 px-6 py-3 text-sm font-bold text-gray-500 hover:text-gray-900 disabled:opacity-0 transition-all"
                >
                    <Icon path={ICONS.arrowLeft} className="w-4 h-4" />
                    上一步
                </button>
                <div className="flex gap-4">
                    <button onClick={onCancel} className="px-6 py-3 text-sm font-bold text-gray-600 hover:bg-gray-50 rounded-xl transition-all">收起工作台</button>
                    <button
                        onClick={handleNext}
                        className="flex items-center gap-2 px-10 py-3 bg-indigo-600 text-white rounded-xl text-sm font-black shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 active:translate-y-0 transition-all"
                    >
                        {currentStage === STAGES.length ? '完成并入库' : '下一步'}
                        <Icon path={ICONS.plus} className="w-4 h-4 rotate-45" />
                    </button>
                </div>
            </footer>
        </div>
    );
};
