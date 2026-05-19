import request from '/@/utils/request';
import { ApiResponse, ChargeConfig, ChargeConfigPageParams, ChargeConfigPageData, AddChargeConfigParams, EditChargeConfigParams } from './type';

// ===================== 停车收费配置表 API =====================

/** 分页查询停车收费配置表（主页列表接口） */
export const getChargeConfigPage = (params: ChargeConfigPageParams): Promise<ApiResponse<ChargeConfigPageData>> => {
	return request({
		url: '/parking/charge/page',
		method: 'get',
		params,
	}) as Promise<ApiResponse<ChargeConfigPageData>>;
};

/** 新增停车收费配置表 */
export const addChargeConfig = (data: AddChargeConfigParams): Promise<ApiResponse<boolean>> => {
	return request({
		url: '/parking/charge/add',
		method: 'post',
		data,
	}) as Promise<ApiResponse<boolean>>;
};

/** 更新停车收费配置表（编辑接口） */
export const editChargeConfig = (data: EditChargeConfigParams): Promise<ApiResponse<boolean>> => {
	return request({
		url: '/parking/charge/edit',
		method: 'post',
		data,
	}) as Promise<ApiResponse<boolean>>;
};

/** 删除停车收费配置表 */
export const deleteChargeConfig = (ids: number[]): Promise<ApiResponse<boolean>> => {
	return request({
		url: '/parking/charge/delete',
		method: 'post',
		data: ids,
	}) as Promise<ApiResponse<boolean>>;
};

/** 通过ID查询停车收费配置表（详情接口） */
export const getChargeConfigDetails = (id: number): Promise<ApiResponse<ChargeConfig>> => {
	return request({
		url: `/parking/charge/details/${id}`,
		method: 'get',
	}) as Promise<ApiResponse<ChargeConfig>>;
};