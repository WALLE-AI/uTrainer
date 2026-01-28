/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { DatasetCard } from './DatasetCard';
import { DatasetDetail } from './DatasetDetail';
import { UploadDatasetWizard } from './UploadDatasetWizard';
import { DatasetBuilder } from './DatasetBuilder';
import { Icon, ICONS } from './shared';
const { useState, useMemo } = React;

const initialDatasets = [
    { name: 'alpaca-gpt4-zh', version: 'v1.2', samples: '52k', size: '102 MB', tags: ['SFT', '中文'], quality: 95, lastEval: '2024-07-28', status: 'Published', creator: 'team-a', modality: 'Text' },
    { name: 'internal-image-qa', version: 'v1.0', samples: '15k', size: '2.3 GB', tags: ['Visual-QA', '图片'], quality: 92, lastEval: '2024-07-25', status: 'Published', creator: 'team-b', modality: 'Image', thumbnail: 'https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&w=300' },
    { name: 'traffic-video-events', version: 'v0.1-draft', samples: '500', size: '12 GB', tags: ['时序分析', '交通'], quality: 78, lastEval: 'N/A', status: 'Draft', creator: 'team-a', modality: 'Video' },
    { name: 'medical-dialogue-en', version: 'v1.0', samples: '250k', size: '450 MB', tags: ['SFT', '医疗'], quality: 88, lastEval: '2024-07-22', status: 'Archived', creator: 'team-c', modality: 'Text' },
];

const modalities = ['全部', 'Text', 'Image', 'Video'];
const domains = ['全部', 'SFT', '中文', '英文', 'RLHF', '预训练', '金融', '医疗', '交通'];

const DatasetManagement = ({ datasets, onSelectDataset }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeDomain, setActiveDomain] = useState('全部');
    const [activeModality, setActiveModality] = useState('全部');
    const [isDomainDropdownOpen, setIsDomainDropdownOpen] = useState(false);
    const [isModalityDropdownOpen, setIsModalityDropdownOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const filteredDatasets = useMemo(() => {
        return datasets.filter(dataset => {
            const nameMatch = dataset.name.toLowerCase().includes(searchTerm.toLowerCase());
            const domainMatch = activeDomain === '全部' || dataset.tags.includes(activeDomain);
            const modalityMatch = activeModality === '全部' || dataset.modality === activeModality;
            return nameMatch && domainMatch && modalityMatch;
        });
    }, [datasets, searchTerm, activeDomain, activeModality]);

    return (
        <div className="space-y-6 pt-4">
            <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                <div className="flex items-center space-x-3">
                    <div className="relative">
                        <Icon path={ICONS.search} className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="搜索数据集..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-gray-50 border border-gray-200 rounded-md pl-10 pr-4 py-2 text-sm w-64 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-800"
                        />
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => setIsModalityDropdownOpen(!isModalityDropdownOpen)}
                            className="flex items-center space-x-2 text-sm px-3 py-2 rounded-md hover:bg-gray-50 border border-gray-200 transition-colors text-gray-600 bg-white min-w-[120px]"
                        >
                            <span>模态: {activeModality}</span>
                            <Icon path={ICONS.chevronDown} className="w-4 h-4" />
                        </button>
                        {isModalityDropdownOpen && (
                            <div className="absolute z-20 mt-2 w-40 bg-white rounded-md shadow-xl border border-gray-200 py-1">
                                {modalities.map(m => (
                                    <button key={m} onClick={() => { setActiveModality(m); setIsModalityDropdownOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600">
                                        {m}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => setIsDomainDropdownOpen(!isDomainDropdownOpen)}
                            className="flex items-center space-x-2 text-sm px-3 py-2 rounded-md hover:bg-gray-50 border border-gray-200 transition-colors text-gray-600 bg-white min-w-[120px]"
                        >
                            <span>领域: {activeDomain}</span>
                            <Icon path={ICONS.chevronDown} className="w-4 h-4" />
                        </button>
                        {isDomainDropdownOpen && (
                            <div className="absolute z-20 mt-2 w-48 bg-white rounded-md shadow-xl border border-gray-200 py-1 max-h-64 overflow-y-auto">
                                {domains.map(domain => (
                                    <button key={domain} onClick={() => { setActiveDomain(domain); setIsDomainDropdownOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600">
                                        {domain}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <button
                    onClick={() => setIsUploading(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2 rounded-lg text-sm shadow-md transition-all duration-200 flex items-center gap-2"
                >
                    <Icon path={ICONS.plus} className="w-4 h-4" />
                    录入数据
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredDatasets.map(d => (
                    <DatasetCard key={d.name} dataset={d} onSelect={onSelectDataset} />
                ))}
            </div>
            <UploadDatasetWizard isOpen={isUploading} onClose={() => setIsUploading(false)} />
        </div>
    )
}

export const DataPlatform = ({ params, onNavigate }) => {
    const [datasets, setDatasets] = useState(initialDatasets);
    const [viewMode, setViewMode] = useState(params?.initialView || 'library'); // 'library' or 'lab'
    const [selectedDataset, setSelectedDataset] = useState(null);

    React.useEffect(() => {
        if (params?.initialView) {
            setViewMode(params.initialView);
            setSelectedDataset(null);
        }
    }, [params?.initialView]);

    const handleUpdateDataset = (updatedDataset) => {
        setDatasets(datasets.map(d => d.name === updatedDataset.name ? updatedDataset : d));
        if (selectedDataset && selectedDataset.name === updatedDataset.name) {
            setSelectedDataset(updatedDataset);
        }
    };

    return (
        <div className="h-full flex flex-col space-y-6">
            {/* Header: Cockpit Switcher */}
            <div className="flex justify-between items-end border-b border-gray-200 pb-6">
                <div className="flex flex-col gap-5">
                    <h1 className="text-2xl font-black text-gray-900 tracking-tighter uppercase flex items-center gap-3">
                        <div className="w-2 h-8 bg-indigo-600 rounded-full shadow-[0_0_12px_rgba(79,70,229,0.4)]"></div>
                        DATA OPS <span className="text-gray-300 font-light mx-1">/</span> <span className="text-gray-500 font-bold tracking-normal text-lg">数据生产中枢</span>
                    </h1>
                    <div className="flex items-center p-1 bg-gray-100/80 rounded-2xl border border-gray-100 self-start">
                        <button
                            onClick={() => { setViewMode('library'); onNavigate('数据中心'); }}
                            className={`text-[11px] font-black tracking-tight px-6 py-2 rounded-xl transition-all ${viewMode === 'library' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            数据中心
                        </button>
                        <button
                            onClick={() => { setViewMode('lab'); onNavigate('数据构建工作室'); }}
                            className={`text-[11px] font-black tracking-tight px-6 py-2 rounded-xl transition-all ${viewMode === 'lab' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            数据构建工作室
                        </button>
                    </div>
                </div>

                <div className="hidden lg:flex items-center gap-6 px-6 py-2 bg-white rounded-2xl border border-gray-100 shadow-sm text-xs">
                    <div className="flex flex-col">
                        <span className="text-gray-400 font-bold uppercase tracking-tighter">存储量</span>
                        <span className="font-mono text-gray-900 font-bold">12.4 / 50 GB</span>
                    </div>
                    <div className="w-px h-8 bg-gray-100"></div>
                    <div className="flex flex-col">
                        <span className="text-gray-400 font-bold uppercase tracking-tighter">进行中任务</span>
                        <span className="font-mono text-indigo-600 font-bold">2 运行中</span>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-hidden">
                {selectedDataset ? (
                    <DatasetDetail
                        dataset={selectedDataset}
                        onBack={() => setSelectedDataset(null)}
                        onUpdate={handleUpdateDataset}
                        onNavigate={onNavigate}
                        onRecycle={() => setViewMode('lab')}
                    />
                ) : (
                    viewMode === 'library' ? (
                        <DatasetManagement datasets={datasets} onSelectDataset={setSelectedDataset} />
                    ) : (
                        <DatasetBuilder onCancel={() => setViewMode('library')} onComplete={() => setViewMode('library')} />
                    )
                )}
            </div>
        </div>
    );
};