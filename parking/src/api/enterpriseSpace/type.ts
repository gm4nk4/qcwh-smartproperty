export interface ApiResponse<T> {
	code: number;
	msg?: string;
	data: T;
}

// ===================== 企业车位包相关类型 =====================

/** 企业车位包实体 */
export interface ParkingEnterprisePackage {
	id?: number;
	enterpriseName?: string;
	contactPerson?: string;
	contactPhone?: string;
	floorLocation?: string;
	contractNo?: string;
	totalSpaces?: number;
	baseSpaces?: number;
	basePrice?: number;
	overPrice?: number;
	startDate?: string;
	endDate?: string;
	status?: string;
	tenantId?: number;
	createBy?: string;
	updateBy?: string;
	createTime?: string;
	updateTime?: string;
	isDeleted?: number;
}

/** 企业车位包VO（返回视图对象） */
export interface ParkingEnterprisePackageVO {
	id?: number;
	enterpriseName?: string;
	contactPerson?: string;
	contactPhone?: string;
	contractNo?: string;
	spaceQuota?: string;
	usedSpaces?: number;
	totalSpaces?: number;
	pricingRule?: string;
	baseSpaces?: number;
	basePrice?: number;
	overPrice?: number;
	bindVehicles?: ParkingVehicleSimpleVO[];
	currentMonthlyFee?: number;
	validPeriod?: string;
	startDate?: string;
	endDate?: string;
	status?: string;
}

/** 绑定车辆简单信息 */
export interface ParkingVehicleSimpleVO {
	id?: number;
	plateNumber?: string;
	type?: string;
	belongType?: string;
	status?: string;
	expireDate?: string;
	vehicleBrand?: string;
	color?: string;
	belongPerson?: string;
	belongId?: number;
	monthlyFee?: number;
	bindFixedSpace?: number;
	parkingSpaceId?: number;
	parkingSpaceCode?: string;
	enterpriseId?: number;
	enterpriseName?: string;
	contactPerson?: string;
	contactPhone?: string;
	tenantId?: number;
	createBy?: string;
	updateBy?: string;
	createTime?: string;
	updateTime?: string;
	isDeleted?: number;
}

/** 企业车位包分页查询参数 */
export interface EnterprisePackagePageParams {
	current: number;
	size: number;
	queryName?: string;
	plateNumber?: string;
	status?: string;
	id?: number;
}

/** 企业车位包分页响应数据 */
export interface EnterprisePackagePageData {
	records: ParkingEnterprisePackageVO[];
	total: number;
	size: number;
	current: number;
}
