import { onMounted, ref } from 'vue';
import { useMessage } from '/@/hooks/message';
import {
	getUtilityMonitorMeterPage,
	getUtilityMonitorOverview,
	type UtilityMonitorMeterPageData,
	type UtilityMonitorMeterPageRecord,
	type UtilityMonitorType,
	type UtilityMonitorOverviewData,
} from '/@/api/energy/utilityMonitor';
import type { MeterStatus, UtilityMonitorMeterRow } from './types';

const DEFAULT_PAGE_SIZE = 10;

const getErrorMessage = (error: any, fallback: string) => error?.message || error?.msg || fallback;

export const formatMonitorValue = (value?: string | number | null, fallback = '--') => {
	const text = String(value ?? '').trim();
	return text || fallback;
};

export const formatMonitorDecimalValue = (value?: string | number | null, digits = 2, fallback = '--') => {
	const text = String(value ?? '').trim();
	if (!text) return fallback;

	const numericMatch = text.match(/[-+]?\d[\d,]*(?:\.\d+)?/);
	if (!numericMatch) return text;

	const numericText = numericMatch[0];
	const parsed = Number(numericText.replace(/,/g, ''));
	if (!Number.isFinite(parsed)) return text;

	const formattedNumber = parsed.toFixed(digits);
	return numericText === text ? formattedNumber : text.replace(numericText, formattedNumber);
};

export const parseMonitorNumber = (value?: string | number | null) => {
	const text = String(value ?? '').trim();
	if (!text) return 0;

	const parsed = Number(text.replace(/[^0-9.-]/g, ''));
	return Number.isFinite(parsed) ? parsed : 0;
};

export const formatPercentMetricValue = (value?: string | number | null, digits = 0) => {
	const text = String(value ?? '').trim();
	if (!text) return '--';
	const numericMatch = text.match(/[-+]?\d[\d,]*(?:\.\d+)?/);
	if (!numericMatch) return text.endsWith('%') ? text.replace('%', '').trim() : text;

	const parsed = Number(numericMatch[0].replace(/,/g, ''));
	if (!Number.isFinite(parsed)) return text.endsWith('%') ? text.replace('%', '').trim() : text;
	if (text.endsWith('%')) return parsed.toFixed(digits);
	if (parsed <= 1) return (parsed * 100).toFixed(digits);
	return parsed.toFixed(digits);
};

export const normalizeMonitorStatus = (status?: string | null): MeterStatus => {
	const text = String(status ?? '').trim();
	if (!text) return 'normal';
	if (text.includes('严重') || /critical/i.test(text)) return 'critical';
	if (text.includes('预警') || text.includes('警告') || text.includes('告警') || text.includes('异常') || /warning|abnormal/i.test(text)) return 'warning';
	if (text.includes('提醒') || /notice/i.test(text)) return 'notice';
	return 'normal';
};

export const mapMeterPageRecord = (record: UtilityMonitorMeterPageRecord): UtilityMonitorMeterRow => ({
	id: formatMonitorValue(record.id),
	monitorType: record.monitorType,
	name: formatMonitorValue(record.meterName),
	location: formatMonitorValue(record.installLoc),
	voltage: formatMonitorValue(record.voltage),
	current: formatMonitorDecimalValue(record.current),
	power: formatMonitorDecimalValue(record.power),
	energy: formatMonitorDecimalValue(record.cumulativeReading),
	cumulativeReading: formatMonitorDecimalValue(record.cumulativeReading),
	todayElec: formatMonitorDecimalValue(record.todayElec),
	phaseACurrent: formatMonitorDecimalValue(record.phaseACurrent),
	phaseBCurrent: formatMonitorDecimalValue(record.phaseBCurrent),
	phaseCCurrent: formatMonitorDecimalValue(record.phaseCCurrent),
	instantFlow: formatMonitorDecimalValue(record.instantFlow),
	pressure: formatMonitorDecimalValue(record.pressure),
	waterConsum: formatMonitorDecimalValue(record.waterConsum),
	gasConsum: formatMonitorDecimalValue(record.gasConsum),
	supplyWaterTemp: formatMonitorDecimalValue(record.supplyWaterTemp),
	returnWaterTemp: formatMonitorDecimalValue(record.returnWaterTemp),
	cumulativeHeat: formatMonitorDecimalValue(record.cumulativeHeat),
	createBy: formatMonitorValue(record.createBy),
	createTime: formatMonitorValue(record.createTime),
	updateBy: formatMonitorValue(record.updateBy),
	updateTime: formatMonitorValue(record.updateTime),
	tenantId: formatMonitorValue(record.tenantId),
	status: normalizeMonitorStatus(record.status),
});

export const useUtilityMonitorData = (monitorType: UtilityMonitorType) => {
	const message = useMessage();

	const overviewData = ref<UtilityMonitorOverviewData | null>(null);
	const meterPageData = ref<UtilityMonitorMeterPageData>({
		total: 0,
		pageNum: 1,
		pageSize: DEFAULT_PAGE_SIZE,
		list: [],
	});
	const overviewLoading = ref(false);
	const tableLoading = ref(false);

	let overviewRequestToken = 0;
	let tableRequestToken = 0;

	const loadOverview = async (showError = true) => {
		const requestToken = ++overviewRequestToken;
		overviewLoading.value = true;

		try {
			const response = await getUtilityMonitorOverview({ monitorType });
			if (requestToken !== overviewRequestToken) return;
			overviewData.value = response.data;
		} catch (error) {
			if (showError) message.error(getErrorMessage(error, '监控概览数据加载失败'));
			throw error;
		} finally {
			if (requestToken === overviewRequestToken) overviewLoading.value = false;
		}
	};

	const loadMeterPage = async (
		pageNum = meterPageData.value.pageNum || 1,
		pageSize = meterPageData.value.pageSize || DEFAULT_PAGE_SIZE,
		showError = true
	) => {
		const requestToken = ++tableRequestToken;
		tableLoading.value = true;

		try {
			const response = await getUtilityMonitorMeterPage({
				monitorType,
				pageNum,
				pageSize,
			});
			if (requestToken !== tableRequestToken) return;
			meterPageData.value = response.data;
		} catch (error) {
			if (showError) message.error(getErrorMessage(error, '表具监控数据加载失败'));
			throw error;
		} finally {
			if (requestToken === tableRequestToken) tableLoading.value = false;
		}
	};

	const reloadAll = async () => {
		const [overviewResult, tableResult] = await Promise.allSettled([loadOverview(false), loadMeterPage(undefined, undefined, false)]);
		if (overviewResult.status === 'rejected') message.error(getErrorMessage(overviewResult.reason, '监控概览数据加载失败'));
		if (tableResult.status === 'rejected') message.error(getErrorMessage(tableResult.reason, '表具监控数据加载失败'));
	};

	const handlePageChange = async (page: number) => {
		await loadMeterPage(page, meterPageData.value.pageSize || DEFAULT_PAGE_SIZE);
	};

	const handlePageSizeChange = async (size: number) => {
		await loadMeterPage(1, size);
	};

	onMounted(() => {
		void reloadAll();
	});

	return {
		overviewData,
		meterPageData,
		overviewLoading,
		tableLoading,
		reloadAll,
		loadOverview,
		loadMeterPage,
		handlePageChange,
		handlePageSizeChange,
	};
};
