export interface ApiResponse<T> {
	code: number;
	msg?: string;
	data: T;
}

// ===================== 停车通行记录表相关类型 =====================

/** 停车通行记录表实体 */
export interface PassRecord {
	id?: number;
	plateNumber?: string;
	vehicleType?: string;
	belongInfo?: string;
	entryGate?: string;
	entryTime?: string;
	entryCaptureUrl?: string;
	exitGate?: string;
	exitTime?: string;
	exitCaptureUrl?: string;
	totalFee?: number;
	feeDesc?: string;
	status?: string;
	tenantId?: number;
	createBy?: string;
	updateBy?: string;
	createTime?: string;
	updateTime?: string;
}

/** 停车通行记录表分页查询参数 */
export interface PassRecordPageParams {
	current: number;
	size: number;
	queryName?: string;
	vehicleType?: string;
	status?: string;
}

/** 停车通行记录表分页响应数据 */
export interface PassRecordPageData {
	records: PassRecord[];
	total: number;
	size: number;
	current: number;
}

/** 新增停车通行记录请求参数 */
export interface AddPassRecordParams {
	plateNumber: string;
	vehicleType?: string;
	belongInfo?: string;
	entryGate?: string;
	entryTime?: string;
	entryCaptureUrl?: string;
	exitGate?: string;
	exitTime?: string;
	exitCaptureUrl?: string;
	totalFee?: number;
	feeDesc?: string;
	status?: string;
}

/** 编辑停车通行记录请求参数 */
export interface EditPassRecordParams {
	id: number;
	plateNumber?: string;
	vehicleType?: string;
	belongInfo?: string;
	entryGate?: string;
	entryTime?: string;
	entryCaptureUrl?: string;
	exitGate?: string;
	exitTime?: string;
	exitCaptureUrl?: string;
	totalFee?: number;
	feeDesc?: string;
	status?: string;
}
