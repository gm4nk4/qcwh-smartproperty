export interface ApiResponse<T> {
	code: number;
	msg?: string;
	data: T;
}

// ===================== 车辆管理表相关类型 =====================

/** 车辆管理表实体 */
export interface Vehicle {
	id?: number;
	plateNumber?: string;
	vehicleBrand?: string;
	color?: string;
	type?: string;
	belongType?: string;
	belongPerson?: string;
	belongId?: number;
	startDate?: string;
	monthlyFee?: number;
	bindFixedSpace?: number;
	parkingSpaceId?: number;
	parkingSpaceCode?: string;
	enterpriseId?: number;
	enterpriseName?: string;
	contactPerson?: string;
	contactPhone?: string;
	status?: string;
	expireDate?: string;
	tenantId?: number;
	createBy?: string;
	updateBy?: string;
	createTime?: string;
	updateTime?: string;
}

/** 车辆管理表分页查询参数 */
export interface VehiclePageParams {
	current: number;
	size: number;
	queryName?: string;
	type?: string;
	belongType?: string;
	status?: string;
}

/** 车辆管理表分页响应数据 */
export interface VehiclePageData {
	records: Vehicle[];
	total: number;
	size: number;
	current: number;
}

/** 新增车辆请求参数 */
export interface AddVehicleParams {
	plateNumber: string;
	vehicleBrand?: string;
	color?: string;
	type: string;
	belongType: string;
	belongPerson?: string;
	belongId?: number;
	startDate?: string;
	monthlyFee?: number;
	bindFixedSpace?: number;
	parkingSpaceId?: number;
	parkingSpaceCode?: string;
	enterpriseId?: number;
	enterpriseName?: string;
	contactPerson?: string;
	contactPhone?: string;
}

/** 编辑车辆请求参数 */
export interface EditVehicleParams {
	id: number;
	plateNumber: string;
	vehicleBrand?: string;
	color?: string;
	type: string;
	belongType: string;
	belongPerson?: string;
	belongId?: number;
	startDate?: string;
	monthlyFee?: number;
	bindFixedSpace?: number;
	parkingSpaceId?: number;
	parkingSpaceCode?: string;
	enterpriseId?: number;
	enterpriseName?: string;
	contactPerson?: string;
	contactPhone?: string;
}

// ===================== 企业车辆相关类型 =====================

/** 企业车辆明细 */
export interface EnterpriseVehicleDetail {
	seqNo?: number;
	plateNumber?: string;
	pricingTier?: string;
	monthlyFee?: number;
}

/** 企业车辆分页查询参数 */
export interface EnterpriseVehiclePageParams {
	current: number;
	size: number;
}

/** 企业车辆分页响应数据 */
export interface EnterpriseVehiclePageData {
	records: EnterpriseVehicleDetail[];
	total: number;
	size: number;
	current: number;
}
