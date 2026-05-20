import type { CreateVisitorBlacklistParams, VisitorBlacklistItem, VisitorBlacklistPageParams, VisitorBlacklistType } from './api';
import type { BlacklistDialogFormData, BlacklistPageFormData } from './index';

export interface BlacklistTableRow extends VisitorBlacklistItem {
	typeLabel: string;
	identityDisplay: string;
}

const blacklistTypeLabelMap: Record<VisitorBlacklistType, string> = {
	visitor: '访客',
	vehicle: '车辆',
	enterprise: '入驻企业',
};

const trimValue = (value: unknown) => {
	if (typeof value !== 'string') return value;
	return value.trim();
};

const formatValue = (value: unknown) => {
	if (value === null || value === undefined || value === '') return '-';
	return String(value);
};

export const buildBlacklistQueryParams = (formData: BlacklistPageFormData): VisitorBlacklistPageParams => {
	return {
		type: formData.type,
		name: trimValue(formData.name) as string,
		identityValue: trimValue(formData.identityValue) as string,
		current: Number(formData.current) || 1,
		size: Number(formData.size) || 10,
	};
};

export const buildBlacklistTableRows = (records: VisitorBlacklistItem[]): BlacklistTableRow[] => {
	return records.map((item) => ({
		...item,
		typeLabel: blacklistTypeLabelMap[item.type],
		identityDisplay: formatValue(item.identityValue),
	}));
};

export const buildCreateBlacklistPayload = (formData: BlacklistDialogFormData, reasonDescription: string): CreateVisitorBlacklistParams => {
	return {
		type: formData.type,
		name: trimValue(formData.name) as string,
		identityValue: trimValue(formData.identityValue) as string,
		reasonDescription,
		remark: trimValue(formData.remark) as string,
	};
};
