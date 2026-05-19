/**
 * 工作台配置类型定义
 * @description 定义工作台配置页面的所有数据类型
 */

/**
 * 统计数据类型
 */
export interface StatsData {
  /** 总模块数 */
  totalModules: number;
  /** 公共模块数 */
  publicModules: number;
  /** 已显示模块数 */
  displayedModules: number;
  /** 布局行数 */
  layoutRows: number;
}

/**
 * 模块类型枚举
 */
export enum ModuleType {
  /** 公共模块 */
  PUBLIC = 'public',
  /** 子应用模块 */
  SUBAPP = 'subapp'
}

/**
 * 模块项类型
 */
export interface ModuleItem {
  /** 模块ID */
  id: number | string;
  /** 模块名称 */
  name: string;
  /** 模块类型 */
  type: ModuleType;
  /** 是否选中 */
  checked: boolean;
  /** 是否禁用 */
  disabled?: boolean;
  /** 宽度（列数） */
  width: number;
  /** 高度（行数） */
  height: number;
  /** 关联应用（子应用模块专用） */
  appName?: string;
  /** 排序权重 */
  sort?: number;
}

/**
 * 布局模块项（预览区使用）
 */
export interface LayoutModuleItem extends ModuleItem {
  /** X坐标 */
  x: number;
  /** Y坐标 */
  y: number;
  /** 标签类型 */
  tagType?: 'public' | 'subapp';
  /** 是否显示 */
  visible?: boolean;
  /** 是否禁用 */
  disabled?: boolean;
}

/**
 * 颜色方案类型
 */
export interface ColorScheme {
  /** 方案名称 */
  name: string;
  /** 是否默认 */
  isDefault: boolean;
}

/**
 * 布局配置类型
 */
export interface LayoutConfig {
  /** 编辑颜色方案 */
  editColorScheme: boolean;
  /** 当前颜色方案 */
  currentColorScheme: string;
  /** 颜色方案列表 */
  colorSchemes: ColorScheme[];
}
