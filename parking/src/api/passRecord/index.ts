import request from '/@/utils/request';
import { ApiResponse, PassRecord, PassRecordPageParams, PassRecordPageData, AddPassRecordParams, EditPassRecordParams } from './type';

// ===================== 停车通行记录表 API =====================

/** 分页查询停车通行记录表（主页列表接口） */
export const getPassRecordPage = (params: PassRecordPageParams): Promise<ApiResponse<PassRecordPageData>> => {
	return request({
		url: '/parking/record/page',
		method: 'get',
		params,
	}) as Promise<ApiResponse<PassRecordPageData>>;
};

/** 通过ID查询停车通行记录表（详情接口） */
export const getPassRecordDetails = (id: number): Promise<ApiResponse<PassRecord>> => {
	return request({
		url: `/parking/record/details/${id}`,
		method: 'get',
	}) as Promise<ApiResponse<PassRecord>>;
};

/** 新增停车通行记录表 */
export const addPassRecord = (data: AddPassRecordParams): Promise<ApiResponse<boolean>> => {
	return request({
		url: '/parking/record/add',
		method: 'post',
		data,
	}) as Promise<ApiResponse<boolean>>;
};

/** 更新停车通行记录表（编辑接口） */
export const editPassRecord = (data: EditPassRecordParams): Promise<ApiResponse<boolean>> => {
	return request({
		url: '/parking/record/edit',
		method: 'post',
		data,
	}) as Promise<ApiResponse<boolean>>;
};

/** 删除停车通行记录表 */
export const deletePassRecord = (ids: number[]): Promise<ApiResponse<boolean>> => {
	return request({
		url: '/parking/record/delete',
		method: 'post',
		data: ids,
	}) as Promise<ApiResponse<boolean>>;
};
