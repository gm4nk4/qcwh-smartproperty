import type { VisitorAppointmentDetail, VisitorAppointmentItem, VisitorAppointmentPageParams, VisitorAppointmentPassRecord, VisitorAppointmentStatus } from './api';
import type { AppointmentFormData, DetailSectionConfig } from './index';

export interface StatusTagMeta {
	label: string;
	className: string;
}

export interface AppointmentTableRow extends VisitorAppointmentItem {
	seq: number;
	statusText: string;
	statusClassName: string;
}

export interface AppointmentDetailSectionItem {
	label: string;
	value: string;
	span: 1 | 2;
}

export interface AppointmentDetailSection {
	key: string;
	title: string;
	items: AppointmentDetailSectionItem[];
}

export interface AppointmentPassRecordRow extends VisitorAppointmentPassRecord {
	seq: number;
	passTypeLabel: string;
}

const statusMetaMap: Record<VisitorAppointmentStatus, StatusTagMeta> = {
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

const passTypeLabelMap: Record<VisitorAppointmentPassRecord['passType'], string> = {
	enter: '入',
	exit: '出',
};

const trimValue = (value: unknown) => {
	if (typeof value !== 'string') return value;
	return value.trim();
};

const formatValue = (value: unknown) => {
	if (value === null || value === undefined || value === '') return '-';
	return String(value);
};

export const buildAppointmentQueryParams = (formData: AppointmentFormData): VisitorAppointmentPageParams => {
	return {
		visitorName: trimValue(formData.visitorName) as string,
		visitorPhone: trimValue(formData.visitorPhone) as string,
		visitorVehicleNo: trimValue(formData.visitorVehicleNo) as string,
		visitedEnterprise: trimValue(formData.visitedEnterprise) as string,
		visitedName: trimValue(formData.visitedName) as string,
		status: formData.status,
		current: Number(formData.current) || 1,
		size: Number(formData.size) || 10,
	};
};

export const getAppointmentStatusMeta = (status: VisitorAppointmentStatus): StatusTagMeta => {
	return statusMetaMap[status];
};

export const buildAppointmentTableRows = (records: VisitorAppointmentItem[], current: number, size: number): AppointmentTableRow[] => {
	return records.map((item, index) => {
		const statusMeta = getAppointmentStatusMeta(item.status);
		return {
			...item,
			seq: (current - 1) * size + index + 1,
			statusText: statusMeta.label,
			statusClassName: statusMeta.className,
		};
	});
};

export const buildAppointmentDetailSections = (
	detail: VisitorAppointmentDetail | null,
	configs: DetailSectionConfig[]
): AppointmentDetailSection[] => {
	if (!detail) return [];
	return configs.map((section) => ({
		key: section.key,
		title: section.title,
		items: section.items.map((item) => ({
			label: item.label,
			value: formatValue(detail[item.field as keyof VisitorAppointmentDetail]),
			span: item.span || 1,
		})),
	}));
};

export const buildAppointmentPassRecordRows = (records: VisitorAppointmentPassRecord[]): AppointmentPassRecordRow[] => {
	return records.map((item, index) => ({
		...item,
		seq: index + 1,
		passTypeLabel: passTypeLabelMap[item.passType],
		licensePlate: formatValue(item.licensePlate),
		passLocation: formatValue(item.passLocation),
	}));
};
