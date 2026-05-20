/**
 * 组织管理模块类型定义
 */

// 组织数据结构
export interface Organization {
	id: number;
	name: string;
	manager: string;
	position: string;
	memberCount: number;
	parentId?: number;
	parentName?: string;
	children?: Organization[];
}

// 子应用数据结构
export interface AppIndependentApp {
	id: string;
	name: string;
	icon?: string;
	hasIndependentOrg: boolean;
	organizations?: Organization[];
}

// 编辑表单数据
export interface OrgFormData {
	name: string;
	manager: string;
	position: string;
	parentId?: number;
}

// 编辑弹窗 Props
export interface OrgEditDialogProps {
	visible: boolean;
	orgInfo?: Organization | null;
}

// 编辑弹窗 Emits
export interface OrgEditDialogEmits {
	(e: 'update:visible', value: boolean): void;
	(e: 'save', data: OrgFormData): void;
}
