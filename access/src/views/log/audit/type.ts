/**
 * 操作审计模块类型定义
 */

/**
 * 审计统计卡片
 */
export interface AuditStatsCard {
  id: string;
  title: string;
  value: number;
  icon: string;
}

/**
 * 审计记录项
 */
export interface AuditRecord {
  id: string;
  userName: string;
  avatar: string;
  department: string;
  operation: string;
  status: 'success' | 'warning' | 'danger';
  statusText: string;
  operationType: string;
  operationModule: string;
  description: string;
  ip: string;
  location: string;
  operationType2: string;
  time: string;
  date: string;
}

/**
 * 审计查询参数
 */
export interface AuditQueryParams {
  operationContent: string;
  operationModule: string;
}
