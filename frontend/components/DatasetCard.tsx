/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { Tag, tagColors, statusColors } from './shared';

type DatasetCardProps = { dataset: any, onSelect: (dataset: any) => void; };

export const DatasetCard: React.FC<DatasetCardProps> = ({ dataset, onSelect }) => (
    <div 
        onClick={() => onSelect(dataset)}
        className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-lg hover:border-indigo-500 transform hover:-translate-y-1 cursor-pointer group"
    >
        <img src={`https://picsum.photos/seed/${dataset.name}/400/200`} alt="Dataset preview" className="w-full h-32 object-cover"/>
        <div className="p-4">
            <h3 className="font-bold text-lg text-gray-800 group-hover:text-indigo-600 truncate">{dataset.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{dataset.version} · {dataset.samples} samples</p>
            <div className="flex flex-wrap gap-1.5 mt-3">
                {dataset.tags.map(t => <Tag key={t} color={tagColors[t] || 'bg-gray-200 text-gray-800'} text={t} />)}
            </div>
        </div>
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center text-xs">
             <Tag color={statusColors[dataset.status]} text={dataset.status} />
             <span className="text-gray-500">by {dataset.creator}</span>
        </div>
    </div>
);
