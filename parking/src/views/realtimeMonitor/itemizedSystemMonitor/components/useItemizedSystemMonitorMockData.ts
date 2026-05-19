import { onMounted, ref } from 'vue';
import { useMessage } from '/@/hooks/message';
import {
	getItemizedSystemMonitorOverview,
	getItemizedSystemMonitorPage,
	type ItemizedMonitorPageData,
	type ItemizedMonitorPageRecordMap,
	type ItemizedMonitorOverviewDataMap,
	type ItemizedMonitorType,
} from '/@/api/energy/itemizedSystemMonitor';

const DEFAULT_PAGE_SIZE = 10;

const getErrorMessage = (error: any, fallback: string) => error?.message || error?.msg || fallback;

export const useItemizedSystemMonitorMockData = <T extends ItemizedMonitorType>(monitorType: T) => {
	const message = useMessage();

	const overviewData = ref<ItemizedMonitorOverviewDataMap[T] | null>(null);
	const pageData = ref<ItemizedMonitorPageData<ItemizedMonitorPageRecordMap[T]>>({
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
			const response = await getItemizedSystemMonitorOverview({ monitorType });
			if (requestToken !== overviewRequestToken) return;
			overviewData.value = response.data;
		} catch (error) {
			if (showError) message.error(getErrorMessage(error, '监控概览数据加载失败'));
			throw error;
		} finally {
			if (requestToken === overviewRequestToken) overviewLoading.value = false;
		}
	};

	const loadPage = async (
		pageNum = pageData.value.pageNum || 1,
		pageSize = pageData.value.pageSize || DEFAULT_PAGE_SIZE,
		showError = true
	) => {
		const requestToken = ++tableRequestToken;
		tableLoading.value = true;

		try {
			const response = await getItemizedSystemMonitorPage({
				monitorType,
				pageNum,
				pageSize,
			});
			if (requestToken !== tableRequestToken) return;
			pageData.value = response.data;
		} catch (error) {
			if (showError) message.error(getErrorMessage(error, '分页监控数据加载失败'));
			throw error;
		} finally {
			if (requestToken === tableRequestToken) tableLoading.value = false;
		}
	};

	const reloadAll = async () => {
		const [overviewResult, pageResult] = await Promise.allSettled([loadOverview(false), loadPage(undefined, undefined, false)]);
		if (overviewResult.status === 'rejected') message.error(getErrorMessage(overviewResult.reason, '监控概览数据加载失败'));
		if (pageResult.status === 'rejected') message.error(getErrorMessage(pageResult.reason, '分页监控数据加载失败'));
	};

	const handlePageChange = async (page: number) => {
		await loadPage(page, pageData.value.pageSize || DEFAULT_PAGE_SIZE);
	};

	const handlePageSizeChange = async (size: number) => {
		await loadPage(1, size);
	};

	onMounted(() => {
		void reloadAll();
	});

	return {
		overviewData,
		pageData,
		overviewLoading,
		tableLoading,
		loadOverview,
		loadPage,
		reloadAll,
		handlePageChange,
		handlePageSizeChange,
	};
};
