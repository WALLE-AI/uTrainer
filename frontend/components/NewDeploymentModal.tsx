/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { Icon, ICONS, Toggle, FormSection, InputField, SelectField, ToggleField } from './shared';
const { useState } = React;

export const NewDeploymentModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const [engine, setEngine] = useState('vLLM');
    const [gpuMemory, setGpuMemory] = useState(0.9);
    const [speculativeDecoding, setSpeculativeDecoding] = useState(true);

    const EngineCard = ({ name, description, selected, onSelect, disabled = false }) => (
        <div onClick={() => !disabled && onSelect(name)}
             className={`p-4 border rounded-lg cursor-pointer transition-all relative ${
                selected ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-500' : 'border-gray-300 bg-white hover:border-gray-400'
             } ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''}`}
        >
            <h4 className="font-bold text-gray-800">{name}</h4>
            <p className="text-xs text-gray-500 mt-1">{description}</p>
            {selected && <div className="absolute top-2 right-2 w-5 h-5 bg-indigo-600 rounded-full text-white flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.052-.143z" clipRule="evenodd" /></svg></div>}
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <header className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900">新建服务部署</h2>
                    <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500"><Icon path={ICONS.close} className="w-5 h-5" /></button>
                </header>
                <main className="flex-1 overflow-y-auto p-8 space-y-8">
                    {/* FIX: Wrapped content inside FormSection component */}
                    <FormSection title="基础信息">
                        <div className="space-y-4 col-span-2">
                           <InputField label="服务名称" placeholder="例如: qwen-1.8b-chat-demo" colSpan="col-span-2"/>
                           <div>
                               <label className="block text-sm font-medium text-gray-600 mb-2">模型来源</label>
                               <div className="grid grid-cols-3 gap-2">
                                   <button className="bg-gray-100 border border-gray-300 p-3 rounded-lg text-sm text-center font-medium text-gray-700 hover:bg-gray-200">Hugging Face</button>
                                   <button className="bg-white border border-gray-300 p-3 rounded-lg text-sm text-center font-medium text-gray-700 hover:bg-gray-50">模型库</button>
                                   <button className="bg-white border border-gray-300 p-3 rounded-lg text-sm text-center font-medium text-gray-700 hover:bg-gray-50">自定义路径</button>
                               </div>
                               <div className="mt-2">
                                   <InputField label="" placeholder="Qwen/Qwen1.5-1.8B-Chat" colSpan="col-span-2"/>
                               </div>
                           </div>
                        </div>
                    </FormSection>
                    
                    {/* FIX: Wrapped content inside FormSection component */}
                    <FormSection title="推理引擎">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 col-span-2">
                            <EngineCard name="vLLM" description="高吞吐、内存优化的推理服务" selected={engine === 'vLLM'} onSelect={setEngine} />
                            <EngineCard name="SGLang" description="面向复杂 LLM 项目的高效推理引擎" selected={engine === 'SGLang'} onSelect={setEngine} />
                            <EngineCard name="TRT-LLM" description="NVIDIA TensorRT-LLM" selected={false} onSelect={() => {}} disabled />
                            <EngineCard name="Ollama" description="本地运行 Llama 3, Mistral 等模型" selected={false} onSelect={() => {}} disabled />
                        </div>
                    </FormSection>

                    {/* FIX: Wrapped content inside FormSection component */}
                    <FormSection title="实例参数">
                         <SelectField label="量化" options={['None', 'AWQ', 'GPTQ', 'FP8']} />
                         <InputField label="最大模型长度" placeholder="例如: 8192"/>
                         <div className="col-span-2">
                             <label className="block text-sm font-medium text-gray-600 mb-1">GPU 内存利用率</label>
                             <div className="flex items-center gap-4">
                                <input type="range" min="0.1" max="1.0" step="0.05" value={gpuMemory} onChange={e => setGpuMemory(parseFloat(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"/>
                                <span className="font-mono text-sm bg-gray-100 text-gray-800 px-2 py-1 rounded-md">{gpuMemory.toFixed(2)}</span>
                             </div>
                         </div>
                         <ToggleField label="启用推测解码" description="使用小模型草稿加速大模型解码过程，以少量显存换取更高吞吐。" enabled={speculativeDecoding} setEnabled={setSpeculativeDecoding} />
                    </FormSection>

                    {/* FIX: Wrapped content inside FormSection component */}
                    <FormSection title="资源配置">
                        <SelectField label="GPU 类型" options={['NVIDIA A100-80G', 'NVIDIA H800-80G', 'NVIDIA RTX 4090']} description="选择用于部署的硬件资源。" />
                        <SelectField label="Tensor Parallel" options={[1, 2, 4, 8]} description="模型并行度，加速大模型推理。" />
                        <InputField label="最小实例数" placeholder="0" description="服务自动伸缩的最小副本数。" />
                        <InputField label="最大实例数" placeholder="1" description="服务自动伸缩的最大副本数。" />
                    </FormSection>
                </main>
                <footer className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
                    <button onClick={onClose} className="text-sm font-semibold text-gray-600 bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100">取消</button>
                    <button onClick={onClose} className="text-sm font-semibold text-white bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-700 shadow-sm">部署</button>
                </footer>
            </div>
        </div>
    );
};