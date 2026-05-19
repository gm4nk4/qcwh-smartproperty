import request from '/@/utils/request';
// 查询系统配置
export function fetchSysConfiguration(query?: Object) {
	return request({
		url: '/admin/sysConfiguration/details',
		method: 'get',
		params: query,
	});
}

// 修改系统配置
export function updateSysConfiguration(obj?: Object) {
	return request({
		url: '/admin/sysConfiguration/add',
		method: 'post',
		data: obj,
	});
}

// 查询安全配置
export function selectSecurityParameter(query?: Object) {
	return request({
		url: '/admin/param/selectSecurityParameter',
		method: 'get',
		params: query,
	});
}

// 修改安全配置
export function updateSecurityParameter(obj?: Object) {
	return request({
		url: '/admin/param/updateSecurityParameter',
		method: 'post',
		data: obj,
	});
}
// 查询系统配置
export function fetchconfiguration(query?: Object) {
	return request({
		url: '/admin/configuration/details',
		method: 'get',
		params: query,
	});
}



// 门户配置查询接口
export function getParamPage(obj?: Object) {
	return request({
		url: '/admin/param/list',
		method: 'get',
		params: obj,
	});
}

// 门户配置保存
export function updateParambatchUpdate(obj?: Object) {
	return request({
		url: '/admin/param/batchUpdate',
		method: 'post',
		data: obj,
	});
}



// 查询模板
export function getTemplateList(obj?: Object) {
	return request({
		url: '/admin/template/list',
		method: 'get',
		params: obj,
	});
}

// 修改模板
export function updateTemplate(obj?: Object) {
	return request({
		url: '/admin/template/saveOrUpdate',
		method: 'post',
		data: obj,
	}); 
}