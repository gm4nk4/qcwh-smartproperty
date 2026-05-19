import request from '/@/utils/request';
import {
	ApiResponse,
	ParkingGround,
	ParkingGroundPageParams,
	ParkingGroundPageData,
	ParkingSpace,
	ParkingSpacePageParams,
	ParkingSpacePageData,
	BatchGenerateSpaceParams,
} from './type';

// ===================== 停车场信息表 API =====================

/** 分页查询停车场信息表 */
export const getParkingGroundPage = (params: ParkingGroundPageParams): Promise<ApiResponse<ParkingGroundPageData>> => {
	return request({
		url: '/parking/ground/page',
		method: 'get',
		params,
	}) as Promise<ApiResponse<ParkingGroundPageData>>;
};

/** 新增停车场信息表 */
export const addParkingGround = (data: ParkingGround): Promise<ApiResponse<boolean>> => {
	return request({
		url: '/parking/ground/add',
		method: 'post',
		data,
	}) as Promise<ApiResponse<boolean>>;
};

/** 更新停车场信息表 */
export const editParkingGround = (data: ParkingGround): Promise<ApiResponse<boolean>> => {
	return request({
		url: '/parking/ground/edit',
		method: 'post',
		data,
	}) as Promise<ApiResponse<boolean>>;
};

/** 删除停车场信息表 */
export const deleteParkingGround = (ids: number[]): Promise<ApiResponse<boolean>> => {
	return request({
		url: '/parking/ground/delete',
		method: 'post',
		data: ids,
	}) as Promise<ApiResponse<boolean>>;
};

/** 通过ID查询停车场信息表 */
export const getParkingGroundDetails = (id: number): Promise<ApiResponse<ParkingGround>> => {
	return request({
		url: `/parking/ground/details/${id}`,
		method: 'get',
	}) as Promise<ApiResponse<ParkingGround>>;
};

// ===================== 车位信息表 API =====================

/** 分页查询车位信息表 */
export const getParkingSpacePage = (params: ParkingSpacePageParams): Promise<ApiResponse<ParkingSpacePageData>> => {
	return request({
		url: '/parking/space/page',
		method: 'get',
		params,
	}) as Promise<ApiResponse<ParkingSpacePageData>>;
};

/** 新增车位信息表 */
export const addParkingSpace = (data: ParkingSpace): Promise<ApiResponse<boolean>> => {
	return request({
		url: '/parking/space/add',
		method: 'post',
		data,
	}) as Promise<ApiResponse<boolean>>;
};

/** 更新车位信息表 */
export const editParkingSpace = (data: ParkingSpace): Promise<ApiResponse<boolean>> => {
	return request({
		url: '/parking/space/edit',
		method: 'post',
		data,
	}) as Promise<ApiResponse<boolean>>;
};

/** 删除车位信息表 */
export const deleteParkingSpace = (ids: number[]): Promise<ApiResponse<boolean>> => {
	return request({
		url: '/parking/space/delete',
		method: 'post',
		data: ids,
	}) as Promise<ApiResponse<boolean>>;
};

/** 通过ID查询车位信息表 */
export const getParkingSpaceDetails = (id: number): Promise<ApiResponse<ParkingSpace>> => {
	return request({
		url: `/parking/space/details/${id}`,
		method: 'get',
	}) as Promise<ApiResponse<ParkingSpace>>;
};

/** 批量生成车位编号 */
export const batchGenerateSpaces = (data: BatchGenerateSpaceParams): Promise<ApiResponse<boolean>> => {
	return request({
		url: '/parking/space/batchGenerateSpaces',
		method: 'post',
		data,
	}) as Promise<ApiResponse<boolean>>;
};

/** 感应器数据导入 */
export const importSensor = (file: File): Promise<ApiResponse<boolean>> => {
	const formData = new FormData();
	formData.append('file', file);
	return request({
		url: '/parking/space/importSensor',
		method: 'post',
		data: formData,
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	}) as Promise<ApiResponse<boolean>>;
};
