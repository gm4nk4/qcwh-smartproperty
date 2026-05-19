export interface VisitorParkGuideFormData {
	markdownContent: string;
}

export type VisitorParkGuideField = keyof VisitorParkGuideFormData;
export type ParkGuideMode = 'view' | 'edit';

export interface ParkGuideModeOption {
	label: string;
	value: ParkGuideMode;
}

export interface ParkGuideEditorFieldConfig {
	key: string;
	field: VisitorParkGuideField;
	label: string;
	component: 'el-input';
	props: Record<string, unknown>;
}

export const guideModeOptions: ParkGuideModeOption[] = [
	{ label: '查看模式', value: 'view' },
	{ label: '编辑模式', value: 'edit' },
];

export const editorFieldConfig: ParkGuideEditorFieldConfig = {
	key: 'markdownContent',
	field: 'markdownContent',
	label: 'Markdown 内容',
	component: 'el-input',
	props: {
		type: 'textarea',
		rows: 24,
		resize: 'none',
		placeholder: '请输入园区访客管理说明（支持 Markdown）',
	},
};

export const defaultFormData: VisitorParkGuideFormData = {
	markdownContent: '',
};
