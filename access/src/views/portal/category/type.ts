/**
 * 应用分类类型定义
 */

/**
 * 应用信息
 */
export interface AppInfo {
  /** 应用ID */
  id: string | number;
  /** 应用名称 */
  name: string;
  /** 应用图标 */
  icon?: string;
  /** 激活状态 */
  active: boolean;
  /** 激活状态显示文字 */
  activeText?: string;
}

/**
 * 分类信息
 */
export interface CategoryInfo {
  /** 分类ID */
  id: string | number;
  /** 分类名称 */
  name: string;
  /** 应用数量 */
  appCount: number;
  /** 激活的应用数量 */
  activeAppCount: number;
  /** 激活状态显示文字 */
  activeText?: string;
  /** 应用列表 */
  apps: AppInfo[];
  /** 未归类的应用列表 */
  uncategorizedApps: AppInfo[];
  /** 是否隐藏 */
  hidden?: boolean;
  /** 隐藏状态显示文字 */
  hiddenText?: string;
}

/**
 * 统计卡片数据
 */
export interface StatCardData {
  /** 标题 */
  title: string;
  /** 数值 */
  value: string | number;
  /** 图标名称 */
  icon: string;
  /** 图标颜色 */
  iconColor: string;
  /** 背景颜色 */
  bgColor: string;
}
