/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { ModelCard } from './ModelCard';
import { Icon, ICONS } from './shared';
import { mockDeployments } from '../api/mockData';

export const EnginesAndInstances = ({ openCreationModal }) => (
    <div className="space-y-6">
        <div className="flex justify-end">
            <button onClick={openCreationModal} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg text-sm shadow-md transition-all duration-200">
                <Icon path={ICONS.plus} className="w-4 h-4" />
                新建部署
            </button>
        </div>
        <div className="space-y-4">
            {mockDeployments.map(d => <ModelCard key={d.id} deployment={d} />)}
        </div>
    </div>
);
