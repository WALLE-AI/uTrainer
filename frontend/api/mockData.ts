/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export const mockDeployments = [
    { id: 1, name: 'Qwen-7B-Chat-AWQ', model: 'qwen/qwen-7b-chat-awq', status: 'Healthy', runtime: 'vLLM', params: { concurrency: 16, batching: 'Continuous', kvCache: '8GB', tensorParallel: 2, speculativeDecoding: true }, routing: { weight: 80, healthCheck: '/health', abTest: 'main-v1', circuitBreaker: true, rateLimit: '1000/m' }, metrics: { qps: 120.5, p95: '85ms', throughput: '3200 t/s', errorRate: '0.1%' } },
    { id: 2, name: 'Llama3-8B-Instruct-GGUF', model: 'meta-llama/Llama-3-8B-Instruct-gguf', status: 'Degraded', runtime: 'Ollama', params: { concurrency: 8, batching: 'Batch', kvCache: '4GB', tensorParallel: 1, speculativeDecoding: false }, routing: { weight: 20, healthCheck: '/health', abTest: 'candidate-v2', circuitBreaker: true, rateLimit: '500/m' }, metrics: { qps: 88.2, p95: '152ms', throughput: '2100 t/s', errorRate: '2.3%' } },
    { id: 3, name: 'Yi-34B-Chat-200K', model: '01-ai/Yi-34B-Chat-200K', status: 'Healthy', runtime: 'TRT-LLM', params: { concurrency: 32, batching: 'Continuous', kvCache: '16GB', tensorParallel: 4, speculativeDecoding: true }, routing: { weight: 100, healthCheck: '/health', abTest: 'main-v1', circuitBreaker: false, rateLimit: '2000/m' }, metrics: { qps: 250.0, p95: '65ms', throughput: '7800 t/s', errorRate: '0.05%' } },
];

const generateHistory = (points = 20, failing = false) => {
    let loss = Math.random() * 2 + 2;
    let val_loss = loss + 0.2;
    const history = [];
    for (let i = 0; i < points; i++) {
        loss -= (Math.random() * 0.15);
        if (failing && i > points * 0.8) {
            loss += Math.random() * 1.5; // Simulate loss exploding
        }
        val_loss -= (Math.random() * 0.14);
        history.push({
            step: i * 10,
            loss: Math.max(0.5, loss + (Math.random() - 0.5) * 0.1),
            val_loss: Math.max(0.6, val_loss + (Math.random() - 0.5) * 0.1),
            throughput: Math.floor(18000 + Math.random() * 2000),
            learning_rate: 0.0001 * Math.cos((i / points) * Math.PI / 2),
            grad_norm: Math.random() * 1.5 + 0.5,
            gpu_utilization: Math.floor(80 + Math.random() * 20),
            gpu_memory_usage: Math.floor(60 + Math.random() * 35),
            gpu_temp: Math.floor(65 + Math.random() * 15),
            network_bw: Math.floor(500 + Math.random() * 200),
        });
    }
    return history;
}

export const mockTrainingJobs = [
    {
        id: 'job-001',
        name: 'qwen-7b-sft-on-alpaca-v2',
        status: 'Running',
        baseModel: 'Qwen/Qwen-7B',
        dataset: 'alpaca-gpt4-zh/v1.2',
        gpus: '4x A100-80G',
        duration: '12h 30m',
        loss: '1.253',
        throughput: '18,200 tokens/s',
        totalTokens: '2.1B',
        createdAt: '2024-07-29',
        history: generateHistory(25),
        artifacts: [
            { name: 'checkpoint-200', path: '/mnt/artifacts/job-001/checkpoint-200', size: '14.2 GB', createdAt: '10h 20m ago' },
            { name: 'checkpoint-100', path: '/mnt/artifacts/job-001/checkpoint-100', size: '14.2 GB', createdAt: '5h 10m ago' },
        ],
    },
    {
        id: 'job-002',
        name: 'llama3-8b-pretrain-finance',
        status: 'Completed',
        baseModel: 'meta-llama/Llama-3-8B',
        dataset: 'internal-customer-qa/v0.1-draft',
        gpus: '8x H800-80G',
        duration: '78h 15m',
        loss: '0.891',
        throughput: '35,600 tokens/s',
        totalTokens: '25.3B',
        createdAt: '2024-07-25',
        history: generateHistory(50),
         artifacts: [
            { name: 'checkpoint-final', path: '/mnt/artifacts/job-002/checkpoint-final', size: '16.8 GB', createdAt: '2d 10h ago' },
            { name: 'checkpoint-400', path: '/mnt/artifacts/job-002/checkpoint-400', size: '16.8 GB', createdAt: '3d 2h ago' },
        ],
    },
    {
        id: 'job-003',
        name: 'yi-34b-dpo-medical',
        status: 'Failed',
        baseModel: '01-ai/Yi-34B-Chat-200K',
        dataset: 'medical-dialogue-en/v1.0',
        gpus: '4x A100-80G',
        duration: '2h 5m',
        loss: 'N/A',
        throughput: 'N/A',
        totalTokens: '102M',
        createdAt: '2024-07-28',
        history: generateHistory(15, true),
        artifacts: [],
    },
    {
        id: 'job-004',
        name: 'gemma-2b-lora-tuning',
        status: 'Pending',
        baseModel: 'google/gemma-2b',
        dataset: 'dolly-v2-15k/v2.0',
        gpus: '1x RTX 4090',
        duration: 'N/A',
        loss: 'N/A',
        throughput: 'N/A',
        totalTokens: 'N/A',
        createdAt: '2024-07-30',
        history: [],
        artifacts: [],
    },
];

export const mockAlerts = [
    { id: 1, severity: 'Critical', source: 'Training', entity: 'job-003', message: 'Loss value is NaN. Gradient explosion suspected.', time: '2m ago' },
    { id: 2, severity: 'Warning', source: 'Inference', entity: 'Llama3-8B-Instruct-GGUF', message: 'P95 latency has increased by 50% in the last 15 mins.', time: '15m ago' },
    { id: 3, severity: 'Warning', source: 'System', entity: 'gpu-node-3', message: 'GPU temperature on device 2 reached 85°C.', time: '45m ago' },
    { id: 4, severity: 'Info', source: 'Data', entity: 'pipeline-json-to-parquet', message: 'Data pipeline completed successfully.', time: '1h ago' },
    { id: 5, severity: 'Critical', source: 'Inference', entity: 'Qwen-7B-Chat-AWQ', message: 'Service experiencing 5xx errors. Error rate > 5%.', time: '3h ago' },
];

export const mockSystemMetrics = (points = 20) => {
    const data = [];
    for (let i = 0; i < points; i++) {
        data.push({
            time: `-${(points - i) * 5}m`,
            gpu_util: Math.floor(70 + Math.random() * 25),
            gpu_mem: Math.floor(50 + Math.random() * 40),
            cpu_util: Math.floor(30 + Math.random() * 50),
            net_io: Math.floor(100 + Math.random() * 400),
        });
    }
    return data;
};

export const mockLogs = [
    { id: 1, time: '2024-07-31 10:00:05', level: 'INFO', source: 'Inference/Qwen-7B', message: 'Request received. prompt_len=512, max_tokens=1024' },
    { id: 2, time: '2024-07-31 10:00:06', level: 'INFO', source: 'Training/job-001', message: 'Step 201/500, Loss: 1.253, LR: 5.6e-6' },
    { id: 3, time: '2024-07-31 10:01:10', level: 'WARN', source: 'System/gpu-node-2', message: 'High memory pressure detected on NUMA node 1.' },
    { id: 4, time: '2024-07-31 10:02:30', level: 'INFO', source: 'Data/pipeline-08a', message: 'Processing chunk 5/10 of dataset medical-dialogue-en/v1.0' },
    { id: 5, time: '2024-07-31 10:03:00', level: 'ERROR', source: 'Inference/Llama3-8B', message: 'CUDA out of memory. Tried to allocate 2.52 GiB.' },
    { id: 6, time: '2024-07-31 10:03:01', level: 'INFO', source: 'Training/job-001', message: 'Step 202/500, Loss: 1.249, LR: 5.5e-6' },
];