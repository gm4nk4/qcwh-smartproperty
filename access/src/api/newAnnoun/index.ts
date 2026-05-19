import request from '/@/utils/request';
// 查询消息服务
export function fetchMsgList(query?: Object) {
	return request({
		url: '/admin/msg/config/page',
		method: 'post',
		data: {
			pageNum: query?.current,
			pageSize: query?.size,
			query: { ...query },
		},
	});
}

// 删除消息服务
export function delMsgObj(ids?: Object) {
	return request({
		url: '/admin/msg/config/delete',
		method: 'post',
		data: ids,
	});
}

// 新增消息服务
export function addMsgObj(obj?: Object) {
	return request({
		url: '/admin/msg/config/saveOrUpdate',
		method: 'post',
		data: obj,
	});
}

// 修改消息服务
export function updateMsgObj(obj?: Object) {
	return request({
		url: '/admin/msg/config/saveOrUpdate',
		method: 'post',
		data: obj,
	});
}

// 获取消息服务详情
export function getMsgObj(id?: Object) {
	let url = '/admin/msg/config/detail?id=' + id?.id;
	return request({
		url,
		method: 'post',
		data: id,
	});
}
