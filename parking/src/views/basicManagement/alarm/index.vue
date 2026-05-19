<template>
  <div class="layout-padding">
    <div class="layout-padding-auto layout-padding-view">
      <ConfigurableTableWithForm
        ref="tableWithFormRef"
        :queryFormConfig="queryFormConfig"
        :tableConfig="tableConfig"
        @search="handleSearch"
        @reset="handleReset"
        @add="handleAdd"
        @operation="handleOperation"
        @select="handleSelect"
      >
        <template #tableActions>
          <el-button icon="folder-add" type="primary"  @click="handleAdd">
            新增规则
          </el-button>
          <el-button type="success" class="ml10" @click="handleBatchEnable" :disabled="multiple">批量启用</el-button>
          <el-button type="warning" class="ml10" @click="handleBatchDisable" :disabled="multiple">批量禁用</el-button>
          <el-button plain :disabled="multiple" icon="Delete" type="danger" class="ml10" @click="handleDelete(selectObjs)">
            批量删除
          </el-button>
        </template>

        <!-- 告警类型列 -->
        <template #alarmType="{ row }">
          <el-tag :type="getAlarmTypeTagType(row.alarmType)">
            {{ getDictLabel(alarm_type, row.alarmType) }}
          </el-tag>
        </template>

        <!-- 告警级别列 -->
        <template #alarmLevel="{ row }">
          <el-tag :type="getAlarmLevelTagType(row.alarmLevel)">
            {{ getDictLabel(alarm_level, row.alarmLevel) }}
          </el-tag>
        </template>

        <!-- 监测指标列 -->
        <template #metrics="{ row }">
          {{ getDictLabel(metrics_indicators, row.metrics) }}
        </template>

        <!-- 触发条件列 -->
        <template #triggerCondition="{ row }">
          {{ getDictLabel(trigger_condition, row.triggerCondition) }}
        </template>

        <!-- 通知方式列 -->
        <template #notifyMethods="{ row }">
          <div v-if="row.notifyMethods">
            <span v-for="(method, index) in row.notifyMethods.split(',')" :key="index" class="inline-tag">
              {{ getDictLabel(notify_methods, method) }}
              <span v-if="index < row.notifyMethods.split(',').length - 1">, </span>
            </span>
          </div>
          <div v-else>-</div>
        </template>

        <!-- 状态列 -->
        <!-- <template #status="{ row }">
          <el-switch
            v-model="row.status"
            :active-value="'1'"
            :inactive-value="'0'"
            @change="handleStatusChange(row)"
          />
        </template> -->
      </ConfigurableTableWithForm>

      <!-- 新增/编辑告警规则弹窗组件 -->
      <AddAlarmRuleDialog
        ref="formDialogRef"
        @refresh-list="handleRefresh"
      />
    </div>
  </div>
</template>

<script setup lang="ts" name="alarmRule">
import { ref, reactive } from 'vue'
import AddAlarmRuleDialog from './components/AddAlarmRuleDialog.vue'
import { getAlarmRulePage, deleteBatchAlarmRule, changeStatusBatchAlarmRule } from '/@/api/basicManagement/alarm'
import { useMessage, useMessageBox } from '/@/hooks/message'
import { useDict } from '/@/hooks/dict'
import { ConfigurableTableWithForm } from '/@/components/ConfigurableComponents'
import { QUERY_FORM_CONFIG, TABLE_CONFIG } from './config'

// 字典数据
const { alarm_type, alarm_level, metrics_indicators, trigger_condition, notify_methods } = useDict('alarm_type', 'alarm_level', 'metrics_indicators', 'trigger_condition', 'notify_methods')

// 根据字典值获取标签
const getDictLabel = (dict: any, value: string) => {
  const item = dict.value?.find((item: any) => item.value === value)
  return item?.label || value
}

// 定义变量内容
const formDialogRef = ref()
const tableWithFormRef = ref()
const selectObjs = ref([]) as any
const multiple = ref(true)

// 从配置文件导入配置
const queryFormConfig = QUERY_FORM_CONFIG
const tableConfig = TABLE_CONFIG

// 搜索事件
const handleSearch = (formData: any) => {
  console.log('搜索条件:', formData)
}

// 重置事件
const handleReset = () => {
  console.log('重置搜索条件')
}

// 新增事件
const handleAdd = () => {
  formDialogRef.value.openDialog()
}

// 刷新事件
const handleRefresh = () => {
  tableWithFormRef.value?.getDataList()
}

// 操作事件
const handleOperation = (data: any) => {
  const { action, row } = data
  switch (action) {
    case 'edit':
      formDialogRef.value.openDialog(row)
      break
    case 'delete':
      handleDelete([row.id])
      break
  }
}

// 选择事件
const handleSelect = (selection: any[]) => {
  selectObjs.value = selection.map(({ id }) => id)
  multiple.value = !selection.length
}

// 删除操作
const handleDelete = async (ids: any[]) => {
	try {
		await useMessageBox().confirm('确定要删除选中的告警规则吗？')
	} catch {
		return
	}

	try {
		await deleteBatchAlarmRule( ids )
		handleRefresh()
		useMessage().success('删除成功')
	} catch (err: any) {
		useMessage().error(err.msg || '删除失败')
	}
}

// 批量启用
const handleBatchEnable = async () => {
	if (selectObjs.value.length === 0) return
	
	try {
		await useMessageBox().confirm('确定要启用选中的告警规则吗？')
	} catch {
		return
	}

	try {
		await changeStatusBatchAlarmRule({ ids: selectObjs.value, status: '1' })
		handleRefresh()
		useMessage().success('启用成功')
	} catch (err: any) {
		useMessage().error(err.msg || '启用失败')
	}
}

// 批量禁用
const handleBatchDisable = async () => {
	if (selectObjs.value.length === 0) return
	
	try {
		await useMessageBox().confirm('确定要禁用选中的告警规则吗？')
	} catch {
		return
	}

	try {
		await changeStatusBatchAlarmRule({ ids: selectObjs.value, status: '0' })
		handleRefresh()
		useMessage().success('禁用成功')
	} catch (err: any) {
		useMessage().error(err.msg || '禁用失败')
	}
}

// 单个状态变更
const handleStatusChange = async (row: any) => {
	try {
		await changeStatusBatchAlarmRule({ ids: [row.id], status: row.status })
		useMessage().success(row.status === '1' ? '启用成功' : '禁用成功')
		handleRefresh()
	} catch (err: any) {
		// 恢复原状态
		row.status = row.status === '1' ? '0' : '1'
		useMessage().error(err.msg || '状态变更失败')
	}
}

// 根据告警类型返回标签类型
const getAlarmTypeTagType = (type: string) => {
	switch (type) {
		case '设备故障':
			return 'danger'
		case '能耗异常':
			return 'warning'
		case '安全告警':
			return 'success'
		default:
			return 'info'
	}
}

// 根据告警级别返回标签类型
const getAlarmLevelTagType = (level: string) => {
	switch (level) {
		case '严重':
			return 'danger'
		case '警告':
			return 'warning'
		case '紧急':
			return 'danger'
		default:
			return 'info'
	}
}
</script>

<style scoped>
.layout-padding-view {
  padding: 0px !important;
}
</style>   
<style scoped lang="scss">
.layout-padding {
	position: relative !important;
	height: auto !important;
	min-height: 100% !important;
	overflow: visible !important;
}

.layout-padding-auto.layout-padding-view {
	padding: 0 !important;
}

.subitem-system-scrollbar {
	height: auto;
	min-height: 100%;
	padding: 0;

	:deep(.el-scrollbar__wrap) {
		overflow-x: hidden;
	}
}

.subitem-system-page {
	height: auto;
	min-height: 100%;
	padding: 0 0 10px;
	background: transparent;
}

.management-card {
	background: #fff;
	border-radius: 0;
	box-shadow: none;
	display: flex;
	flex-direction: column;
}

.management-card__header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 8px 0 10px;
}

.management-card__title {
	display: inline-flex;
	align-items: center;
	gap: 10px;
	font-size: 16px;
	font-weight: 600;
	line-height: 24px;
	color: #1f2937;
}

.management-card__title-bar {
	width: 4px;
	height: 20px;
	border-radius: 999px;
	background: var(--dashboard-primary, var(--el-color-primary));
	box-shadow: 0 4px 10px rgba(var(--dashboard-primary-rgb, 64, 158, 255), 0.22);
}

.management-card__content {
	flex: 1;
	min-height: 0;
	padding: 12px 0 0;
	display: flex;
}

.management-card__content :deep(.configurable-table-with-form) {
	flex: 1;
	min-height: 0;
}

.management-card__content :deep(.form-container) {
	margin-bottom: 12px;
}

.management-card__content :deep(.query-form) {
	margin: 0;
	border: none;
	border-radius: 0;
	background: transparent;
}

.management-card__content :deep(.filter-content) {
	padding: 0 0 12px;
}

.management-card__content :deep(.query-form .el-form-item) {
	margin-bottom: 8px;
}

.management-card__content :deep(.query-form .filter-actions) {
	padding-top: 4px;
}

.management-card__content :deep(.configurable-table-container) {
	flex: 1;
	min-height: 0;
	border: 1px solid #e8eef5;
	border-radius: 8px;
	overflow: hidden;
	background: #fff;
}

.management-card__content :deep(.table-content) {
	min-height: 0;
}

.management-card__content :deep(.el-table th.el-table__cell) {
	// height: 46px;
	background: #fafbfd !important;
	font-size: 13px;
	font-weight: 400;
	color: #5f6b7a;
	border-right: 1px solid #eef2f7 !important;
}

.management-card__content :deep(.el-table td.el-table__cell) {
	padding: 11px 0;
	font-size: 13px;
	color: #5f6b7a;
	border-right: 1px solid #eef2f7 !important;
	border-bottom: 1px solid #eef2f7 !important;
}

.management-card__content :deep(.el-table--border .el-table__cell),
.management-card__content :deep(.el-table--border th.el-table__cell) {
	border-right: 1px solid #eef2f7 !important;
}

.management-card__content :deep(.el-table td.el-table__cell:last-child),
.management-card__content :deep(.el-table th.el-table__cell:last-child) {
	border-right: none !important;
}

.management-card__content :deep(.el-table__border-left-patch) {
	display: block !important;
	background: #eef2f7;
}

.management-card__content :deep(.el-table__inner-wrapper::before) {
	height: 1px !important;
	background-color: #eef2f7 !important;
}

.management-card__content :deep(.el-table__fixed-right::before),
.management-card__content :deep(.el-table__fixed::before) {
	background-color: #eef2f7 !important;
}

.management-card__content :deep(.pagination-container) {
	background: #fff;
	border-left: none;
	border-right: none;
	border-bottom: none;
	border-top: 1px solid #eef2f7;
	padding: 12px 14px;
}

.management-card__content :deep(.pagination-total) {
	font-size: 13px;
	color: #7b8794;
}

.management-card__content :deep(.el-pagination .btn-prev),
.management-card__content :deep(.el-pagination .btn-next) {
	min-width: 28px;
	height: 28px;
	padding: 0 8px;
	border: 1px solid #dbe3ec;
	color: #98a2b3;
}

.management-card__content :deep(.el-pagination .el-pager li) {
	min-width: 28px;
	height: 28px;
	line-height: 26px;
	border: 1px solid transparent;
	border-radius: 2px;
	font-size: 13px;
	color: #7b8794;
}

.management-card__content :deep(.el-pagination .el-pager li.is-active) {
	border-color: #409eff;
	color: #409eff;
	background: #fff;
}

.management-card__content :deep(.el-pagination .el-select .el-input__wrapper),
.management-card__content :deep(.el-pagination .el-input__wrapper) {
	box-shadow: 0 0 0 1px #dbe3ec inset;
	border-radius: 2px;
}

.rate-tag,
.status-tag {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	min-width: 46px;
	height: 22px;
	padding: 0 8px;
	border: 1px solid transparent;
	border-radius: 3px;
	font-size: 12px;
	font-weight: 500;
	line-height: 20px;
	box-sizing: border-box;
}

.rate-tag--success,
.rate-tag--normal,
.status-tag--normal {
	background: #f6ffed;
	border-color: #b7eb8f;
	color: #52c41a;
}

.rate-tag--warning,
.status-tag--warning {
	background: #fff7e6;
	border-color: #ffd591;
	color: #fa8c16;
}

.status-tag--offline {
	background: #fafafa;
	border-color: #d9d9d9;
	color: #8c8c8c;
}

.status-tag--danger {
	background: #fff1f0;
	border-color: #ffccc7;
	color: #f5222d;
}

.time-cell {
	display: inline-flex;
	flex-direction: column;
	align-items: center;
	line-height: 1.5;
	color: #4b5563;
}

.action-group {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	gap: 0;
}

.action-link {
	padding: 0;
	height: auto;
	font-size: 13px;
	font-weight: 500;
	color: #1677ff;
}

.action-link--bind {
	color: #1677ff;
}

.action-link--view {
	color: #1677ff;
}

.action-link--edit {
	color: #1677ff;
}

.action-link--delete {
	color: #ff4d4f;
}

.action-group :deep(.el-button + .el-button) {
	margin-left: 14px;
}

.action-group :deep(.el-button:hover),
.action-group :deep(.el-button:focus-visible) {
	opacity: 0.9;
}

:deep(.subitem-system-dialog) {
	max-width: calc(100vw - 32px);
	border-radius: 12px;
	overflow: hidden;
}

:deep(.subitem-system-dialog .el-dialog__header) {
	margin-right: 0;
	padding: 28px 32px 12px;
}

:deep(.subitem-system-dialog .el-dialog__title) {
	font-size: 20px;
	font-weight: 600;
	line-height: 28px;
	color: #1f2937;
}

:deep(.subitem-system-dialog .el-dialog__headerbtn) {
	top: 28px;
	right: 24px;
}

:deep(.subitem-system-dialog .el-dialog__body) {
	padding: 12px 32px 8px;
}

:deep(.subitem-system-dialog .el-dialog__footer) {
	padding: 20px 32px 28px;
}

.subitem-dialog-form__grid {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	column-gap: 44px;
	row-gap: 6px;
}

.subitem-dialog-form__item--full {
	grid-column: 1 / -1;
}

.subitem-dialog-form :deep(.el-form-item) {
	margin-bottom: 20px;
}

.subitem-dialog-form :deep(.el-form-item__label) {
	font-size: 15px;
	color: #374151;
	line-height: 46px;
}

.subitem-dialog-form :deep(.el-input),
.subitem-dialog-form :deep(.el-select),
.subitem-dialog-form :deep(.el-tree-select) {
	width: 100%;
}

.subitem-dialog-form :deep(.el-input__wrapper),
.subitem-dialog-form :deep(.el-select__wrapper),
.subitem-dialog-form :deep(.el-textarea__inner) {
	border-radius: 8px;
	box-shadow: 0 0 0 1px #d7deea inset;
}

.subitem-dialog-form :deep(.el-input__wrapper),
.subitem-dialog-form :deep(.el-select__wrapper) {
	min-height: 46px;
	padding-left: 14px;
}

.subitem-dialog-form__unit {
	display: inline-flex;
	align-items: center;
	padding-left: 8px;
	color: #8b95a7;
	font-size: 15px;
	white-space: nowrap;
}

.subitem-dialog-form :deep(.el-textarea__inner) {
	min-height: 144px;
	padding: 12px 14px;
}

.subitem-dialog-form :deep(.el-input__count) {
	color: #98a2b3;
}

.subitem-dialog__footer {
	display: flex;
	justify-content: flex-end;
	gap: 16px;
}

.subitem-dialog__cancel,
.subitem-dialog__confirm {
	min-width: 116px;
	height: 42px;
	border-radius: 8px;
	font-size: 16px;
}

.subitem-dialog__cancel {
	border-color: #d7deea;
	color: #4b5563;
}

:deep(.device-bind-dialog) {
	max-width: calc(100vw - 32px);
	border-radius: 12px;
	overflow: hidden;
}

:deep(.device-bind-dialog .el-dialog__header) {
	margin-right: 0;
	padding: 24px 28px 8px;
}

:deep(.device-bind-dialog .el-dialog__title) {
	font-size: 18px;
	font-weight: 600;
	color: #1f2937;
}

:deep(.device-bind-dialog .el-dialog__headerbtn) {
	top: 24px;
	right: 20px;
}

:deep(.device-bind-dialog .el-dialog__body) {
	padding: 8px 28px 0;
}

:deep(.device-bind-dialog .el-dialog__footer) {
	padding: 20px 28px 24px;
}

.device-bind-dialog__summary {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	gap: 36px;
	margin-bottom: 20px;
	font-size: 15px;
	color: #6b7280;
}

.device-bind-dialog__summary-item {
	display: inline-flex;
	align-items: center;
	gap: 8px;
}

.device-bind-dialog__summary-label {
	color: #4b5563;
}

.device-bind-dialog__summary-value {
	font-size: 16px;
	font-weight: 600;
	color: #1f2937;
}

.device-bind-dialog__content {
	display: flex;
	flex-direction: column;
	min-height: 640px;
}

.device-bind-dialog__content :deep(.configurable-table-with-form) {
	flex: 1;
	min-height: 0;
}

.device-bind-dialog__content :deep(.form-container) {
	margin-bottom: 12px;
}

.device-bind-dialog__content :deep(.query-form .el-form-item) {
	margin-bottom: 8px;
}

.device-bind-dialog__content :deep(.query-form .condition-value) {
	min-width: 220px;
}

.device-bind-dialog__content :deep(.query-form .filter-actions) {
	padding-top: 2px;
}

.device-bind-dialog__content :deep(.configurable-table-container) {
	flex: 1;
	min-height: 0;
	border: 1px solid #e8eef5;
	border-radius: 8px;
	overflow: hidden;
	background: #fff;
}

.device-bind-dialog__content :deep(.table-content) {
	height: 520px;
}

.device-bind-dialog__content :deep(.el-table th.el-table__cell) {
	height: 46px;
	background: #fafbfd !important;
	font-size: 13px;
	font-weight: 400;
	color: #5f6b7a;
	border-right: 1px solid #eef2f7 !important;
}

.device-bind-dialog__content :deep(.el-table td.el-table__cell) {
	padding: 11px 0;
	font-size: 13px;
	color: #5f6b7a;
	border-right: 1px solid #eef2f7 !important;
	border-bottom: 1px solid #eef2f7 !important;
}

.device-bind-dialog__content :deep(.el-table__inner-wrapper::before),
.device-bind-dialog__content :deep(.el-table__fixed-right::before),
.device-bind-dialog__content :deep(.el-table__fixed::before) {
	background-color: #eef2f7 !important;
}

.device-bind-dialog__content :deep(.pagination-container) {
	background: #fff;
	border-top: 1px solid #eef2f7;
	padding: 12px 14px;
}

.bind-subsystem-text {
	color: #4b5563;
}

.bind-subsystem-text--empty {
	color: #98a2b3;
}

.device-bind-dialog__footer {
	display: flex;
	justify-content: flex-end;
	gap: 16px;
}

.device-bind-dialog__cancel,
.device-bind-dialog__confirm {
	min-width: 120px;
	height: 42px;
	border-radius: 8px;
	font-size: 16px;
}

.device-bind-dialog__cancel {
	border-color: #d7deea;
	color: #4b5563;
}

@media screen and (max-width: 1280px) {
	.management-card__header {
		padding: 8px 0 10px;
	}

	.subitem-dialog-form__grid {
		column-gap: 24px;
	}

	.device-bind-dialog__content {
		min-height: 560px;
	}
}

@media screen and (max-width: 768px) {
	.subitem-system-page {
		padding-bottom: 64px;
	}

	.management-card__header {
		flex-direction: column;
		align-items: flex-start;
		gap: 12px;
	}

	.add-button {
		width: 100%;
		justify-content: center;
	}

	.filter-form {
		display: block;
	}

	.filter-form :deep(.el-form-item) {
		width: 100%;
		margin-right: 0;
	}

	.filter-form__actions {
		margin-left: 0;
	}

	.management-card__content {
		overflow-x: auto;
	}

	:deep(.subitem-system-dialog .el-dialog__header) {
		padding: 20px 20px 8px;
	}

	:deep(.subitem-system-dialog .el-dialog__body) {
		padding: 12px 20px 4px;
	}

	:deep(.subitem-system-dialog .el-dialog__footer) {
		padding: 16px 20px 20px;
	}

	:deep(.device-bind-dialog .el-dialog__header) {
		padding: 20px 20px 8px;
	}

	:deep(.device-bind-dialog .el-dialog__body) {
		padding: 12px 20px 0;
	}

	:deep(.device-bind-dialog .el-dialog__footer) {
		padding: 16px 20px 20px;
	}

	.subitem-dialog-form__grid {
		grid-template-columns: minmax(0, 1fr);
		row-gap: 0;
	}

	.subitem-dialog-form__item--full {
		grid-column: auto;
	}

	.subitem-dialog-form :deep(.el-form-item__label) {
		line-height: 1.5;
		padding-bottom: 8px;
	}

	.subitem-dialog__footer {
		flex-direction: column-reverse;
	}

	.subitem-dialog__cancel,
	.subitem-dialog__confirm {
		width: 100%;
	}

	.device-bind-dialog__summary {
		gap: 12px;
		margin-bottom: 16px;
	}

	.device-bind-dialog__content {
		min-height: 420px;
	}

	.device-bind-dialog__content :deep(.query-form .condition-value) {
		min-width: 0;
		width: 100%;
	}

	.device-bind-dialog__content :deep(.table-content) {
		height: 420px;
	}

	.device-bind-dialog__footer {
		flex-direction: column-reverse;
	}

	.device-bind-dialog__cancel,
	.device-bind-dialog__confirm {
		width: 100%;
	}
}
</style>