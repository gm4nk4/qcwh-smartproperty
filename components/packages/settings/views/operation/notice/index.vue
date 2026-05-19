<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="ml10" v-show="showSearch">
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
						<el-form-item :label="item.title" prop="productName" v-for="item in searchList" :key="item.key">
							<el-input :placeholder="`请输入${item.title}`" v-model="state.queryForm[item.key]" v-if="item.type === 'input'" />
						</el-form-item>
						<el-form-item label="当前状态">
							<el-select clearable multiple v-model="state.queryForm['stateCodeList']" placeholder="请选择当前状态">
								<el-option :key="1" label="启用" :value="1"></el-option>
								<el-option :key="0" label="禁用" :value="0"></el-option>
								<el-option :key="2" label="超期截止" :value="2"></el-option>
							</el-select>
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
					<el-button v-auth="'sys_notice_save'" @click="FormRef.openDialog()" type="primary" icon="folder-add"> 新增公告 </el-button>
					<el-button v-auth="'sys_notice_delete'" :disabled="multiple" @click="handleDelete(selectObjs)" class="ml10" icon="Delete" type="primary">
						删除
					</el-button>
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
				<el-table-column align="center" type="selection" width="40" />
				<el-table-column label="序号" fixed="left" type="index" width="60" />
				<el-table-column
					v-for="item in currentColumns"
					:key="item.key"
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
						<span v-else-if="item.key === 'fileUrl'">
							<el-button type="primary" link @click="clickHref(baseURL + row.fileUrl)"> 附件预览 </el-button>
						</span>
						<span v-else-if="item.key === 'state'">
							<StatusTag :text="row.state == 1 ? '启用' : '禁用'" />
						</span>
						<span v-else>
							{{ validateNull(row[item.key]) ? '/' : row[item.key] }}
						</span>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="250" fixed="right">
					<template #default="scope">
						<el-button v-auth="'sys_notice_update'" @click="FormRef.openDialog(scope.row.id)" text type="primary">编辑</el-button>
						<el-button
							v-auth="'sys_notice_enable_disable'"
							@click="enableOrDisable([scope.row.id], scope.row.state === 1 ? 0 : 1)"
							text
							type="primary"
							>{{ scope.row.state === 1 ? '禁用' : '启用' }}</el-button
						>
						<el-button v-auth="'sys_notice_delete'" @click="handleDelete([scope.row.id])" text type="primary">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>

		<!-- 编辑、新增  -->
		<Form @refresh="getDataList()" ref="FormRef" />
		<FileReview :fileUrl="fileUrl" ref="FileReviewRef" />
	</div>
</template>

<script lang="ts" name="systemdatasourceproduct" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { fetchNoticeList, delNoticeObj, enableNoticeObj } from '/@/api/newAnnoun/notice';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { validateNull } from '/@/utils/validate';
import { columns } from './indexConfig';

const currentColumns = ref(columns);

// 引入组件
const Form = defineAsyncComponent(() => import('./form.vue'));
const FileReview = defineAsyncComponent(() => import('/@/components/FileReview/index.vue'));

// 定义变量内容
const FormRef = ref();
const FileReviewRef = ref();
const fileUrl = ref('');

// 搜索变量
const queryRef = ref();
const showSearch = ref(true);
// 多选变量
const selectObjs = ref([]) as any;
const multiple = ref(true);

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: fetchNoticeList,
});
//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

const clickHref = (href: string) => {
	// window.open(href);
	fileUrl.value = href;
	FileReviewRef.value.openDialog();
};

// 批量启用禁用
const enableOrDisable = async (ids: string[], state: number) => {
	if (!ids || ids.length < 1) {
		useMessage().warning('请选择公告');
		return false;
	}

	try {
		await useMessageBox().confirm(`确定操作${state === 1 ? '启用' : '禁用'}`);
	} catch {
		return;
	}

	try {
		const result = await enableNoticeObj({ idList: ids, state: state });
		if (result.data) {
			getDataList();
			useMessage().success('操作成功');
		} else {
			useMessage().error('操作失败');
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};

// 删除操作
const handleDelete = async (ids: string[]) => {
	try {
		await useMessageBox().confirm('此操作将永久删除');
	} catch {
		return;
	}
	try {
		await delNoticeObj({ idList: ids });
		getDataList();
		useMessage().success('删除成功');
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};

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
