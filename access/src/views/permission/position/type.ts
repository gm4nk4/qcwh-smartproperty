/**
 * @file type.ts
 * @description 岗位管理模块类型定义
 * @module position/type
 */

/**
 * 岗位数据类型
 * @interface Position
 */
export interface Position {
	/** 岗位ID */
	id: number;
	/** 岗位名称 */
	positionName: string;
	/** 岗位编码 */
	positionCode: string;
	/** 所属部门 */
	department: string;
	/** 岗位描述 */
	description: string;
	/** 授权用户数 */
	userCount: number;
	/** 关联角色数 */
	roleCount: number;
	/** 是否启用 */
	status: 'enable' | 'disable';
	/** 创建时间 */
	createTime: string;
}

/**
 * 岗位查询参数类型
 * @interface PositionQueryParams
 */
export interface PositionQueryParams {
	/** 岗位名称 */
	positionName: string;
	/** 岗位编码 */
	positionCode: string;
	/** 所属部门 */
	department: string;
}

/**
 * 部门数据类型
 * @interface Department
 */
export interface Department {
	/** 部门ID */
	id: number;
	/** 部门名称 */
	name: string;
	/** 父级部门ID */
	parentId: number;
}

/**
 * 岗位表单数据类型
 * @interface PositionFormData
 */
export interface PositionFormData {
	/** 岗位名称 */
	positionName: string;
	/** 岗位编码 */
	positionCode: string;
	/** 所属部门 */
	department: string;
	/** 岗位描述 */
	description: string;
}

/**
 * 岗位编辑弹窗 Props 类型
 */
export interface PositionEditDialogProps {
	/** 是否显示弹窗 */
	visible: boolean;
	/** 编辑时的岗位信息 */
	positionInfo?: Position | null;
}

/**
 * 岗位编辑弹窗 Emits 类型
 */
export interface PositionEditDialogEmits {
	(e: 'update:visible', val: boolean): void;
	(e: 'save', data: any): void;
}
