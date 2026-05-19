import request from '/@/utils/request';
// 分页查询配置下发记录
export function fetchList(query?: any) {
	return request({
		url: '/platform/box/configDistributionTaskPool/page',
		method: 'get',
		params: {
			current: query?.current,
			size: query?.size,
			...query,
		},
	});
}
