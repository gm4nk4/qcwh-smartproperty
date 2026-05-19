import request from '/@/utils/request';
// 查询消息模板
export function fetchTemplateList(query?: Object) {
	return request({
		url: '/admin/msg/template/page',
		method: 'post',
		data: {
			pageNum: query?.current,
			pageSize: query?.size,
			query: { ...query },
		},
	});
}

// 模板使用统计
export function fetchLogCount(obj?: Object) {
	return request({
		url: '/admin/msg/log/logCount?way=' + obj?.way,
		method: 'post',
		data: obj,
	});
}

// 模板使用明细
export function fetchLogPage(query?: Object) {
	return request({
		url: '/admin/msg/log/page?way=' + query?.way,
		method: 'post',
		data: {
			pageNum: query?.current,
			pageSize: query?.size,
			query: { ...query },
		},
	});
}

// 根据推送类型获取模板列表
export function fetchListByWay(obj?: Object) {
	return request({
		url: '/admin/msg/template/listByWay?way=' + obj?.way,
		method: 'post',
		data: obj,
	});
}

// 删除消息模板
export function delTemplateObj(ids?: Object) {
	return request({
		url: '/admin/msg/template/delete',
		method: 'post',
		data: ids,
	});
}

// 新增消息模板
export function addTemplateObj(obj?: Object) {
	return request({
		url: '/admin/msg/template/saveOrUpdate',
		method: 'post',
		data: obj,
	});
}

// 修改消息模板
export function updateTemplateObj(obj?: Object) {
	return request({
		url: '/admin/msg/template/saveOrUpdate',
		method: 'post',
		data: obj,
	});
}

// 获取消息模板详情
export function getTemplateObj(id?: Object) {
	let url = '/admin/msg/template/detail?id=' + id?.id;
	return request({
		url,
		method: 'post',
		data: id,
	});
}

// 消息发送 测试连接
export function getMsgSendObj(data?: Object) {
	let url = '/admin/msg/send';
	return request({
		url,
		method: 'post',
		data: data,
	});
}

// 消息发送 测试连接
export function getTemplateByWay(data?: Object) {
	let url = '/admin/msg/config/treeWithTemplate';
	return request({
		url,
		method: 'post',
		data: data,
	});
}

// 消息模板 根据类型获取配置
export function getConfigByType(data?: Object) {
	let url = '/admin/msg/config/getConfigByType?way=' + data?.way;
	return request({
		url,
		method: 'post',
		data: data,
	});
}

// 消息模板接收人下拉接口
export function listByMsgWay(data?: Object) {
	let url = '/admin/user/listByMsgWay?way=' + data?.way;
	return request({
		url,
		method: 'post',
		data: data,
	});
}
