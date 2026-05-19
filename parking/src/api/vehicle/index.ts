import request from '/@/utils/request';
import { ApiResponse, Vehicle, VehiclePageParams, VehiclePageData, AddVehicleParams, EditVehicleParams, EnterpriseVehiclePageParams, EnterpriseVehiclePageData } from './type';

// ===================== 车辆管理表 API =====================

/** 分页查询车辆管理表（主页列表接口） */
export const getVehiclePage = (params: VehiclePageParams): Promise<ApiResponse<VehiclePageData>> => {
	return request({
		url: '/parking/vehicle/page',
		method: 'get',
		params,
	}) as Promise<ApiResponse<VehiclePageData>>;
};

/** 新增车辆管理表（登记车辆接口） */
export const addVehicle = (data: AddVehicleParams): Promise<ApiResponse<boolean>> => {
	return request({
		url: '/parking/vehicle/add',
		method: 'post',
		data,
	}) as Promise<ApiResponse<boolean>>;
};

/** 更新车辆管理表（编辑接口） */
export const editVehicle = (data: EditVehicleParams): Promise<ApiResponse<boolean>> => {
	return request({
		url: '/parking/vehicle/edit',
		method: 'post',
		data,
	}) as Promise<ApiResponse<boolean>>;
};

/** 删除车辆管理表 */
export const deleteVehicle = (ids: number[]): Promise<ApiResponse<boolean>> => {
	return request({
		url: '/parking/vehicle/delete',
		method: 'post',
		data: ids,
	}) as Promise<ApiResponse<boolean>>;
};

/** 通过ID查询车辆管理表（详情接口） */
export const getVehicleDetails = (id: number): Promise<ApiResponse<Vehicle>> => {
	return request({
		url: `/parking/vehicle/details/${id}`,
		method: 'get',
	}) as Promise<ApiResponse<Vehicle>>;
};

/** 根据登录用户绑定车牌号 */
export const bindPlateNumber = (plateNumber: string): Promise<ApiResponse<boolean>> => {
	return request({
		url: '/parking/vehicle/bindPlateNumber',
		method: 'post',
		data: { plateNumber },
	}) as Promise<ApiResponse<boolean>>;
};

/** 根据用户ID查询绑定的车牌列表 */
export const getVehicleListByUserId = (userId: number): Promise<ApiResponse<Vehicle[]>> => {
	return request({
		url: `/parking/vehicle/listByUserId/${userId}`,
		method: 'get',
	}) as Promise<ApiResponse<Vehicle[]>>;
};

/** 根据车牌号查询历史缴费记录 */
export const getPaymentHistory = (plateNumber: string): Promise<ApiResponse<any[]>> => {
	return request({
		url: `/parking/vehicle/paymentHistory/${plateNumber}`,
		method: 'get',
	}) as Promise<ApiResponse<any[]>>;
};

/** 车辆缴费 */
export const vehiclePayment = (data: any): Promise<ApiResponse<boolean>> => {
	return request({
		url: '/parking/vehicle/payment',
		method: 'post',
		data,
	}) as Promise<ApiResponse<boolean>>;
};

/** 根据企业ID分页查询绑定车辆列表及收费档位明细 */
export const getVehicleListByEnterpriseId = (
	enterpriseId: number,
	params: EnterpriseVehiclePageParams
): Promise<ApiResponse<EnterpriseVehiclePageData>> => {
	return request({
		url: `/parking/vehicle/enterpriseVehicles/page/${enterpriseId}`,
		method: 'get',
		params,
	}) as Promise<ApiResponse<EnterpriseVehiclePageData>>;
};
