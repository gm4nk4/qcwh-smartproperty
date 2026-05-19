import type {
	VisitorAccessRecordDetail,
	VisitorAccessRecordItem,
	VisitorAccessRecordPageParams,
	VisitorAccessRecordPassItem,
	VisitorAccessStatus,
} from './api';
import type { AccessRecordFormData, DetailSectionConfig } from './index';

export interface StatusTagMeta {
	label: string;
	className: string;
}

export interface AccessRecordTableRow extends VisitorAccessRecordItem {
	seq: number;
	statusText: string;
	statusClassName: string;
	passTypeLabel: string;
	passMethodLabel: string;
}

export interface AccessRecordDetailSectionItem {
	label: string;
	value: string;
	span: 1 | 2;
}

export interface AccessRecordDetailSection {
	key: string;
	title: string;
	items: AccessRecordDetailSectionItem[];
}

export interface AccessRecordPassTableRow extends VisitorAccessRecordPassItem {
	seq: number;
	passTypeLabel: string;
	passMethodLabel: string;
}

const statusMetaMap: Record<VisitorAccessStatus, StatusTagMeta> = {
	pending_visit: {
		label: '待来访',
		className: 'status-tag status-tag--pending-visit',
	},
	completed: {
		label: '已完成',
		className: 'status-tag status-tag--completed',
	},
	expired: {
		label: '已失效',
		className: 'status-tag status-tag--expired',
	},
};

const passTypeLabelMap: Record<VisitorAccessRecordPassItem['passType'], string> = {
	enter: '入',
	exit: '出',
};

const passMethodLabelMap: Record<VisitorAccessRecordPassItem['passMethod'], string> = {
	vehicle: '车辆通行',
	person_scan: '行人扫码',
};

const trimValue = (value: unknown) => {
	if (typeof value !== 'string') return value;
	return value.trim();
};

const formatValue = (value: unknown) => {
	if (value === null || value === undefined || value === '') return '-';
	return String(value);
};

const getPassTypeLabel = (passType: VisitorAccessRecordPassItem['passType']) => passTypeLabelMap[passType];

const getPassMethodLabel = (passMethod: VisitorAccessRecordPassItem['passMethod']) => passMethodLabelMap[passMethod];

const formatDetailFieldValue = (detail: VisitorAccessRecordDetail, field: string) => {
	if (field === 'passTypeLabel') return getPassTypeLabel(detail.passType);
	if (field === 'passMethodLabel') return getPassMethodLabel(detail.passMethod);
	return formatValue(detail[field as keyof VisitorAccessRecordDetail]);
};

export const buildAccessRecordQueryParams = (formData: AccessRecordFormData): VisitorAccessRecordPageParams => {
	return {
		visitorName: trimValue(formData.visitorName) as string,
		visitorPhone: trimValue(formData.visitorPhone) as string,
		licensePlate: trimValue(formData.licensePlate) as string,
		visitedEnterprise: trimValue(formData.visitedEnterprise) as string,
		visitedName: trimValue(formData.visitedName) as string,
		passType: trimValue(formData.passType) as string,
		passMethod: trimValue(formData.passMethod) as string,
		appointmentNo: trimValue(formData.appointmentNo) as string,
		passLocation: trimValue(formData.passLocation) as string,
		current: Number(formData.current) || 1,
		size: Number(formData.size) || 10,
	};
};

export const getAccessRecordStatusMeta = (status: VisitorAccessStatus): StatusTagMeta => {
	return statusMetaMap[status];
};

export const buildAccessRecordTableRows = (records: VisitorAccessRecordItem[], current: number, size: number): AccessRecordTableRow[] => {
	return records.map((item, index) => {
		const statusMeta = getAccessRecordStatusMeta(item.status);
		return {
			...item,
			seq: (current - 1) * size + index + 1,
			statusText: statusMeta.label,
			statusClassName: statusMeta.className,
			passTypeLabel: getPassTypeLabel(item.passType),
			passMethodLabel: getPassMethodLabel(item.passMethod),
		};
	});
};

export const buildAccessRecordDetailSections = (
	detail: VisitorAccessRecordDetail | null,
	configs: DetailSectionConfig[]
): AccessRecordDetailSection[] => {
	if (!detail) return [];
	return configs.map((section) => ({
		key: section.key,
		title: section.title,
		items: section.items.map((item) => ({
			label: item.label,
			value: formatDetailFieldValue(detail, item.field),
			span: item.span || 1,
		})),
	}));
};

export const buildAccessRecordPassRows = (records: VisitorAccessRecordPassItem[]): AccessRecordPassTableRow[] => {
	return records.map((item, index) => ({
		...item,
		seq: index + 1,
		passTypeLabel: getPassTypeLabel(item.passType),
		passMethodLabel: getPassMethodLabel(item.passMethod),
		licensePlate: formatValue(item.licensePlate),
		passLocation: formatValue(item.passLocation),
	}));
};
