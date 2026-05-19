import request from '/@/utils/request';
// 查询盒子管理
export function fetchList(query?: any) {
	return request({
		url: '/platform/box/boxDevice/page',
		method: 'get',
		params: {
			current: query?.current,
			size: query?.size,
			...query,
		},
	});
}

// 删除盒子管理
export function delObj(ids?: Object) {
	return request({
		url: '/platform/box/boxDevice/delete',
		method: 'post',
		data: ids,
	});
}

// 新增盒子管理
export function addObj(obj?: Object) {
	return request({
		url: '/platform/box/boxDevice/add',
		method: 'post',
		data: obj,
	});
}

// 修改盒子管理
export function updateObj(obj?: Object) {
	return request({
		url: '/platform/box/boxDevice/edit',
		method: 'post',
		data: obj,
	});
}

// 获取盒子管理详情
export function getObj(data?: any) {
	let url = '/platform/box/boxDevice/details/' + data?.id;
	return request({
		url,
		method: 'get',
		params: {},
	});
}

// 根据唯一编码查询盒子详情
export function getByUniqueCode(query?: any) {
	let url = '/platform/box/boxDevice/getByUniqueCode';
	return request({
		url,
		method: 'get',
		params: query,
	});
}

// 通过ID查询盒子详情-数据中心配置信息
export function boxDetailDataCenterConfigDetails(query?: any) {
	let url = '/platform/box/boxDetailDataCenterConfig/page';
	return request({
		url,
		method: 'get',
		params: query,
	});
}

// 更新盒子详情-数据中心配置信息
export function boxDetailDataCenterConfigEdit(obj?: Object) {
	return request({
		url: '/platform/box/configDistributionTaskPool/centerIssue/add',
		method: 'post',
		data: obj,
	});
}

// 更新盒子详情-数据中心配置信息
export function modelBoxList() {
	return request({
		url: '/platform/box/modelBox/list',
		method: 'get',
		params: {},
	});
}

// 分页查询配置下发_任务池信息
export function configDistributionTaskPoolList(query?: any) {
	return request({
		url: '/platform/box/callPlatformLogRecord/page',
		method: 'get',
		params: {
			current: query?.current,
			size: query?.size,
			...query,
		},
	});
}

// 分页查询盒子详情-监控策略信息
export function boxDetailPolicyConfigList(query?: any) {
	return request({
		url: '/platform/box/boxDetailPolicyConfig/page',
		method: 'get',
		params: {
			current: query?.current,
			size: query?.size,
			...query,
		},
	});
}

// 分页查询盒子详情-模型装载信息
export function boxDetailModelConfigList(query?: any) {
	return request({
		url: '/platform/box/boxDetailModelConfig/page',
		method: 'get',
		params: {
			current: query?.current,
			size: query?.size,
			...query,
		},
	});
}

// 分页查询盒子详情-监控接入信息
export function boxDetailMonitorConfigList(query?: any) {
	return request({
		url: '/platform/box/boxDetailMonitorConfig/page',
		method: 'get',
		params: {
			current: query?.current,
			size: query?.size,
			...query,
		},
	});
}

// 下发_模型配置
export function configDistributionTaskPoolPost(obj?: Object) {
	return request({
		url: '/platform/box/configDistributionTaskPool/modelIssue/add',
		method: 'post',
		data: obj,
	});
}

// 下发_监控配置
export function configDistributionTaskPoolMonitorIssuePost(obj?: Object) {
	return request({
		url: '/platform/box/configDistributionTaskPool/monitorIssue/add',
		method: 'post',
		data: obj,
	});
}

// 下发_监控配置删除
export function configDistributionTaskPoolMonitorUnloadPost(obj?: Object) {
	return request({
		url: '/platform/box/configDistributionTaskPool/monitorUnload/add',
		method: 'post',
		data: obj,
	});
}

// 下发_模型删除
export function configDistributionTaskPoolModelUnloadPost(obj?: Object) {
	return request({
		url: '/platform/box/configDistributionTaskPool/modelUnload/add',
		method: 'post',
		data: obj,
	});
}

// 获取指定模型仓库的填充json树
export function modelRepositoryJsonTreePost(obj?: any) {
	return request({
		url: '/platform/box/boxDetailModelConfig/jsonTree/' + obj?.id,
		method: 'get',
		params: {},
	});
}

// 下发_策略停用
export function strategyStopPost(obj?: Object) {
	return request({
		url: '/platform/box/configDistributionTaskPool/strategyStop/add',
		method: 'post',
		data: obj,
	});
}

// 下发_策略启用
export function strategyStartPost(obj?: Object) {
	return request({
		url: '/platform/box/configDistributionTaskPool/strategyStart/add',
		method: 'post',
		data: obj,
	});
}

// 下发_策略重置
export function strategyResetPost(obj?: Object) {
	return request({
		url: '/platform/box/configDistributionTaskPool/strategyReset/add',
		method: 'post',
		data: obj,
	});
}

// 下发_策略配置
export function strategyIssuePost(obj?: Object) {
	return request({
		url: '/platform/box/configDistributionTaskPool/strategyIssue/add',
		method: 'post',
		data: obj,
	});
}
