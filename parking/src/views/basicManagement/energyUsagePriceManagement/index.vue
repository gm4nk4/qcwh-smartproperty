<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<div class="energy-price-scrollbar">
				<div class="energy-price-page" :style="pageVars">
					<div ref="energyPriceShellRef" class="energy-price-shell" v-loading="pageLoading">
						<aside class="energy-price-sidebar">
							<section ref="sidebarSectionRef" class="price-section price-section--sidebar" :style="sidebarSectionStyle">
								<header class="price-section__header">
									<div class="section-title">
										<span class="section-title__bar"></span>
										<span>价格方案列表</span>
									</div>
									<el-button type="primary" class="header-button" @click="handleCreatePlan">新增方案</el-button>
								</header>

								<div v-if="hasPlans" class="plan-list">
									<div
										v-for="plan in pricePlans"
										:key="plan.id"
										class="plan-item"
										:class="{ 'is-active': activePlanId === plan.id }"
										tabindex="0"
										@click="handleSelectPlan(plan.id)"
										@keydown.enter.prevent="handleSelectPlan(plan.id)"
										@keydown.space.prevent="handleSelectPlan(plan.id)"
									>
										<div class="plan-item__main">
											<span class="plan-item__icon" aria-hidden="true">
												<span class="plan-item__icon-hole"></span>
											</span>
											<span class="plan-item__name">{{ plan.name }}</span>
										</div>

										<span v-if="plan.isDefault && !hasMultipleDefaultPlans" class="plan-item__default">默认</span>
										<span
											v-else
											class="plan-item__action"
											:class="{ 'is-visible': statusLoadingPlanId === plan.id }"
											@click.stop="handleSetDefault(plan.id)"
										>
											{{ statusLoadingPlanId === plan.id ? '设置中...' : plan.isDefault ? '校正默认' : '设为默认' }}
										</span>
									</div>
								</div>

								<div v-else class="sidebar-empty">
									<el-empty description="暂无价格方案" :image-size="90" />
								</div>
							</section>
						</aside>

						<section class="energy-price-content" v-loading="detailLoading">
							<section v-if="activePlan" class="price-section price-section--content" :style="contentSectionStyle">
								<div class="content-blocks">
									<section class="content-block">
										<header class="price-section__header content-block__header">
											<div class="section-title">
												<span class="section-title__bar"></span>
												<span>{{ activePlan.name }}</span>
											</div>
											<div class="content-block__actions">
												<el-button type="primary" class="header-button header-button--small" @click="handleEdit('plan')">编辑</el-button>
												<el-button
													v-if="canDeleteActivePlan"
													type="danger"
													plain
													class="action-button action-button--small"
													:loading="deletePlanLoading"
													@click="handleDeleteActivePlan"
												>
													删除
												</el-button>
											</div>
										</header>

										<div class="summary-table">
											<div v-for="(row, index) in activePlanSummaryRows" :key="`${activePlan.id}-${index}`" class="summary-row">
												<div class="summary-cell summary-cell--label">{{ row.leftLabel }}</div>
												<div class="summary-cell summary-cell--value">{{ row.leftValue }}</div>
												<div class="summary-cell summary-cell--label">{{ row.rightLabel }}</div>
												<div class="summary-cell summary-cell--value">{{ row.rightValue }}</div>
											</div>
										</div>
									</section>

									<section class="content-block">
										<header class="price-section__header content-block__header">
											<div class="section-title">
												<span class="section-title__bar"></span>
												<span>电力价格</span>
											</div>
											<el-button type="primary" class="header-button header-button--small" @click="handleEdit('electricity')">编辑</el-button>
										</header>

										<div class="table-wrap">
											<el-table :data="activePlan.electricityRows" class="price-table" border>
												<el-table-column prop="period" label="时段" min-width="160" show-overflow-tooltip />
												<el-table-column prop="startTime" label="开始时间" min-width="140" />
												<el-table-column prop="endTime" label="结束时间" min-width="140" />
												<el-table-column label="价格(元/kWh)" min-width="150">
													<template #default="{ row }">
														<span class="price-highlight">{{ formatPriceValue(row.price) }}</span>
													</template>
												</el-table-column>
												<el-table-column prop="description" label="说明" min-width="180" show-overflow-tooltip />
											</el-table>
										</div>
									</section>

									<section class="content-block">
										<header class="price-section__header content-block__header">
											<div class="section-title">
												<span class="section-title__bar"></span>
												<span>水价</span>
											</div>
											<el-button type="primary" class="header-button header-button--small" @click="handleEdit('water')">编辑</el-button>
										</header>

										<div class="table-wrap">
											<el-table :data="activePlan.waterRows" class="price-table" border>
												<el-table-column prop="level" label="时段" min-width="180" show-overflow-tooltip />
												<el-table-column prop="minUsage" label="用量下限(m³)" min-width="140" />
												<el-table-column prop="maxUsage" label="用量上限(m³)" min-width="140" />
												<el-table-column label="价格(元/m³)" min-width="150">
													<template #default="{ row }">
														<span class="price-highlight">{{ formatPriceValue(row.price) }}</span>
													</template>
												</el-table-column>
												<el-table-column prop="description" label="说明" min-width="180" show-overflow-tooltip />
											</el-table>
										</div>
									</section>

									<section class="content-block">
										<header class="price-section__header content-block__header">
											<div class="section-title">
												<span class="section-title__bar"></span>
												<span>燃气价格</span>
											</div>
											<el-button type="primary" class="header-button header-button--small" @click="handleEdit('gas')">编辑</el-button>
										</header>

										<div class="table-wrap">
											<el-table :data="activePlan.gasRows" class="price-table" border>
												<el-table-column prop="level" label="阶梯" min-width="180" show-overflow-tooltip />
												<el-table-column prop="minUsage" label="用量下限(m³)" min-width="160" />
												<el-table-column prop="maxUsage" label="用量上限(m³)" min-width="160" />
												<el-table-column label="价格(元/m³)" min-width="160">
													<template #default="{ row }">
														<span class="price-highlight">{{ formatPriceValue(row.price) }}</span>
													</template>
												</el-table-column>
												<el-table-column prop="description" label="说明" min-width="180" show-overflow-tooltip />
											</el-table>
										</div>
									</section>
								</div>
							</section>

							<div v-else class="content-empty">
								<el-empty description="暂无可展示的方案详情" :image-size="110" />
							</div>
						</section>
					</div>
				</div>
			</div>
		</div>

		<el-dialog
			v-model="planDialogVisible"
			:title="planDialogTitle"
			width="min(860px, 96vw)"
			append-to-body
			destroy-on-close
			:close-on-click-modal="false"
		>
			<el-form ref="planFormRef" :model="planForm" :rules="planFormRules" label-width="110px">
				<el-form-item label="方案名称" prop="name">
					<el-input v-model="planForm.name" maxlength="50" placeholder="请输入方案名称" clearable />
				</el-form-item>
				<el-form-item label="方案编码" prop="code">
					<el-input v-model="planForm.code" maxlength="50" placeholder="请输入方案编码" clearable />
				</el-form-item>
				<el-form-item label="生效日期" prop="effectiveDate">
					<el-date-picker
						v-model="planForm.effectiveDate"
						type="date"
						value-format="YYYY-MM-DD"
						format="YYYY-MM-DD"
						placeholder="选择日期"
						style="width: 100%"
					/>
				</el-form-item>
				<el-form-item label="失效日期">
					<el-date-picker
						v-model="planForm.expiryDate"
						type="date"
						value-format="YYYY-MM-DD"
						format="YYYY-MM-DD"
						placeholder="选择日期（可选）"
						clearable
						style="width: 100%"
					/>
				</el-form-item>
				<el-form-item label="备注">
					<el-input v-model="planForm.remark" type="textarea" :rows="4" maxlength="200" show-word-limit placeholder="请输入备注信息" />
				</el-form-item>
			</el-form>

			<template #footer>
				<el-button :disabled="planSubmitLoading" @click="planDialogVisible = false">取消</el-button>
				<el-button type="primary" :loading="planSubmitLoading" @click="handlePlanSubmit">确定</el-button>
			</template>
		</el-dialog>

		<el-dialog
			v-model="electricityDialogVisible"
			title="编辑电力价格"
			width="min(1280px, 96vw)"
			append-to-body
			destroy-on-close
			:close-on-click-modal="false"
		>
			<el-button type="primary" @click="handleAddElectricityRow">+添加时段</el-button>

			<el-table :data="electricityDialogRows" border style="width: 100%; margin-top: 16px" max-height="55vh">
				<el-table-column label="时段" min-width="160">
					<template #default="{ row }">
						<el-select v-model="row.period" placeholder="请选择时段" style="width: 100%">
							<el-option v-for="item in periodOptions" :key="item" :label="item" :value="item" />
						</el-select>
					</template>
				</el-table-column>
				<el-table-column label="开始时间" min-width="160">
					<template #default="{ row }">
						<el-time-picker v-model="row.startTime" format="HH:mm" value-format="HH:mm" placeholder="选择时间" style="width: 100%" />
					</template>
				</el-table-column>
				<el-table-column label="结束时间" min-width="160">
					<template #default="{ row }">
						<el-time-picker v-model="row.endTime" format="HH:mm" value-format="HH:mm" placeholder="选择时间" style="width: 100%" />
					</template>
				</el-table-column>
				<el-table-column label="价格(元/kWh)" min-width="180">
					<template #default="{ row }">
						<el-input-number v-model="row.price" :min="0" :precision="2" :step="0.1" style="width: 100%" />
					</template>
				</el-table-column>
				<el-table-column label="说明" min-width="220">
					<template #default="{ row }">
						<el-input v-model="row.description" maxlength="50" placeholder="请输入说明" clearable />
					</template>
				</el-table-column>
				<el-table-column label="操作" width="100" fixed="right">
					<template #default="{ $index }">
						<el-button link type="danger" @click="handleRemoveElectricityRow($index)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>

			<template #footer>
				<el-button :disabled="ruleSubmitLoading" @click="electricityDialogVisible = false">取消</el-button>
				<el-button type="primary" :loading="ruleSubmitLoading" @click="handleSaveElectricityRows">保存</el-button>
			</template>
		</el-dialog>

		<el-dialog v-model="waterDialogVisible" title="编辑水价" width="min(1280px, 96vw)" append-to-body destroy-on-close :close-on-click-modal="false">
			<el-button type="primary" @click="handleAddWaterRow">+添加阶梯</el-button>

			<el-table :data="waterDialogRows" border style="width: 100%; margin-top: 16px" max-height="55vh">
				<el-table-column label="阶梯" min-width="160">
					<template #default="{ row }">
						<el-input v-model="row.level" maxlength="20" placeholder="请输入阶梯名称" clearable />
					</template>
				</el-table-column>
				<el-table-column label="用量下限(m³)" min-width="180">
					<template #default="{ row }">
						<el-input-number v-model="row.minUsage" :min="0" :precision="0" :step="1" style="width: 100%" />
					</template>
				</el-table-column>
				<el-table-column label="用量上限(m³)" min-width="180">
					<template #default="{ row }">
						<el-input-number v-model="row.maxUsage" :min="0" :precision="0" :step="1" style="width: 100%" />
					</template>
				</el-table-column>
				<el-table-column label="价格(元/m³)" min-width="180">
					<template #default="{ row }">
						<el-input-number v-model="row.price" :min="0" :precision="2" :step="0.1" style="width: 100%" />
					</template>
				</el-table-column>
				<el-table-column label="说明" min-width="220">
					<template #default="{ row }">
						<el-input v-model="row.description" maxlength="50" placeholder="请输入说明" clearable />
					</template>
				</el-table-column>
				<el-table-column label="操作" width="100" fixed="right">
					<template #default="{ $index }">
						<el-button link type="danger" @click="handleRemoveWaterRow($index)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>

			<template #footer>
				<el-button :disabled="ruleSubmitLoading" @click="waterDialogVisible = false">取消</el-button>
				<el-button type="primary" :loading="ruleSubmitLoading" @click="handleSaveWaterRows">保存</el-button>
			</template>
		</el-dialog>

		<el-dialog
			v-model="gasDialogVisible"
			title="编辑燃气价格"
			width="min(1280px, 96vw)"
			append-to-body
			destroy-on-close
			:close-on-click-modal="false"
		>
			<el-button type="primary" @click="handleAddGasRow">+添加阶梯</el-button>

			<el-table :data="gasDialogRows" border style="width: 100%; margin-top: 16px" max-height="55vh">
				<el-table-column label="阶梯" min-width="160">
					<template #default="{ row }">
						<el-input v-model="row.level" maxlength="20" placeholder="请输入阶梯名称" clearable />
					</template>
				</el-table-column>
				<el-table-column label="用量下限(m³)" min-width="180">
					<template #default="{ row }">
						<el-input-number v-model="row.minUsage" :min="0" :precision="0" :step="1" style="width: 100%" />
					</template>
				</el-table-column>
				<el-table-column label="用量上限(m³)" min-width="180">
					<template #default="{ row }">
						<el-input-number v-model="row.maxUsage" :min="0" :precision="0" :step="1" style="width: 100%" />
					</template>
				</el-table-column>
				<el-table-column label="价格(元/m³)" min-width="180">
					<template #default="{ row }">
						<el-input-number v-model="row.price" :min="0" :precision="2" :step="0.1" style="width: 100%" />
					</template>
				</el-table-column>
				<el-table-column label="说明" min-width="220">
					<template #default="{ row }">
						<el-input v-model="row.description" maxlength="50" placeholder="请输入说明" clearable />
					</template>
				</el-table-column>
				<el-table-column label="操作" width="100" fixed="right">
					<template #default="{ $index }">
						<el-button link type="danger" @click="handleRemoveGasRow($index)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>

			<template #footer>
				<el-button :disabled="ruleSubmitLoading" @click="gasDialogVisible = false">取消</el-button>
				<el-button type="primary" :loading="ruleSubmitLoading" @click="handleSaveGasRows">保存</el-button>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="energyUsagePriceManagement">
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useThemeConfig } from '/@/stores/themeConfig';
import { useChangeColor } from '/@/utils/theme';
import {
	changeEnergyPricePlanStatus,
	deleteEnergyPricePlan,
	getEnergyPricePlanDetail,
	getEnergyPricePlanList,
	saveEnergyPricePlan,
	type EnergyPricePlanRecord,
	type SaveEnergyPricePlanParams,
} from '/@/api/basicManagement/energyUsagePriceManagement';

type EditableSection = 'plan' | 'electricity' | 'water' | 'gas';
type PlanDialogMode = 'create' | 'edit';
type PlanId = number | string;

interface SummaryRow {
	leftLabel: string;
	leftValue: string;
	rightLabel: string;
	rightValue: string;
}

interface PricePlanListItem {
	id: PlanId;
	name: string;
	status: string;
	isDefault: boolean;
}

interface ElectricityPriceRow {
	id: string;
	period: string;
	startTime: string;
	endTime: string;
	price: number | null;
	description: string;
}

interface LadderPriceRow {
	id: string;
	level: string;
	minUsage: number | null;
	maxUsage: number | null;
	price: number | null;
	description: string;
}

interface PricePlan {
	id: PlanId;
	name: string;
	code: string;
	effectiveDate: string;
	expiryDate: string;
	createdTime: string;
	remark: string;
	status: string;
	isDefault: boolean;
	electricityRows: ElectricityPriceRow[];
	waterRows: LadderPriceRow[];
	gasRows: LadderPriceRow[];
}

interface PlanFormModel {
	name: string;
	code: string;
	effectiveDate: string;
	expiryDate: string;
	remark: string;
}

interface LoadPricePlanOptions {
	preferredPlanId?: PlanId | null;
	preserveCurrent?: boolean;
	pickFirst?: boolean;
}

const ENABLED_STATUS = 'enable';
const DISABLED_STATUS = 'disabled';
const periodOptions = ['峰时段', '平时段', '谷时段', '尖时段'];
const chineseNumbers = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
const periodLabelToCodeMap: Record<string, string> = {
	峰时段: 'PEAK',
	平时段: 'FLAT',
	谷时段: 'VALLEY',
	尖时段: 'TIP',
};
const periodCodeToLabelMap: Record<string, string> = {
	PEAK: '峰时段',
	FLAT: '平时段',
	VALLEY: '谷时段',
	TIP: '尖时段',
	SHARP: '尖时段',
};

const createId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const formatPriceValue = (value: number | null | undefined) => {
	if (value === null || value === undefined || Number.isNaN(Number(value))) return '--';
	return `¥${Number(value)
		.toFixed(2)
		.replace(/\.?0+$/, '')}`;
};

const formatDateTimeValue = (value?: string | null) => {
	if (!value) return '--';
	return `${value}`.replace('T', ' ').replace(/\.\d+$/, '');
};

const normalizeStatus = (value?: string | null) => `${value ?? ''}`.trim().toLowerCase();
const isEnabledStatus = (value?: string | null) => ['enable', 'enabled', '1', 'true'].includes(normalizeStatus(value));
const normalizeText = (value?: string | null) => `${value ?? ''}`.trim();
const normalizeNumber = (value: number | string | null | undefined) => {
	if (value === '' || value === null || value === undefined) return null;
	const numberValue = Number(value);
	return Number.isNaN(numberValue) ? null : numberValue;
};
const normalizePeriodLabel = (value?: string | null) => {
	const text = normalizeText(value);
	if (!text) return '峰时段';
	return periodCodeToLabelMap[text.toUpperCase()] || text;
};
const normalizePeriodCode = (value?: string | null) => {
	const text = normalizeText(value);
	if (!text) return 'PEAK';
	return periodLabelToCodeMap[text] || text.toUpperCase();
};

const getLadderLabel = (index: number) => {
	const label = chineseNumbers[index - 1];
	return label ? `第${label}阶梯` : `第${index}阶梯`;
};

const createElectricityRow = (payload: Partial<ElectricityPriceRow> = {}): ElectricityPriceRow => ({
	id: payload.id || createId('electricity'),
	period: payload.period || '峰时段',
	startTime: payload.startTime || '',
	endTime: payload.endTime || '',
	price: payload.price ?? 0,
	description: payload.description || '',
});

const createLadderRow = (index: number, payload: Partial<LadderPriceRow> = {}): LadderPriceRow => ({
	id: payload.id || createId('ladder'),
	level: payload.level || getLadderLabel(index),
	minUsage: payload.minUsage ?? 0,
	maxUsage: payload.maxUsage ?? 0,
	price: payload.price ?? 0,
	description: payload.description || '',
});

const cloneElectricityRows = (rows: ElectricityPriceRow[]) => rows.map((row) => ({ ...row }));
const cloneLadderRows = (rows: LadderPriceRow[]) => rows.map((row) => ({ ...row }));

const createEmptyPlanForm = (): PlanFormModel => ({
	name: '',
	code: '',
	effectiveDate: '',
	expiryDate: '',
	remark: '',
});

const mapPricePlanListItem = (record: EnergyPricePlanRecord): PricePlanListItem => ({
	id: record.id ?? createId('plan'),
	name: normalizeText(record.planName) || '--',
	status: normalizeStatus(record.status) || DISABLED_STATUS,
	isDefault: isEnabledStatus(record.status),
});

const mapPricePlanDetail = (record: EnergyPricePlanRecord & Record<string, any>): PricePlan => {
	const basicInfo = record?.basicInfo || record;
	const electricityRules = Array.isArray(record?.electricityPriceConfig?.rules) ? record.electricityPriceConfig.rules : basicInfo.electricityPrices;
	const waterRules = Array.isArray(record?.waterPriceConfig?.rules) ? record.waterPriceConfig.rules : basicInfo.waterPrices;
	const gasRules = Array.isArray(record?.gasPriceConfig?.rules) ? record.gasPriceConfig.rules : basicInfo.gasPrices;

	return {
		id: basicInfo.id ?? createId('plan'),
		name: normalizeText(basicInfo.planName),
		code: normalizeText(basicInfo.planCode),
		effectiveDate: normalizeText(basicInfo.effectiveDate),
		expiryDate: normalizeText(basicInfo.expiryDate),
		createdTime: formatDateTimeValue(basicInfo.createTime || basicInfo.createdTime),
		remark: normalizeText(basicInfo.remark),
		status: normalizeStatus(basicInfo.status) || DISABLED_STATUS,
		isDefault: isEnabledStatus(basicInfo.status),
		electricityRows: Array.isArray(electricityRules)
			? electricityRules.map((item, index) =>
				createElectricityRow({
					id: `electricity-${basicInfo.id || 'plan'}-${index}`,
					period: normalizePeriodLabel(item.periodTypeName || item.periodType || item.period),
					startTime: normalizeText(item.startTime),
					endTime: normalizeText(item.endTime),
					price: normalizeNumber(item.price),
					description: normalizeText(item.description),
				})
			)
			: [],
		waterRows: Array.isArray(waterRules)
			? waterRules.map((item, index) =>
				createLadderRow(index + 1, {
					id: `water-${basicInfo.id || 'plan'}-${index}`,
					level: normalizeText(item.tierName) || getLadderLabel(index + 1),
					minUsage: normalizeNumber(item.minUsage),
					maxUsage: normalizeNumber(item.maxUsage),
					price: normalizeNumber(item.price),
					description: normalizeText(item.description),
				})
			)
			: [],
		gasRows: Array.isArray(gasRules)
			? gasRules.map((item, index) =>
				createLadderRow(index + 1, {
					id: `gas-${basicInfo.id || 'plan'}-${index}`,
					level: normalizeText(item.tierName) || getLadderLabel(index + 1),
					minUsage: normalizeNumber(item.minUsage),
					maxUsage: normalizeNumber(item.maxUsage),
					price: normalizeNumber(item.price),
					description: normalizeText(item.description),
				})
			)
			: [],
	};
};

const buildBasePlanPayload = (plan: Pick<PricePlan, 'id' | 'name' | 'code' | 'effectiveDate' | 'expiryDate' | 'remark'>): SaveEnergyPricePlanParams => ({
	id: plan.id === '' ? null : plan.id ?? null,
	planName: normalizeText(plan.name),
	planCode: normalizeText(plan.code),
	effectiveDate: plan.effectiveDate,
	expiryDate: normalizeText(plan.expiryDate) || null,
	remark: normalizeText(plan.remark) || null,
});

const buildSavePayload = (plan: PricePlan): SaveEnergyPricePlanParams => ({
	...buildBasePlanPayload(plan),
	status: plan.status || (plan.isDefault ? ENABLED_STATUS : DISABLED_STATUS),
	electricityPrices: plan.electricityRows.map((row, index) => ({
		periodType: normalizePeriodCode(row.period),
		startTime: normalizeText(row.startTime),
		endTime: normalizeText(row.endTime),
		price: normalizeNumber(row.price),
		description: normalizeText(row.description) || null,
		sortNo: index + 1,
	})),
	waterPrices: plan.waterRows.map((row, index) => ({
		tierNo: index + 1,
		tierName: normalizeText(row.level),
		minUsage: normalizeNumber(row.minUsage),
		maxUsage: normalizeNumber(row.maxUsage),
		price: normalizeNumber(row.price),
		description: normalizeText(row.description) || null,
		sortNo: index + 1,
	})),
	gasPrices: plan.gasRows.map((row, index) => ({
		tierNo: index + 1,
		tierName: normalizeText(row.level),
		minUsage: normalizeNumber(row.minUsage),
		maxUsage: normalizeNumber(row.maxUsage),
		price: normalizeNumber(row.price),
		description: normalizeText(row.description) || null,
		sortNo: index + 1,
	})),
});

const getErrorMessage = (error: unknown, fallback: string) => {
	const maybeError = error as { msg?: string; message?: string } | undefined;
	return maybeError?.msg || maybeError?.message || fallback;
};

const resolveTargetPlanId = (plans: PricePlanListItem[], options: LoadPricePlanOptions = {}) => {
	if (!plans.length) return '';
	if (options.pickFirst) return plans[0]?.id ?? '';

	if (options.preferredPlanId !== undefined && options.preferredPlanId !== null) {
		const target = plans.find((plan) => String(plan.id) === String(options.preferredPlanId));
		if (target) return target.id;
	}

	if (options.preserveCurrent !== false && activePlanId.value !== '') {
		const current = plans.find((plan) => String(plan.id) === String(activePlanId.value));
		if (current) return current.id;
	}

	return plans.find((plan) => plan.isDefault)?.id ?? plans[0]?.id ?? '';
};

const syncPlanListItem = (plan: PricePlan) => {
	const target = pricePlans.value.find((item) => String(item.id) === String(plan.id));
	if (!target) return;
	target.name = plan.name || '--';
	target.status = plan.status;
	target.isDefault = plan.isDefault;
};

const message = useMessage();
const messageBox = useMessageBox();
const pricePlans = ref<PricePlanListItem[]>([]);
const activePlanId = ref<PlanId | ''>('');
const activePlan = ref<PricePlan | null>(null);
const pageLoading = ref(false);
const detailLoading = ref(false);
const planSubmitLoading = ref(false);
const ruleSubmitLoading = ref(false);
const deletePlanLoading = ref(false);
const statusLoadingPlanId = ref<PlanId | ''>('');
const footerReservedHeight = ref(40);
const hasPlans = computed(() => pricePlans.value.length > 0);
const defaultPlanCount = computed(() => pricePlans.value.filter((plan) => plan.isDefault).length);
const hasMultipleDefaultPlans = computed(() => defaultPlanCount.value > 1);
const canDeleteActivePlan = computed(() => Boolean(activePlan.value) && !isEnabledStatus(activePlan.value?.status));
const activePlanSummaryRows = computed<SummaryRow[]>(() => {
	if (!activePlan.value) return [];
	return [
		{ leftLabel: '方案名称', leftValue: activePlan.value.name || '--', rightLabel: '方案编号', rightValue: activePlan.value.code || '--' },
		{
			leftLabel: '生效日期',
			leftValue: activePlan.value.effectiveDate || '--',
			rightLabel: '失效日期',
			rightValue: activePlan.value.expiryDate || '长期有效',
		},
		{ leftLabel: '创建时间', leftValue: activePlan.value.createdTime || '--', rightLabel: '备注', rightValue: activePlan.value.remark || '--' },
	];
});

const storesThemeConfig = useThemeConfig();
const { getLightColor, hexToRgb } = useChangeColor();

const currentTheme = computed(() => storesThemeConfig.themeConfig.currentTheme);
const primaryColor = computed(() => storesThemeConfig.themeConfig.primary || currentTheme.value?.color?.primary?.normal || '#1677ff');
const gradientStart = computed(() => currentTheme.value?.color?.gradient?.start || getLightColor(primaryColor.value, 0.15));
const gradientEnd = computed(() => currentTheme.value?.color?.gradient?.end || primaryColor.value);

const pageVars = computed(() => {
	const rgb = hexToRgb(primaryColor.value);

	return {
		'--energy-price-primary': primaryColor.value,
		'--energy-price-primary-rgb': Array.isArray(rgb) ? rgb.join(',') : '22, 119, 255',
		'--energy-price-gradient-start': gradientStart.value,
		'--energy-price-gradient-end': gradientEnd.value,
		'--energy-price-footer-space': `${footerReservedHeight.value}px`,
	};
});

const planDialogVisible = ref(false);
const planDialogMode = ref<PlanDialogMode>('create');
const planDialogTitle = computed(() => (planDialogMode.value === 'create' ? '新增价格方案' : '编辑价格方案'));
const editingPlanId = ref<PlanId | ''>('');
const planFormRef = ref<FormInstance>();
const energyPriceShellRef = ref<HTMLElement>();
const sidebarSectionRef = ref<HTMLElement>();
const sidebarSectionHeight = ref('');
const planForm = reactive<PlanFormModel>(createEmptyPlanForm());
const planFormRules: FormRules<PlanFormModel> = {
	name: [{ required: true, message: '请输入方案名称', trigger: 'blur' }],
	code: [{ required: true, message: '请输入方案编码', trigger: 'blur' }],
	effectiveDate: [{ required: true, message: '请选择生效日期', trigger: 'change' }],
};
const sidebarSectionStyle = computed(() =>
	sidebarSectionHeight.value
		? {
				height: sidebarSectionHeight.value,
				maxHeight: sidebarSectionHeight.value,
			}
		: {}
);
const contentSectionStyle = computed(() =>
	sidebarSectionHeight.value
		? {
				height: sidebarSectionHeight.value,
				maxHeight: sidebarSectionHeight.value,
			}
		: {}
);

let sidebarSectionResizeObserver: ResizeObserver | null = null;

const electricityDialogVisible = ref(false);
const electricityDialogRows = ref<ElectricityPriceRow[]>([]);

const waterDialogVisible = ref(false);
const waterDialogRows = ref<LadderPriceRow[]>([]);

const gasDialogVisible = ref(false);
const gasDialogRows = ref<LadderPriceRow[]>([]);

const getLayoutMainScrollWrap = () =>
	sidebarSectionRef.value?.closest('.layout-main')?.querySelector('.el-scrollbar__wrap.layout-main-scroll') as HTMLElement | undefined;
const getLayoutFooter = () => sidebarSectionRef.value?.closest('.layout-main')?.querySelector('.layout-footer') as HTMLElement | null;

const updateFooterReservedHeight = () => {
	const footerEl = getLayoutFooter();
	if (!footerEl) {
		footerReservedHeight.value = 0;
		return;
	}

	const footerHeight = Math.ceil(footerEl.getBoundingClientRect().height || footerEl.offsetHeight || 0);
	footerReservedHeight.value = footerHeight > 0 ? footerHeight + 8 : 40;
};

const updateSidebarSectionHeight = () => {
	if (typeof window === 'undefined') return;
	if (window.innerWidth <= 1200) {
		sidebarSectionHeight.value = '';
		return;
	}

	const sidebarSectionEl = sidebarSectionRef.value;
	if (!sidebarSectionEl) return;

	const shellRect = energyPriceShellRef.value?.getBoundingClientRect();
	const wrapEl = getLayoutMainScrollWrap();
	const rect = sidebarSectionEl.getBoundingClientRect();
	const wrapRect = wrapEl?.getBoundingClientRect();
	const top = Math.floor(rect.top);
	const bottom = shellRect?.bottom ?? wrapRect?.bottom ?? window.innerHeight ?? document.documentElement.clientHeight ?? 0;
	const nextHeight = Math.max(360, Math.floor(bottom - top));
	sidebarSectionHeight.value = `${nextHeight}px`;
};

const scheduleSidebarSectionHeightUpdate = () => {
	if (typeof window === 'undefined') return;
	window.requestAnimationFrame(() => {
		updateFooterReservedHeight();
		updateSidebarSectionHeight();
	});
};

const getActivePlanOrWarn = () => {
	if (!activePlan.value) {
		message.warning('当前没有可编辑的价格方案。');
		return null;
	}
	return activePlan.value;
};

const resetPlanForm = () => {
	Object.assign(planForm, createEmptyPlanForm());
};

const loadPlanDetail = async (planId: PlanId, silentError = false) => {
	const requestPlanId = String(planId);
	detailLoading.value = true;

	try {
		const response = await getEnergyPricePlanDetail(planId);
		if (String(activePlanId.value) !== requestPlanId) return;
		const normalizedPlan = mapPricePlanDetail((response.data || {}) as EnergyPricePlanRecord & Record<string, any>);
		activePlan.value = normalizedPlan;
		syncPlanListItem(normalizedPlan);
	} catch (error) {
		if (String(activePlanId.value) !== requestPlanId) return;
		activePlan.value = null;
		if (!silentError) {
			message.error(getErrorMessage(error, '价格方案详情加载失败'));
		}
	} finally {
		if (String(activePlanId.value) === requestPlanId) {
			detailLoading.value = false;
		}
	}
};

const loadPricePlans = async (options: LoadPricePlanOptions = {}) => {
	pageLoading.value = true;

	try {
		const response = await getEnergyPricePlanList();
		const records = Array.isArray(response.data) ? response.data : Array.isArray((response.data as { list?: EnergyPricePlanRecord[] })?.list) ? response.data.list || [] : [];
		pricePlans.value = records.map(mapPricePlanListItem);
		const targetPlanId = resolveTargetPlanId(pricePlans.value, options);
		activePlanId.value = targetPlanId;

		if (!targetPlanId) {
			activePlan.value = null;
			return;
		}

		await loadPlanDetail(targetPlanId);
	} catch (error) {
		pricePlans.value = [];
		activePlanId.value = '';
		activePlan.value = null;
		message.error(getErrorMessage(error, '价格方案加载失败'));
	} finally {
		pageLoading.value = false;
	}
};

const openPlanDialog = (mode: PlanDialogMode) => {
	if (mode === 'edit') {
		const currentPlan = getActivePlanOrWarn();
		if (!currentPlan) return;
		editingPlanId.value = currentPlan.id;
		Object.assign(planForm, {
			name: currentPlan.name,
			code: currentPlan.code,
			effectiveDate: currentPlan.effectiveDate,
			expiryDate: currentPlan.expiryDate,
			remark: currentPlan.remark,
		});
	} else {
		editingPlanId.value = '';
		resetPlanForm();
	}

	planDialogMode.value = mode;
	planDialogVisible.value = true;
	nextTick(() => {
		planFormRef.value?.clearValidate();
	});
};

const handleSelectPlan = async (planId: PlanId) => {
	if (String(activePlanId.value) === String(planId) && activePlan.value) return;
	activePlanId.value = planId;
	await loadPlanDetail(planId);
};

const handleCreatePlan = () => {
	openPlanDialog('create');
};

const handleDeleteActivePlan = async () => {
	const currentPlan = getActivePlanOrWarn();
	if (!currentPlan) return;
	if (isEnabledStatus(currentPlan.status)) {
		message.warning('启用中的方案不允许删除。');
		return;
	}

	try {
		await messageBox.confirm(`确认删除“${currentPlan.name || '当前方案'}”吗？`);
	} catch {
		return;
	}

	deletePlanLoading.value = true;
	try {
		await deleteEnergyPricePlan([currentPlan.id]);
		await loadPricePlans({ preserveCurrent: false });
		message.success('删除成功');
	} catch (error) {
		message.error(getErrorMessage(error, '删除失败'));
	} finally {
		deletePlanLoading.value = false;
	}
};

const openElectricityDialog = () => {
	const currentPlan = getActivePlanOrWarn();
	if (!currentPlan) return;
	electricityDialogRows.value = cloneElectricityRows(currentPlan.electricityRows);
	electricityDialogVisible.value = true;
};

const openWaterDialog = () => {
	const currentPlan = getActivePlanOrWarn();
	if (!currentPlan) return;
	waterDialogRows.value = cloneLadderRows(currentPlan.waterRows);
	waterDialogVisible.value = true;
};

const openGasDialog = () => {
	const currentPlan = getActivePlanOrWarn();
	if (!currentPlan) return;
	gasDialogRows.value = cloneLadderRows(currentPlan.gasRows);
	gasDialogVisible.value = true;
};

const handleEdit = (section: EditableSection) => {
	if (section === 'plan') {
		openPlanDialog('edit');
		return;
	}
	if (section === 'electricity') {
		openElectricityDialog();
		return;
	}
	if (section === 'water') {
		openWaterDialog();
		return;
	}
	openGasDialog();
};

const handleSetDefault = async (planId: PlanId) => {
	const targetPlan = pricePlans.value.find((plan) => String(plan.id) === String(planId));
	if (!targetPlan) return;
	if (targetPlan.isDefault && !hasMultipleDefaultPlans.value) {
		message.info('当前方案已是默认方案。');
		return;
	}

	statusLoadingPlanId.value = planId;
	try {
		await changeEnergyPricePlanStatus({ id: planId, status: ENABLED_STATUS });
		await loadPricePlans({ preferredPlanId: planId, preserveCurrent: false });
		message.success(`已将“${targetPlan.name}”设为默认方案。`);
	} catch (error) {
		message.error(getErrorMessage(error, '设置默认方案失败'));
	} finally {
		statusLoadingPlanId.value = '';
	}
};

const handlePlanSubmit = async () => {
	if (!planFormRef.value) return;

	try {
		await planFormRef.value.validate();
	} catch {
		return;
	}

	const planName = normalizeText(planForm.name);
	const planCode = normalizeText(planForm.code);
	if (!planName || !planCode) {
		message.warning('方案名称和方案编码不能为空。');
		return;
	}
	if (planForm.expiryDate && planForm.expiryDate < planForm.effectiveDate) {
		message.warning('失效日期不能早于生效日期。');
		return;
	}

	const currentPlan = activePlan.value;
	const isCreate = planDialogMode.value === 'create';
	const savePayload = isCreate
		? buildBasePlanPayload({
				id: '',
				name: planName,
				code: planCode,
				effectiveDate: planForm.effectiveDate,
				expiryDate: planForm.expiryDate,
				remark: normalizeText(planForm.remark),
			})
		: buildSavePayload({
				id: editingPlanId.value,
				name: planName,
				code: planCode,
				effectiveDate: planForm.effectiveDate,
				expiryDate: planForm.expiryDate,
				createdTime: currentPlan?.createdTime || '--',
				remark: normalizeText(planForm.remark),
				status: currentPlan?.status || DISABLED_STATUS,
				isDefault: currentPlan?.isDefault || false,
				electricityRows: cloneElectricityRows(currentPlan?.electricityRows || []),
				waterRows: cloneLadderRows(currentPlan?.waterRows || []),
				gasRows: cloneLadderRows(currentPlan?.gasRows || []),
			});

	planSubmitLoading.value = true;
	try {
		await saveEnergyPricePlan(savePayload);
		planDialogVisible.value = false;
		await loadPricePlans(isCreate ? { pickFirst: true, preserveCurrent: false } : { preferredPlanId: editingPlanId.value, preserveCurrent: false });
		message.success(isCreate ? '新增成功' : '编辑成功');
	} catch (error) {
		message.error(getErrorMessage(error, isCreate ? '新增失败' : '编辑失败'));
	} finally {
		planSubmitLoading.value = false;
	}
};

const validateElectricityRows = (rows: ElectricityPriceRow[]) => {
	if (!rows.length) {
		message.warning('请至少保留一个电价时段。');
		return false;
	}

	for (let index = 0; index < rows.length; index += 1) {
		const row = rows[index];
		const rowText = `第 ${index + 1} 行`;
		if (!row.period) {
			message.warning(`${rowText}请选择时段。`);
			return false;
		}
		if (!row.startTime) {
			message.warning(`${rowText}请选择开始时间。`);
			return false;
		}
		if (!row.endTime) {
			message.warning(`${rowText}请选择结束时间。`);
			return false;
		}
		if (row.startTime === row.endTime) {
			message.warning(`${rowText}开始时间和结束时间不能相同。`);
			return false;
		}
		if (row.price === null || row.price === undefined || Number.isNaN(Number(row.price))) {
			message.warning(`${rowText}请输入价格。`);
			return false;
		}
	}

	return true;
};

const validateLadderRows = (rows: LadderPriceRow[], typeLabel: string) => {
	if (!rows.length) {
		message.warning(`请至少保留一个${typeLabel}阶梯。`);
		return false;
	}

	for (let index = 0; index < rows.length; index += 1) {
		const row = rows[index];
		const rowText = `第 ${index + 1} 行`;
		if (!normalizeText(row.level)) {
			message.warning(`${rowText}请输入阶梯名称。`);
			return false;
		}
		if (row.minUsage === null || row.minUsage === undefined || Number.isNaN(Number(row.minUsage))) {
			message.warning(`${rowText}请输入用量下限。`);
			return false;
		}
		if (row.maxUsage === null || row.maxUsage === undefined || Number.isNaN(Number(row.maxUsage))) {
			message.warning(`${rowText}请输入用量上限。`);
			return false;
		}
		if (Number(row.maxUsage) < Number(row.minUsage)) {
			message.warning(`${rowText}用量上限不能小于用量下限。`);
			return false;
		}
		if (row.price === null || row.price === undefined || Number.isNaN(Number(row.price))) {
			message.warning(`${rowText}请输入价格。`);
			return false;
		}
	}

	return true;
};

const saveActivePlanRules = async (payload: Partial<Pick<PricePlan, 'electricityRows' | 'waterRows' | 'gasRows'>>, successMessage: string, errorMessage: string) => {
	const currentPlan = getActivePlanOrWarn();
	if (!currentPlan) return false;

	const savePayload = buildSavePayload({
		...currentPlan,
		electricityRows: payload.electricityRows ? cloneElectricityRows(payload.electricityRows) : cloneElectricityRows(currentPlan.electricityRows),
		waterRows: payload.waterRows ? cloneLadderRows(payload.waterRows) : cloneLadderRows(currentPlan.waterRows),
		gasRows: payload.gasRows ? cloneLadderRows(payload.gasRows) : cloneLadderRows(currentPlan.gasRows),
	});

	ruleSubmitLoading.value = true;
	try {
		await saveEnergyPricePlan(savePayload);
		await loadPricePlans({ preferredPlanId: currentPlan.id, preserveCurrent: false });
		message.success(successMessage);
		return true;
	} catch (error) {
		message.error(getErrorMessage(error, errorMessage));
		return false;
	} finally {
		ruleSubmitLoading.value = false;
	}
};

const handleAddElectricityRow = () => {
	electricityDialogRows.value.push(createElectricityRow());
};

const handleRemoveElectricityRow = (index: number) => {
	electricityDialogRows.value.splice(index, 1);
};

const handleSaveElectricityRows = async () => {
	if (!validateElectricityRows(electricityDialogRows.value)) return;
	const saved = await saveActivePlanRules({ electricityRows: electricityDialogRows.value }, '电力价格已更新', '电力价格保存失败');
	if (saved) {
		electricityDialogVisible.value = false;
	}
};

const handleAddWaterRow = () => {
	waterDialogRows.value.push(createLadderRow(waterDialogRows.value.length + 1));
};

const handleRemoveWaterRow = (index: number) => {
	waterDialogRows.value.splice(index, 1);
};

const handleSaveWaterRows = async () => {
	if (!validateLadderRows(waterDialogRows.value, '水价')) return;
	const saved = await saveActivePlanRules({ waterRows: waterDialogRows.value }, '水价已更新', '水价保存失败');
	if (saved) {
		waterDialogVisible.value = false;
	}
};

const handleAddGasRow = () => {
	gasDialogRows.value.push(createLadderRow(gasDialogRows.value.length + 1));
};

const handleRemoveGasRow = (index: number) => {
	gasDialogRows.value.splice(index, 1);
};

const handleSaveGasRows = async () => {
	if (!validateLadderRows(gasDialogRows.value, '燃气价格')) return;
	const saved = await saveActivePlanRules({ gasRows: gasDialogRows.value }, '燃气价格已更新', '燃气价格保存失败');
	if (saved) {
		gasDialogVisible.value = false;
	}
};

onMounted(() => {
	nextTick(() => {
		scheduleSidebarSectionHeightUpdate();
		if (typeof window !== 'undefined') {
			window.addEventListener('resize', scheduleSidebarSectionHeightUpdate);
		}
		if (typeof ResizeObserver !== 'undefined' && energyPriceShellRef.value) {
			sidebarSectionResizeObserver = new ResizeObserver(() => {
				scheduleSidebarSectionHeightUpdate();
			});
			sidebarSectionResizeObserver.observe(energyPriceShellRef.value);
		}
	});
	loadPricePlans();
});

onBeforeUnmount(() => {
	if (typeof window !== 'undefined') {
		window.removeEventListener('resize', scheduleSidebarSectionHeightUpdate);
	}
	sidebarSectionResizeObserver?.disconnect();
	sidebarSectionResizeObserver = null;
});
</script>

<style scoped lang="scss">
.layout-padding {
	position: absolute !important;
	top: 0;
	right: 0;
	bottom: var(--energy-price-footer-space, 40px);
	left: 0;
	height: auto !important;
	min-height: 0 !important;
	overflow: hidden !important;
}

.layout-padding-auto.layout-padding-view {
	padding: 0 !important;
	height: 100% !important;
	min-height: 0 !important;
}

.energy-price-scrollbar {
	height: 100%;
	min-height: 0;
	padding: 0;
	overflow: hidden;
}

.energy-price-page {
	box-sizing: border-box;
	height: 100%;
	min-height: 0;
	padding: 8px 0 10px;
	display: flex;
	flex-direction: column;
}

.energy-price-shell {
	flex: 1;
	display: grid;
	grid-template-columns: 292px minmax(0, 1fr);
	height: 100%;
	gap: 14px;
	align-items: stretch;
	background: transparent;
}

.energy-price-sidebar,
.energy-price-content {
	height: 100%;
	min-width: 0;
	min-height: 0;
}

.energy-price-sidebar {
	align-self: stretch;
	position: relative;
	top: auto;
}

.energy-price-content {
	display: flex;
	flex-direction: column;
	gap: 14px;
}

.price-section {
	padding: 12px 14px 14px;
	border: 1px solid #e9eef5;
	border-radius: 14px;
	background: #ffffff;
	box-shadow: 0 6px 16px rgba(15, 23, 42, 0.03);
}

.price-section--sidebar {
	display: flex;
	flex-direction: column;
	min-height: 0;
	overflow: hidden;
	z-index: 2;
}

.price-section--content {
	display: flex;
	flex-direction: column;
	min-height: 0;
	padding: 16px 18px 18px;
	overflow: hidden;
}

.content-blocks {
	flex: 1;
	min-height: 0;
	overflow: auto;
	padding-right: 4px;
}

.content-block + .content-block {
	margin-top: 18px;
	padding-top: 18px;
	border-top: 1px solid #edf1f7;
}

.content-block__header {
	margin-bottom: 14px;
}

.content-block__actions {
	display: inline-flex;
	align-items: center;
	gap: 12px;
	flex-wrap: wrap;
}

.price-section__header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 12px;
	margin-bottom: 12px;
}

.section-title {
	display: inline-flex;
	align-items: center;
	gap: 10px;
	min-width: 0;
	font-size: 16px;
	font-weight: 700;
	line-height: 24px;
	color: #1f2937;
}

.section-title__bar {
	width: 4px;
	height: 20px;
	flex-shrink: 0;
	border-radius: 999px;
	background: var(--energy-price-primary);
	box-shadow: 0 4px 10px rgba(var(--energy-price-primary-rgb), 0.24);
}

.header-button {
	min-width: 88px;
	height: 32px;
	padding: 0 16px;
	border-radius: 8px;
	font-size: 13px;
	font-weight: 600;
	box-shadow: none;
	--el-button-bg-color: var(--energy-price-primary);
	--el-button-border-color: var(--energy-price-primary);
	--el-button-hover-bg-color: var(--energy-price-primary);
	--el-button-hover-border-color: var(--energy-price-primary);
	--el-button-active-bg-color: var(--energy-price-primary);
	--el-button-active-border-color: var(--energy-price-primary);
}

.header-button--small {
	min-width: 72px;
}

.action-button {
	height: 32px;
	padding: 0 16px;
	border-radius: 8px;
	font-size: 13px;
	font-weight: 600;
	box-shadow: none;
}

.action-button--small {
	min-width: 72px;
}

.plan-list {
	flex: 1;
	min-height: 0;
	display: flex;
	flex-direction: column;
	gap: 12px;
	overflow: auto;
	padding-right: 2px;
}

.plan-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 10px;
	padding: 12px 14px;
	border: 1px solid #e7edf5;
	border-radius: 10px;
	background: #ffffff;
	cursor: pointer;
	outline: none;
	transition:
		transform 0.2s ease,
		border-color 0.2s ease,
		box-shadow 0.2s ease,
		background 0.2s ease;
}

.plan-item:hover,
.plan-item:focus-visible {
	transform: translateY(-1px);
	border-color: rgba(var(--energy-price-primary-rgb), 0.26);
	box-shadow: 0 10px 20px rgba(var(--energy-price-primary-rgb), 0.08);
}

.plan-item.is-active {
	border-color: rgba(var(--energy-price-primary-rgb), 0.34);
	background: linear-gradient(135deg, rgba(var(--energy-price-primary-rgb), 0.08) 0%, rgba(var(--energy-price-primary-rgb), 0.03) 100%);
	box-shadow: inset 0 0 0 1px rgba(var(--energy-price-primary-rgb), 0.05);
}

.plan-item__main {
	min-width: 0;
	display: inline-flex;
	align-items: center;
	gap: 10px;
}

.plan-item__icon {
	position: relative;
	width: 15px;
	height: 15px;
	flex-shrink: 0;
	transform: rotate(45deg);
	border-radius: 3px;
	background: linear-gradient(135deg, var(--energy-price-gradient-start), var(--energy-price-gradient-end));
	box-shadow: 0 4px 8px rgba(var(--energy-price-primary-rgb), 0.24);
}

.plan-item__icon-hole {
	position: absolute;
	top: 3px;
	left: 3px;
	width: 4px;
	height: 4px;
	border-radius: 50%;
	background: #ffffff;
}

.plan-item__name {
	min-width: 0;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	font-size: 14px;
	font-weight: 600;
	color: #334155;
}

.plan-item__default {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	height: 24px;
	padding: 0 10px;
	flex-shrink: 0;
	border-radius: 999px;
	background: rgba(var(--energy-price-primary-rgb), 0.1);
	color: var(--energy-price-primary);
	font-size: 12px;
	font-weight: 600;
}

.plan-item__action {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	height: 24px;
	padding: 0 2px;
	flex-shrink: 0;
	font-size: 12px;
	font-weight: 600;
	color: var(--energy-price-primary);
	opacity: 0;
	visibility: hidden;
	pointer-events: none;
	transition:
		opacity 0.2s ease,
		visibility 0.2s ease;
}

.plan-item:hover .plan-item__action,
.plan-item:focus-visible .plan-item__action,
.plan-item__action.is-visible {
	opacity: 1;
	visibility: visible;
	pointer-events: auto;
}

.summary-table {
	border: 1px solid #e9eef5;
	border-radius: 12px;
	overflow: hidden;
	background: #ffffff;
}

.summary-row {
	display: grid;
	grid-template-columns: 150px minmax(0, 1fr) 150px minmax(0, 1fr);
}

.summary-cell {
	min-height: 48px;
	padding: 12px 16px;
	display: flex;
	align-items: center;
	font-size: 14px;
	line-height: 22px;
	border-right: 1px solid #edf1f7;
	border-bottom: 1px solid #edf1f7;
	color: #334155;
	word-break: break-word;
}

.summary-row:last-child .summary-cell {
	border-bottom: none;
}

.summary-row .summary-cell:last-child {
	border-right: none;
}

.summary-cell--label {
	background: #f8fafc;
	font-weight: 600;
	color: #64748b;
}

.summary-cell--value {
	background: #ffffff;
	font-weight: 600;
}

.table-wrap {
	border-radius: 12px;
	overflow: hidden;
}

:deep(.price-table) {
	width: 100%;
	--el-table-border-color: #edf1f7;
	--el-table-header-bg-color: #f8fafc;
	--el-table-row-hover-bg-color: #f7fbff;
}

:deep(.price-table th.el-table__cell) {
	height: 48px;
	background: #f8fafc !important;
	font-size: 14px;
	font-weight: 600;
	color: #64748b;
}

:deep(.price-table td.el-table__cell) {
	padding: 12px 0;
	font-size: 14px;
	color: #334155;
}

:deep(.price-table .el-table__inner-wrapper::before),
:deep(.price-table .el-table__fixed-right::before),
:deep(.price-table .el-table__fixed::before),
:deep(.price-table .el-table__border-left-patch) {
	background-color: #edf1f7 !important;
}

.price-highlight {
	color: #ff5a5a;
	font-weight: 700;
}

.sidebar-empty,
.content-empty {
	flex: 1;
	min-height: 320px;
	display: flex;
	align-items: center;
	justify-content: center;
}

@media screen and (max-width: 1200px) {
	.layout-padding {
		position: relative !important;
		top: auto;
		right: auto;
		bottom: auto;
		left: auto;
		height: auto !important;
		min-height: 100% !important;
		overflow: visible !important;
	}

	.layout-padding-auto.layout-padding-view {
		height: auto !important;
		min-height: 100% !important;
	}

	.energy-price-scrollbar,
	.energy-price-page,
	.energy-price-shell,
	.energy-price-sidebar,
	.energy-price-content {
		height: auto;
		min-height: 0;
	}

	.energy-price-scrollbar {
		overflow: visible;
	}

	.energy-price-shell {
		grid-template-columns: minmax(0, 1fr);
	}

	.energy-price-sidebar {
		position: static;
		top: auto;
	}

	.price-section--sidebar {
		height: auto !important;
		max-height: none !important;
	}
}

@media screen and (max-width: 992px) {
	.energy-price-shell {
		gap: 12px;
	}

	.price-section {
		padding: 12px;
	}

	.price-section--content {
		padding: 14px;
	}

	.content-blocks {
		overflow: visible;
		padding-right: 0;
	}

	.content-block + .content-block {
		margin-top: 16px;
		padding-top: 16px;
	}

	.price-section__header {
		flex-direction: column;
		align-items: flex-start;
	}

	.summary-row {
		grid-template-columns: 132px minmax(0, 1fr);
	}

	.summary-row .summary-cell:nth-child(2n) {
		border-right: none;
	}

	.summary-row:last-child .summary-cell:nth-last-child(-n + 2) {
		border-bottom: none;
	}
}

@media screen and (max-width: 768px) {
	.energy-price-page {
		padding-bottom: 64px;
	}

	.plan-item {
		padding: 11px 12px;
	}

	.plan-item__name,
	.summary-cell,
	:deep(.price-table td.el-table__cell),
	:deep(.price-table th.el-table__cell) {
		font-size: 13px;
	}

	.summary-cell {
		padding: 10px 12px;
		min-height: 44px;
	}
}

@media (hover: none) {
	.plan-item.is-active .plan-item__action {
		opacity: 1;
		visibility: visible;
		pointer-events: auto;
	}
}
</style>
