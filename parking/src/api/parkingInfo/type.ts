export interface ApiResponse<T> {
	code: number;
	msg?: string;
	data: T;
}

// ===================== 停车场信息表相关类型 =====================

/** 停车场信息表实体 */
export interface ParkingGround {
	id?: number;
	parkingGroundCode?: string;
	parkingGroundName?: string;
	location?: string;
	type?: string;
	totalSpaces?: number;
	operationTime?: string;
	personInCharge?: string;
	contactPhone?: string;
	status?: string;
	tenantId?: number;
	createBy?: string;
	updateBy?: string;
	createTime?: string;
	updateTime?: string;
	isDeleted?: number;
}

/** 停车场信息表分页查询参数 */
export interface ParkingGroundPageParams {
	current: number;
	size: number;
	queryName?: string;
	type?: string;
	status?: string;
}

/** 停车场信息表分页响应数据 */
export interface ParkingGroundPageData {
	records: ParkingGround[];
	total: number;
	size: number;
	current: number;
}

// ===================== 车位信息表相关类型 =====================

/** 车位信息表实体 */
export interface ParkingSpace {
	id?: number;
	parkingSpaceCode?: string;
	parkingGroundCode?: string;
	parkingGroundId?: number;
	parkingGroundName?: string;
	type?: string;
	sensorCode?: string;
	sensorModel?: string;
	busyStatus?: string;
	bindStatus?: string;
	occupiedPlate?: string;
	bindPlate?: string;
	tenantId?: number;
	createBy?: string;
	updateBy?: string;
	createTime?: string;
	updateTime?: string;
	isDeleted?: number;
}

/** 车位信息表分页查询参数 */
export interface ParkingSpacePageParams {
	current: number;
	size: number;
	queryName?: string;
	bindStatus?: string;
	bindPlate?: string;
	occupiedPlate?: string;
}

/** 车位信息表分页响应数据 */
export interface ParkingSpacePageData {
	records: ParkingSpace[];
	total: number;
	size: number;
	current: number;
}

/** 批量生成车位编号请求参数 */
export interface BatchGenerateSpaceParams {
	parkingGroundId: number;
	prefix: string;
	startNumber: number;
	count: number;
	type: string;
}
