import request from '/@/utils/request';
import { ApiResponse, ParkingEnterprisePackage, ParkingEnterprisePackageVO, EnterprisePackagePageParams, EnterprisePackagePageData } from './type';

// ===================== 企业车位包信息表 API =====================

/** 分页查询企业车位包列表 */
export const getEnterprisePackagePage = (params: EnterprisePackagePageParams): Promise<ApiResponse<EnterprisePackagePageData>> => {
	return request({
		url: '/parking/enterprise/page',
		method: 'get',
		params,
	}) as Promise<ApiResponse<EnterprisePackagePageData>>;
};

/** 查询企业车位包列表（不分页） */
export const getEnterprisePackageList = (params?: {
	queryName?: string;
	plateNumber?: string;
	status?: string;
	id?: number;
}): Promise<ApiResponse<ParkingEnterprisePackageVO[]>> => {
	return request({
		url: '/parking/enterprise/list',
		method: 'get',
		params,
	}) as Promise<ApiResponse<ParkingEnterprisePackageVO[]>>;
};

/** 通过ID查询企业车位包信息表信息 */
export const getEnterprisePackageDetails = (id: number): Promise<ApiResponse<ParkingEnterprisePackageVO>> => {
	return request({
		url: `/parking/enterprise/details/${id}`,
		method: 'get',
	}) as Promise<ApiResponse<ParkingEnterprisePackageVO>>;
};

/** 新增企业车位包信息表 */
export const addEnterprisePackage = (data: ParkingEnterprisePackage): Promise<ApiResponse<boolean>> => {
	return request({
		url: '/parking/enterprise/add',
		method: 'post',
		data,
	}) as Promise<ApiResponse<boolean>>;
};

/** 更新企业车位包信息表信息 */
export const editEnterprisePackage = (data: ParkingEnterprisePackage): Promise<ApiResponse<boolean>> => {
	return request({
		url: '/parking/enterprise/edit',
		method: 'post',
		data,
	}) as Promise<ApiResponse<boolean>>;
};

/** 删除企业车位包信息表 */
export const deleteEnterprisePackage = (ids: number[]): Promise<ApiResponse<boolean>> => {
	return request({
		url: '/parking/enterprise/delete',
		method: 'post',
		data: ids,
	}) as Promise<ApiResponse<boolean>>;
};
