import request from '/@/utils/request';

export interface SubitemSystemPageParams {
	systemName?: string;
	systemType?: string;
	runningStatus?: string;
	current?: number;
	size?: number;
}

export interface SubitemSystemRecord {
	id: number | string;
	systemName?: string | null;
	systemCode?: string | null;
	systemType?: string | null;
	systemTypeName?: string | null;
	spaceId?: number | string | null;
	spaceName?: string | null;
	deviceCount?: number | null;
	todayEnergy?: number | null;
	loadRate?: number | string | null;
	runningStatus?: string | null;
	runStatus?: string | null;
	runStatusName?: string | null;
	responsiblePerson?: string | null;
	principal?: string | null;
	phone?: string | null;
	installedCapacity?: number | null;
	energyQuota?: number | null;
	remark?: string | null;
	updateTime?: string | null;
	updatedTime?: string | null;
	createTime?: string | null;
}

export interface SubitemSystemPageData {
	records: SubitemSystemRecord[];
	total: number;
	size?: number;
	current?: number;
}

export interface SubitemSystemApiResponse<T> {
	code: number;
	msg?: string;
	data: T;
}

export interface SaveSubitemSystemParams {
	id?: number | string | null;
	systemName: string;
	systemCode: string;
	systemType: string;
	spaceId?: number | string | null;
	responsiblePerson: string;
	phone: string;
	installedCapacity?: number | null;
	energyQuota?: number | null;
	remark?: string | null;
	runningStatus?: string;
}

export interface BaseSpaceTreeNode {
	id: number | string;
	spaceName: string;
	parentId?: number | string | null;
	child?: BaseSpaceTreeNode[];
}

export interface GetDeviceBindListParams {
	deviceName?: string;
	deviceCode?: string;
	deviceCategory?: string;
	deviceType?: string;
	configStatus?: string;
}

export interface DeviceBindRecord {
	id?: number | string | null;
	name?: string | null;
	deviceId?: number | string | null;
	deviceName?: string | null;
	deviceCode?: string | null;
	deviceType?: string | null;
	deviceTypeName?: string | null;
	installLocation?: string | null;
	location?: string | null;
	spaceName?: string | null;
	ratedPower?: number | null;
	runningStatus?: string | null;
	runStatus?: string | null;
	runStatusName?: string | null;
	deviceStatus?: string | null;
	deviceStatusName?: string | null;
	subSystemId?: number | string | null;
	subSystemName?: string | null;
	systemId?: number | string | null;
	systemName?: string | null;
	belongSubsystemId?: number | string | null;
	belongSubsystemName?: string | null;
	isChoose?: boolean | null;
	checked?: boolean | null;
	disabled?: boolean | null;
}

export type DeviceBindListData =
	| DeviceBindRecord[]
	| {
			records?: DeviceBindRecord[] | null;
			list?: DeviceBindRecord[] | null;
			rows?: DeviceBindRecord[] | null;
	  };

export function getSubitemSystemPage(params: SubitemSystemPageParams): Promise<SubitemSystemApiResponse<SubitemSystemPageData>> {
	return request({
		url: '/platform/base/subSystem/page',
		method: 'get',
		params,
	}) as Promise<SubitemSystemApiResponse<SubitemSystemPageData>>;
}

export function deleteSubitemSystem(ids: Array<number | string>): Promise<SubitemSystemApiResponse<boolean>> {
	return request({
		url: '/platform/base/subSystem/delete',
		method: 'post',
		data: ids,
	}) as Promise<SubitemSystemApiResponse<boolean>>;
}

export function saveSubitemSystem(data: SaveSubitemSystemParams): Promise<SubitemSystemApiResponse<boolean>> {
	return request({
		url: '/platform/base/subSystem/save',
		method: 'post',
		data,
	}) as Promise<SubitemSystemApiResponse<boolean>>;
}

export function getBaseSpaceTree(): Promise<SubitemSystemApiResponse<BaseSpaceTreeNode[]>> {
	return request({
		url: '/platform/base/space/tree',
		method: 'get',
	}) as Promise<SubitemSystemApiResponse<BaseSpaceTreeNode[]>>;
}

export function getDeviceBindList(
	id: number | string,
	data?: GetDeviceBindListParams
): Promise<SubitemSystemApiResponse<DeviceBindListData>> {
	return request({
		url: `/platform/base/subSystem/device/list/${id}`,
		method: 'post',
		data,
	}) as Promise<SubitemSystemApiResponse<DeviceBindListData>>;
}

export function bindSubitemSystemDevices(id: number | string, deviceIds: Array<number | string>): Promise<SubitemSystemApiResponse<boolean>> {
	return request({
		url: `/platform/base/subSystem/deviceBind/${id}`,
		method: 'post',
		data: deviceIds,
	}) as Promise<SubitemSystemApiResponse<boolean>>;
}
