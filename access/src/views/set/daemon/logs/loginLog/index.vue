<template>
	<el-row class="ml10" v-show="showSearch">
		<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
			<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
				<el-form-item :label="item.title" prop="productName" v-for="item in searchList" :key="item.key">
					<el-input :placeholder="`请输入${item.title}`" v-model="state.queryForm[item.key]" v-if="item.type === 'input'" />
					<el-date-picker
						v-model="state.queryForm[item.key]"
						type="date"
						placeholder="选择日期"
						v-if="item.type === 'date'"
						value-format="YYYY-MM-DD HH:mm:ss"
					/>
				</el-form-item>
				<el-form-item>
					<!-- <moreForm :columns="columns" :currentColumns="currentColumns" @handleCheckBox="handleCheckBox" /> -->
					<el-button @click="getDataList" icon="search" type="primary" :loading="state.loading"> 查询 </el-button>
					<el-button @click="resetQuery" icon="Refresh" :loading="state.loading">重置</el-button>
				</el-form-item>
			</el-form>
		</el-form>
	</el-row>
	<el-row>
		<div class="mb8" style="width: 100%">
			<right-toolbar
				@queryTable="getDataList"
				class="ml10"
				style="float: right; margin-right: 20px"
				v-model:showSearch="showSearch"
				:tableRowShow="true"
				:tableColumns="columns"
				@changeColumns="changeColumns"
				:export="false"
			></right-toolbar>
		</div>
	</el-row>
	<el-table
		:data="state.dataList"
		@selection-change="handleSelectionChange"
		style="width: 100%"
		v-loading="state.loading"
		border
		:cell-style="tableStyle.cellStyle"
		:header-cell-style="tableStyle.headerCellStyle"
	>
		<el-table-column label="序号" fixed="left" type="index"" />
		" />
		<el-table-column
			:key="item.key"
			v-for="item in currentColumns"
			:min-width="120"
			:width="item.width"
			:fixed="item.fixed"
			:label="item.title"
			:prop="item.key"
			show-overflow-tooltip
		>
			<template #default="{ row }">
				<span v-if="item.key === 'title'">
					<el-tag type="primary">{{ row.title }}</el-tag>
				</span>
				<span v-else>
					{{ validateNull(row[item.key]) ? '/' : row[item.key] }}
				</span>
			</template>
		</el-table-column>
	</el-table>
	<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
</template>

<script lang="ts" name="systemdatasourceproduct" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { fetchList } from '/@/api/daemon/loginLog';
import { validateNull } from '/@/utils/validate';
import { columns } from './indexConfig';

const currentColumns = ref(columns);

// 定义变量内容
// 搜索变量
const queryRef = ref();
const showSearch = ref(true);
// 多选变量
const selectObjs = ref([]) as any;
const multiple = ref(true);

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: fetchList,
});
//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);



// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	state.queryForm = {};
	getDataList();
};

// 多选事件
const handleSelectionChange = (objs: { id: any }[]) => {
	selectObjs.value = objs.map((item) => item.id);
	multiple.value = !objs.length;
};

// 增减查询条件
const searchList = ref(columns.filter((item) => item.checked));

// 改变列
const changeColumns = (columns: any) => {
	currentColumns.value = columns;
};



onMounted(() => {});
</script>
