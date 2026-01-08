# 设计文档 - 数据标注平台

## 概述

数据标注平台是一个基于 React + TypeScript + Vite 构建的现代化 Web 应用，用于图片和视频数据的专业标注。系统采用模块化架构，支持多种标注类型、AI 辅助标注、质量控制工作流和团队协作功能。

### 技术栈

- **前端框架**: React 19.2.0 + TypeScript 5.8.2
- **构建工具**: Vite 6.2.0
- **UI 库**: Tailwind CSS（基于现有项目）
- **Canvas 库**: Konva.js（用于标注绘制）
- **状态管理**: React Context API + Custom Hooks
- **数据存储**: IndexedDB（本地）+ RESTful API（服务器）
- **路由**: React Router v6

### 设计原则

1. **模块化**: 各功能模块独立开发和维护
2. **可扩展性**: 易于添加新的标注类型和 AI 模型
3. **性能优化**: 大数据集和视频的高效处理
4. **用户体验**: 直观的界面和流畅的交互
5. **数据安全**: 本地缓存和服务器同步机制

## 架构

### 系统架构图

```
┌─────────────────────────────────────────────────────────────┐
│                        前端应用层                              │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ 标注工作室 │  │ 数据中心  │  │   看板    │  │ 用户中心  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              大模型管理                                 │   │
│  └──────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│                      业务逻辑层                               │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ 标注引擎  │  │ 任务管理  │  │ 质量控制  │  │ 数据转换  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
├─────────────────────────────────────────────────────────────┤
│                      数据访问层                               │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                  │
│  │ IndexedDB │  │ LocalStorage│ │ API Client│                │
│  └──────────┘  └──────────┘  └──────────┘                  │
└─────────────────────────────────────────────────────────────┘
                          ↕
┌─────────────────────────────────────────────────────────────┐
│                      后端服务层                               │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                  │
│  │ RESTful API│ │ AI 模型服务│ │ 文件存储  │                  │
│  └──────────┘  └──────────┘  └──────────┘                  │
└─────────────────────────────────────────────────────────────┘
```

### 模块划分

#### 1. 标注工作室（Annotation Studio）
- **职责**: 提供标注界面和工具
- **子模块**:
  - Canvas 渲染引擎（基于 Konva.js）
  - 标注工具集（矩形、多边形、画笔等）
  - 视频播放器和帧控制
  - AI 预标注集成

#### 2. 数据中心（Data Center）
- **职责**: 数据集管理和展示
- **子模块**:
  - 数据集列表和详情
  - 数据导入/导出
  - 版本控制
  - 搜索和过滤

#### 3. 看板（Dashboard）
- **职责**: 统计分析和可视化
- **子模块**:
  - 标注统计图表
  - 质量指标展示
  - 标签分析
  - 进度跟踪

#### 4. 大模型管理（Model Management）
- **职责**: AI 模型配置和管理
- **子模块**:
  - 模型提供商配置
  - API 密钥管理
  - 模型列表和测试

#### 5. 用户中心（User Center）
- **职责**: 用户认证和资料管理
- **子模块**:
  - 登录/注册
  - 用户资料
  - 权限管理

## 组件和接口

### 核心组件

#### 1. DataImporter 组件

```typescript
interface DataImporterProps {
  onImportComplete: (data: ImportedData) => void;
  onError: (error: Error) => void;
}

interface ImportedData {
  type: 'local' | 'dataset';
  files: MediaFile[];
  annotations?: Annotation[];
  metadata?: DatasetMetadata;
}

interface MediaFile {
  id: string;
  name: string;
  type: 'image' | 'video';
  url: string;
  size: number;
  dimensions?: { width: number; height: number };
}

interface DatasetMetadata {
  name: string;
  description: string;
  format: 'coco' | 'yolo' | 'voc' | 'cvat' | 'labelme';
  categories: Category[];
}

// 本地文件导入
const importLocalFiles = async (files: File[]): Promise<MediaFile[]> => {
  return Promise.all(files.map(async (file) => {
    const url = URL.createObjectURL(file);
    const dimensions = await getMediaDimensions(file);
    
    return {
      id: generateId(),
      name: file.name,
      type: file.type.startsWith('video/') ? 'video' : 'image',
      url,
      size: file.size,
      dimensions
    };
  }));
};

// 开源数据集导入
const importDataset = async (
  files: File[], 
  format: DatasetMetadata['format']
): Promise<ImportedData> => {
  const parser = getDatasetParser(format);
  const parsed = await parser.parse(files);
  
  return {
    type: 'dataset',
    files: parsed.files,
    annotations: parsed.annotations,
    metadata: parsed.metadata
  };
};

// 数据集解析器接口
interface DatasetParser {
  parse(files: File[]): Promise<{
    files: MediaFile[];
    annotations: Annotation[];
    metadata: DatasetMetadata;
  }>;
}

// COCO 格式解析器
class COCOParser implements DatasetParser {
  async parse(files: File[]) {
    const annotationFile = files.find(f => f.name.endsWith('.json'));
    const imageFiles = files.filter(f => f.type.startsWith('image/'));
    
    if (!annotationFile) {
      throw new Error('COCO annotation file not found');
    }
    
    const cocoData = JSON.parse(await annotationFile.text());
    
    // 转换 COCO 格式到内部格式
    const annotations = cocoData.annotations.map((ann: any) => ({
      id: String(ann.id),
      type: 'rectangle',
      label: cocoData.categories.find((c: any) => c.id === ann.category_id)?.name,
      geometry: {
        type: 'rectangle',
        x: ann.bbox[0],
        y: ann.bbox[1],
        width: ann.bbox[2],
        height: ann.bbox[3]
      },
      confidence: ann.score,
      createdBy: 'imported',
      createdAt: new Date().toISOString()
    }));
    
    const files = await importLocalFiles(imageFiles);
    
    return {
      files,
      annotations,
      metadata: {
        name: cocoData.info?.description || 'Imported Dataset',
        description: cocoData.info?.description || '',
        format: 'coco',
        categories: cocoData.categories.map((c: any) => ({
          id: String(c.id),
          name: c.name,
          color: generateColor()
        }))
      }
    };
  }
}

// YOLO 格式解析器
class YOLOParser implements DatasetParser {
  async parse(files: File[]) {
    const classFile = files.find(f => f.name === 'classes.txt' || f.name === 'data.yaml');
    const imageFiles = files.filter(f => f.type.startsWith('image/'));
    const labelFiles = files.filter(f => f.name.endsWith('.txt') && f !== classFile);
    
    if (!classFile) {
      throw new Error('YOLO class file not found');
    }
    
    const classNames = (await classFile.text()).split('\n').filter(Boolean);
    
    // 解析标注文件
    const annotations: Annotation[] = [];
    for (const labelFile of labelFiles) {
      const content = await labelFile.text();
      const lines = content.split('\n').filter(Boolean);
      
      lines.forEach(line => {
        const [classId, x, y, width, height] = line.split(' ').map(Number);
        annotations.push({
          id: generateId(),
          type: 'rectangle',
          label: classNames[classId],
          geometry: {
            type: 'rectangle',
            x: x - width / 2, // YOLO 使用中心点坐标
            y: y - height / 2,
            width,
            height
          },
          createdBy: 'imported',
          createdAt: new Date().toISOString()
        });
      });
    }
    
    const mediaFiles = await importLocalFiles(imageFiles);
    
    return {
      files: mediaFiles,
      annotations,
      metadata: {
        name: 'YOLO Dataset',
        description: 'Imported from YOLO format',
        format: 'yolo',
        categories: classNames.map((name, idx) => ({
          id: String(idx),
          name,
          color: generateColor()
        }))
      }
    };
  }
}

// 获取对应格式的解析器
const getDatasetParser = (format: DatasetMetadata['format']): DatasetParser => {
  switch (format) {
    case 'coco':
      return new COCOParser();
    case 'yolo':
      return new YOLOParser();
    case 'voc':
      return new VOCParser();
    case 'cvat':
      return new CVATParser();
    case 'labelme':
      return new LabelMeParser();
    default:
      throw new Error(`Unsupported format: ${format}`);
  }
};
```

#### 2. AnnotationCanvas 组件

```typescript
interface AnnotationCanvasProps {
  imageUrl: string;
  annotations: Annotation[];
  mode: 'view' | 'edit' | 'review';
  toolType: ToolType;
  onAnnotationCreate: (annotation: Annotation) => void;
  onAnnotationUpdate: (id: string, updates: Partial<Annotation>) => void;
  onAnnotationDelete: (id: string) => void;
}

type ToolType = 'rectangle' | 'polygon' | 'brush' | 'point' | 'circle';

interface Annotation {
  id: string;
  type: ToolType;
  label: string;
  geometry: Geometry;
  confidence?: number;
  createdBy: string;
  createdAt: string;
  modifiedAt?: string;
}

type Geometry = 
  | { type: 'rectangle'; x: number; y: number; width: number; height: number }
  | { type: 'polygon'; points: Point[] }
  | { type: 'circle'; cx: number; cy: number; radius: number }
  | { type: 'point'; x: number; y: number };

interface Point {
  x: number;
  y: number;
}
```

#### 2. ImportWorkflow 组件

```typescript
interface ImportWorkflowProps {
  onComplete: (data: ImportedData) => void;
}

const ImportWorkflow: React.FC<ImportWorkflowProps> = ({ onComplete }) => {
  const [step, setStep] = useState<'select' | 'upload' | 'preview' | 'confirm'>('select');
  const [importType, setImportType] = useState<'local' | 'dataset'>('local');
  const [format, setFormat] = useState<DatasetMetadata['format']>('coco');
  const [files, setFiles] = useState<File[]>([]);
  const [importedData, setImportedData] = useState<ImportedData | null>(null);
  
  // 步骤 1: 选择导入类型
  const renderSelectStep = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">选择导入方式</h2>
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setImportType('local')}
          className={`p-6 border-2 rounded-lg ${
            importType === 'local' ? 'border-indigo-600' : 'border-gray-300'
          }`}
        >
          <UploadIcon className="w-12 h-12 mx-auto mb-2" />
          <h3 className="font-semibold">本地文件</h3>
          <p className="text-sm text-gray-600">上传图片或视频文件</p>
        </button>
        <button
          onClick={() => setImportType('dataset')}
          className={`p-6 border-2 rounded-lg ${
            importType === 'dataset' ? 'border-indigo-600' : 'border-gray-300'
          }`}
        >
          <DatabaseIcon className="w-12 h-12 mx-auto mb-2" />
          <h3 className="font-semibold">开源数据集</h3>
          <p className="text-sm text-gray-600">导入 COCO、YOLO 等格式</p>
        </button>
      </div>
      <button
        onClick={() => setStep('upload')}
        className="w-full py-2 bg-indigo-600 text-white rounded-md"
      >
        下一步
      </button>
    </div>
  );
  
  // 步骤 2: 上传文件
  const renderUploadStep = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">
        {importType === 'local' ? '上传文件' : '上传数据集'}
      </h2>
      
      {importType === 'dataset' && (
        <div>
          <label className="block text-sm font-medium mb-2">数据集格式</label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as any)}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="coco">COCO (JSON)</option>
            <option value="yolo">YOLO (TXT)</option>
            <option value="voc">Pascal VOC (XML)</option>
            <option value="cvat">CVAT (XML/JSON)</option>
            <option value="labelme">LabelMe (JSON)</option>
          </select>
        </div>
      )}
      
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <UploadIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <p className="text-lg mb-2">拖拽文件到此处或点击上传</p>
        <p className="text-sm text-gray-600 mb-4">
          {importType === 'local' 
            ? '支持 JPG、PNG、MP4、AVI 等格式'
            : '请上传标注文件和图片文件'}
        </p>
        <input
          type="file"
          multiple
          accept={importType === 'local' ? 'image/*,video/*' : '*'}
          onChange={handleFileSelect}
          className="hidden"
          id="file-input"
        />
        <label
          htmlFor="file-input"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md cursor-pointer"
        >
          选择文件
        </label>
      </div>
      
      {files.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold">已选择 {files.length} 个文件</h3>
          <div className="max-h-40 overflow-y-auto space-y-1">
            {files.map((file, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm truncate">{file.name}</span>
                <span className="text-xs text-gray-500">{formatFileSize(file.size)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex gap-2">
        <button
          onClick={() => setStep('select')}
          className="flex-1 py-2 border border-gray-300 rounded-md"
        >
          上一步
        </button>
        <button
          onClick={handleImport}
          disabled={files.length === 0}
          className="flex-1 py-2 bg-indigo-600 text-white rounded-md disabled:opacity-50"
        >
          导入
        </button>
      </div>
    </div>
  );
  
  // 步骤 3: 预览导入结果
  const renderPreviewStep = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">预览导入结果</h2>
      
      {importedData && (
        <>
          <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-600">文件数量</p>
              <p className="text-2xl font-bold">{importedData.files.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">标注数量</p>
              <p className="text-2xl font-bold">{importedData.annotations?.length || 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">类别数量</p>
              <p className="text-2xl font-bold">{importedData.metadata?.categories.length || 0}</p>
            </div>
          </div>
          
          {importedData.metadata && (
            <div className="space-y-2">
              <h3 className="font-semibold">类别列表</h3>
              <div className="flex flex-wrap gap-2">
                {importedData.metadata.categories.map(cat => (
                  <span
                    key={cat.id}
                    className="px-3 py-1 rounded-full text-sm"
                    style={{ backgroundColor: cat.color + '20', color: cat.color }}
                  >
                    {cat.name}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <h3 className="font-semibold">样本预览</h3>
            <div className="grid grid-cols-4 gap-2">
              {importedData.files.slice(0, 8).map(file => (
                <div key={file.id} className="aspect-square bg-gray-100 rounded overflow-hidden">
                  {file.type === 'image' ? (
                    <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                  ) : (
                    <video src={file.url} className="w-full h-full object-cover" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
      
      <div className="flex gap-2">
        <button
          onClick={() => setStep('upload')}
          className="flex-1 py-2 border border-gray-300 rounded-md"
        >
          重新导入
        </button>
        <button
          onClick={() => {
            onComplete(importedData!);
            setStep('select');
          }}
          className="flex-1 py-2 bg-indigo-600 text-white rounded-md"
        >
          确认导入
        </button>
      </div>
    </div>
  );
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      setFiles(Array.from(e.dataTransfer.files));
    }
  };
  
  const handleImport = async () => {
    try {
      let data: ImportedData;
      
      if (importType === 'local') {
        const mediaFiles = await importLocalFiles(files);
        data = {
          type: 'local',
          files: mediaFiles
        };
      } else {
        data = await importDataset(files, format);
      }
      
      setImportedData(data);
      setStep('preview');
    } catch (error) {
      console.error('Import failed:', error);
      // 显示错误提示
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto p-6">
      {step === 'select' && renderSelectStep()}
      {step === 'upload' && renderUploadStep()}
      {step === 'preview' && renderPreviewStep()}
    </div>
  );
};
```

#### 3. VideoPlayer 组件

```typescript
interface VideoPlayerProps {
  videoUrl: string;
  annotations: VideoAnnotation[];
  currentFrame: number;
  onFrameChange: (frame: number) => void;
  onAnnotationCreate: (annotation: VideoAnnotation) => void;
}

interface VideoAnnotation extends Annotation {
  frameStart: number;
  frameEnd: number;
  trackId?: string; // 用于对象跟踪
}
```

#### 3. TaskManager 组件

```typescript
interface Task {
  id: string;
  projectId: string;
  name: string;
  description: string;
  dataType: 'image' | 'video';
  status: TaskStatus;
  assignedTo: string[];
  reviewer: string;
  createdAt: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  progress: number; // 0-100
}

type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'under_review' | 'rejected' | 'approved';

interface TaskManagerProps {
  tasks: Task[];
  onTaskCreate: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onTaskUpdate: (id: string, updates: Partial<Task>) => void;
  onTaskAssign: (taskId: string, userId: string) => void;
}
```

#### 4. QualityControl 组件

```typescript
interface ReviewSession {
  id: string;
  taskId: string;
  reviewerId: string;
  status: 'pending' | 'approved' | 'rejected';
  comments: Comment[];
  createdAt: string;
}

interface Comment {
  id: string;
  annotationId: string;
  text: string;
  type: 'issue' | 'suggestion' | 'approval';
  createdBy: string;
  createdAt: string;
}

interface QualityControlProps {
  task: Task;
  annotations: Annotation[];
  onApprove: () => void;
  onReject: (reason: string) => void;
  onCommentAdd: (comment: Omit<Comment, 'id' | 'createdAt'>) => void;
}
```

### API 接口

#### 项目和任务 API

```typescript
// 获取项目列表
GET /api/projects
Response: Project[]

// 创建项目
POST /api/projects
Body: { name: string; description: string; annotationType: string; categories: string[] }
Response: Project

// 获取任务列表
GET /api/tasks?projectId={id}&status={status}
Response: Task[]

// 创建任务
POST /api/tasks
Body: { projectId: string; name: string; dataUrls: string[]; assignedTo: string[] }
Response: Task

// 更新任务状态
PATCH /api/tasks/{id}/status
Body: { status: TaskStatus }
Response: Task
```

#### 标注 API

```typescript
// 获取标注数据
GET /api/annotations?taskId={id}
Response: Annotation[]

// 保存标注
POST /api/annotations
Body: { taskId: string; annotations: Annotation[] }
Response: { success: boolean }

// 更新标注
PATCH /api/annotations/{id}
Body: Partial<Annotation>
Response: Annotation

// 删除标注
DELETE /api/annotations/{id}
Response: { success: boolean }
```

#### AI 模型 API

```typescript
// 获取预标注
POST /api/ai/predict
Body: { imageUrl: string; modelId: string; confidenceThreshold: number }
Response: { annotations: Annotation[] }

// 获取模型列表
GET /api/models
Response: Model[]

interface Model {
  id: string;
  name: string;
  type: 'detection' | 'segmentation';
  provider: string;
  status: 'active' | 'inactive';
}
```

#### 数据导入/导出 API

```typescript
// 导入数据集
POST /api/datasets/import
Body: FormData (files + format)
Response: { datasetId: string; importedCount: number }

// 导出数据集
POST /api/datasets/{id}/export
Body: { format: 'coco' | 'yolo' | 'voc' | 'cvat' }
Response: { downloadUrl: string }
```

## 数据模型

### 核心数据结构

#### Project（项目）

```typescript
interface Project {
  id: string;
  name: string;
  description: string;
  annotationType: 'detection' | 'segmentation' | 'classification';
  categories: Category[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  settings: ProjectSettings;
}

interface Category {
  id: string;
  name: string;
  color: string;
  parentId?: string; // 支持层级分类
}

interface ProjectSettings {
  allowOverlap: boolean; // 是否允许标注重叠
  requireReview: boolean; // 是否需要审核
  minAnnotationsPerImage: number;
  maxAnnotationsPerImage: number;
}
```

#### Dataset（数据集）

```typescript
interface Dataset {
  id: string;
  name: string;
  description: string;
  projectId: string;
  version: string;
  status: 'draft' | 'published';
  statistics: DatasetStatistics;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface DatasetStatistics {
  totalImages: number;
  totalAnnotations: number;
  categoryDistribution: Record<string, number>;
  annotationQuality: {
    averageConfidence: number;
    reviewedCount: number;
    approvedCount: number;
  };
}
```

#### User（用户）

```typescript
interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  profile: UserProfile;
  createdAt: string;
}

type UserRole = 'admin' | 'project_manager' | 'annotator' | 'reviewer';

interface UserProfile {
  displayName: string;
  avatar?: string;
  statistics: {
    tasksCompleted: number;
    annotationsCreated: number;
    averageQuality: number;
  };
}
```

### 数据存储策略

#### IndexedDB 结构

```typescript
// 数据库名称: AnnotationPlatformDB
// 版本: 1

// Object Stores:
1. projects: { keyPath: 'id', indexes: ['createdBy', 'createdAt'] }
2. tasks: { keyPath: 'id', indexes: ['projectId', 'status', 'assignedTo'] }
3. annotations: { keyPath: 'id', indexes: ['taskId', 'createdBy'] }
4. cache: { keyPath: 'key' } // 用于缓存图片和临时数据
```

#### 数据同步机制

```typescript
interface SyncManager {
  // 上传本地更改到服务器
  syncToServer(): Promise<SyncResult>;
  
  // 从服务器下载更新
  syncFromServer(): Promise<SyncResult>;
  
  // 处理冲突
  resolveConflict(localData: any, serverData: any): any;
  
  // 离线队列
  queueOfflineAction(action: OfflineAction): void;
}

interface SyncResult {
  success: boolean;
  synced: number;
  failed: number;
  conflicts: Conflict[];
}

interface Conflict {
  id: string;
  type: 'annotation' | 'task';
  localVersion: any;
  serverVersion: any;
}
```

## 错误处理

### 错误类型

```typescript
class AnnotationError extends Error {
  constructor(
    message: string,
    public code: ErrorCode,
    public details?: any
  ) {
    super(message);
    this.name = 'AnnotationError';
  }
}

enum ErrorCode {
  // 网络错误
  NETWORK_ERROR = 'NETWORK_ERROR',
  API_ERROR = 'API_ERROR',
  
  // 数据错误
  INVALID_DATA = 'INVALID_DATA',
  DATA_NOT_FOUND = 'DATA_NOT_FOUND',
  
  // 权限错误
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  
  // 业务逻辑错误
  INVALID_ANNOTATION = 'INVALID_ANNOTATION',
  TASK_LOCKED = 'TASK_LOCKED',
  QUOTA_EXCEEDED = 'QUOTA_EXCEEDED',
  
  // AI 模型错误
  MODEL_ERROR = 'MODEL_ERROR',
  MODEL_UNAVAILABLE = 'MODEL_UNAVAILABLE',
}
```

### 错误处理策略

1. **网络错误**: 自动重试（最多3次），失败后提示用户并缓存到本地
2. **数据验证错误**: 显示具体错误信息，阻止提交
3. **权限错误**: 重定向到登录页面或显示权限不足提示
4. **AI 模型错误**: 降级到手动标注模式，记录错误日志
5. **冲突错误**: 提供冲突解决界面，让用户选择保留哪个版本

### 错误边界组件

```typescript
interface ErrorBoundaryProps {
  fallback: React.ComponentType<{ error: Error; reset: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps> {
  // 捕获组件树中的错误
  // 显示降级 UI
  // 记录错误日志
}
```

## 测试策略

### 测试金字塔

```
        ┌─────────────┐
        │  E2E Tests  │  (10%)
        ├─────────────┤
        │Integration  │  (20%)
        │   Tests     │
        ├─────────────┤
        │   Unit      │  (70%)
        │   Tests     │
        └─────────────┘
```

### 单元测试

使用 Vitest 进行单元测试，覆盖：

1. **工具函数**: 数据转换、验证、计算等
2. **Hooks**: 自定义 React Hooks
3. **组件逻辑**: 组件的业务逻辑部分
4. **数据模型**: 数据结构的验证和转换

示例：

```typescript
// 测试标注数据验证
describe('validateAnnotation', () => {
  it('should accept valid rectangle annotation', () => {
    const annotation = {
      id: '1',
      type: 'rectangle',
      label: 'person',
      geometry: { type: 'rectangle', x: 0, y: 0, width: 100, height: 100 }
    };
    expect(validateAnnotation(annotation)).toBe(true);
  });
  
  it('should reject annotation with negative dimensions', () => {
    const annotation = {
      id: '1',
      type: 'rectangle',
      label: 'person',
      geometry: { type: 'rectangle', x: 0, y: 0, width: -100, height: 100 }
    };
    expect(validateAnnotation(annotation)).toBe(false);
  });
});
```

### 集成测试

测试组件之间的交互和数据流：

1. **标注工作流**: 创建、编辑、删除标注的完整流程
2. **任务管理流程**: 创建任务、分配、审核的完整流程
3. **数据导入/导出**: 不同格式的转换和验证

### 属性测试（Property-Based Testing）

使用 fast-check 库进行属性测试，验证系统的通用属性。

**测试库配置**:
- 使用 fast-check 作为属性测试库
- 每个属性测试至少运行 100 次迭代
- 每个测试必须引用设计文档中的属性编号

## 正确性属性

*属性是系统应该在所有有效执行中保持为真的特征或行为——本质上是关于系统应该做什么的形式化陈述。属性作为人类可读规范和机器可验证正确性保证之间的桥梁。*


### 属性反思

在编写正确性属性之前，我识别了以下可以合并的冗余属性：

1. **CRUD操作属性**: 项目创建、任务创建、标注创建等可以合并为通用的"创建操作保留所有字段"属性
2. **状态转换属性**: 任务状态变更、审核状态变更可以合并为"状态转换记录历史"属性
3. **搜索过滤属性**: 任务搜索、数据集搜索可以合并为"搜索结果符合过滤条件"属性
4. **数据格式转换**: 多种导入/导出格式可以合并为"往返转换保持等价性"属性
5. **权限检查属性**: 不同模块的权限检查可以合并为"权限控制正确性"属性

### 正确性属性列表

#### 属性 1: 创建操作保留所有字段
*对于任何*有效的实体数据（项目、任务、标注等），创建操作后查询该实体应该返回包含所有原始字段的对象
**验证需求: 1.1, 1.2, 2.1-2.7, 3.1-3.7**

#### 属性 2: 状态转换记录历史
*对于任何*状态转换序列，系统应该记录完整的状态历史，包括每次转换的时间戳和操作者
**验证需求: 1.5, 6.1-6.6**

#### 属性 3: 搜索结果符合过滤条件
*对于任何*搜索条件和数据集合，返回的所有结果都应该满足指定的过滤条件
**验证需求: 1.6, 11.5**

#### 属性 4: 标注数据完整性
*对于任何*标注操作（创建、更新、删除），操作后的标注列表应该反映该操作的效果
**验证需求: 2.1-2.8, 3.1-3.7**

#### 属性 5: 视频标注帧关联
*对于任何*视频标注，标注应该正确关联到指定的帧范围，且帧号应该在视频的有效范围内
**验证需求: 4.3, 4.4, 4.5**

#### 属性 6: 视频标注插值一致性
*对于任何*两个关键帧之间的标注，插值生成的中间帧标注应该在几何上平滑过渡
**验证需求: 4.4**

#### 属性 7: AI预标注置信度过滤
*对于任何*置信度阈值，批量接受操作应该只接受置信度大于等于阈值的预标注
**验证需求: 5.5**

#### 属性 8: 审核流程状态一致性
*对于任何*审核操作（接受、拒绝），任务状态应该正确转换，且审核记录应该包含操作者和时间戳
**验证需求: 6.1-6.6**

#### 属性 9: 标注者间一致性计算正确性
*对于任何*多个标注者的标注集合，计算的一致性指标（IoU、Kappa）应该在有效范围内[0, 1]
**验证需求: 7.1, 7.2**

#### 属性 10: 权限控制正确性
*对于任何*用户和操作，系统应该根据用户角色正确允许或拒绝该操作
**验证需求: 8.1-8.5**

#### 属性 11: 进度统计准确性
*对于任何*项目或任务集合，计算的进度百分比应该等于已完成数量除以总数量
**验证需求: 9.1, 9.2, 15.1**

#### 属性 12: 数据导出往返一致性
*对于任何*有效的标注数据集，导出为某种格式然后重新导入应该得到等价的数据结构
**验证需求: 10.2-10.4, 12.1-12.10**

#### 属性 13: 数据集搜索结果正确性
*对于任何*搜索查询，返回的数据集应该在名称、标签或类别中包含查询关键词
**验证需求: 11.5**

#### 属性 14: 版本历史完整性
*对于任何*数据集修改序列，版本历史应该包含所有修改记录，且按时间顺序排列
**验证需求: 13.1, 13.2**

#### 属性 15: 版本差异计算正确性
*对于任何*两个数据集版本，差异应该准确反映新增、删除和修改的标注
**验证需求: 13.3**

#### 属性 16: 标签统计准确性
*对于任何*标注集合，每个标签的统计数量应该等于该标签在集合中出现的次数
**验证需求: 16.1, 16.2**

#### 属性 17: 质量指标计算正确性
*对于任何*审核记录集合，通过率应该等于通过数量除以总审核数量
**验证需求: 17.1, 17.2**

#### 属性 18: API密钥加密往返一致性
*对于任何*有效的API密钥，加密后解密应该得到原始密钥
**验证需求: 19.1, 19.2**

#### 属性 19: 数据持久化往返一致性
*对于任何*标注数据，保存到本地存储然后读取应该得到等价的数据
**验证需求: 24.1**

#### 属性 20: 数据同步往返一致性
*对于任何*本地数据，同步到服务器然后从服务器同步回来应该得到等价的数据（无冲突情况下）
**验证需求: 24.2, 24.3**

#### 属性 21: 冲突检测正确性
*对于任何*本地和服务器的数据版本，如果修改时间戳不同，系统应该检测到冲突
**验证需求: 24.6**

#### 属性 22: 标注几何有效性
*对于任何*标注几何数据，坐标应该在图片边界内，且尺寸应该为正数
**验证需求: 2.1-2.7, 3.1-3.7**

#### 属性 23: 任务分配一致性
*对于任何*任务分配操作，分配后的任务应该出现在被分配用户的任务列表中
**验证需求: 1.4, 8.4**

#### 属性 24: 数据删除完整性
*对于任何*删除操作，被删除的实体不应该出现在后续的查询结果中
**验证需求: 2.8, 14.3**

#### 属性 25: 批量操作原子性
*对于任何*批量操作，要么所有操作都成功，要么所有操作都失败（不应该部分成功）
**验证需求: 5.5**


## 性能优化

### 大数据集处理

#### 虚拟滚动
对于包含大量图片的数据集，使用虚拟滚动技术只渲染可见区域的内容：

```typescript
interface VirtualScrollProps {
  items: any[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: any, index: number) => React.ReactNode;
}

// 只渲染可见范围内的项目
const visibleItems = items.slice(startIndex, endIndex);
```

#### 图片懒加载
使用 Intersection Observer API 实现图片懒加载：

```typescript
const useImageLazyLoad = (imageUrl: string) => {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setLoaded(true);
        observer.disconnect();
      }
    });
    
    if (imgRef.current) {
      observer.observe(imgRef.current);
    }
    
    return () => observer.disconnect();
  }, []);
  
  return { loaded, imgRef };
};
```

#### Canvas 性能优化
使用 Konva.js 的性能优化技术：

1. **图层分离**: 将静态内容和动态内容分离到不同图层
2. **缓存**: 对复杂形状使用缓存
3. **批量更新**: 使用 `batchDraw()` 减少重绘次数

```typescript
// 图层分离
const imageLayer = new Konva.Layer(); // 静态图片层
const annotationLayer = new Konva.Layer(); // 标注层
const interactionLayer = new Konva.Layer(); // 交互层

// 缓存复杂形状
complexShape.cache();

// 批量更新
stage.batchDraw();
```

### 视频处理优化

#### 帧提取和缓存
预先提取关键帧并缓存到 IndexedDB：

```typescript
interface FrameCache {
  videoId: string;
  frameNumber: number;
  imageData: Blob;
  timestamp: number;
}

const extractKeyFrames = async (videoUrl: string, interval: number) => {
  const video = document.createElement('video');
  video.src = videoUrl;
  
  const frames: FrameCache[] = [];
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  
  for (let time = 0; time < video.duration; time += interval) {
    video.currentTime = time;
    await new Promise(resolve => video.onseeked = resolve);
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);
    
    const blob = await new Promise<Blob>(resolve => 
      canvas.toBlob(blob => resolve(blob!))
    );
    
    frames.push({
      videoId: generateId(),
      frameNumber: Math.floor(time * video.fps),
      imageData: blob,
      timestamp: Date.now()
    });
  }
  
  return frames;
};
```

### 数据同步优化

#### 增量同步
只同步变更的数据，而不是整个数据集：

```typescript
interface SyncDelta {
  created: Annotation[];
  updated: Annotation[];
  deleted: string[];
  lastSyncTimestamp: number;
}

const getLocalChanges = async (lastSyncTime: number): Promise<SyncDelta> => {
  const db = await openDB();
  
  const created = await db.annotations
    .where('createdAt').above(lastSyncTime)
    .toArray();
    
  const updated = await db.annotations
    .where('updatedAt').above(lastSyncTime)
    .and(a => a.createdAt <= lastSyncTime)
    .toArray();
    
  const deleted = await db.deletedAnnotations
    .where('deletedAt').above(lastSyncTime)
    .toArray();
    
  return { created, updated, deleted: deleted.map(d => d.id), lastSyncTimestamp: Date.now() };
};
```

#### 后台同步
使用 Web Workers 在后台执行数据同步：

```typescript
// sync-worker.ts
self.addEventListener('message', async (event) => {
  const { type, data } = event.data;
  
  if (type === 'SYNC') {
    try {
      const result = await syncToServer(data);
      self.postMessage({ type: 'SYNC_SUCCESS', result });
    } catch (error) {
      self.postMessage({ type: 'SYNC_ERROR', error });
    }
  }
});

// 主线程
const syncWorker = new Worker('sync-worker.ts');
syncWorker.postMessage({ type: 'SYNC', data: localChanges });
```

## 安全性考虑

### 数据加密

#### API 密钥加密
使用 Web Crypto API 加密存储的 API 密钥：

```typescript
const encryptApiKey = async (apiKey: string, masterKey: CryptoKey): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(apiKey);
  
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    masterKey,
    data
  );
  
  // 将 IV 和加密数据组合
  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(encrypted), iv.length);
  
  return btoa(String.fromCharCode(...combined));
};

const decryptApiKey = async (encryptedKey: string, masterKey: CryptoKey): Promise<string> => {
  const combined = Uint8Array.from(atob(encryptedKey), c => c.charCodeAt(0));
  const iv = combined.slice(0, 12);
  const data = combined.slice(12);
  
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    masterKey,
    data
  );
  
  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
};
```

### XSS 防护

对用户输入进行清理和转义：

```typescript
import DOMPurify from 'dompurify';

const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [], // 不允许任何 HTML 标签
    ALLOWED_ATTR: []
  });
};

// 在显示用户输入前进行清理
const displayUserInput = (input: string) => {
  const sanitized = sanitizeInput(input);
  return <div>{sanitized}</div>;
};
```

### CSRF 防护

在所有 API 请求中包含 CSRF 令牌：

```typescript
const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'X-CSRF-Token': getCsrfToken()
  }
});

const getCsrfToken = (): string => {
  return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
};
```

## 可访问性

### 键盘导航

确保所有功能都可以通过键盘访问：

```typescript
const AnnotationTool = () => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'r':
          setToolType('rectangle');
          break;
        case 'p':
          setToolType('polygon');
          break;
        case 'Delete':
          deleteSelectedAnnotation();
          break;
        case 'Escape':
          cancelCurrentOperation();
          break;
        case 'z':
          if (e.ctrlKey || e.metaKey) {
            undo();
          }
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  return <div role="application" aria-label="Annotation Tool">...</div>;
};
```

### ARIA 标签

为所有交互元素添加适当的 ARIA 标签：

```typescript
<button
  aria-label="Create rectangle annotation"
  aria-pressed={toolType === 'rectangle'}
  onClick={() => setToolType('rectangle')}
>
  <RectangleIcon />
</button>

<div
  role="list"
  aria-label="Annotation list"
>
  {annotations.map(annotation => (
    <div
      key={annotation.id}
      role="listitem"
      aria-label={`${annotation.label} annotation`}
    >
      {annotation.label}
    </div>
  ))}
</div>
```

## 国际化

使用 i18next 实现多语言支持：

```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          'annotation.create': 'Create Annotation',
          'annotation.edit': 'Edit Annotation',
          'annotation.delete': 'Delete Annotation'
        }
      },
      zh: {
        translation: {
          'annotation.create': '创建标注',
          'annotation.edit': '编辑标注',
          'annotation.delete': '删除标注'
        }
      }
    },
    lng: 'zh',
    fallbackLng: 'en'
  });

// 使用
const { t } = useTranslation();
<button>{t('annotation.create')}</button>
```

## 部署和运维

### 构建优化

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'canvas-vendor': ['konva', 'react-konva'],
          'ui-vendor': ['@headlessui/react', 'framer-motion']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  optimizeDeps: {
    include: ['konva', 'react-konva']
  }
});
```

### 监控和日志

```typescript
interface LogEntry {
  level: 'info' | 'warn' | 'error';
  message: string;
  context?: any;
  timestamp: number;
}

class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];
  
  static getInstance() {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }
  
  log(level: LogEntry['level'], message: string, context?: any) {
    const entry: LogEntry = {
      level,
      message,
      context,
      timestamp: Date.now()
    };
    
    this.logs.push(entry);
    
    // 发送到监控服务
    if (level === 'error') {
      this.sendToMonitoring(entry);
    }
    
    // 控制台输出
    console[level](message, context);
  }
  
  private sendToMonitoring(entry: LogEntry) {
    // 发送到 Sentry、LogRocket 等监控服务
    fetch('/api/logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry)
    });
  }
}

// 使用
const logger = Logger.getInstance();
logger.log('error', 'Failed to save annotation', { annotationId: '123' });
```

## 总结

本设计文档详细描述了数据标注平台的架构、组件、接口和实现细节。系统采用模块化设计，确保各模块之间的低耦合和高内聚。通过使用现代化的技术栈和最佳实践，系统能够提供高性能、高可用性和良好的用户体验。

关键设计决策：
1. 使用 Konva.js 作为 Canvas 库，提供高性能的标注绘制
2. 采用 IndexedDB 进行本地数据存储，支持离线工作
3. 实现增量同步机制，减少网络传输
4. 使用属性测试验证系统的正确性属性
5. 提供完善的错误处理和用户反馈机制
