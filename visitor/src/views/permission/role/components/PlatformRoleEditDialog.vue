<template>
	<!-- 平台角色编辑弹窗 -->
	<el-dialog
		v-model="dialogVisible"
		width="1100px"
		:close-on-click-modal="false"
		class="platform-role-edit-dialog"
		:title="isEdit ? '编辑平台角色' : '新建平台角色'"
		@close="handleClose"
	>
		<el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px" class="platform-role-form">
			<el-form-item label="角色名称" prop="roleName">
				<el-input v-model="formData.roleName" placeholder="请输入角色名称" clearable />
			</el-form-item>

			<el-form-item label="角色编码" prop="roleCode">
				<el-input v-model="formData.roleCode" placeholder="请输入角色编码" clearable />
			</el-form-item>

			<el-form-item label="角色说明" prop="description">
				<el-input v-model="formData.description" type="textarea" :rows="3" placeholder="请输入角色说明" />
			</el-form-item>

			<el-form-item label="子应用角色配置">
				<div class="app-role-config">
					<div class="config-header">
						<div class="config-title">
							<el-icon><Grid /></el-icon>
							子应用角色配置（选择子应用并指定对应角色）
						</div>
						<div class="config-stats">
							已选择 <b>{{ selectedAppCount }}</b> 个子应用，共 <b>{{ totalSelectedRoles }}</b> 个角色
						</div>
					</div>

					<el-collapse class="app-role-list" v-model="activeCollapseNames" expand-icon-position="left">
						<el-collapse-item v-for="(app, appIndex) in appRoleList" :key="appIndex" :name="String(appIndex)" class="app-role-item">
							<template #title>
								<div class="app-header">
									<div class="app-left">
										<el-icon class="app-icon"><Grid /></el-icon>
										<span class="app-name">{{ app.appName }}</span>
									</div>
									<div class="app-right">
										<span class="selected-count" v-if="app.selectedCount > 0"> 已选 {{ app.selectedCount }} 个 </span>
									</div>
								</div>
							</template>
							<div class="role-options">
								<div v-for="(role, roleIndex) in app.roles" :key="roleIndex" class="role-option">
									<el-checkbox v-model="role.selected" @change="updateSelectedCount(app)">
										{{ role.roleName }}
									</el-checkbox>
								</div>
							</div>
						</el-collapse-item>
					</el-collapse>
				</div>
			</el-form-item>
		</el-form>

		<!-- 底部按钮 -->
		<template #footer>
			<div class="dialog-footer">
				<el-button @click="handleClose">取消</el-button>
				<el-button type="primary" @click="handleSave">
					{{ isEdit ? '保存' : '创建' }}
				</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script setup lang="ts" name="PlatformRoleEditDialog">
/**
 * @component PlatformRoleEditDialog
 * @description 平台角色新增/编辑弹窗组件
 * @props visible - 控制弹窗显示/隐藏
 * @props roleInfo - 编辑时的角色信息（可选）
 * @emits update:visible - 关闭弹窗时触发
 * @emits save - 保存时触发
 */
import { ref, computed, watch, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { Grid } from '@element-plus/icons-vue';
import type { PlatformRoleEditDialogProps, PlatformRoleEditDialogEmits, PlatformRoleFormData, AppRoleOption } from '../type';
import { mockPlatformRoleAppList } from '../mock';

const props = defineProps<PlatformRoleEditDialogProps>();
const emit = defineEmits<PlatformRoleEditDialogEmits>();

const formRef = ref();

// 是否是编辑模式
const isEdit = computed(() => !!props.roleInfo);

// 表单数据
const formData = ref<PlatformRoleFormData>({
	roleName: '',
	roleCode: '',
	description: '',
});

// 子应用角色列表
const appRoleList = ref<AppRoleOption[]>(JSON.parse(JSON.stringify(mockPlatformRoleAppList)));

// 折叠面板当前激活的项
const activeCollapseNames = ref<string[]>([]);

// 初始化子应用角色列表
const initAppRoleList = () => {
	appRoleList.value = JSON.parse(JSON.stringify(mockPlatformRoleAppList));
	activeCollapseNames.value = [];
};

// 表单验证规则
const formRules = {
	roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
	roleCode: [{ required: true, message: '请输入角色编码', trigger: 'blur' }],
};

// 选中的子应用数量
const selectedAppCount = computed(() => {
	return appRoleList.value.filter((_, index) => activeCollapseNames.value.includes(String(index)) && appRoleList.value[index].selectedCount > 0)
		.length;
});

// 总共选中的角色数量
const totalSelectedRoles = computed(() => {
	let count = 0;
	appRoleList.value.forEach((app) => {
		count += app.selectedCount;
	});
	return count;
});

/**
 * 初始化子应用角色选择状态
 */
const initAppRoleSelection = (roleInfo: any) => {
	initAppRoleList();
	if (roleInfo.appRoleMap) {
		const expandedNames: string[] = [];
		roleInfo.appRoleMap.forEach((appMap: any) => {
			const appIndex = appRoleList.value.findIndex((a) => a.appName === appMap.appName);
			if (appIndex !== -1) {
				const app = appRoleList.value[appIndex];
				expandedNames.push(String(appIndex));
				appMap.roles.forEach((selectedRole: any) => {
					const role = app.roles.find((r) => r.roleName === selectedRole.roleName);
					if (role) {
						role.selected = selectedRole.isDefault;
					}
				});
				updateSelectedCount(app);
			}
		});
		activeCollapseNames.value = expandedNames;
	}
};

/**
 * 重置表单
 */
const resetForm = () => {
	formData.value = {
		roleName: '',
		roleCode: '',
		description: '',
	};
	initAppRoleList();
};

/**
 * 更新选中数量
 */
const updateSelectedCount = (app: AppRoleOption) => {
	app.selectedCount = app.roles.filter((role) => role.selected).length;
};

// 监听roleInfo变化，初始化表单
watch(
	() => props.roleInfo,
	(val) => {
		if (val) {
			formData.value = {
				roleName: val.roleName,
				roleCode: val.roleCode,
				description: val.description,
			};
			// 初始化子应用角色选择状态
			initAppRoleSelection(val);
		} else {
			resetForm();
		}
	},
	{ deep: true }
);

// 监听visible变化，打开弹窗时重置表单
watch(
	() => props.visible,
	(val) => {
		if (val) {
			if (props.roleInfo) {
				initAppRoleSelection(props.roleInfo);
			} else {
				resetForm();
			}
		}
	}
);

// 组件挂载时初始化
onMounted(() => {
	initAppRoleList();
});

/**
 * 双向绑定控制弹窗显示/隐藏
 */
const dialogVisible = computed({
	get: () => props.visible,
	set: (val: boolean) => emit('update:visible', val),
});

/**
 * 关闭弹窗
 */
const handleClose = () => {
	emit('update:visible', false);
};

/**
 * 保存
 */
const handleSave = async () => {
	try {
		await formRef.value.validate();

		// 构建子应用角色映射
		const appRoleMap = appRoleList.value
			.filter((_, index) => activeCollapseNames.value.includes(String(index)) && appRoleList.value[index].selectedCount > 0)
			.map((app) => ({
				appName: app.appName,
				roles: app.roles
					.filter((role) => role.selected)
					.map((role) => ({
						roleName: role.roleName,
						isDefault: true,
					})),
			}));

		const result = {
			...formData.value,
			appRoleMap,
			isBuiltIn: false,
			appCount: appRoleMap.length,
			roleCount: totalSelectedRoles.value,
			userCount: 0,
		};

		emit('save', result);
		ElMessage.success(isEdit.value ? '角色保存成功！' : '角色创建成功！');
		handleClose();
	} catch (error) {
		// 验证失败
	}
};
</script>

<style lang="scss" scoped>
.platform-role-edit-dialog :deep(.el-dialog) {
	border-radius: 16px;
	overflow: hidden;
}

.platform-role-edit-dialog :deep(.el-dialog__header) {
	padding: 20px 24px;
	background: linear-gradient(135deg, #00c6ff 0%, #0072ff 100%);
	margin: 0;
	color: white;

	.el-dialog__title {
		color: white;
		font-weight: 600;
	}

	.el-dialog__headerbtn {
		top: 20px;
		right: 24px;

		.el-dialog__close {
			color: white;
			font-size: 18px;

			&:hover {
				color: #f0f0f0;
			}
		}
	}
}

.platform-role-form {
	padding: 24px;
}

.app-role-config {
	width: 100%;

	.config-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 16px;
		padding-bottom: 12px;

		.config-title {
			display: flex;
			align-items: center;
			gap: 8px;
			font-size: 14px;
			font-weight: 500;
			color: #374151;

			.el-icon {
				color: #0088ff;
			}
		}

		.config-stats {
			font-size: 12px;
			color: #6b7280;

			b {
				color: #0088ff;
			}
		}
	}

	.app-role-list {
		max-height: 400px;
		overflow-y: auto;
		padding-right: 4px;
		border: 1px solid #e5e7eb;
		border-radius: 8px;
		padding: 0 25px;
		:deep(.el-collapse-item) {
			margin-bottom: 12px;
			overflow: hidden;
			background: #f9fafb;
			transition: all 0.2s;

			&:last-child {
				margin-bottom: 0;
			}

			&:hover {
				border-color: #93c5fd;
			}

			&.is-active {
				border-color: #0088ff;
			}

			.el-collapse-item__title {
				padding: 12px 16px;
				height: auto;
				line-height: normal;

				.app-header {
					display: flex;
					justify-content: space-between;
					align-items: center;
					width: 100%;

					.app-left {
						display: flex;
						align-items: center;
						gap: 8px;

						.app-icon {
							color: #6b7280;
						}
						.app-name {
							font-size: 14px;
							font-weight: 500;
							color: #374151;
						}
					}

					.app-right {
						.selected-count {
							font-size: 12px;
							color: #0088ff;
							background: #e6f4ff;
							padding: 2px 8px;
							border-radius: 4px;
						}
					}
				}
			}

			.el-collapse-item__wrap {
				background: #ffffff;
			}

			.el-collapse-item__content {
				padding: 12px 16px;
				background: #f8f9fa;
			}

			.role-options {
				display: flex;
				flex-wrap: wrap;
				gap: 10px;

				.role-option {
					display: flex;
					align-items: center;

					.el-checkbox {
						padding: 8px 16px;
						background: #f3f4f6;
						border-radius: 6px;
						border: 1px solid #d1d5db;
						transition: all 0.2s;

						&:hover {
							border-color: #0088ff;
						}

						&:has(.el-checkbox__input.is-checked) {
							background: #e6f4ff;
							border-color: #0088ff;
						}

						.el-checkbox__label {
							font-size: 13px;
							color: #4b5563;
						}
					}
				}
			}
		}
		:deep(.el-collapse-item:last-child) {
			.el-collapse-item__header {
				border-bottom: 0;
			}
		}
	}
}
</style>
