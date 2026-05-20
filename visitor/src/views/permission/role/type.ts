/**
 * @file type.ts
 * @description 角色管理模块类型定义
 * @module role/type
 */

/**
 * 角色数据类型
 * @interface Role
 */
export interface Role {
	/** 角色ID */
	id: number;
	/** 角色名称 */
	roleName: string;
	/** 角色编码 */
	roleCode: string;
	/** 所属子应用 */
	appName: string;
	/** 角色说明 */
	description: string;
	/** 授权用户数量 */
	authUserCount: number;
	/** 授权平台角色 */
	authPlatformRoles: string[];
	/** 状态 */
	status: '启用' | '禁用';
}

/**
 * 平台角色数据类型
 * @interface PlatformRole
 */
export interface PlatformRole {
	/** 角色ID */
	id: number;
	/** 角色名称 */
	roleName: string;
	/** 角色编码 */
	roleCode: string;
	/** 是否内置角色 */
	isBuiltIn: boolean;
	/** 子应用数量 */
	appCount: number;
	/** 角色数量 */
	roleCount: number;
	/** 使用人数 */
	userCount: number;
	/** 角色说明 */
	description: string;
	/** 子应用角色映射 */
	appRoleMap: AppRoleMap[];
}

/**
 * 子应用角色映射类型
 * @interface AppRoleMap
 */
export interface AppRoleMap {
	/** 子应用名称 */
	appName: string;
	/** 角色列表 */
	roles: AppRole[];
}

/**
 * 子应用角色类型
 * @interface AppRole
 */
export interface AppRole {
	/** 角色名称 */
	roleName: string;
	/** 是否默认选中 */
	isDefault: boolean;
}

/**
 * 平台角色列表项类型
 * @interface PlatformRoleItem
 */
export interface PlatformRoleItem {
	/** 角色ID */
	id: number;
	/** 角色名称 */
	name: string;
	/** 子应用数量 */
	appCount: number;
	/** 角色数量 */
	roleCount: number;
}

/**
 * 查询参数类型
 * @interface QueryParams
 */
export interface QueryParams {
	/** 角色名称 */
	roleName: string;
	/** 角色编码 */
	roleCode: string;
}

/**
 * 应用树形节点类型
 * @interface AppTreeNode
 */
export interface AppTreeNode {
	/** 节点ID */
	id: string;
	/** 节点名称 */
	name: string;
	/** 节点类型 */
	type: 'group' | 'app';
	/** 子节点 */
	children?: AppTreeNode[];
	/** 角色数量 */
	count?: number;
}

/**
 * 子应用角色选项类型（弹窗用）
 * @interface AppRoleOption
 */
export interface AppRoleOption {
	/** 子应用名称 */
	appName: string;
	/** 是否展开 */
	expanded: boolean;
	/** 选中数量 */
	selectedCount: number;
	/** 角色列表 */
	roles: { roleName: string; selected: boolean }[];
}

/**
 * 平台角色表单数据类型
 * @interface PlatformRoleFormData
 */
export interface PlatformRoleFormData {
	/** 角色名称 */
	roleName: string;
	/** 角色编码 */
	roleCode: string;
	/** 角色说明 */
	description: string;
}

/**
 * 平台角色编辑弹窗 Props 类型
 */
export interface PlatformRoleEditDialogProps {
	/** 是否显示弹窗 */
	visible: boolean;
	/** 编辑时的角色信息 */
	roleInfo?: PlatformRole | null;
}

/**
 * 平台角色编辑弹窗 Emits 类型
 */
export interface PlatformRoleEditDialogEmits {
	(e: 'update:visible', val: boolean): void;
	(e: 'save', data: any): void;
}

/**
 * 权限树节点类型
 */
export interface PermissionTreeNode {
	/** 节点ID */
	id: string;
	/** 节点名称 */
	label: string;
	/** 子节点 */
	children?: PermissionTreeNode[];
	/** 是否选中 */
	checked?: boolean;
}

/**
 * 权限分配弹窗 Props 类型
 */
export interface PermissionAssignDialogProps {
	/** 是否显示弹窗 */
	visible: boolean;
	/** 平台角色信息 */
	roleInfo?: PlatformRole | null;
}

/**
 * 权限分配弹窗 Emits 类型
 */
export interface PermissionAssignDialogEmits {
	(e: 'update:visible', val: boolean): void;
	(e: 'save', data: any): void;
}

/**
 * 用户列表项类型
 */
export interface UserItem {
	/** 用户ID */
	id: number;
	/** 用户名称 */
	name: string;
	/** 用户部门 */
	department?: string;
	/** 用户编号 */
	code?: string;
}

/**
 * 角色编辑弹窗 Props 类型
 */
export interface RoleEditDialogProps {
	/** 是否显示弹窗 */
	visible: boolean;
	/** 编辑时的角色信息 */
	roleInfo?: Role | null;
}

/**
 * 角色编辑弹窗 Emits 类型
 */
export interface RoleEditDialogEmits {
	(e: 'update:visible', val: boolean): void;
	(e: 'save', data: any): void;
}

/**
 * 角色分配弹窗 Props 类型
 */
export interface RoleAssignDialogProps {
	/** 是否显示弹窗 */
	visible: boolean;
	/** 角色信息 */
	roleInfo?: Role | null;
}

/**
 * 角色分配弹窗 Emits 类型
 */
export interface RoleAssignDialogEmits {
	(e: 'update:visible', val: boolean): void;
	(e: 'save', data: any): void;
}
