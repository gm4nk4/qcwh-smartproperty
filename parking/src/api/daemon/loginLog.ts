import request from '/@/utils/request';

export function fetchList(query?: Object) {
	return request({
		url: '/admin/log/getSignInPage',
		method: 'get',
		params: query,
	});
}
