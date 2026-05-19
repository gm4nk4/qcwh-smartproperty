<template>
	<div class="top-right-btn" :style="style">
		<el-row>
			<!--      布局 列表 卡片-->
			<el-tooltip class="item" effect="dark" :content="layoutShow ? '列表' : '卡片'" placement="top" v-if="layout">
				<el-button :icon="layoutShow ? 'Tickets' : 'Postcard'" @click="handleLayout" v-if="layout" />
			</el-tooltip>

			<!--      增减表格列-->
			<el-popover placement="bottom" trigger="hover" v-if="tableRowShow">
				<template #reference>
					<el-button icon="Histogram" />
				</template>

				<div class="popover_list">
					<el-checkbox-group v-model="checkList" style="display: flex; flex-direction: column" @change="handleCheckBox">
						<el-checkbox v-for="item in computedColumns" :label="item.title" :value="item.key" :checked="item.checked" />
					</el-checkbox-group>
				</div>
			</el-popover>

			<!-- 搜索框控制 -->
			<el-tooltip
				class="item"
				effect="dark"
				:content="showSearch ? $t('queryTree.hideSearch') : $t('queryTree.displayTheSearch')"
				placement="top"
				v-if="search"
			>
				<el-button icon="Search" @click="toggleSearch()" />
			</el-tooltip>

			<!-- 导出 -->
			<el-tooltip class="item" effect="dark" :content="$t('common.exportBtn')" placement="top" v-if="isExport()" v-auth="exportAuth">
				<el-button icon="Download" @click="handleExport()" />
			</el-tooltip>

			<!-- 刷新功能 -->
			<el-tooltip class="item" effect="dark" :content="$t('queryTree.refresh')" placement="top">
				<el-button @click="handleRefresh()">
					<el-icon :class="{ 'is-rotating': isRotating }"><Refresh /></el-icon>
				</el-button>
			</el-tooltip>

			<!-- 插槽 -->
			<slot></slot>
		</el-row>
	</div>
</template>

<script setup name="right-toolbar">
// import { auth } from '/@/utils/authFunction';
import { Refresh } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { nextTick } from 'vue';

/**
 * 通过 defineProps 函数定义组件 props
 */
const props = defineProps({
	/**
	 * 是否显示搜索框
	 */
	showSearch: {
		type: Boolean,
		default: true,
	},
	/**
	 * 是否导出
	 */
	export: {
		type: [String, Boolean],
		default: null,
	},
	/**
	 * 是否显示搜索框
	 */
	search: {
		type: Boolean,
		default: true,
	},
	/**
	 * 列表项之间的间距
	 */
	gutter: {
		type: Number,
		default: 10,
	},
	/**
	 * 是否显示布局按钮
	 */
	layout: {
		type: Boolean,
		default: false,
	},
	/**
	 * 是否显示增减表格列
	 */
	tableRowShow: {
		type: Boolean,
		default: false,
	},
	/**
	 * 表格列
	 */
	tableColumns: {
		type: Array,
		default: () => [],
	},
	/**
	 * 导出权限
	 */
	exportAuth: {
		type: String,
		default: '',
	},
});

const emits = defineEmits(['update:showSearch', 'queryTable', 'exportExcel']);

const style = computed(() => {
	const ret = {};
	// 如果props中有传入gutter属性，则计算出marginRight
	if (props.gutter) {
		ret.marginRight = `${props.gutter / 2}px`;
	}
	return ret; // 返回计算后的样式对象
});

// 改变布局
const layoutShow = ref(false);
const handleLayout = () => {
	layoutShow.value = !layoutShow.value;
	emits('changeLayout');
};

// 搜索
const toggleSearch = () => {
	emits('update:showSearch', !props.showSearch);
};

// 添加动画控制变量
const isRotating = ref(false);

// 修改刷新处理函数
const handleRefresh = () => {
	isRotating.value = true;

	// 触发父组件的刷新方法
	emits('queryTable');

	nextTick(() => {
		ElMessage.success('刷新成功');
		// 停止旋转动画
		setTimeout(() => {
			isRotating.value = false;
		}, 500);
	});
};

// 导出excel
const handleExport = () => {
	emits('exportExcel');
};

// 是否导出
const isExport = () => {
	if (props.export === true) {
		return true;
	}

	// 字符串鉴权
	return props.export;
};

// 增减表格列
const checkList = ref([]);
const handleCheckBox = (val) => {
	let columns = props.tableColumns;
	let newColumns = [];
	columns.forEach((item) => {
		if (val.includes(item.key)) {
			item.defaultColumnShow = true;
			newColumns.push(item);
		} else {
			item.defaultColumnShow = false;
		}
	});
	emits('changeColumns', newColumns);
};

// 计算属性，根据defaultColumnShow来设置每个checkbox的checked值
const computedColumns = computed(() => {
	return props.tableColumns.map((item) => ({
		...item,
		checked: 'defaultColumnShow' in item ? item.defaultColumnShow !== false : true,
	}));
});
</script>

<style lang="scss" scoped>
:deep(.el-transfer__button) {
	border-radius: 50%;
	display: block;
	margin-left: 0px;
}

:deep(.el-transfer__button:first-child) {
	margin-bottom: 10px;
}

.my-el-transfer {
	text-align: center;
}

.icon {
	width: 30px;
	height: 30px;
	margin-right: 10px;
	cursor: pointer;
}

// 添加旋转动画样式
@keyframes rotate {
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
}

.is-rotating {
	animation: rotate 1s linear;
}
</style>
