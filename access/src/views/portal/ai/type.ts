/**
 * AI工具中心类型定义
 */

/**
 * 服务状态类型
 */
export type ServiceStatus = 'healthy' | 'warning' | 'abnormal' | 'offline';

/**
 * AI服务信息
 */
export interface AIService {
  id: string;
  name: string;
  status: ServiceStatus;
  statusText: string;
  availability: string;
  latency: string;
  heartbeat: string;
}

/**
 * 数据来源项
 */
export interface DataSource {
  id: string;
  name: string;
  count: number;
}

/**
 * AI工具项
 */
export interface AITool {
  id: string;
  name: string;
  dataSource: string;
  accuracy: string;
}

/**
 * 输出场景项
 */
export interface OutputScene {
  id: string;
  name: string;
  count: number;
}

/**
 * 健康监控统计
 */
export interface HealthStats {
  healthy: number;
  warning: number;
  abnormal: number;
  offline: number;
}

/**
 * 统计卡片数据
 */
export interface StatsCard {
  id: string;
  title: string;
  value: string | number;
  icon: string;
  iconColor: string;
  bgColor: string;
}

/**
 * 趋势数据点
 */
export interface TrendDataPoint {
  date: string;
  value: number;
}

/**
 * 分类分布数据
 */
export interface CategoryDistribution {
  name: string;
  value: number;
  color: string;
  percentage: string;
}

/**
 * 工具统计信息
 */
export interface ToolStats {
  active: number;
  normal: number;
  warning: number;
  offline: number;
}

/**
 * 工具项
 */
export interface ToolItem {
  id: string;
  name: string;
  status: 'attention' | 'normal';
  tag: string;
  tagColor: string;
}

/**
 * 高频工具项
 */
export interface TopToolItem {
  id: string;
  name: string;
  rank: number;
  callCount: number;
  tokenCount: number;
  percentage: string;
}

/**
 * Token统计信息
 */
export interface TokenStats {
  todayCalls: number;
  todayInputTokens: number;
  todayOutputTokens: number;
  totalTokens: number;
}

/**
 * 子系统调用统计
 */
export interface SubsystemCall {
  id: string;
  name: string;
  callCount: number;
  tokenCount: number;
}

/**
 * 工具分类
 */
export interface ToolCategory {
  id: string;
  name: string;
}

/**
 * 使用场景
 */
export interface UseScene {
  id: string;
  name: string;
}

/**
 * 工具卡片信息
 */
export interface ToolCard {
  id: string;
  name: string;
  category: string;
  categoryColor: string;
  enabled: boolean;
  description: string;
  dataSources: string[];
  useScenes: string[];
  accuracy: string;
  accuracyType: 'normal' | 'warning' | 'error';
  todayCalls: number;
  version: string;
}

/**
 * 视图类型
 */
export type ViewType = 'card' | 'list';

/**
 * 模型状态
 */
export type ModelStatus = 'enabled' | 'disabled';

/**
 * 模型类型
 */
export type ModelType = 'inference' | 'image' | 'speech' | 'embedding' | 'multimodal';

/**
 * 模型分类
 */
export interface ModelCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
}

/**
 * 模型信息
 */
export interface Model {
  id: string;
  name: string;
  category: string;
  categoryIcon: string;
  categoryColor: string;
  status: ModelStatus;
  statusText: string;
  provider: string;
  modelId: string;
  maxTokens: string;
  description: string;
  isPreferred: boolean;
}

/**
 * 查询参数
 */
export interface ModelQueryParams {
  modelName: string;
  provider: string;
  modelType: string;
}

/**
 * 日志类型
 */
export type LogType = 'analysis' | 'dispatch' | 'warning' | 'discovery' | 'generate' | 'notice';

/**
 * 活动日志项
 */
export interface ActivityLog {
  id: string;
  title: string;
  description: string;
  type: LogType;
  typeText: string;
  time: string;
}

/**
 * 日志统计卡片
 */
export interface LogStatsCard {
  id: string;
  title: string;
  value: number;
  icon: string;
  iconColor: string;
}
