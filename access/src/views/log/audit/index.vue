<template>
	<div class="audit-page">
		<!-- 统计卡片 -->
		<div class="stat-cards">
			<div
				class="stat-card"
				v-for="stat in stats"
				:key="stat.id"
			>
				<div class="stat-info">
					<span class="stat-title">{{ stat.title }}</span>
					<span class="stat-value">{{ stat.value }}</span>
				</div>
				<div class="stat-icon">
					<el-icon :size="40">
						<component :is="getIconByName(stat.icon)" />
					</el-icon>
				</div>
			</div>
		</div>

		<!-- 查询表单 -->
		<ConfigurableQueryForm
			ref="queryFormRef"
			:config="queryFormConfig"
			@search="handleFormSearch"
			@reset="handleFormReset"
		>
			<template #actions>
				<slot name="formActions"></slot>
			</template>
			<!-- 传递 departmentSelection 插槽 -->
			<template #departmentSelection="slotProps">
				<slot
					name="departmentSelection"
					v-bind="slotProps"
				></slot>
			</template>
		</ConfigurableQueryForm>
		<!-- <div class="query-form">
			<el-form
				:model="queryParams"
				inline
				class="form-inline"
			>
				<el-form-item label="操作内容">
					<el-input
						v-model="queryParams.operationContent"
						placeholder="请输入操作内容"
						clearable
					/>
				</el-form-item>
				<el-form-item label="操作模块">
					<el-select
						v-model="queryParams.operationModule"
						placeholder="全部模块"
						clearable
					>
						<el-option
							label="全部模块"
							value=""
						/>
						<el-option
							label="角色管理"
							value="角色管理"
						/>
						<el-option
							label="第三方应用"
							value="第三方应用"
						/>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button
						type="primary"
						link
					>
						<el-icon><ArrowDown /></el-icon>
						更多选项
					</el-button>
					<el-button
						type="primary"
						@click="handleSearch"
					>
						查询
					</el-button>
					<el-button @click="handleReset"> 重置 </el-button>
				</el-form-item>
			</el-form>
			<div class="query-actions">
				<el-button
					link
					type="primary"
				>
					<el-icon><Download /></el-icon>
					导出日志
				</el-button>
			</div>
		</div> -->

		<!-- 折叠面板 - 按日期分组 -->
		<el-collapse
			class="audit-collapse"
			v-model="activeCollapse"
		>
			<el-collapse-item
				v-for="group in groupedRecords"
				:key="group.date"
				:name="group.date"
			>
				<template #title>
					<div class="collapse-title">
						<el-icon><Clock /></el-icon>
						<span>{{ group.date }} ({{ group.records.length }}条记录)</span>
					</div>
				</template>
				<div class="audit-list">
					<div
						class="audit-item"
						v-for="record in group.records"
						:key="record.id"
					>
						<div class="item-header">
							<div class="user-info">
								<el-avatar
									:size="40"
									:src="record.avatar"
								/>
								<div class="user-detail">
									<span class="user-name">{{ record.userName }}</span>
									<span class="user-dept">{{ record.department }}</span>
								</div>
							</div>
							<div class="operation-info">
								<div class="operation-title">
									{{ record.operation }}
									<el-tag
										:type="getStatusType(record.status)"
										size="small"
										class="status-tag"
									>
										{{ record.statusText }}
									</el-tag>
									<el-tag
										v-if="record.operationType"
										type="danger"
										size="small"
										class="risk-tag"
									>
										{{ record.operationType }}
									</el-tag>
								</div>
								<div class="operation-time">
									{{ record.time }}
									<el-button
										link
										type="info"
										size="small"
									>
										<el-icon><CircleCheck /></el-icon>
									</el-button>
								</div>
							</div>
						</div>
						<div
							class="item-detail"
							v-if="record.description"
						>
							<p class="detail-desc">{{ record.description }}</p>
							<div class="detail-meta">
								<span
									v-if="record.ip"
									class="meta-item"
								>
									<el-icon><Position /></el-icon>
									IP: {{ record.ip }}
								</span>
								<span
									v-if="record.operationModule"
									class="meta-item"
								>
									<el-icon><Grid /></el-icon>
									模块: {{ record.operationModule }}
								</span>
								<span
									v-if="record.operationType2"
									class="meta-item"
								>
									<el-icon><Operation /></el-icon>
									操作类型: {{ record.operationType2 }}
								</span>
							</div>
						</div>
					</div>
				</div>
			</el-collapse-item>
		</el-collapse>
	</div>
</template>

<script setup lang="ts" name="AuditLog">
import { ref, computed, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { Calendar, Warning, CircleClose, Key, ArrowDown, Download, Clock, Position, Grid, Operation, CircleCheck } from '@element-plus/icons-vue';
import type { AuditStatsCard, AuditRecord, AuditQueryParams } from './type';
import { mockAuditStatsCards, mockAuditRecords,operationModuleOptions } from './mock';
import { ConfigurableQueryForm, type QueryFormConfig } from '@zhqc-smart/table';

/**
 * 统计卡片数据
 */
const stats = ref<AuditStatsCard[]>(mockAuditStatsCards);

/**
 * 审计记录数据
 */
const records = ref<AuditRecord[]>(mockAuditRecords);
/** 查询表单配置 */
const queryFormConfig = computed<QueryFormConfig>(() => ({
	fields: [
		{ label: '操作内容', value: 'operationContent', type: 'text', selected: true },
		{ label: '操作模块', value: 'operationModule', type: 'select', selected: true },
	],
	fieldOptions: {
		operationModule: operationModuleOptions,
	},
	maxConditions: 3,
	initialConditions: 3,
}));
/**
 * 查询参数
 */
const queryParams = reactive<AuditQueryParams>({
	operationContent: '',
	operationModule: '',
});
/**
 * 处理表单搜索
 */
const handleFormSearch = () => {
	ElMessage.success('查询成功');
};
/**
 * 处理表单重置
 */
const handleFormReset = () => {
	queryParams.operationContent = '';
	queryParams.operationModule = '';
	ElMessage.success('重置成功');
};
/**
 * 折叠面板激活状态
 */
const activeCollapse = ref<string[]>(['今天', '昨天']);

/**
 * 获取图标组件
 * @param iconName 图标名称
 * @returns 图标组件
 */
const getIconByName = (iconName: string) => {
	const iconMap: Record<string, any> = {
		Calendar,
		Warning,
		CircleClose,
		Key,
	};
	return iconMap[iconName] || Calendar;
};

/**
 * 获取状态对应的tag类型
 * @param status 状态
 * @returns tag类型
 */
const getStatusType = (status: string) => {
	const typeMap: Record<string, any> = {
		success: 'success',
		warning: 'warning',
		danger: 'danger',
	};
	return typeMap[status] || 'info';
};

/**
 * 按日期分组记录
 */
const groupedRecords = computed(() => {
	const groups: Record<string, AuditRecord[]> = {};
	records.value.forEach((record) => {
		if (!groups[record.date]) {
			groups[record.date] = [];
		}
		groups[record.date].push(record);
	});
	return Object.keys(groups).map((date) => ({
		date,
		records: groups[date],
	}));
});

/**
 * 处理搜索
 */
const handleSearch = () => {
	ElMessage.success('查询成功');
};

/**
 * 处理重置
 */
const handleReset = () => {
	queryParams.operationContent = '';
	queryParams.operationModule = '';
	ElMessage.success('重置成功');
};
</script>

<style scoped lang="scss">
.audit-page {
	display: flex;
	flex-direction: column;
	gap: 16px;
	padding: 16px;
}

.stat-cards {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 16px;
}

.stat-card {
	display: flex;
	justify-content: space-between;
	align-items: center;
	background: white;
	border-radius: 12px;
	padding: 20px;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.stat-info {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.stat-title {
	font-size: 14px;
	color: #6b7280;
}

.stat-value {
	font-size: 28px;
	font-weight: 700;
	color: #111827;
}

.stat-icon {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 64px;
	height: 64px;
	border-radius: 8px;
	background: linear-gradient(135deg, #f9fafb 0%, #e5e7eb 100%);
}

.query-form {
	display: flex;
	justify-content: space-between;
	align-items: center;
	background: white;
	padding: 20px;
	border-radius: 12px;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.form-inline {
	display: flex;
	align-items: center;
	gap: 16px;
	margin-bottom: 0;
}

.query-actions {
	display: flex;
	align-items: center;
}

.audit-collapse {
	background: white;
	border-radius: 12px;
	padding: 0;
	border: none;

	:deep(.el-collapse-item__header) {
		padding: 16px 20px;
		border-bottom: 1px solid #f3f4f6;
	}

	:deep(.el-collapse-item__wrap) {
		border: none;
	}
}

.collapse-title {
	display: flex;
	align-items: center;
	gap: 8px;
	font-weight: 600;
	color: #1f2937;
}

.audit-list {
	display: flex;
	flex-direction: column;
	gap: 8px;
	padding: 8px 20px;
}

.audit-item {
	border-radius: 8px;
	padding: 12px;
	border: 1px solid #e5e7eb;
	transition: all 0.3s;

	&:hover {
		background: #f9fafb;
		border-color: #3b82f6;
	}
}

.item-header {
	display: flex;
	align-items: center;
	gap: 12px;
}

.user-info {
	display: flex;
	align-items: center;
	gap: 12px;
}

.user-detail {
	display: flex;
	flex-direction: column;
	gap: 4px;
}

.user-name {
	font-size: 14px;
	font-weight: 600;
	color: #1f2937;
}

.user-dept {
	font-size: 12px;
	color: #9ca3af;
}

.operation-info {
	flex: 1;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.operation-title {
	display: flex;
	align-items: center;
	gap: 8px;
}

.status-tag {
	margin: 0;
}

.risk-tag {
	margin: 0;
}

.operation-time {
	display: flex;
	align-items: center;
	gap: 4px;
	font-size: 14px;
	color: #9ca3af;
}

.item-detail {
	margin-top: 12px;
	padding-top: 12px;
	border-top: 1px solid #f3f4f6;
}

.detail-desc {
	font-size: 13px;
	color: #374151;
	margin: 0 0 12px 0;
	line-height: 1.6;
}

.detail-meta {
	display: flex;
	flex-wrap: wrap;
	gap: 24px;
}

.meta-item {
	display: flex;
	align-items: center;
	gap: 4px;
	font-size: 12px;
	color: #6b7280;
}
</style>
