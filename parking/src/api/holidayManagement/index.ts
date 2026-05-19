import request from '/@/utils/request';
// 查询节假日
export function fetchHolidayList(obj?: Object) {
	return request({
		url: '/admin/holiday/list?year=' + obj?.year + '&isHoliday=' + obj?.isHoliday,
		method: 'post',
		data: obj,
	});
}

export function fetchWithoutSystemList(obj?: Object) {
	return request({
		url: '/admin/holiday/listWithoutSystem?year=' + obj?.year + '&isHoliday=' + obj?.isHoliday,
		method: 'post',
		data: obj,
	});
}

// 修改节假日

export function fetchHolidaySaveBath(obj?: Object) {
	return request({
		url: '/admin/holiday/saveBath',
		method: 'post',
		data: obj,
	});
}

// 接口固定数据下拉框
export function selectItem(data?: Object) {
	let url = '/admin/select/item?type=' + data.type;
	let callData = request({
		url,
		method: 'post',
		data: data,
	});
	return callData;
}

// 重置节假日
export function fetchHolidayResetByYear(obj: Object) {
	return request({
		url: '/admin/holiday/resetByYear?year=' + obj.year,
		method: 'post',
		data: obj,
	});
}
