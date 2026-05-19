export interface ApiResponse<T> {
	code: number;
	msg?: string;
	data: T;
}

// ===================== 停车收费配置表相关类型 =====================

/** 停车收费配置表实体 */
export interface ChargeConfig {
	id?: number;
	/** 临时停车-前2小时单价（¥/小时） */
	tempFirst2hRate?: number;
	/** 临时停车-2小时后单价（¥/小时） */
	tempAfter2hRate?: number;
	/** 临时停车-日封顶（¥） */
	tempDailyCap?: number;
	/** 临时停车-夜间包时22:00-06:00费用（¥） */
	tempNightPackageFee?: number;
	/** 月租收费-地面车位单价（¥/月） */
	monthlyGroundPrice?: number;
	/** 月租收费-地下一层车位单价（¥/月） */
	monthlyUnderground1Price?: number;
	/** 月租收费-地下二层车位单价（¥/月） */
	monthlyUnderground2Price?: number;
	/** 月租收费-企业基础单价范围 */
	enterpriseBasePriceRange?: string;
	/** 月租收费-企业超出单价范围 */
	enterpriseOverPriceRange?: string;
	/** 访客停车-免费时长（小时） */
	visitorFreeHours?: number;
	/** 访客停车-超时后单价（¥/小时） */
	visitorOvertimeRate?: number;
	/** 访客停车-日封顶（¥） */
	visitorDailyCap?: number;
	tenantId?: number;
	createBy?: string;
	updateBy?: string;
	createTime?: string;
	updateTime?: string;
	isDeleted?: number;
}

/** 停车收费配置表分页查询参数 */
export interface ChargeConfigPageParams {
	current: number;
	size: number;
	queryName?: string;
}

/** 停车收费配置表分页响应数据 */
export interface ChargeConfigPageData {
	records: ChargeConfig[];
	total: number;
	size: number;
	current: number;
}

/** 新增停车收费配置表请求参数 */
export interface AddChargeConfigParams {
	/** 临时停车-前2小时单价（¥/小时） */
	tempFirst2hRate: number;
	/** 临时停车-2小时后单价（¥/小时） */
	tempAfter2hRate: number;
	/** 临时停车-日封顶（¥） */
	tempDailyCap: number;
	/** 临时停车-夜间包时22:00-06:00费用（¥） */
	tempNightPackageFee: number;
	/** 月租收费-地面车位单价（¥/月） */
	monthlyGroundPrice: number;
	/** 月租收费-地下一层车位单价（¥/月） */
	monthlyUnderground1Price: number;
	/** 月租收费-地下二层车位单价（¥/月） */
	monthlyUnderground2Price: number;
	/** 月租收费-企业基础单价范围 */
	enterpriseBasePriceRange: string;
	/** 月租收费-企业超出单价范围 */
	enterpriseOverPriceRange: string;
	/** 访客停车-免费时长（小时） */
	visitorFreeHours: number;
	/** 访客停车-超时后单价（¥/小时） */
	visitorOvertimeRate: number;
	/** 访客停车-日封顶（¥） */
	visitorDailyCap: number;
}

/** 编辑停车收费配置表请求参数 */
export interface EditChargeConfigParams {
	id: number;
	/** 临时停车-前2小时单价（¥/小时） */
	tempFirst2hRate: number;
	/** 临时停车-2小时后单价（¥/小时） */
	tempAfter2hRate: number;
	/** 临时停车-日封顶（¥） */
	tempDailyCap: number;
	/** 临时停车-夜间包时22:00-06:00费用（¥） */
	tempNightPackageFee: number;
	/** 月租收费-地面车位单价（¥/月） */
	monthlyGroundPrice: number;
	/** 月租收费-地下一层车位单价（¥/月） */
	monthlyUnderground1Price: number;
	/** 月租收费-地下二层车位单价（¥/月） */
	monthlyUnderground2Price: number;
	/** 月租收费-企业基础单价范围 */
	enterpriseBasePriceRange: string;
	/** 月租收费-企业超出单价范围 */
	enterpriseOverPriceRange: string;
	/** 访客停车-免费时长（小时） */
	visitorFreeHours: number;
	/** 访客停车-超时后单价（¥/小时） */
	visitorOvertimeRate: number;
	/** 访客停车-日封顶（¥） */
	visitorDailyCap: number;
}