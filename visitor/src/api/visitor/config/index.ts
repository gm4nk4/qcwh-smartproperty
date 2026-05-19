export type VisitorConfigDeviceType = 'person_gate' | 'vehicle_gate';
export type VisitorConfigValidityType = 'same_day' | 'fixed_hours' | 'same_day_until';
export type VisitorConfigPassMethod = 'qr_code' | 'vehicle_scan';

export interface VisitorConfigDeviceItem {
	id: string;
	deviceName: string;
	deviceType: VisitorConfigDeviceType;
	deviceLocation: string;
}

export interface VisitorConfigDetail {
	devices: VisitorConfigDeviceItem[];
	validityType: VisitorConfigValidityType;
	fixedHours: number;
	untilTime: string;
	passMethods: VisitorConfigPassMethod[];
	noticeLines: string[];
}

export interface SaveVisitorConfigParams {
	validityType: VisitorConfigValidityType;
	fixedHours: number;
	untilTime: string;
	passMethods: VisitorConfigPassMethod[];
}

export interface AddVisitorConfigDeviceParams {
	deviceId: string;
}

const allDeviceOptions: VisitorConfigDeviceItem[] = [
	{
		id: 'device-1',
		deviceName: '东大门人行门禁01',
		deviceType: 'person_gate',
		deviceLocation: '园区东大门门口',
	},
	{
		id: 'device-2',
		deviceName: '东大门车辆门闸01',
		deviceType: 'vehicle_gate',
		deviceLocation: '园区东大门门口',
	},
	{
		id: 'device-3',
		deviceName: '西大门人行门禁01',
		deviceType: 'person_gate',
		deviceLocation: '园区西大门门口',
	},
	{
		id: 'device-4',
		deviceName: '南门人行门禁01',
		deviceType: 'person_gate',
		deviceLocation: '园区南门门口',
	},
	{
		id: 'device-5',
		deviceName: '北门车辆门闸01',
		deviceType: 'vehicle_gate',
		deviceLocation: '园区北门门口',
	},
	{
		id: 'device-6',
		deviceName: '访客中心人行门禁01',
		deviceType: 'person_gate',
		deviceLocation: '访客中心接待大厅',
	},
	{
		id: 'device-7',
		deviceName: '展示厅车辆门闸01',
		deviceType: 'vehicle_gate',
		deviceLocation: '展示厅外广场',
	},
];

let visitorConfigState: VisitorConfigDetail = {
	devices: allDeviceOptions.slice(0, 3).map((item) => ({ ...item })),
	validityType: 'same_day',
	fixedHours: 4,
	untilTime: '18:00',
	passMethods: ['qr_code', 'vehicle_scan'],
	noticeLines: [
		'所有访客通行有效期均为当日内，不可跨日。',
		'1、当日内有效：访客可通行时间为申请访问时间起到当日24:00。',
		'2、固定间隔小时：如4小时，访客可通行时间为申请访问时间起4小时后失效。',
		'3、当日几点截至：则有效期为访客可通行时间固定截至时间。',
	],
};

const cloneDevice = (item: VisitorConfigDeviceItem): VisitorConfigDeviceItem => ({ ...item });

const cloneDetail = (detail: VisitorConfigDetail): VisitorConfigDetail => ({
	...detail,
	devices: detail.devices.map(cloneDevice),
	passMethods: [...detail.passMethods],
	noticeLines: [...detail.noticeLines],
});

export const getVisitorConfigDetail = async (): Promise<{ code: number; data: VisitorConfigDetail }> => {
	return Promise.resolve({
		code: 0,
		data: cloneDetail(visitorConfigState),
	});
};

export const getVisitorConfigDeviceOptions = async (): Promise<{ code: number; data: VisitorConfigDeviceItem[] }> => {
	return Promise.resolve({
		code: 0,
		data: allDeviceOptions.map(cloneDevice),
	});
};

export const addVisitorConfigDevice = async (params: AddVisitorConfigDeviceParams): Promise<{ code: number; data: VisitorConfigDetail }> => {
	const selected = allDeviceOptions.find((item) => item.id === params.deviceId);
	if (selected && !visitorConfigState.devices.some((item) => item.id === params.deviceId)) {
		visitorConfigState = {
			...visitorConfigState,
			devices: [...visitorConfigState.devices, cloneDevice(selected)],
		};
	}

	return Promise.resolve({
		code: 0,
		data: cloneDetail(visitorConfigState),
	});
};

export const removeVisitorConfigDevice = async (id: string): Promise<{ code: number; data: VisitorConfigDetail }> => {
	visitorConfigState = {
		...visitorConfigState,
		devices: visitorConfigState.devices.filter((item) => item.id !== id),
	};

	return Promise.resolve({
		code: 0,
		data: cloneDetail(visitorConfigState),
	});
};

export const saveVisitorConfig = async (params: SaveVisitorConfigParams): Promise<{ code: number; data: VisitorConfigDetail }> => {
	visitorConfigState = {
		...visitorConfigState,
		validityType: params.validityType,
		fixedHours: Number(params.fixedHours) || 1,
		untilTime: params.untilTime,
		passMethods: [...params.passMethods],
	};

	return Promise.resolve({
		code: 0,
		data: cloneDetail(visitorConfigState),
	});
};
