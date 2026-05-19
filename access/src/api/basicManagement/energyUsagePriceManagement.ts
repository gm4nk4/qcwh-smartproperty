import request from '/@/utils/request';

export interface EnergyPriceApiResponse<T> {
	code: number;
	msg?: string;
	data: T;
}

export interface ElectricityPriceConfig {
	periodType?: string | null;
	startTime?: string | null;
	endTime?: string | null;
	price?: number | null;
	description?: string | null;
	sortNo?: number | null;
}

export interface LadderPriceConfig {
	tierNo?: number | null;
	tierName?: string | null;
	minUsage?: number | null;
	maxUsage?: number | null;
	price?: number | null;
	description?: string | null;
	sortNo?: number | null;
}

export interface EnergyPricePlanRecord {
	id?: number | string | null;
	planName?: string | null;
	planCode?: string | null;
	effectiveDate?: string | null;
	expiryDate?: string | null;
	remark?: string | null;
	electricityPrices?: ElectricityPriceConfig[] | null;
	waterPrices?: LadderPriceConfig[] | null;
	gasPrices?: LadderPriceConfig[] | null;
	status?: string | null;
	createTime?: string | null;
	updateTime?: string | null;
}

export interface SaveEnergyPricePlanParams {
	id?: number | string | null;
	planName: string;
	planCode: string;
	effectiveDate: string;
	expiryDate?: string | null;
	remark?: string | null;
	electricityPrices?: ElectricityPriceConfig[];
	waterPrices?: LadderPriceConfig[];
	gasPrices?: LadderPriceConfig[];
	status?: string | null;
}

export interface ChangeEnergyPricePlanStatusParams {
	id: number | string;
	status: string;
}

export function getEnergyPricePlanList(): Promise<EnergyPriceApiResponse<EnergyPricePlanRecord[]>> {
	return request({
		url: '/platform/basic/energy-price/plan/list',
		method: 'get',
	}) as Promise<EnergyPriceApiResponse<EnergyPricePlanRecord[]>>;
}

export function getEnergyPricePlanDetail(id: number | string): Promise<EnergyPriceApiResponse<EnergyPricePlanRecord>> {
	return request({
		url: `/platform/basic/energy-price/plan/${id}`,
		method: 'get',
	}) as Promise<EnergyPriceApiResponse<EnergyPricePlanRecord>>;
}

export function saveEnergyPricePlan(data: SaveEnergyPricePlanParams): Promise<EnergyPriceApiResponse<boolean>> {
	return request({
		url: '/platform/basic/energy-price/plan/save',
		method: 'post',
		data,
	}) as Promise<EnergyPriceApiResponse<boolean>>;
}

export function changeEnergyPricePlanStatus(data: ChangeEnergyPricePlanStatusParams): Promise<EnergyPriceApiResponse<boolean>> {
	return request({
		url: '/platform/basic/energy-price/plan/status/change',
		method: 'post',
		data,
	}) as Promise<EnergyPriceApiResponse<boolean>>;
}

export function deleteEnergyPricePlan(ids: Array<number | string>): Promise<EnergyPriceApiResponse<boolean>> {
	return request({
		url: '/platform/basic/energy-price/plan/delete',
		method: 'post',
		data: ids,
	}) as Promise<EnergyPriceApiResponse<boolean>>;
}
