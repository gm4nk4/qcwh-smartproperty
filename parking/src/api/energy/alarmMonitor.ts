import request from '/@/utils/request';

export interface AlarmMonitorApiResponse<T> {
	code: number;
	msg?: string;
	data: T;
}

export interface AlarmMonitorSummaryData {
	emergencyCount?: number | null;
	seriousCount?: number | null;
	warningCount?: number | null;
	infoCount?: number | null;
}

export interface AlarmMonitorPageParams {
	current: number;
	size: number;
	alarmLevel?: string;
	alarmType?: string;
	status?: string;
	dateStart?: string;
	dateEnd?: string;
}

export interface AlarmMonitorRecord {
	id: number | string;
	alarmLevel?: string | null;
	alarmType?: string | null;
	content?: string | null;
	alarmValue?: string | null;
	threshold?: string | null;
	alarmLog?: string | null;
	alarmTime?: string | null;
	status?: string | null;
	createBy?: string | null;
	createTime?: string | null;
	updateBy?: string | null;
	updateTime?: string | null;
	tenantId?: number | null;
}

export interface AlarmMonitorPageData {
	records: AlarmMonitorRecord[];
	total: number;
	size: number;
	current: number;
}

export interface AlarmMonitorUpdatePayload {
	id: number | string;
	status?: string;
	alarmLog?: string;
}

export const getAlarmMonitorSummary = (): Promise<AlarmMonitorApiResponse<AlarmMonitorSummaryData>> => {
	return request({
		url: '/platform/alarm/monitor/summary',
		method: 'get',
	}) as Promise<AlarmMonitorApiResponse<AlarmMonitorSummaryData>>;
};

export const getAlarmMonitorPage = (params: AlarmMonitorPageParams): Promise<AlarmMonitorApiResponse<AlarmMonitorPageData>> => {
	return request({
		url: '/platform/alarm/monitor/page',
		method: 'post',
		params,
	}) as Promise<AlarmMonitorApiResponse<AlarmMonitorPageData>>;
};

export const getAlarmMonitorDetail = (id: number | string): Promise<AlarmMonitorApiResponse<AlarmMonitorRecord>> => {
	return request({
		url: `/platform/alarm/monitor/detail/${id}`,
		method: 'get',
	}) as Promise<AlarmMonitorApiResponse<AlarmMonitorRecord>>;
};

export const updateAlarmMonitor = (data: AlarmMonitorUpdatePayload): Promise<AlarmMonitorApiResponse<boolean>> => {
	return request({
		url: '/platform/alarm/monitor/process',
		method: 'post',
		data,
	}) as Promise<AlarmMonitorApiResponse<boolean>>;
};

export const exportAlarmMonitor = (params: Omit<AlarmMonitorPageParams, 'current' | 'size'>) => {
	return request({
		url: '/platform/alarm/monitor/export',
		method: 'post',
		data: params,
		responseType: 'blob',
	});
};
