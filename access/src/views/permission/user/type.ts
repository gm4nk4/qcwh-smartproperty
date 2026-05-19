/**
 * @file type.ts
 * @description 用户模块类型定义
 * @module user/type
 */

/**
 * 登录日志数据类型
 * @interface LoginLog
 */
export interface LoginLog {
	/** 登录时间 */
	time: string;
	/** 登录终端 */
	terminal: string;
	/** IP 地址 */
	ip: string;
}

/**
 * 用户基本信息数据类型
 * @interface UserInfo
 */
export interface UserInfo {
	/** 用户名 */
	username: string;
	/** 职位 */
	position: string;
	/** 用户ID */
	userId: string;
	/** 所属部门 */
	department: string;
	/** 手机号码 */
	phone: string;
	/** 电子邮箱 */
	email: string;
	/** 创建时间 */
	createTime: string;
	/** 最后登录时间 */
	lastLogin: string;
	/** 是否在线 */
	isOnline: boolean;
}

/**
 * 平台角色数据类型
 * @interface PlatformRole
 */
export interface PlatformRole {
	/** 角色图标 */
	icon: string;
	/** 角色名称 */
	name: string;
	/** 是否内置角色 */
	isBuiltIn: boolean;
	/** 角色描述 */
	desc: string;
}

/**
 * 子应用权限详情数据类型
 * @interface SubAppPermission
 */
export interface SubAppPermission {
	/** 子应用名称 */
	name: string;
	/** 角色列表 */
	roles: string[];
	/** 权限详情（可选） */
	permissions?: {
		/** 平台角色继承 */
		platformInherit: string[];
		/** 直接分配 */
		direct: string[];
	};
}

/**
 * 用户详情弹窗 Props
 * @interface UserDetailDialogProps
 */
export interface UserDetailDialogProps {
	/** 控制弹窗显示/隐藏 */
	visible: boolean;
}

/**
 * 用户详情弹窗 Emits
 * @interface UserDetailDialogEmits
 */
export interface UserDetailDialogEmits {
	/** 更新 visible 状态 */
	'update:visible': [value: boolean];
	/** 点击赋权按钮 */
	assign: [];
}

/**
 * 用户信息面板 Props
 * @interface UserInfoPanelProps
 */
export interface UserInfoPanelProps {
	/** 用户基本信息 */
	userInfo: UserInfo;
	/** 登录日志列表 */
	loginLogs: LoginLog[];
}

/**
 * 权限面板 Props
 * @interface PermissionPanelProps
 */
export interface PermissionPanelProps {
	/** 平台角色列表 */
	platformRoles: PlatformRole[];
	/** 子应用权限列表 */
	subAppPermissions: SubAppPermission[];
}

/**
 * 用户赋权弹窗 Props
 * @interface UserAuthDialogProps
 */
export interface UserAuthDialogProps {
	visible: boolean;
	userInfo: UserInfo;
}

/**
 * 用户赋权弹窗 Emits
 * @interface UserAuthDialogEmits
 */
export interface UserAuthDialogEmits {
	(e: 'update:visible', value: boolean): void;
	(e: 'save', data: SaveData): void;
}

/**
 * 赋权角色类型
 * @interface AuthRole
 */
export interface AuthRole {
	name: string;
	selected: boolean;
	inherited: boolean;
}

/**
 * 赋权子应用类型
 * @interface AuthSubApp
 */
export interface AuthSubApp {
	name: string;
	inherited: boolean;
	selectedCount: number;
	roles: AuthRole[];
}

/**
 * 保存数据类型
 * @interface SaveData
 */
export interface SaveData {
	directAssignRoles: string[];
	finalRoles: string[];
}

export interface User {
	id: number;
	userName: string;
	userId: string;
	deptName: string;
	platformRole: string;
	postTags: string[];
	appAuth: string;
	status: '在线' | '离线' | '禁用';
	lastLoginTime: string;
	avatar?: string;
}

export interface QueryParams {
	userName: string;
	platformRole: string;
	status: string;
}

export interface StatCard {
	title: string;
	value: number | string;
	icon: string;
	color: string;
}

export interface UserEditDialogProps {
	visible: boolean;
	userInfo?: UserEditFormData;
}

export interface UserEditDialogEmits {
	'update:visible': [value: boolean];
	save: [data: UserEditFormData];
}

export interface UserEditFormData {
	userName: string;
	phone: string;
	deptName: string;
	postTags: string[];
	email: string;
}

export interface UserResetPwdDialogProps {
	visible: boolean;
	userInfo?: User;
}

export interface UserResetPwdDialogEmits {
	'update:visible': [value: boolean];
	save: [data: UserResetPwdFormData];
}

export interface UserResetPwdFormData {
	newPassword: string;
	confirmPassword: string;
}
