import request from '/@/utils/request';
// 查询公告通知
export function fetchNoticeList(query?: Object) {
	return request({
		url: '/admin/notice/page',
		method: 'post',
		data: {
			pageNum: query?.current,
			pageSize: query?.size,
			query: { ...query },
		},
	});
}

// 删除公告通知
export function delNoticeObj(ids?: Object) {
	return request({
		url: '/admin/notice/delete',
		method: 'post',
		data: ids,
	});
}

// 新增公告通知
export function addNoticeObj(obj?: Object) {
	return request({
		url: '/admin/notice/saveOrUpdate',
		method: 'post',
		data: obj,
	});
}

// 修改公告通知
export function updateNoticeObj(obj?: Object) {
	return request({
		url: '/admin/notice/saveOrUpdate',
		method: 'post',
		data: obj,
	});
}

// 获取公告通知详情
export function getNoticeObj(id?: Object) {
	let url = '/admin/notice/detail?id=' + id?.id;
	return request({
		url,
		method: 'post',
		data: id,
	});
}

// 批量启用禁用
export function enableNoticeObj(id?: Object) {
	let url = '/admin/notice/enableOrDisable';
	return request({
		url,
		method: 'post',
		data: id,
	});
}
