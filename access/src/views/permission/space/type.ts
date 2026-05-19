/**
 * 空间管理模块类型定义
 */

// 空间类型
export type SpaceType = 'project' | 'building' | 'floor' | 'room' | 'public';

// 空间数据结构
export interface Space {
	id: number;
	name: string;
	code: string;
	type: SpaceType;
	typeLabel: string;
	parentId?: number;
	children?: Space[];
}

// 查询参数
export interface SpaceQueryParams {
	name: string;
	type: SpaceType | '';
}

// 编辑表单数据
export interface SpaceFormData {
	name: string;
	code: string;
	type: SpaceType;
	parentId?: number;
}

// 编辑弹窗 Props
export interface SpaceEditDialogProps {
	visible: boolean;
	spaceInfo?: Space | null;
}

// 编辑弹窗 Emits
export interface SpaceEditDialogEmits {
	(e: 'update:visible', value: boolean): void;
	(e: 'save', data: SpaceFormData): void;
}
