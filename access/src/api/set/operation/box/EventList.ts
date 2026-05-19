import request from '/@/utils/request';
// 查询事件列表
export function fetchList(query?: any) {
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
