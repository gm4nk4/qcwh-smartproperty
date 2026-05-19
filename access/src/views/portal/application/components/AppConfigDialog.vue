<template>
	<el-dialog
		v-model="dialogVisible"
		width="960px"
		:close-on-click-modal="false"
		class="app-config-dialog"
		title="访问配置"
		@close="handleClose"
	>
		<div class="dialog-content">
			<!-- 应用信息展示 -->
			<div class="app-info-card">
				<div class="app-icon">
					<div class="icon-box">
						<el-icon><Box /></el-icon>
					</div>
				</div>
				<div class="app-details">
					<div class="app-header">
						<span class="app-name">{{ appData?.name }}</span>
						<span class="app-version">{{ appData?.version }}</span>
					</div>
					<div class="app-desc">{{ appData?.description }}</div>
				</div>
			</div>

			<!-- 组织架构管理 -->
			<div class="section">
				<div class="section-title">组织架构管理</div>
				<div class="org-options">
					<div
						class="org-option"
						:class="{ selected: orgOption === 'unified' }"
						@click="orgOption = 'unified'"
					>
						<div class="org-option-icon">
							<el-icon><OfficeBuilding /></el-icon>
						</div>
						<div class="org-option-text">
							<div class="org-option-title">使用统一组织架构</div>
							<div class="org-option-desc">直接使用平台统一的组织架构树，与其他子应用共享组织节点和人员数据</div>
						</div>
						<el-checkbox v-model="orgUnified" :value="true" @click.stop />
					</div>
					<div
						class="org-option"
						:class="{ selected: orgOption === 'independent' }"
						@click="orgOption = 'independent'"
					>
						<div class="org-option-icon">
							<el-icon><Connection /></el-icon>
						</div>
						<div class="org-option-text">
							<div class="org-option-title">启用独立组织架构管理</div>
							<div class="org-option-desc">该子应用将独立维护自己的组织架构树，不与平台统一架构关联，适用于安监监控、工单管理等需要专属组织架构的场景。可在「组织管理」中随时切换统一模式。</div>
						</div>
						<el-checkbox v-model="orgIndependent" :value="true" @click.stop />
					</div>
				</div>
				<div class="org-tip">
					<el-icon><InfoFilled /></el-icon>
					<span>组织架构模式决定该子应用如何管理组织节点和人员归属。大多数子应用建议使用统一组织架构以保持数据一致性。</span>
				</div>
			</div>

			<!-- 访问地址配置 -->
			<div class="section">
				<div class="section-title">访问地址配置</div>
				<div class="address-list">
					<div
						v-for="(item, index) in addressList"
						:key="index"
						class="address-item"
					>
						<div class="address-row">
							<el-select v-model="item.type" class="type-select">
								<el-option label="PC Web" value="pc" />
								<el-option label="Mobile H5" value="h5" />
								<el-option label="微信小程序" value="wechat" />
								<el-option label="其他" value="other" />
							</el-select>
							<el-input v-model="item.url" class="url-input" placeholder="https://example.com/app" />
							<el-switch v-model="item.enabled" />
							<el-icon class="delete-icon" @click="removeAddress(index)"><Delete /></el-icon>
							<el-icon class="add-icon" @click="addAddress"><Plus /></el-icon>
						</div>
						<div class="display-options">
							<span class="display-label">显示方式</span>
							<el-radio-group v-model="item.displayMode" size="small">
								<el-radio-button value="always">一直显示</el-radio-button>
								<el-radio-button value="never">一直不显示</el-radio-button>
								<el-radio-button value="role">拥有角色才显示</el-radio-button>
							</el-radio-group>
						</div>
					</div>
				</div>
				<div class="address-tip">
					<el-icon><InfoFilled /></el-icon>
					<span>不同端可配置不同的访问地址和显示方式，用于门户快捷入口和SSO跳转</span>
				</div>
			</div>

			<!-- 底部提示 -->
			<div class="bottom-notice">
				<el-icon><InfoFilled /></el-icon>
				<span>访问地址用于门户快捷入口跳转和SSO单点登录。不同终端可配置不同的访问地址。内部应用默认使用系统路由路径，第三方应用必须配置至少一个访问地址。</span>
			</div>
		</div>

		<template #footer>
			<div class="dialog-footer">
				<el-button @click="handleClose">取消</el-button>
				<el-button type="primary" @click="handleSave">保存</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { Box, OfficeBuilding, Connection, InfoFilled, Delete, Plus } from '@element-plus/icons-vue';
import type { ApplicationItem } from '../type';

interface AppConfigDialogProps {
	visible: boolean;
	appData?: ApplicationItem | null;
}

interface AppConfigDialogEmits {
	(e: 'update:visible', value: boolean): void;
	(e: 'save', data: any): void;
}

const props = defineProps<AppConfigDialogProps>();
const emit = defineEmits<AppConfigDialogEmits>();

interface AddressItem {
	type: string;
	url: string;
	enabled: boolean;
	displayMode: string;
}

const orgOption = ref('unified');
const orgUnified = ref(true);
const orgIndependent = ref(false);

const addressList = ref<AddressItem[]>([
	{ type: 'pc', url: 'https://example.com/app', enabled: true, displayMode: 'always' },
	{ type: 'h5', url: 'https://example.com/app', enabled: true, displayMode: 'always' },
]);

const dialogVisible = computed({
	get: () => props.visible,
	set: (val: boolean) => emit('update:visible', val),
});

watch(orgOption, (val) => {
	orgUnified.value = val === 'unified';
	orgIndependent.value = val === 'independent';
});

function addAddress() {
	addressList.value.push({
		type: 'pc',
		url: '',
		enabled: true,
		displayMode: 'always',
	});
}

function removeAddress(index: number) {
	if (addressList.value.length > 1) {
		addressList.value.splice(index, 1);
	}
}

function handleClose() {
	emit('update:visible', false);
}

function handleSave() {
	emit('save', {
		orgOption: orgOption.value,
		addressList: [...addressList.value],
	});
	ElMessage.success('保存成功');
	handleClose();
}
</script>

<style lang="scss" scoped>
.app-config-dialog :deep(.el-dialog) {
	border-radius: 12px;
	overflow: hidden;
}

.app-config-dialog :deep(.el-dialog__header) {
	background: linear-gradient(135deg, #06b6d4 0%, #0284c7 100%);
	padding: 16px 20px;
}

.app-config-dialog :deep(.el-dialog__title) {
	color: white;
	font-size: 16px;
	font-weight: 500;
}

.app-config-dialog :deep(.el-dialog__headerbtn .el-dialog__close) {
	color: white;
}

.app-config-dialog :deep(.el-dialog__body) {
	padding: 24px 20px;
}

.app-config-dialog :deep(.el-dialog__footer) {
	padding: 16px 20px;
}

.dialog-content {
	.app-info-card {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 12px 16px;
		background: white;
		border: 1px solid #e5e7eb;
		border-radius: 8px;
		margin-bottom: 24px;

		.app-icon {
			.icon-box {
				width: 40px;
				height: 40px;
				border-radius: 6px;
				background: #eff6ff;
				display: flex;
				align-items: center;
				justify-content: center;
				color: #3b82f6;

				.el-icon {
					font-size: 20px;
				}
			}
		}

		.app-details {
			flex: 1;

			.app-header {
				display: flex;
				align-items: center;
				gap: 8px;
				margin-bottom: 2px;

				.app-name {
					font-size: 14px;
					font-weight: 600;
					color: #1f2937;
				}

				.app-version {
					font-size: 12px;
					color: #64748b;
				}
			}

			.app-desc {
				font-size: 12px;
				color: #64748b;
			}
		}
	}

	.section {
		padding: 16px;
		border: 1px solid #e5e7eb;
		border-radius: 8px;
		margin-bottom: 16px;

		.section-title {
			font-size: 14px;
			font-weight: 600;
			color: #374151;
			margin-bottom: 16px;
		}

		.org-options {
			display: flex;
			flex-direction: column;
			gap: 12px;
			margin-bottom: 12px;

			.org-option {
				display: flex;
				align-items: flex-start;
				gap: 12px;
				padding: 12px;
				border: 1px solid #e5e7eb;
				border-radius: 8px;
				cursor: pointer;
				position: relative;

				&:hover {
					border-color: #93c5fd;
					background: #f8fafc;
				}

				&.selected {
					border-color: #3b82f6;
					background: #eff6ff;

					.org-option-icon {
						background: #3b82f6;
						color: white;
					}
				}

				.org-option-icon {
					width: 40px;
					height: 40px;
					background: #f3f4f6;
					border-radius: 6px;
					display: flex;
					align-items: center;
					justify-content: center;
					flex-shrink: 0;
					color: #6b7280;

					.el-icon {
						font-size: 20px;
					}
				}

				.org-option-text {
					flex: 1;

					.org-option-title {
						font-size: 14px;
						font-weight: 600;
						color: #1f2937;
						margin-bottom: 4px;
					}

					.org-option-desc {
						font-size: 12px;
						color: #6b7280;
						line-height: 1.6;
					}
				}

				:deep(.el-checkbox) {
					margin-left: auto;
					margin-top: 4px;
				}
			}
		}

		.org-tip {
			display: flex;
			align-items: flex-start;
			gap: 6px;
			font-size: 12px;
			color: #6b7280;
			line-height: 1.6;

			.el-icon {
				color: #6b7280;
				flex-shrink: 0;
				margin-top: 2px;
			}
		}

		.address-list {
			display: flex;
			flex-direction: column;
			gap: 12px;
			margin-bottom: 12px;

			.address-item {
				padding: 12px;
				background: #f8fafc;
				border-radius: 8px;

				.address-row {
					display: flex;
					align-items: center;
					gap: 8px;
					margin-bottom: 12px;

					.type-select {
						width: 120px;
					}

					.url-input {
						flex: 1;
					}

					.delete-icon,
					.add-icon {
						cursor: pointer;
						color: #6b7280;
						font-size: 18px;

						&:hover {
							color: #3b82f6;
						}
					}

					.delete-icon:hover {
						color: #ef4444;
					}
				}

				.display-options {
					display: flex;
					align-items: center;
					gap: 8px;

					.display-label {
						font-size: 12px;
						color: #6b7280;
					}
				}
			}
		}

		.address-tip {
			display: flex;
			align-items: flex-start;
			gap: 6px;
			font-size: 12px;
			color: #6b7280;
			line-height: 1.6;

			.el-icon {
				color: #6b7280;
				flex-shrink: 0;
				margin-top: 2px;
			}
		}
	}

	.bottom-notice {
		display: flex;
		align-items: flex-start;
		gap: 8px;
		padding: 12px 16px;
		background: #eff6ff;
		border-radius: 6px;
		font-size: 12px;
		color: #3b82f6;
		line-height: 1.6;

		.el-icon {
			flex-shrink: 0;
			margin-top: 2px;
		}
	}
}

.dialog-footer {
	display: flex;
	justify-content: center;
	gap: 12px;
}
</style>
