<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="ml10">
				<el-form :model="queryParams" ref="queryForm" :inline="true">
					<el-space direction="horizontal" alignment="flex-start">
						<el-form-item label="年份" prop="holidayYear">
							<el-date-picker v-model="queryParams.holidayYear" type="year" :clearable="false" placeholder="选择年"> </el-date-picker>
						</el-form-item>
						<el-alert type="warning" show-icon :closable="false" style="margin: 0 20px; height: 30px">
							<p>红色字体表示当天为非工作日</p>
						</el-alert>
					</el-space>
					<el-form-item>
						<el-button type="primary" :loading="loading" icon="search" @click="handleQuery">搜索</el-button>
						<el-button icon="refresh" :loading="loading" @click="resetQuery">重置节假日</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row :gutter="24" class="holidayDemo">
				<el-col :span="17" style="height: 100%; overflow: auto">
					<el-row :gutter="24">
						<el-col :span="6" v-for="(cal, i) in defaultCals" :key="i" style="min-width: 300px; margin-bottom: 20px">
							<el-card class="card" v-loading="loading">
								<el-calendar :model-value="cal" class="holiday">
									<template #date-cell="{ data }">
										<div
											class="temp-mt"
											:class="`holiday-cell ${data.day === selectDay ? 'holiday-select' : ''}`"
											v-if="data.type === 'current-month'"
											:id="data.day"
											@dblclick="onAddItem(data.day)"
											@click="selectDay = data.day"
										>
											{{ data.day.split('-')[2] }}
										</div>
										<div v-else></div>
									</template>
								</el-calendar>
							</el-card>
						</el-col>
					</el-row>
				</el-col>
				<el-col :span="7" style="height: 100%; overflow: auto">
					<el-card class="card">
						<template #header>
							<el-row>
								<el-col :span="24">
									<!-- <el-button @click="onSubmit" :loading="loading" icon="folder-add" type="primary"> 保存 </el-button> -->
									<el-button v-auth="'sys_holiday_update'" :loading="loading" icon="folder-add" type="primary" @click="onAddItem(selectDay)">
										新增节假日
									</el-button>
								</el-col>
							</el-row>
						</template>
						<el-row>
							<el-col :span="24">
								<el-table
									:data="state.dataList"
									style="width: 100%"
									max-height="800"
									v-loading="state.loading"
									border
									:cell-style="tableStyle.cellStyle"
									:header-cell-style="tableStyle.headerCellStyle"
								>
									<!-- <el-table-column align="center" type="selection" width="40" /> -->
									<el-table-column label="序号" fixed="left" type="index" width="60" />
									<el-table-column label="节假日日期" fixed="left" type="date" min-width="150">
										<template #default="{ row }">
											<span>
												<el-date-picker
													@blur="onSubmit"
													value-format="YYYY-MM-DD"
													v-model="row.date"
													type="date"
													placeholder="请选择"
													style="width: 120px"
												/>
											</span>
										</template>
									</el-table-column>
									<el-table-column label="节假日名称" type="des" min-width="100">
										<template #default="{ row }">
											<span>
												<el-input @blur="onSubmit" style="width: 70px" v-model="row.des" placeholder="请输入" />
											</span>
										</template>
									</el-table-column>
									<el-table-column label="类型" type="index" min-width="90">
										<template #default="{ row }">
											<span>
												<el-select v-model="row.isHoliday" style="width: 60px" placeholder="请选择" @blur="onSubmit">
													<el-option v-for="item in typeOption" :key="item.key" :label="item.value" :value="item.key" />
												</el-select>
											</span>
										</template>
									</el-table-column>
									<!-- <el-table-column label="操作" width="50" fixed="right">
										<template #default="scope">
											<el-button @click.prevent="deleteRow(scope.$index)" text type="primary">删除</el-button>
										</template>
									</el-table-column> -->
								</el-table>
							</el-col>
							<!-- <el-pagination
								background
								layout="prev, pager, next, jumper"
								:total="state.dataList.length"
								:page-size="pageSize"
								@current-change="handlePageChange"
								:current-page="currentPage"
							></el-pagination> -->
						</el-row>
					</el-card>
				</el-col>
			</el-row>
		</div>
	</div>
</template>

<script lang="ts" name="systemdatasourceproduct" setup>
import { useI18n } from 'vue-i18n';
import { formatDate } from '/@/utils/formatTime';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { fetchHolidayList, fetchWithoutSystemList, fetchHolidaySaveBath, selectItem, fetchHolidayResetByYear } from '/@/api/holidayManagement/index';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { findObjectByValue } from '/@/utils/arrayOperation';
import { useUserInfo } from '/@/stores/userInfo';

// 引入组件

const { t } = useI18n();
// 定义变量内容
const queryParams = ref({
	holidayYear: new Date(),
});
const defaultCals = ref([]) as any; //设置的月份
const typeOption = ref([]) as any; //设置的月份

const holidayDate = ref([]) as any; // 全年已选中的日期
const currentPage = ref(1);
const pageSize = ref(10);
const loading = ref(false);
const selectDay = ref('');
const sys_holiday_update = ref(true);

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	// pageList: getLogObj,
	pageList: () => Promise.resolve([]),
});

//  table hook
const { tableStyle } = useTable(state);

//初始化日历
const initCalendar = async (year: any) => {
	loading.value = true;
	defaultCals.value = [
		new Date(year, 0, 1),
		new Date(year, 1, 1),
		new Date(year, 2, 1),
		new Date(year, 3, 1),
		new Date(year, 4, 1),
		new Date(year, 5, 1),
		new Date(year, 6, 1),
		new Date(year, 7, 1),
		new Date(year, 8, 1),
		new Date(year, 9, 1),
		new Date(year, 10, 1),
		new Date(year, 11, 1),
	];

	//调接口获取
	const res = await fetchHolidayList({
		year: year,
		isHoliday: '1',
	});
	if (res.data) {
		let holidayArr = [];
		for (let index = 0; index < res.data.length; index++) {
			const element = res.data[index];
			const dateString = element?.date;
			const parts = dateString.split('-');
			const y = parts[0];
			const m = parts[1];
			const d = parts[2];

			holidayArr.push({
				date: y + '-' + m + '-' + d,
			});
		}
		console.log(holidayArr);
		holidayDate.value = holidayArr;
		loading.value = false;
	}

	const res2 = await fetchWithoutSystemList({
		year: year,
		isHoliday: '1',
	});

	if (res2.data) {
		state.dataList = res2.data;
		loading.value = false;
	}

	// holidayDate.value = [{ date: '0-' + year + '-01-02' }, { date: '1-' + year + '-02-02' }, { date: '2-' + year + '-03-02' }];
	nextTick(() => {
		let holidayCell = document.getElementsByClassName('holiday-cell') as any;
		for (let i in holidayCell) {
			if (undefined != holidayCell[i].style) {
				holidayCell[i].style.backgroundColor = '#FFFFFF';
				holidayCell[i].style.color = '#333';
			}
		}
		//给已选中的日期加背景色

		for (let i in holidayDate.value) {
			let span = document.getElementById(holidayDate.value[i].date) as any;
			span.style.backgroundColor = 'rgb(254,233,211)';
			span.style.color = '#F56C6C';
		}

		// 今天的日期标注蓝框
		let today = formatDate(new Date(), 'YYYY-mm-dd');

		// 检查 document.getElementById(today) 是否为 null，避免报错
		const todayElement = document.getElementById(today);
		if (todayElement) {
			todayElement.style.backgroundColor = 'rgba(40, 95, 243,.6)';
			todayElement.style.color = '#fff';
		}
	});
};
/** 搜索按钮操作 */
const handleQuery = () => {
	let year = queryParams.value.holidayYear.getFullYear();
	initCalendar(year);
};
/** 重置按钮操作 */
const resetQuery = async () => {
	let year = queryParams.value.holidayYear.getFullYear();
	try {
		await useMessageBox().confirm('此操作将重置节假日设置');
	} catch {
		return;
	}
	try {
		state.loading = true;
		loading.value = true;
		const res = await fetchHolidayResetByYear({ year });
		if (res.data) {
			handleQuery();
			useMessage().success('重置成功');
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		state.loading = false;
		loading.value = false;
	}
};

const onAddItem = (date: any) => {
	if (!sys_holiday_update.value) {
		return false;
	}
	let visDate = findObjectByValue(holidayDate.value, date, 'date');

	// 计算总页数（向上取整）
	// 处理 state.dataList 可能为 undefined 的情况，若为 undefined 则默认为 0
	const totalPages = computed(() => Math.ceil((state.dataList?.length || 0) / pageSize.value));
	// 跳到最后一页的方法
	currentPage.value = totalPages.value;
	let year = queryParams.value.holidayYear.getFullYear();
	if (!state.dataList) {
		state.dataList = [];
	}
	state.dataList.push({
		year: year.toString(),
		date: date || '',
		des: '',
		isHoliday: visDate ? 0 : 1,
	});
	onSubmit();
};

// 提交
const onSubmit = async () => {
	try {
		state.loading = true;
		loading.value = true;
		const res = await fetchHolidaySaveBath({ holidayList: state.dataList });
		if (res.data) {
			useMessage().success(t('common.editSuccessText'));
			let nowYear = new Date().getFullYear();
			initCalendar(nowYear); // 初始化日历
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		state.loading = false;
		loading.value = false;
	}
};

onMounted(() => {
	//初始化日历
	let nowYear = new Date().getFullYear();
	initCalendar(nowYear);

	// 文档格式
	selectItem({ type: 'HOLIDAY' }).then((res: any) => {
		for (let index = 0; index < res?.data.length; index++) {
			const element = res?.data[index];
			element.key = parseInt(element.key);
		}
		typeOption.value = res?.data;
	});
	sys_holiday_update.value = useUserInfo().userInfos.authBtnList.some((v: string) => v === 'sys_holiday_update');
});
</script>

<style lang="scss">
.holidayDemo {
	overflow: auto;
	height: 100%;

	.card {
		background: rgba(255, 255, 255, 0.95);
		-webkit-backdrop-filter: blur(10px);
		backdrop-filter: blur(10px);
		border-radius: 16px;
		box-shadow: 0px 20px 27px 0px rgba(0, 0, 0, 0.05);
		transition: all 0.3s ease;
	}

	.holiday .el-calendar__button-group {
		display: none;
	}

	.select-month .el-calendar__button-group {
		display: none;
	}

	.holiday .el-calendar-day {
		padding: 1px;
		width: 100%;
		height: 34px;
	}

	.holiday .el-calendar__body {
		max-height: 268px;
	}

	.select-month .el-calendar-day {
		padding: 1px;
		width: 100%;
	}

	.holiday-cell {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;

		&:hover {
			border: 1px solid #ccc;
		}
	}

	.holiday-select {
		border: 2px solid rgba(40, 95, 243, 0.6);
	}

	.holiday .el-calendar-day {
		padding: 0;
	}
}
</style>
