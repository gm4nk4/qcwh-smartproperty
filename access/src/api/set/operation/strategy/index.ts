import request from '/@/utils/request';

/**接口类型 通用响应 */
export interface ICommonResponse<T> {
	code: number;
	msg: string;
	data: T;
}

/**
 * 启动 /job/sys-job/start-job/1858770931940192258
 * @returns Promise<ICommonResponse<boolean>>
 */
export function startStrategy(id: string): Promise<ICommonResponse<boolean>> {
	return request({
		url: `/job/sys-job/start-job/${id}`,
		method: 'post',
	});
}

/**
 * 暂停 /job/sys-job/shutdown-job/1872553802517446657
 * @returns Promise<ICommonResponse<boolean>>
 */
export function pauseStrategy(id: string): Promise<ICommonResponse<boolean>> {
	return request({
		url: `/job/sys-job/shutdown-job/${id}`,
		method: 'post',
	});
}

/**
 * 立即执行 /job/sys-job/run-job/1876888914563686481
 * @returns Promise<ICommonResponse<boolean>>
 */
export function executeStrategy(id: string): Promise<ICommonResponse<boolean>> {
	return request({
		url: `/job/sys-job/run-job/${id}`,
		method: 'post',
	});
}

/**
 * 执行日志
 * @param id 策略ID
 * @returns Promise<ICommonResponse<boolean>>
 */
export function executeLog(id: number): Promise<ICommonResponse<boolean>> {
	return request({
		url: '/platform/strategy/log',
		method: 'post',
		data: { id },
	});
}

/*获取执行日志*/
export interface IExecuteLogParams {
	pageNum: number;
	pageSize: number;
	query: Partial<IExecuteLogQuery>;
}

export interface IExecuteLogQuery {
	ruleId: number;
	ruleName: string;
	algorithmId: string;
	algorithmName: string;
	cameraId: string;
	cameraName: string;
	spaceId: string;
	spaceName: string;
	timeStart: string;
	timeEnd: string;
	info: string;
	state: string;
	result: string;
	exception: string;
	createTime: string;
}

export interface IExecuteLogResponse {
	records: IExecuteLogRecord[];
	total: number;
	size: number;
	current: number;
}

export interface IExecuteLogRecord {
	ruleId: number;
	ruleName: string;
	algorithmId: string;
	algorithmName: string;
	cameraId: string;
	cameraName: string;
	spaceId: string;
	spaceName: string;
	timeStart: string;
	timeEnd: string;
	info: string;
	state: string;
	result: string;
	exception: string;
	createTime: string;
}

export function getExecuteLog(params: IExecuteLogParams): Promise<ICommonResponse<IExecuteLogResponse>> {
	return request({
		url: '/rule/rule/taskPage',
		method: 'post',
		data: params,
	});
}
