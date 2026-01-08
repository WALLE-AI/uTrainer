# 需求文档 - 数据标注平台

## 简介

数据标注平台是一个专业的图片和视频数据标注 Web 应用系统。该平台支持多种标注类型、智能辅助标注、质量控制工作流、团队协作、数据集管理和统计分析，旨在为机器学习和计算机视觉项目提供高效、高质量的数据标注解决方案。

## 术语表

- **标注工作室（Annotation_Studio）**: 用户进行图片和视频标注的主要工作界面
- **数据中心（Data_Center）**: 管理和展示数据集的模块
- **看板（Dashboard）**: 展示数据集统计分析和标注进度的可视化界面
- **大模型管理（Model_Management）**: 管理 AI 模型提供商、API 密钥和模型列表的模块
- **用户中心（User_Center）**: 管理用户账号、登录和个人信息的模块
- **任务（Task）**: 一个包含待标注数据的工作单元
- **项目（Project）**: 包含多个任务的标注项目集合
- **标注者（Annotator）**: 执行标注工作的用户角色
- **审核者（Reviewer）**: 审核标注质量的用户角色
- **模型辅助标注（Model_Assisted_Labeling）**: 使用 AI 模型生成预标注以提高效率
- **质量控制（Quality_Control）**: 确保标注质量的审核和验证流程
- **COCO格式（COCO_Format）**: 常用的目标检测数据集标注格式

## 需求

### 需求 1: 标注工作室 - 数据导入

**用户故事:** 作为标注人员，我想导入本地文件或开源数据集到标注工作室，以便开始标注工作。

#### 验收标准

1. WHEN 用户打开标注工作室 THEN THE Annotation_Studio SHALL 显示数据导入选项
2. WHEN 用户选择本地文件导入 THEN THE Annotation_Studio SHALL 支持拖拽或选择图片和视频文件
3. WHEN 用户选择数据集导入 THEN THE Annotation_Studio SHALL 提供格式选择（COCO、YOLO、Pascal VOC、CVAT、LabelMe）
4. WHEN 用户上传数据集文件 THEN THE Annotation_Studio SHALL 解析标注文件并提取标注数据
5. WHEN 导入完成 THEN THE Annotation_Studio SHALL 显示导入统计（文件数量、标注数量、类别数量）
6. WHEN 用户预览导入结果 THEN THE Annotation_Studio SHALL 显示样本图片和类别列表
7. WHEN 用户确认导入 THEN THE Annotation_Studio SHALL 将数据加载到标注界面
8. WHEN 导入失败 THEN THE Annotation_Studio SHALL 显示具体错误信息和修复建议

### 需求 2: 项目和任务管理

**用户故事:** 作为项目管理员，我想创建和管理标注项目和任务，以便组织团队的标注工作。

#### 验收标准

1. WHEN 用户创建项目 THEN THE System SHALL 允许用户设置项目名称、描述、标注类型和类别列表
2. WHEN 用户创建任务 THEN THE System SHALL 允许用户上传数据并分配给标注者
3. WHEN 用户查看项目 THEN THE System SHALL 显示项目下所有任务的进度和状态
4. WHEN 用户分配任务 THEN THE System SHALL 允许指定标注者和审核者
5. WHEN 任务状态变更 THEN THE System SHALL 记录状态历史和时间戳
6. WHEN 用户搜索任务 THEN THE System SHALL 支持按状态、标注者、日期等条件过滤

### 需求 3: 标注工作室 - 目标检测标注

**用户故事:** 作为标注人员，我想使用目标检测工具对图片进行标注，以便创建目标检测训练数据。

#### 验收标准

1. WHEN 用户选择目标检测任务 THEN THE Annotation_Studio SHALL 提供矩形框、圆形和点标注工具
2. WHEN 用户绘制矩形框 THEN THE Annotation_Studio SHALL 允许用户拖拽创建边界框
3. WHEN 用户创建标注 THEN THE Annotation_Studio SHALL 允许用户从预定义类别列表中选择标签
4. WHEN 用户编辑标注 THEN THE Annotation_Studio SHALL 允许调整位置、大小和标签
5. WHEN 用户删除标注 THEN THE Annotation_Studio SHALL 从当前图片中移除该标注
6. WHEN 用户使用快捷键 THEN THE Annotation_Studio SHALL 支持键盘快捷键加速标注
7. WHEN 用户保存标注 THEN THE Annotation_Studio SHALL 自动保存到本地存储并同步到服务器

### 需求 4: 标注工作室 - 图像分割标注

**用户故事:** 作为标注人员，我想使用图像分割工具对图片进行像素级标注，以便创建语义分割和实例分割训练数据。

#### 验收标准

1. WHEN 用户选择图像分割任务 THEN THE Annotation_Studio SHALL 提供多边形、画笔和智能选择工具
2. WHEN 用户使用多边形工具 THEN THE Annotation_Studio SHALL 允许用户通过点击创建多边形区域
3. WHEN 用户使用画笔工具 THEN THE Annotation_Studio SHALL 允许用户自由绘制分割掩码
4. WHEN 用户使用智能选择工具 THEN THE Annotation_Studio SHALL 基于颜色相似度自动选择区域
5. WHEN 用户创建分割标注 THEN THE Annotation_Studio SHALL 允许用户为分割区域添加类别标签
6. WHEN 用户编辑分割标注 THEN THE Annotation_Studio SHALL 允许添加、删除或移动顶点
7. WHEN 用户完成分割标注 THEN THE Annotation_Studio SHALL 将分割掩码保存为多边形坐标或RLE格式

### 需求 5: 标注工作室 - 视频标注

**用户故事:** 作为标注人员，我想对视频进行逐帧标注，以便创建视频目标检测和跟踪数据集。

#### 验收标准

1. WHEN 用户打开视频任务 THEN THE Annotation_Studio SHALL 显示视频播放器和时间轴
2. WHEN 用户播放视频 THEN THE Annotation_Studio SHALL 支持播放、暂停、逐帧前进和后退
3. WHEN 用户在关键帧创建标注 THEN THE Annotation_Studio SHALL 记录标注与帧号的关联
4. WHEN 用户标注多个关键帧 THEN THE Annotation_Studio SHALL 自动插值生成中间帧的标注
5. WHEN 用户跟踪对象 THEN THE Annotation_Studio SHALL 为同一对象分配唯一ID以支持跟踪
6. WHEN 用户导出视频标注 THEN THE Annotation_Studio SHALL 包含每一帧的标注信息和对象ID

### 需求 6: 模型辅助标注（AI预标注）

**用户故事:** 作为标注人员，我想使用 AI 模型自动生成预标注，以便提高标注效率。

#### 验收标准

1. WHEN 用户启用模型辅助标注 THEN THE Annotation_Studio SHALL 调用配置的 AI 模型（VLM、DINO、SAM等）
2. WHEN 模型返回预测结果 THEN THE Annotation_Studio SHALL 在图片上显示预标注框或掩码
3. WHEN 显示预标注 THEN THE Annotation_Studio SHALL 显示每个预标注的置信度分数
4. WHEN 用户审核预标注 THEN THE Annotation_Studio SHALL 允许用户接受、修改或拒绝每个预标注
5. WHEN 用户批量接受预标注 THEN THE Annotation_Studio SHALL 支持一键接受所有高置信度预标注
6. WHEN 模型辅助标注失败 THEN THE Annotation_Studio SHALL 显示错误信息并允许手动标注
7. WHEN 用户配置模型参数 THEN THE Annotation_Studio SHALL 允许调整置信度阈值和其他参数

### 需求 7: 质量控制 - 审核工作流

**用户故事:** 作为审核者，我想审核标注质量，以便确保数据集的准确性。

#### 验收标准

1. WHEN 标注者完成任务 THEN THE System SHALL 将任务状态更新为"待审核"
2. WHEN 审核者打开任务 THEN THE System SHALL 显示所有标注和标注者信息
3. WHEN 审核者审核标注 THEN THE System SHALL 允许审核者接受、拒绝或修改标注
4. WHEN 审核者拒绝标注 THEN THE System SHALL 要求审核者提供拒绝原因并将任务退回标注者
5. WHEN 审核者接受标注 THEN THE System SHALL 将任务状态更新为"已完成"
6. WHEN 审核者修改标注 THEN THE System SHALL 记录修改历史和审核者信息

### 需求 8: 质量控制 - 标注一致性检查

**用户故事:** 作为项目管理员，我想检查标注者之间的一致性，以便评估标注质量。

#### 验收标准

1. WHEN 多个标注者标注同一数据 THEN THE System SHALL 计算标注者间一致性（Inter-Annotator Agreement）
2. WHEN 显示一致性指标 THEN THE System SHALL 显示 IoU、Kappa 系数等指标
3. WHEN 检测到不一致 THEN THE System SHALL 高亮显示差异较大的标注
4. WHEN 用户查看不一致标注 THEN THE System SHALL 并排显示不同标注者的结果
5. WHEN 用户解决不一致 THEN THE System SHALL 允许选择正确标注或创建新的共识标注

### 需求 9: 团队协作 - 用户角色和权限

**用户故事:** 作为系统管理员，我想管理用户角色和权限，以便控制团队成员的访问权限。

#### 验收标准

1. WHEN 管理员创建用户 THEN THE System SHALL 允许分配角色（管理员、项目经理、标注者、审核者）
2. WHEN 用户登录 THEN THE System SHALL 根据角色显示相应的功能和数据
3. WHEN 管理员分配项目权限 THEN THE System SHALL 允许指定用户可访问的项目
4. WHEN 标注者访问任务 THEN THE System SHALL 仅显示分配给该标注者的任务
5. WHEN 审核者访问任务 THEN THE System SHALL 仅显示分配给该审核者的待审核任务

### 需求 10: 团队协作 - 标注进度跟踪

**用户故事:** 作为项目经理，我想跟踪团队成员的标注进度，以便管理项目进度。

#### 验收标准

1. WHEN 用户查看项目进度 THEN THE System SHALL 显示每个任务的完成状态和进度百分比
2. WHEN 显示标注者统计 THEN THE System SHALL 显示每个标注者的任务数量、完成数量和平均时间
3. WHEN 显示审核者统计 THEN THE System SHALL 显示每个审核者的审核数量和通过率
4. WHEN 用户查看时间线 THEN THE System SHALL 以甘特图或时间线形式展示项目进度
5. WHEN 检测到延期任务 THEN THE System SHALL 高亮显示并发送提醒通知

### 需求 11: 数据导出

**用户故事:** 作为数据工程师，我想将标注数据导出为多种格式，以便用于不同的模型训练框架。

#### 验收标准

1. WHEN 用户选择导出功能 THEN THE System SHALL 提供多种格式选项（COCO、YOLO、Pascal VOC、CVAT）
2. WHEN 用户导出 COCO 格式 THEN THE System SHALL 生成符合 COCO 标准的 JSON 文件
3. WHEN 用户导出 YOLO 格式 THEN THE System SHALL 生成 TXT 标注文件和类别配置文件
4. WHEN 用户导出 Pascal VOC 格式 THEN THE System SHALL 生成 XML 标注文件
5. WHEN 导出包含图片 THEN THE System SHALL 将图片和标注文件打包为 ZIP 压缩文件
6. WHEN 导出完成 THEN THE System SHALL 提供下载链接
7. WHEN 导出数据为空 THEN THE System SHALL 提示用户并阻止导出操作

### 需求 12: 数据中心 - 数据集展示

**用户故事:** 作为用户，我想浏览所有可用的数据集，以便找到适合我项目的数据。

#### 验收标准

1. WHEN 用户访问数据中心 THEN THE Data_Center SHALL 以卡片形式展示所有数据集
2. WHEN 显示数据集卡片 THEN THE Data_Center SHALL 包含数据集名称、缩略图、标注数量、类别和创建时间
3. WHEN 用户点击数据集卡片 THEN THE Data_Center SHALL 显示数据集详情页面
4. WHEN 显示数据集详情 THEN THE Data_Center SHALL 包含完整描述、标注统计、样本预览和下载选项
5. WHEN 用户搜索数据集 THEN THE Data_Center SHALL 支持按名称、标签和类别搜索
6. WHEN 数据中心为空 THEN THE Data_Center SHALL 显示空状态提示和创建数据集的引导

### 需求 13: 数据中心 - 开源数据导入

**用户故事:** 作为数据工程师，我想导入多种格式的开源数据集，以便扩充我的训练数据。

#### 验收标准

1. WHEN 用户选择导入功能 THEN THE Data_Center SHALL 提供多种格式选项（COCO、YOLO、Pascal VOC、CVAT、LabelMe）
2. WHEN 用户上传 COCO 格式数据 THEN THE Data_Center SHALL 解析 JSON 标注文件和图片
3. WHEN 用户上传 YOLO 格式数据 THEN THE Data_Center SHALL 解析 TXT 标注文件和类别配置
4. WHEN 用户上传 Pascal VOC 格式数据 THEN THE Data_Center SHALL 解析 XML 标注文件
5. WHEN 用户上传 CVAT 格式数据 THEN THE Data_Center SHALL 解析 XML 或 JSON 导出文件
6. WHEN 用户上传 LabelMe 格式数据 THEN THE Data_Center SHALL 解析 JSON 标注文件
7. WHEN 数据验证通过 THEN THE Data_Center SHALL 将数据转换为统一的内部格式并创建新数据集
8. WHEN 导入完成 THEN THE Data_Center SHALL 显示导入的数据集并提供预览
9. WHEN 数据格式错误 THEN THE Data_Center SHALL 显示具体的错误信息和修复建议
10. WHEN 用户导入大型数据集 THEN THE Data_Center SHALL 显示导入进度条

### 需求 14: 数据中心 - 数据集版本控制

**用户故事:** 作为数据管理员，我想管理数据集的版本，以便跟踪数据集的演变历史。

#### 验收标准

1. WHEN 用户修改数据集 THEN THE Data_Center SHALL 自动创建新版本
2. WHEN 用户查看数据集 THEN THE Data_Center SHALL 显示所有历史版本
3. WHEN 用户比较版本 THEN THE Data_Center SHALL 显示版本之间的差异（新增、删除、修改的标注）
4. WHEN 用户回滚版本 THEN THE Data_Center SHALL 允许恢复到历史版本
5. WHEN 用户导出版本 THEN THE Data_Center SHALL 允许导出指定版本的数据

### 需求 15: 数据中心 - 数据集管理

**用户故事:** 作为数据管理员，我想管理数据集的生命周期，以便维护数据质量和组织。

#### 验收标准

1. WHEN 用户拥有数据集权限 THEN THE Data_Center SHALL 显示编辑和删除选项
2. WHEN 用户编辑数据集 THEN THE Data_Center SHALL 允许修改名称、描述和标签
3. WHEN 用户删除数据集 THEN THE Data_Center SHALL 显示确认对话框并在确认后删除
4. WHEN 数据集被删除 THEN THE Data_Center SHALL 从列表中移除该数据集
5. WHEN 用户分享数据集 THEN THE Data_Center SHALL 生成分享链接或设置访问权限

### 需求 16: 看板 - 标注统计

**用户故事:** 作为项目经理，我想查看标注进度统计，以便了解项目状态。

#### 验收标准

1. WHEN 用户访问看板 THEN THE Dashboard SHALL 显示总数据集数量、总标注数量和完成率
2. WHEN 显示标注统计 THEN THE Dashboard SHALL 以图表形式展示每日标注数量趋势
3. WHEN 显示项目统计 THEN THE Dashboard SHALL 列出每个项目的标注进度和任务状态分布
4. WHEN 用户选择时间范围 THEN THE Dashboard SHALL 更新统计数据以反映选定时间段
5. WHEN 统计数据为空 THEN THE Dashboard SHALL 显示空状态提示

### 需求 17: 看板 - 标签分析

**用户故事:** 作为数据科学家，我想分析标签分布，以便了解数据集的平衡性。

#### 验收标准

1. WHEN 用户查看标签分析 THEN THE Dashboard SHALL 显示所有标签的数量统计
2. WHEN 显示标签分布 THEN THE Dashboard SHALL 以柱状图或饼图展示标签比例
3. WHEN 用户点击标签 THEN THE Dashboard SHALL 显示该标签的详细信息和样本预览
4. WHEN 检测到数据不平衡 THEN THE Dashboard SHALL 高亮显示数量过少或过多的标签
5. WHEN 用户导出分析报告 THEN THE Dashboard SHALL 生成包含统计图表的 PDF 或 CSV 文件

### 需求 18: 看板 - 质量指标

**用户故事:** 作为项目经理，我想查看标注质量指标，以便评估团队表现。

#### 验收标准

1. WHEN 用户查看质量指标 THEN THE Dashboard SHALL 显示审核通过率、平均审核时间和拒绝率
2. WHEN 显示标注者质量 THEN THE Dashboard SHALL 显示每个标注者的通过率和平均标注时间
3. WHEN 显示审核者质量 THEN THE Dashboard SHALL 显示每个审核者的审核数量和一致性
4. WHEN 检测到质量问题 THEN THE Dashboard SHALL 高亮显示质量低于阈值的标注者
5. WHEN 用户查看质量趋势 THEN THE Dashboard SHALL 以折线图展示质量指标的时间变化

### 需求 19: 大模型管理 - 模型提供商配置

**用户故事:** 作为系统管理员，我想配置 AI 模型提供商，以便使用模型辅助标注功能。

#### 验收标准

1. WHEN 用户访问大模型管理 THEN THE Model_Management SHALL 显示已配置的模型提供商列表
2. WHEN 用户添加提供商 THEN THE Model_Management SHALL 提供表单输入提供商名称和 API 端点
3. WHEN 用户保存提供商配置 THEN THE Model_Management SHALL 验证连接并保存配置
4. WHEN 连接验证失败 THEN THE Model_Management SHALL 显示错误信息并阻止保存
5. WHEN 用户删除提供商 THEN THE Model_Management SHALL 显示确认对话框并在确认后删除

### 需求 20: 大模型管理 - API 密钥管理

**用户故事:** 作为系统管理员，我想安全地管理 API 密钥，以便控制模型访问权限。

#### 验收标准

1. WHEN 用户添加 API 密钥 THEN THE Model_Management SHALL 加密存储密钥
2. WHEN 显示 API 密钥 THEN THE Model_Management SHALL 仅显示密钥的部分字符（如前4位和后4位）
3. WHEN 用户更新 API 密钥 THEN THE Model_Management SHALL 替换旧密钥并验证新密钥
4. WHEN 用户删除 API 密钥 THEN THE Model_Management SHALL 显示确认对话框并在确认后删除
5. WHEN API 密钥过期或无效 THEN THE Model_Management SHALL 显示警告并提示用户更新

### 需求 21: 大模型管理 - 模型列表

**用户故事:** 作为标注人员，我想查看可用的 AI 模型列表，以便选择合适的模型进行辅助标注。

#### 验收标准

1. WHEN 用户访问模型列表 THEN THE Model_Management SHALL 显示所有可用模型及其描述
2. WHEN 显示模型信息 THEN THE Model_Management SHALL 包含模型名称、类型、提供商和状态
3. WHEN 用户选择模型 THEN THE Model_Management SHALL 将该模型设置为辅助标注的默认模型
4. WHEN 模型不可用 THEN THE Model_Management SHALL 显示不可用状态并禁用选择
5. WHEN 用户测试模型 THEN THE Model_Management SHALL 发送测试请求并显示响应结果

### 需求 22: 用户中心 - 用户认证

**用户故事:** 作为用户，我想登录和注册系统，以便访问我的数据和设置。

#### 验收标准

1. WHEN 用户访问登录页面 THEN THE User_Center SHALL 显示用户名和密码输入框
2. WHEN 用户提交登录表单 THEN THE User_Center SHALL 验证用户凭证
3. WHEN 登录成功 THEN THE User_Center SHALL 创建用户会话并重定向到主页
4. WHEN 登录失败 THEN THE User_Center SHALL 显示错误信息并保留用户名输入
5. WHEN 用户注册 THEN THE User_Center SHALL 验证用户名、邮箱和密码格式
6. WHEN 注册成功 THEN THE User_Center SHALL 创建用户账号并自动登录

### 需求 23: 用户中心 - 用户资料管理

**用户故事:** 作为用户，我想管理我的个人资料，以便更新我的信息和偏好设置。

#### 验收标准

1. WHEN 用户访问用户中心 THEN THE User_Center SHALL 显示用户的个人资料信息
2. WHEN 用户编辑资料 THEN THE User_Center SHALL 允许修改昵称、邮箱和头像
3. WHEN 用户保存更改 THEN THE User_Center SHALL 验证数据并更新用户信息
4. WHEN 用户修改密码 THEN THE User_Center SHALL 要求输入当前密码进行验证
5. WHEN 用户上传头像 THEN THE User_Center SHALL 验证图片格式和大小并保存

### 需求 24: 系统架构 - 模块分离

**用户故事:** 作为系统架构师，我想确保各模块之间清晰分离，以便系统易于维护和扩展。

#### 验收标准

1. WHEN 标注工作室模块更新 THEN THE System SHALL 不影响数据中心和看板模块的功能
2. WHEN 数据中心模块更新 THEN THE System SHALL 不影响标注工作室和用户中心模块的功能
3. WHEN 大模型管理模块更新 THEN THE System SHALL 不影响其他模块的核心功能
4. WHEN 用户中心模块更新 THEN THE System SHALL 不影响数据标注和管理功能
5. WHEN 任何模块发生错误 THEN THE System SHALL 隔离错误并保持其他模块正常运行

### 需求 25: 数据持久化和同步

**用户故事:** 作为用户，我想确保我的标注数据被安全保存，以便不会丢失工作成果。

#### 验收标准

1. WHEN 用户创建标注 THEN THE System SHALL 立即保存标注数据到本地存储
2. WHEN 用户完成任务 THEN THE System SHALL 将数据持久化到服务器
3. WHEN 系统检测到网络中断 THEN THE System SHALL 在本地缓存数据并在恢复后自动同步
4. WHEN 用户关闭浏览器 THEN THE System SHALL 保留未提交的标注数据
5. WHEN 数据保存失败 THEN THE System SHALL 显示错误信息并提供重试选项
6. WHEN 检测到数据冲突 THEN THE System SHALL 提示用户并提供冲突解决选项

### 需求 26: 响应式设计

**用户故事:** 作为用户，我想在不同设备上使用平台，以便灵活地进行标注工作。

#### 验收标准

1. WHEN 用户在桌面浏览器访问 THEN THE System SHALL 显示完整的多列布局
2. WHEN 用户在平板设备访问 THEN THE System SHALL 调整布局以适应中等屏幕尺寸
3. WHEN 用户在移动设备访问 THEN THE System SHALL 显示单列布局并优化触摸操作
4. WHEN 用户调整浏览器窗口大小 THEN THE System SHALL 动态调整界面布局
5. WHEN 用户在小屏幕设备上标注 THEN THE System SHALL 提供缩放功能以便精确操作
