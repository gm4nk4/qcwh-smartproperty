import request from '/@/utils/request';
// 查询黑白名单
export function fetchList(query?: Object) {
	return request({
		url: '/admin/listRegistration/page',
		method: 'get',
		params: query,
	});
}

// 删除黑白名单
export function delObj(ids?: Object) {
	return request({
		url: '/admin/listRegistration/delete',
		method: 'post',
		data: ids,
	});
}

// 新增黑白名单
export function addObj(obj?: Object) {
	return request({
		url: '/admin/listRegistration/add',
		method: 'post',
		data: obj,
	});
}

// 修改黑白名单
export function updateObj(obj?: Object) {
	return request({
		url: '/admin/listRegistration/update',
		method: 'post',
		data: obj,
	});
}

// 获取黑白名单详情
export function getObj(id?: Object) {
	let url = '/admin/listRegistration/details';
	return request({
		url,
		method: 'get',
		params: id,
	});
}

// 批量启用禁用
export function enableObj(id?: Object) {
	let url = '/admin/listRegistration/updateListRegistrationStatus';
	return request({
		url,
		method: 'post',
		data: id,
	});
}

// 查询黑白名单防护日志
export function fetchlistRegistrationList(query?: Object) {
	return request({
		url: '/admin/listRegistrationLog/page',
		method: 'get',
		params: query,
	});
}
