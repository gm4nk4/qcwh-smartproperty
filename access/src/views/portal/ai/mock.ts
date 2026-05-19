/**
 * AI工具中心模拟数据
 */

import type {
	AIService,
	DataSource,
	AITool,
	OutputScene,
	HealthStats,
	StatsCard,
	TrendDataPoint,
	CategoryDistribution,
	ToolStats,
	ToolItem,
	TopToolItem,
	TokenStats,
	SubsystemCall,
	ToolCategory,
	UseScene,
	ToolCard,
	ModelCategory,
	Model,
	LogStatsCard,
	ActivityLog
} from './type';

/**
 * AI服务数据
 */
export const mockAIServices: AIService[] = [
  {
    id: '1',
    name: 'AI智能派单引擎',
    status: 'healthy',
    statusText: '健康',
    availability: '99.1%',
    latency: '245ms',
    heartbeat: '刚刚',
  },
  {
    id: '2',
    name: 'AI智能派单引擎',
    status: 'warning',
    statusText: '注意',
    availability: '99.1%',
    latency: '245ms',
    heartbeat: '刚刚',
  },
  {
    id: '3',
    name: 'AI智能派单引擎',
    status: 'healthy',
    statusText: '健康',
    availability: '99.1%',
    latency: '245ms',
    heartbeat: '刚刚',
  },
  {
    id: '4',
    name: 'AI智能派单引擎',
    status: 'abnormal',
    statusText: '异常',
    availability: '99.1%',
    latency: '245ms',
    heartbeat: '刚刚',
  },
  {
    id: '5',
    name: 'AI智能派单引擎',
    status: 'offline',
    statusText: '离线',
    availability: '99.1%',
    latency: '245ms',
    heartbeat: '刚刚',
  },
  {
    id: '6',
    name: 'AI智能派单引擎',
    status: 'healthy',
    statusText: '健康',
    availability: '99.1%',
    latency: '245ms',
    heartbeat: '刚刚',
  },
  {
    id: '7',
    name: 'AI智能派单引擎',
    status: 'healthy',
    statusText: '健康',
    availability: '99.1%',
    latency: '245ms',
    heartbeat: '刚刚',
  },
  {
    id: '8',
    name: 'AI智能派单引擎',
    status: 'warning',
    statusText: '注意',
    availability: '99.1%',
    latency: '245ms',
    heartbeat: '刚刚',
  },
];

/**
 * 健康监控统计
 */
export const mockHealthStats: HealthStats = {
  healthy: 4,
  warning: 2,
  abnormal: 1,
  offline: 1,
};

/**
 * 数据来源
 */
export const mockDataSources: DataSource[] = [
  { id: '1', name: '资产管理', count: 24 },
  { id: '2', name: '物业缴费', count: 12 },
  { id: '3', name: '能源管理', count: 10 },
  { id: '4', name: '工单管理', count: 8 },
  { id: '5', name: '客户评价', count: 4 },
];

/**
 * AI工具
 */
export const mockAITools: AITool[] = [
  { id: '1', name: 'AI备件临界评估', dataSource: '工单调度', accuracy: '94.2%' },
  { id: '2', name: 'AI智能派单引擎', dataSource: '设备管理', accuracy: '94.2%' },
  { id: '3', name: 'AI工单故障诊断', dataSource: '能源优化', accuracy: '79.2%' },
  { id: '4', name: 'AI设备健康度评估', dataSource: '安防分析', accuracy: '84.2%' },
  { id: '5', name: 'AI智能排班优化', dataSource: '财务分析', accuracy: '94.2%' },
];

/**
 * 输出场景
 */
export const mockOutputScenes: OutputScene[] = [
  { id: '1', name: '资产管理', count: 14 },
  { id: '2', name: '能源管理', count: 11 },
  { id: '3', name: '物业缴费', count: 6 },
  { id: '4', name: '运营驾驶舱', count: 5 },
  { id: '5', name: '工单管理', count: 4 },
];

/**
 * 统计卡片数据
 */
export const mockStatsCards: StatsCard[] = [
  { id: '1', title: 'AI工具总数', value: '24', icon: 'Box', iconColor: '#3b82f6', bgColor: '#eff6ff' },
  { id: '2', title: '今日调用', value: '3,147', icon: 'DataAnalysis', iconColor: '#10b981', bgColor: '#f0fdf4' },
  { id: '3', title: '本月调用', value: '94,163', icon: 'TrendCharts', iconColor: '#f59e0b', bgColor: '#fffbeb' },
  { id: '4', title: '平均准确率', value: '89.7%', icon: 'CircleCheck', iconColor: '#8b5cf6', bgColor: '#faf5ff' },
  { id: '5', title: '健康工具', value: '13/24', icon: 'Monitor', iconColor: '#ec4899', bgColor: '#fdf2f8' },
];

/**
 * 近7日AI调用趋势
 */
export const mockWeeklyTrendData: TrendDataPoint[] = [
  { date: '3.01', value: 2721 },
  { date: '3.02', value: 2278 },
  { date: '3.03', value: 3101 },
  { date: '3.04', value: 2982 },
  { date: '3.05', value: 3093 },
  { date: '3.06', value: 3004 },
  { date: '3.07', value: 3124 },
];

/**
 * 分类分布数据
 */
export const mockCategoryDistribution: CategoryDistribution[] = [
  { name: '智能优化', value: 40, color: '#3b82f6', percentage: '40%' },
  { name: '分类分析', value: 35, color: '#10b981', percentage: '35%' },
  { name: '趋势优化', value: 25, color: '#ec4899', percentage: '25%' },
];

/**
 * 平台性能趋势数据
 */
export const mockPerformanceTrend: TrendDataPoint[] = [
  { date: '10月', value: 92 },
  { date: '11月', value: 88 },
  { date: '12月', value: 90 },
  { date: '1月', value: 85 },
  { date: '2月', value: 93 },
  { date: '3月', value: 91 },
];

/**
 * 调用量增长趋势数据
 */
export const mockCallGrowthTrend: TrendDataPoint[] = [
  { date: '10月', value: 50000 },
  { date: '11月', value: 55000 },
  { date: '12月', value: 58000 },
  { date: '1月', value: 60000 },
  { date: '2月', value: 62000 },
  { date: '3月', value: 70000 },
];

/**
 * Token统计数据
 */
export const mockTokenStats: TokenStats = {
  todayCalls: 3147,
  todayInputTokens: 2524452,
  todayOutputTokens: 1363456,
  totalTokens: 3887908,
};

/**
 * 子系统调用统计
 */
export const mockSubsystemCalls: SubsystemCall[] = [
  { id: '1', name: '安防监控', callCount: 2340, tokenCount: 2387398 },
  { id: '2', name: '能源管理', callCount: 279, tokenCount: 422383 },
  { id: '3', name: '资产管理', callCount: 248, tokenCount: 265210 },
  { id: '4', name: '物业缴费', callCount: 85, tokenCount: 65453 },
  { id: '5', name: '工单管理', callCount: 56, tokenCount: 67679 },
  { id: '6', name: '社区运营', callCount: 38, tokenCount: 66219 },
  { id: '7', name: '指挥中心', callCount: 5, tokenCount: 1708 },
  { id: '8', name: '资产管理', callCount: 1, tokenCount: 1708 },
  { id: '9', name: '数据管理', callCount: 1, tokenCount: 1708 },
];

/**
 * 工具统计
 */
export const mockToolStats: ToolStats = {
  active: 13,
  normal: 11,
  warning: 0,
  offline: 0,
};

/**
 * 需关注工具
 */
export const mockAttentionTools: ToolItem[] = [
  { id: '1', name: 'AI安防预警评估', status: 'attention', tag: '效率降低', tagColor: '#ef4444' },
  { id: '2', name: 'AI工单故障诊断', status: 'attention', tag: '效率降低', tagColor: '#ef4444' },
  { id: '3', name: 'AI备件分析与预测', status: 'normal', tag: '效率降低', tagColor: '#f59e0b' },
  { id: '4', name: 'AI智能排班方案', status: 'normal', tag: '效率降低', tagColor: '#f59e0b' },
  { id: '5', name: 'AI合同风险分析', status: 'normal', tag: '效率降低', tagColor: '#f59e0b' },
  { id: '6', name: 'AI合同标签建议', status: 'normal', tag: '效率降低', tagColor: '#f59e0b' },
  { id: '7', name: 'AI采购需求预测', status: 'normal', tag: '效率降低', tagColor: '#f59e0b' },
  { id: '8', name: 'AI公告智能撰写', status: 'normal', tag: '效率降低', tagColor: '#f59e0b' },
  { id: '9', name: 'AI社区运营建议', status: 'normal', tag: '效率降低', tagColor: '#f59e0b' },
];

/**
 * 今日高频工具Top10
 */
export const mockTopTools: TopToolItem[] = [
  { id: '1', name: 'AI高频耗损分析', rank: 1, callCount: 2340, tokenCount: 2387398, percentage: '94.2%' },
  { id: '2', name: 'AI预警维护', rank: 2, callCount: 279, tokenCount: 422383, percentage: '94.2%' },
  { id: '3', name: 'AI巡检报告评估', rank: 3, callCount: 248, tokenCount: 265210, percentage: '84.2%' },
  { id: '4', name: 'AI智能异常异常检测', rank: 4, callCount: 85, tokenCount: 65453, percentage: '94.2%' },
  { id: '5', name: 'AI备件临界评估', rank: 5, callCount: 56, tokenCount: 66219, percentage: '87.2%' },
  { id: '6', name: 'AI工单健康度评估', rank: 6, callCount: 5, tokenCount: 1708, percentage: '87.2%' },
  { id: '7', name: 'AI智能排班方案', rank: 7, callCount: 1, tokenCount: 1708, percentage: '87.2%' },
  { id: '8', name: 'AI异常分析预警', rank: 8, callCount: 1, tokenCount: 1708, percentage: '87.2%' },
  { id: '9', name: 'AI采购需求预测', rank: 9, callCount: 1, tokenCount: 1708, percentage: '87.2%' },
];

/**
 * 工具分类
 */
export const mockToolCategories: ToolCategory[] = [
  { id: '1', name: '工单调度' },
  { id: '2', name: '能源优化' },
  { id: '3', name: '安防分析' },
  { id: '4', name: '人员调度' },
  { id: '5', name: '库存优化' },
  { id: '6', name: '财务分析' },
];

/**
 * 使用场景
 */
export const mockUseScenes: UseScene[] = [
  { id: '1', name: '工单管理' },
  { id: '2', name: '能源管理' },
  { id: '3', name: '安防监控' },
  { id: '4', name: '人员管理' },
  { id: '5', name: '资产管理' },
  { id: '6', name: '运营驾驶舱' },
  { id: '7', name: '数据治理' },
];

/**
 * 工具卡片数据
 */
export const mockToolCards: ToolCard[] = [
  {
    id: '1',
    name: 'AI智能派单引擎',
    category: '工单调度',
    categoryColor: '#3b82f6',
    enabled: true,
    description: '基于工单类型、紧急程度、技能匹配、地理位置的派单工作流，自动匹配最优派单人员及时效要求，支持紧急工单自动升级',
    dataSources: ['工单管理', '人员管理', '资产管理'],
    useScenes: ['能源管理', '资产管理'],
    accuracy: '94.2%',
    accuracyType: 'normal',
    todayCalls: 23,
    version: 'V2.3',
  },
  {
    id: '2',
    name: 'AI能耗预测与优化',
    category: '能源优化',
    categoryColor: '#10b981',
    enabled: true,
    description: '基于历史数据、天气数据和建筑模型预测未来用电趋势，生成个性化节能策略（如照明调光、空调调节），累计节约用电4,713',
    dataSources: ['能源管理'],
    useScenes: ['能源管理'],
    accuracy: '84.2%',
    accuracyType: 'warning',
    todayCalls: 42,
    version: 'V2.3',
  },
  {
    id: '3',
    name: 'AI工单故障诊断',
    category: '工单调度',
    categoryColor: '#3b82f6',
    enabled: true,
    description: '通过NLP分析工单描述，自动识别故障类型、判断严重程度，并推荐修复方案（如AI建议：排查检查室→清理地毯）',
    dataSources: ['工单管理', '资产管理'],
    useScenes: ['工单管理'],
    accuracy: '79.2%',
    accuracyType: 'error',
    todayCalls: 15,
    version: 'V2.3',
  },
  {
    id: '4',
    name: 'AI安防视觉分析',
    category: '安防分析',
    categoryColor: '#ec4899',
    enabled: true,
    description: '对监控画面进行实时AI分析，识别人员聚集、可疑行为、烟雾火情等异常事件，支持二次分析和审核（如水银蒸气泄露预警），告警管理审核',
    dataSources: ['安防监控', '停车管理'],
    useScenes: ['工单管理', '人员管理', '安防监控'],
    accuracy: '84.2%',
    accuracyType: 'warning',
    todayCalls: 42,
    version: 'V2.3',
  },
  {
    id: '5',
    name: 'AI智能排班优化',
    category: '人员调度',
    categoryColor: '#f59e0b',
    enabled: true,
    description: '结合考虑劳动力成本（现程≤40%）、高峰时段覆盖、员工技能和成本最优模型，自动生成排班方案，支持一键应用',
    dataSources: ['工单管理', '人员管理', '安防监控'],
    useScenes: ['人员管理', '运营驾驶舱'],
    accuracy: '94.2%',
    accuracyType: 'normal',
    todayCalls: 23,
    version: 'V2.3',
  },
  {
    id: '6',
    name: 'AI停车分析与预测',
    category: '库存优化',
    categoryColor: '#8b5cf6',
    enabled: true,
    description: '通过NLP分析工单描述，自动识别故障类型、判断严重程度，并推荐维修方案（如AI建议：排查检查室→清理地毯）',
    dataSources: ['工单管理', '资产管理'],
    useScenes: ['能源管理'],
    accuracy: '94.2%',
    accuracyType: 'normal',
    todayCalls: 15,
    version: 'V2.3',
  },
  {
    id: '7',
    name: 'AI智能催收方案',
    category: '财务分析',
    categoryColor: '#ec4899',
    enabled: false,
    description: '根据用户画像（企业主）、历史缴费习惯建立模型，生成个性化催收策略（如企业客户自动提醒、个人客户发送温馨提醒），提高催收响应率',
    dataSources: ['工单管理', '人员管理', '资产管理'],
    useScenes: ['能源管理', '资产管理'],
    accuracy: '84.2%',
    accuracyType: 'warning',
    todayCalls: 42,
    version: 'V2.3',
  },
  {
    id: '8',
    name: 'AI合同风险分析',
    category: '财务分析',
    categoryColor: '#ec4899',
    enabled: true,
    description: '解析各类合同关键条款（租金测算、免租期、违约金比例），识别潜在风险，对比场景和异常条款',
    dataSources: ['能源管理'],
    useScenes: ['能源管理', '资产管理'],
    accuracy: '94.2%',
    accuracyType: 'normal',
    todayCalls: 21,
    version: 'V2.3',
  },
  {
    id: '9',
    name: 'AI合同标签建议',
    category: '财务分析',
    categoryColor: '#ec4899',
    enabled: true,
    description: '根据当前市场行情、同区域同类型水平和客户价值评估，自动生成合同变更建议和沟通策略',
    dataSources: ['工单管理', '资产管理'],
    useScenes: ['工单管理'],
    accuracy: '94.2%',
    accuracyType: 'normal',
    todayCalls: 15,
    version: 'V2.3',
  },
];

/**
 * 模型分类数据
 */
export const mockModelCategories: ModelCategory[] = [
  { id: '1', name: '推理模型', icon: 'ChatDotRound', color: '#3b82f6' },
  { id: '2', name: '图像理解模型', icon: 'Picture', color: '#10b981' },
  { id: '3', name: '语音识别模型', icon: 'Microphone', color: '#f59e0b' },
  { id: '4', name: 'Embedding模型', icon: 'Document', color: '#8b5cf6' },
  { id: '5', name: '多模态模型', icon: 'Monitor', color: '#ec4899' },
];

/**
 * 模型数据
 */
export const mockModels: Model[] = [
  {
    id: '1',
    name: 'GPT-4o 推理模型',
    category: '推理模型',
    categoryIcon: 'ChatDotRound',
    categoryColor: '#3b82f6',
    status: 'enabled',
    statusText: '已启用',
    provider: 'OpenAI',
    modelId: 'gpt-4o',
    maxTokens: '4,096',
    description: '主推推理模型，用于工单分析、文本生成',
    isPreferred: true,
  },
  {
    id: '2',
    name: 'Claude 3.5 Sonnet',
    category: '推理模型',
    categoryIcon: 'ChatDotRound',
    categoryColor: '#3b82f6',
    status: 'enabled',
    statusText: '已启用',
    provider: 'Anthropic',
    modelId: 'claude-3-5-sonnet',
    maxTokens: '8,192',
    description: '推理模型',
    isPreferred: false,
  },
  {
    id: '3',
    name: 'Qwen-VL-Max',
    category: '图像理解模型',
    categoryIcon: 'Picture',
    categoryColor: '#10b981',
    status: 'enabled',
    statusText: '已启用',
    provider: '阿里云',
    modelId: 'qwen-vl-max',
    maxTokens: '2,048',
    description: '图像理解模型',
    isPreferred: true,
  },
  {
    id: '4',
    name: 'GPT-4o Vision',
    category: '图像理解模型',
    categoryIcon: 'Picture',
    categoryColor: '#10b981',
    status: 'disabled',
    statusText: '已停用',
    provider: 'OpenAI',
    modelId: 'gpt-4o-vision',
    maxTokens: '4,096',
    description: '图像理解模型',
    isPreferred: false,
  },
  {
    id: '5',
    name: 'Whisper-1',
    category: '语音识别模型',
    categoryIcon: 'Microphone',
    categoryColor: '#f59e0b',
    status: 'enabled',
    statusText: '已启用',
    provider: 'OpenAI',
    modelId: 'whisper-1',
    maxTokens: '4,096',
    description: '语音识别模型',
    isPreferred: true,
  },
  {
    id: '6',
    name: 'Paraformer-2',
    category: '语音识别模型',
    categoryIcon: 'Microphone',
    categoryColor: '#f59e0b',
    status: 'disabled',
    statusText: '已停用',
    provider: '阿里云',
    modelId: 'paraformer-2',
    maxTokens: '8,192',
    description: '语音识别模型',
    isPreferred: false,
  },
  {
    id: '7',
    name: 'Text-Embedding-3',
    category: 'Embedding模型',
    categoryIcon: 'Document',
    categoryColor: '#8b5cf6',
    status: 'enabled',
    statusText: '已启用',
    provider: 'OpenAI',
    modelId: 'text-embedding-3-large',
    maxTokens: '8,192',
    description: 'Embedding模型',
    isPreferred: true,
  },
  {
    id: '8',
    name: 'Qwen-Max',
    category: '多模态模型',
    categoryIcon: 'Monitor',
    categoryColor: '#ec4899',
    status: 'enabled',
    statusText: '已启用',
    provider: '阿里云',
    modelId: 'qwen-max',
    maxTokens: '4,096',
    description: '多模态模型',
    isPreferred: true,
  },
  {
    id: '9',
    name: 'GPT-4 Turbo',
    category: '推理模型',
    categoryIcon: 'ChatDotRound',
    categoryColor: '#3b82f6',
    status: 'enabled',
    statusText: '已启用',
    provider: 'OpenAI',
    modelId: 'gpt-4-turbo',
    maxTokens: '8,192',
    description: '主推推理模型，用于工单分析、文本生成',
    isPreferred: false,
  },
  {
    id: '10',
    name: 'Llama 3 70B',
    category: '推理模型',
    categoryIcon: 'ChatDotRound',
    categoryColor: '#3b82f6',
    status: 'enabled',
    statusText: '已启用',
    provider: 'Meta',
    modelId: 'llama-3-70b',
    maxTokens: '4,096',
    description: '推理模型',
    isPreferred: false,
  },
];

/**
 * 服务商选项
 */
export const providerOptions = [
  { label: 'OpenAI', value: 'OpenAI' },
  { label: 'Anthropic', value: 'Anthropic' },
  { label: '阿里云', value: '阿里云' },
  { label: 'Meta', value: 'Meta' },
];

/**
 * 模型类型选项
 */
export const modelTypeOptions = [
  { label: '推理模型', value: 'inference' },
  { label: '图像理解模型', value: 'image' },
  { label: '语音识别模型', value: 'speech' },
  { label: 'Embedding模型', value: 'embedding' },
  { label: '多模态模型', value: 'multimodal' },
];

/**
 * 日志统计卡片数据
 */
export const mockLogStatsCards: LogStatsCard[] = [
  { id: '1', title: '今日分析次数', value: 2, icon: 'TrendCharts', iconColor: '#3b82f6' },
  { id: '2', title: '今日派单次数', value: 1, icon: 'Document', iconColor: '#10b981' },
  { id: '3', title: '今日预警次数', value: 2, icon: 'Warning', iconColor: '#f59e0b' },
  { id: '4', title: '今日恢复次数', value: 1, icon: 'CircleCheck', iconColor: '#10b981' },
  { id: '5', title: '今日生成次数', value: 2, icon: 'Edit', iconColor: '#8b5cf6' },
  { id: '6', title: '今日催缴次数', value: 1, icon: 'Bell', iconColor: '#ec4899' },
  { id: '7', title: '今日建议次数', value: 1, icon: 'ChatDotRound', iconColor: '#3b82f6' },
];

/**
 * 活动日志数据
 */
export const mockActivityLogs: ActivityLog[] = [
  {
    id: '1',
    title: 'AI 安防视觉分析',
    description: '检测到栋地下1层烟雾告警，经二次分析判定为水蒸气误报',
    type: 'analysis',
    typeText: '分析',
    time: '09:15',
  },
  {
    id: '2',
    title: 'AI 智能派单引擎',
    description: '工单WO-20240305-012已自动派单至王工（匹配度94%）',
    type: 'dispatch',
    typeText: '派单',
    time: '09:12',
  },
  {
    id: '3',
    title: 'AI 能耗预测与优化',
    description: '预测今日13:00-15:00用电尖峰，建议提前开启蓄冷释放',
    type: 'warning',
    typeText: '预警',
    time: '09:10',
  },
  {
    id: '4',
    title: 'AI 智能抄表异常检测',
    description: 'C-15f水表NB-loT模块恢复在线，已自动补抄数据',
    type: 'discovery',
    typeText: '发现',
    time: '09:10',
  },
  {
    id: '5',
    title: 'AI 账单智能生成引擎',
    description: '已为B-20f星巴克生成3月月度账单¥18,200',
    type: 'generate',
    typeText: '生成',
    time: '09:09',
  },
  {
    id: '6',
    title: 'AI 服务提醒引擎',
    description: '租户A-5f网易游戏物业费预缴提醒已推送',
    type: 'notice',
    typeText: '通知',
    time: '09:08',
  },
];
