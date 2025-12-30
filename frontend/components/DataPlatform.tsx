/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { DatasetCard } from './DatasetCard';
import { DatasetDetail } from './DatasetDetail';
import { UploadDatasetWizard } from './UploadDatasetWizard';
import { DataPreprocessing } from './DataPreprocessing';
import { DataSynthesis } from './DataSynthesis';
import { Icon, ICONS } from './shared';
const { useState, useMemo } = React;

const initialDatasets = [
    { name: 'alpaca-gpt4-zh', version: 'v1.2', samples: '52k', size: '102 MB', tags: ['SFT', '中文'], quality: 95, lastEval: '2024-07-28', status: 'Published', creator: 'team-a' },
    { name: 'dolly-v2-15k', version: 'v2.0', samples: '15k', size: '30 MB', tags: ['SFT', '英文', 'RLHF'], quality: 92, lastEval: '2024-07-25', status: 'Published', creator: 'team-b' },
    { name: 'internal-customer-qa', version: 'v0.1-draft', samples: '1.1M', size: '2.3 GB', tags: ['预训练', '金融'], quality: 78, lastEval: 'N/A', status: 'Draft', creator: 'team-a' },
    { name: 'medical-dialogue-en', version: 'v1.0', samples: '250k', size: '450 MB', tags: ['SFT', '医疗'], quality: 88, lastEval: '2024-07-22', status: 'Archived', creator: 'team-c' },
];

const domains = ['全部', 'SFT', '中文', '英文', 'RLHF', '预训练', '金融', '医疗'];
const tabs = ['数据集管理', '数据预处理', '数据合成'];

// FIX: Added explicit types for TabButton component props. This resolves an error where TypeScript couldn't assign the 'key' prop during list rendering because the component's props were implicitly typed.
const TabButton: React.FC<{ name: string, activeTab: string, setActiveTab: (name: string) => void }> = ({ name, activeTab, setActiveTab }) => (
    <button
        onClick={() => setActiveTab(name)}
        className={`whitespace-nowrap py-3 px-4 font-medium text-sm transition-colors rounded-t-lg
            ${activeTab === name
                ? 'border-b-2 border-indigo-500 text-indigo-600 bg-indigo-50'
                : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
    >
        {name}
    </button>
);


const DatasetManagement = ({ datasets, onSelectDataset }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeDomain, setActiveDomain] = useState('全部');
    const [isDomainDropdownOpen, setIsDomainDropdownOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

     const filteredDatasets = useMemo(() => {
        return datasets.filter(dataset => {
            const nameMatch = dataset.name.toLowerCase().includes(searchTerm.toLowerCase());
            const domainMatch = activeDomain === '全部' || dataset.tags.includes(activeDomain);
            return nameMatch && domainMatch;
        });
    }, [datasets, searchTerm, activeDomain]);

    return (
        <div className="space-y-6 pt-4">
             <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                     <div className="relative">
                        <Icon path={ICONS.search} className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                        <input 
                            type="text" 
                            placeholder="搜索数据集..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-white border border-gray-300 rounded-md pl-10 pr-4 py-2 text-sm w-64 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-800"
                        />
                    </div>
                     <button className="flex items-center space-x-2 text-sm p-2 rounded-md hover:bg-gray-100 border border-gray-300 transition-colors text-gray-600 bg-white">
                        <span>来源: 全部</span>
                        <Icon path={ICONS.chevronDown} className="w-4 h-4"/>
                    </button>
                    <div className="relative">
                        <button 
                            onClick={() => setIsDomainDropdownOpen(!isDomainDropdownOpen)}
                            onBlur={() => setTimeout(() => setIsDomainDropdownOpen(false), 150)}
                            className="flex items-center space-x-2 text-sm p-2 rounded-md hover:bg-gray-100 border border-gray-300 transition-colors text-gray-600 bg-white"
                        >
                            <span>领域: {activeDomain}</span>
                            <Icon path={ICONS.chevronDown} className="w-4 h-4"/>
                        </button>
                        {isDomainDropdownOpen && (
                            <div className="absolute z-10 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200">
                                <div className="py-1">
                                    {domains.map(domain => (
                                         <a 
                                            href="#" 
                                            key={domain}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setActiveDomain(domain);
                                                setIsDomainDropdownOpen(false);
                                            }}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            {domain}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                 <button 
                    onClick={() => setIsUploading(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg text-sm shadow-md transition-all duration-200"
                 >
                    上传与导入
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

export const DataPlatform = () => {
    const [datasets, setDatasets] = useState(initialDatasets);
    const [selectedDataset, setSelectedDataset] = useState(null);
    const [activeTab, setActiveTab] = useState(tabs[0]);
    const [preprocessingDataset, setPreprocessingDataset] = useState(null);
    
    const handleStartPreprocessing = (datasetToProcess) => {
        setPreprocessingDataset(datasetToProcess);
        setActiveTab('数据预处理');
        setSelectedDataset(null); // close the detail view
    };

    const handleUpdateDataset = (updatedDataset) => {
        setDatasets(datasets.map(d => d.name === updatedDataset.name ? updatedDataset : d));
        if (selectedDataset && selectedDataset.name === updatedDataset.name) {
            setSelectedDataset(updatedDataset);
        }
    };

    const renderContent = () => {
        if (selectedDataset) {
            return <DatasetDetail dataset={selectedDataset} onBack={() => setSelectedDataset(null)} onUpdate={handleUpdateDataset} onStartPreprocessing={handleStartPreprocessing} />;
        }
        
        switch(activeTab) {
            case '数据集管理':
                return <DatasetManagement datasets={datasets} onSelectDataset={setSelectedDataset} />;
            case '数据预处理':
                return <DataPreprocessing datasets={datasets} selectedDataset={preprocessingDataset} setSelectedDataset={setPreprocessingDataset} />;
            case '数据合成':
                return <DataSynthesis />;
            default:
                return null;
        }
    }
    
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">数据平台</h1>
                <p className="mt-2 text-gray-600">管理、预处理、合成与评估您的数据集。</p>
            </div>
            
            {!selectedDataset && (
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-2" aria-label="Tabs">
                         {tabs.map(tab => (
                            <TabButton key={tab} name={tab} activeTab={activeTab} setActiveTab={setActiveTab} />
                         ))}
                    </nav>
                </div>
            )}
            
            <div>
                {renderContent()}
            </div>
        </div>
    );
};