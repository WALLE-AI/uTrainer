/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { Icon, ICONS, SelectField, InputField } from './shared';
const { useState } = React;

const synthesisStrategies = {
  'Evol-Instruct': {
    description: '通过逐步增加复杂性或约束来演化和生成新的指令。',
    placeholder: "为合成过程提供一个或多个起始指令。例如：'请解释什么是机器学习'。每行一个。",
    headers: ['原始指令', '合成指令', '模型回答'],
    exampleRows: [
      ['"天空为什么是蓝色的？"', '"从物理学的角度，详细解释大气层中的瑞利散射现象是如何导致我们感知到天空是蓝色的，并讨论在日出日落时颜色变化的原因。"', '"瑞利散射指出，当光线穿过比其波长小得多的粒子时，较短的波长（如蓝色和紫色）比... "'],
      ['"如何烤饼干？"', '"为一位绝对的烘焙新手，提供一份万无一失的巧克力曲奇食谱，包括详细的步骤、常见错误以及如何判断饼干是否烤制完成的技巧。"', '"当然！这是一个简单的巧克力曲奇食谱：首先，预热你的烤箱到175°C。在一个大碗里，混合..."'],
    ],
  },
  'Self-Instruct': {
    description: '使用模型自身根据少量种子指令生成更多样化的指令。',
    placeholder: "提供几个种子指令，模型将在此基础上进行泛化。例如：'写一首关于秋天的诗。'",
    headers: ['种子指令', '生成指令', '模型回答'],
    exampleRows: [
        ['"写一首关于秋天的诗。"', '"创作一首描绘深秋森林景色的五言绝句。"', '"空山新雨后，天气晚来秋。明月松间照，清泉石上流。"']
    ]
  },
  'Preference (DPO)': {
    description: '生成包含“选择”和“拒绝”回答的偏好对，用于 DPO 训练。',
    placeholder: "提供一个指令，模型将为其生成一个优质回答和一个较差回答。例如：'解释光合作用的过程。'",
    headers: ['指令', '选择的回答 (Chosen)', '拒绝的回答 (Rejected)'],
    exampleRows: [
      ['"法国的首都是哪里？"', '"法国的首都是巴黎。"', '"法国的首都是伦敦。"'],
      ['"如何为 DPO 训练准备数据？"', '"为DPO训练准备数据，你需要一个包含三列的数据集：`prompt`、`chosen` 和 `rejected`。`chosen` 回答应该比 `rejected` 回答更受青睐。"', '"准备DPO数据很简单，只需要一堆prompt就行了。"']
    ],
  },
  'Multi-turn Conversation': {
    description: '生成模拟用户和AI助手之间的多轮对话。',
    placeholder: "提供对话的开场白或场景设定。例如：'模拟一个用户咨询手机套餐的对话。'",
    headers: ['场景', '生成对话'],
    exampleRows: [
      ['"用户咨询手机套餐"', '用户: 你好，我想了解一下你们最新的5G套餐。\nAI: 您好！我们有多种5G套餐，请问您每月大概需要多少流量和通话分钟数？\n用户: 我流量用的比较多，大概100G吧，电话不多。\nAI: 好的，根据您的需求，我推荐您...'],
    ],
  },
   'Code & Explanation': {
    description: '生成代码片段及其对应的自然语言解释。',
    placeholder: "提供一个编程相关的任务描述。例如：'用Python写一个斐波那契数列函数。'",
    headers: ['指令', '代码片段', '解释'],
    exampleRows: [
      ['"用Python写一个斐波那契数列函数。"', '```python\ndef fibonacci(n):\n    a, b = 0, 1\n    while a < n:\n        print(a, end=\' \')\n        a, b = b, a+b\n    print()\n```', '这个函数使用一个 `while` 循环来生成并打印所有小于 `n` 的斐波那契数。它通过同时更新两个变量 `a` 和 `b` 来高效地计算序列。'],
    ],
  },
};


export const DataSynthesis = () => {
    const [synthesisMethod, setSynthesisMethod] = useState(Object.keys(synthesisStrategies)[0]);
    const [generatorModel, setGeneratorModel] = useState('gemini-2.5-flash');

    const activeStrategy = synthesisStrategies[synthesisMethod];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
            {/* Column 1: Configuration */}
            <div className="lg:col-span-1 bg-white border border-gray-200 rounded-xl p-6 space-y-6 h-fit">
                <h2 className="text-lg font-semibold text-gray-800">合成配置</h2>
                
                <SelectField 
                    label="合成方法" 
                    options={Object.keys(synthesisStrategies)}
                    value={synthesisMethod}
                    onChange={(e) => setSynthesisMethod(e.target.value)}
                    description={activeStrategy.description}
                />

                <SelectField 
                    label="生成模型" 
                    options={['gemini-2.5-flash', 'qwen-72b-chat', 'llama3-70b-instruct']}
                    value={generatorModel}
                    onChange={(e) => setGeneratorModel(e.target.value)}
                    description="用于执行合成任务的 LLM。"
                />

                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">种子指令/提示</label>
                    <textarea 
                        // FIX: Changed the 'rows' prop on the textarea from a string to a number to match the expected type and resolve the TypeScript error.
                        rows={6} 
                        placeholder={activeStrategy.placeholder}
                        className="w-full bg-gray-50 border border-gray-300 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-800"
                    />
                </div>

                <InputField label="生成数量" type="number" placeholder="100" />
                
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">创造力 (Temperature)</label>
                    <div className="flex items-center gap-4">
                        <input type="range" min="0.1" max="1.0" step="0.1" defaultValue="0.7" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"/>
                        <span className="font-mono text-sm bg-gray-100 text-gray-800 px-2 py-1 rounded-md">0.7</span>
                    </div>
                </div>

                <button className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-3 rounded-lg text-sm shadow-md transition-all duration-200">
                    <Icon path={ICONS.training} className="w-5 h-5" />
                    开始生成
                </button>
            </div>

            {/* Column 2: Output */}
            <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">生成结果</h2>
                    <div className="flex gap-2">
                        <button className="text-sm font-semibold text-gray-600 bg-white border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-100">全部导出</button>
                        <button className="text-sm font-semibold text-white bg-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-700">保存至数据集</button>
                    </div>
                </div>
                <div className="overflow-x-auto h-[60vh] border border-gray-200 rounded-lg bg-gray-50/50">
                    <table className="w-full text-sm text-left text-gray-600">
                        <thead className="bg-gray-100 text-xs text-gray-500 uppercase sticky top-0">
                            <tr>
                                {activeStrategy.headers.map(header => (
                                    <th key={header} className="p-3">{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {/* Example Rows */}
                            {activeStrategy.exampleRows.map((row, rowIndex) => (
                                <tr key={rowIndex} className="hover:bg-white">
                                    {row.map((cell, cellIndex) => (
                                        <td key={cellIndex} className={`p-3 align-top ${cellIndex > 0 ? 'font-medium text-gray-800' : ''} whitespace-pre-wrap`}>
                                            {cell}
                                        </td>
                                    ))}
                                </tr>
                            ))}

                            {/* Placeholder for actual generated content */}
                             <tr className="hover:bg-white">
                               <td colSpan={activeStrategy.headers.length} className="text-center p-8 text-gray-400">
                                   配置参数后点击“开始生成”
                               </td>
                           </tr>
                        </tbody>
                    </table>
                 </div>
            </div>
        </div>
    );
};