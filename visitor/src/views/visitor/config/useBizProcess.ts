import type {
	AddVisitorConfigDeviceParams,
	SaveVisitorConfigParams,
	VisitorConfigDetail,
	VisitorConfigDeviceItem,
	VisitorConfigDeviceType,
} from './api';
import type { DeviceDialogFormData, VisitorConfigFormData } from './index';

export interface VisitorConfigDeviceRow extends VisitorConfigDeviceItem {
	seq: number;
	deviceTypeLabel: string;
}

export interface VisitorConfigDeviceOption {
	label: string;
	value: string;
	disabled: boolean;
	deviceTypeLabel: string;
	deviceLocation: string;
}

const deviceTypeLabelMap: Record<VisitorConfigDeviceType, string> = {
	person_gate: '人行门禁',
	vehicle_gate: '车辆门闸',
};

export const getVisitorConfigDeviceTypeLabel = (type: VisitorConfigDeviceType) => {
	return deviceTypeLabelMap[type];
};

export const buildVisitorConfigFormData = (detail: VisitorConfigDetail): VisitorConfigFormData => {
	return {
		validityType: detail.validityType,
		fixedHours: detail.fixedHours,
		untilTime: detail.untilTime,
		passMethods: [...detail.passMethods],
	};
};

export const buildVisitorConfigDeviceRows = (records: VisitorConfigDeviceItem[]): VisitorConfigDeviceRow[] => {
	return records.map((item, index) => ({
		...item,
		seq: index + 1,
		deviceTypeLabel: getVisitorConfigDeviceTypeLabel(item.deviceType),
	}));
};

export const buildVisitorConfigDeviceOptions = (
	options: VisitorConfigDeviceItem[],
	selectedDevices: VisitorConfigDeviceItem[]
): VisitorConfigDeviceOption[] => {
	const selectedIdSet = new Set(selectedDevices.map((item) => item.id));
	return options.map((item) => ({
		label: item.deviceName,
		value: item.id,
		disabled: selectedIdSet.has(item.id),
		deviceTypeLabel: getVisitorConfigDeviceTypeLabel(item.deviceType),
		deviceLocation: item.deviceLocation,
	}));
};

export const getSelectedVisitorConfigDeviceOption = (deviceId: string, options: VisitorConfigDeviceOption[]): VisitorConfigDeviceOption | null => {
	return options.find((item) => item.value === deviceId) || null;
};

export const buildVisitorConfigSavePayload = (formData: VisitorConfigFormData): SaveVisitorConfigParams => {
	return {
		validityType: formData.validityType,
		fixedHours: Number(formData.fixedHours) || 1,
		untilTime: formData.untilTime,
		passMethods: [...formData.passMethods],
	};
};

export const buildAddVisitorConfigDevicePayload = (formData: DeviceDialogFormData): AddVisitorConfigDeviceParams => {
	return {
		deviceId: formData.deviceId,
	};
};
