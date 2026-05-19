import request from '/@/utils/request';
// 查询模型仓库
export function fetchList(query?: any) {
	return request({
		url: '/platform/box/modelRepository/page',
		method: 'get',
		params: {
			current: query?.current,
			size: query?.size,
			...query,
		},
	});
}

// 删除模型仓库
export function delObj(ids?: Object) {
	return request({
		url: '/platform/box/modelRepository/delete',
		method: 'post',
		data: ids,
	});
}

// 新增模型仓库
export function addObj(obj?: Object) {
	return request({
		url: '/platform/box/modelRepository/add',
		method: 'post',
		data: obj,
	});
}

// 修改模型仓库
export function updateObj(obj?: Object) {
	return request({
		url: '/platform/box/modelRepository/edit',
		method: 'post',
		data: obj,
	});
}

// 获取模型仓库详情
export function getObj(data?: any) {
	let url = '/platform/box/modelRepository/details/' + data?.id;
	return request({
		url,
		method: 'get',
		params: {},
	});
}

// 模型仓库模板下载
export function templateDownload() {
	let url = '/platform/box/modelRepository/templateDownload';
	return request({
		url,
		method: 'get',
		params: {},
		responseType: 'blob', // 设置响应类型为blob，用于文件下载
	});
}

// 校验模型仓库模板
export function templateValidate(form?: any) {
	let url = '/platform/box/modelRepository/templateValidate';
	return request({
		url,
		method: 'post',
		data: form,
	});
}

// 导入数据
export function importData(form?: any) {
	let url = '/platform/box/modelRepository/importData';
	return request({
		url,
		method: 'put',
		data: form,
	});
}
