<template>
	<el-row style="height: 100%">
		<el-col :span="20" :offset="2" style="height: 100%; overflow: auto">
			<el-card>
				<template #header>
					<el-row>
						<el-col :span="24">
							<el-button @click="onSubmit" :loading="loading" icon="plus" type="primary"> 保存 </el-button>
						</el-col>
					</el-row>
				</template>
				<el-form ref="dataFormRef" :model="form" :rules="dataRules" formDialogRef label-width="140px" v-loading="loading">
					<el-form-item label="系统完整名称" prop="SYSTEM_FULL_NAME">
						<el-input v-model="form.SYSTEM_FULL_NAME" placeholder="请输入系统完整名称" />
					</el-form-item>

					<el-form-item label="系统缩略名称" prop="SYSTEM_NAME">
						<el-input v-model="form.SYSTEM_NAME" placeholder="请输入系统缩略名称" />
						<span style="color: #909399">显示在浏览器的地址栏上,优先使用系统缩略名称</span>
					</el-form-item>
					<el-form-item label="系统版权信息" prop="SYSTEM_COPY_RIGHT">
						<el-input v-model="form.SYSTEM_COPY_RIGHT" placeholder="请输入系统版权信息" />
					</el-form-item>
					<el-form-item label="底部版权信息显示" prop="SYSTEM_BOTTOM_DISPLAY">
						<el-switch
							v-model="form.SYSTEM_BOTTOM_DISPLAY"
							class="ml-2"
							style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949; width: 200px"
							inactive-text="关闭"
							active-text="开启"
							:active-value="'1'"
							:inactive-value="'0'"
						/>
					</el-form-item>
					<el-form-item label="网站图标" prop="SYSTEM_WEB_ICON_URL">
						<el-row :gutter="24">
							<el-col :span="10">
								<UploadImg class="systemSmallLogo" v-model:imageUrl="form.SYSTEM_WEB_ICON_URL" width="75px" height="75px" :iconSize="true">
									<template #empty>
										<span>图标48*48</span>
									</template>
								</UploadImg>
							</el-col>
							<div class="tip-text">显示在浏览器的地址栏上</div>
						</el-row>
					</el-form-item>

					<el-row>
						<el-col :span="6">
							<el-form-item label="系统logo图片" prop="SYSTEM_MIDDLE_LOGO_URL">
								<UploadImg class="systemMiddleLogo" v-model:imageUrl="form.SYSTEM_MIDDLE_LOGO_URL">
									<template #empty>
										<span>图标80*80</span>
									</template>
								</UploadImg>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</el-card>
		</el-col>
	</el-row>
	<!-- 编辑、新增  -->
	<form-dialog ref="formDialogRef" />
</template>

<script lang="ts" name="loginPage" setup>
import { useI18n } from 'vue-i18n';
import { useMessage } from '/@/hooks/message';
import { getParamPage, updateParambatchUpdate } from '/@/api/systemConfiguration/basicConfig';
import { storeToRefs } from 'pinia';
import { Local } from '/@/utils/storage';
import { useThemeConfig } from '/@/stores/themeConfig';
import { transformObject, mergeAndUpdateArrays } from '/@/utils/arrayOperation';

// 引入组件
const FormDialog = defineAsyncComponent(() => import('./form.vue'));

const { t } = useI18n();
// 定义变量内容
const dataFormRef = ref();
const loading = ref(false);
const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);

/** 表单弹窗引用 */
const formDialogRef = ref();

// 提交表单数据
const form = reactive({
	SYSTEM_FULL_NAME: '',
	SYSTEM_NAME: '',
	SYSTEM_COPY_RIGHT: '',
	SYSTEM_BOTTOM_DISPLAY: '1',
	SYSTEM_WEB_ICON_URL: '',
	SYSTEM_MIDDLE_LOGO_URL: '',
	SYSTEM_SMALL_LOGO_URL: '',
});
// 定义校验规则
const dataRules = ref({
	SYSTEM_FULL_NAME: [{ required: true, message: '系统完整名称不能为空', trigger: 'blur' }],
	SYSTEM_NAME: [{ required: true, message: '系统缩略名称不能为空', trigger: 'blur' }],
	SYSTEM_COPY_RIGHT: [{ required: true, message: '系统版权信息', trigger: 'blur' }],
	SYSTEM_BOTTOM_DISPLAY: [{ required: true, message: '请选择', trigger: 'blur' }],
	SYSTEM_WEB_ICON_URL: [{ required: true, message: '网站图标不能为空', trigger: 'blur' }],
	SYSTEM_MIDDLE_LOGO_URL: [{ required: true, message: '系统logo不能为空', trigger: 'blur' }],
	SYSTEM_SMALL_LOGO_URL: [{ required: true, message: '系统小logo不能为空', trigger: 'blur' }],
});

onMounted(() => {
	getDatasourceConfData(); // 初始化表单数据
});

// 获取布局配置信息
const getThemeConfig = computed(() => {
	return themeConfig.value;
});

// 存储布局配置
const setLocalThemeConfig = () => {
	Local.remove('themeConfig');
	Local.set('themeConfig', getThemeConfig.value);
};

// 提交表单数据
const editForm = reactive([]);
// 初始化表单数据
const getDatasourceConfData = () => {
	// 获取数据
	getParamPage({ validateCode: 'SystemAppearance' }).then((res: any) => {
		let records = res?.data;
		type PasswordFormType = typeof form;

		Object.assign(editForm, records); // 表单数据
		for (const element of records) {
			const key = element?.publicKey as keyof PasswordFormType;
			if (key) {
				form[key] = element?.publicValue ?? '';
			}
		}
	});
};

// 提交
const onSubmit = async () => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;
	const transformedArray = transformObject(form, 'SystemAppearance');
	let params = mergeAndUpdateArrays(editForm, transformedArray, 'publicKey'); // 表单数据

	try {
		loading.value = true;
		const res = await updateParambatchUpdate(params);
		if (res.data) {
			useMessage().success(t('common.editSuccessText'));
			getDatasourceConfData(); // 初始化表单数据
			getThemeConfig.value.systemAppearanceConfig = JSON.parse(JSON.stringify(form));
			setLocalThemeConfig(); // 存储布局配置
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		loading.value = false;
	}
};
</script>

<style lang="scss" scoped>
.systemBackground {
	width: 600px;

	.el-upload {
		width: 100% !important;
	}
}

.systemSmallLogo {
	.upload-image {
		width: 48px !important;
	}
}

.systemMiddleLogo {
	.upload-image {
		width: 80px !important;
	}
}
.tip-text {
	color: #909399;
	margin-left: 13px;
}

.portal-box {
	display: flex;

	.left {
		width: 60%;

		.tab-box {
			width: 100%;
			text-align: center;
		}

		img.pngBg {
			height: calc(100% - 100px);
		}

		.el-segmented {
			margin-top: 30px;
		}

		.el-segmented {
			--el-segmented-item-selected-color: var(--el-text-color-primary);
			--el-segmented-item-selected-bg-color: #fff;
		}

		:deep(.is-selected) {
			.el-segmented__item-label {
				font-weight: 700 !important;
			}
		}
	}

	.right {
		width: 40%;
	}
}

.carousel-box {
	margin-bottom: 30px;
	display: flex;
	overflow-x: scroll;
	overflow-y: hidden;
	white-space: nowrap;

	.carousel-con {
		flex: 0 0 15%;
		margin-right: 5px;
		padding: 10px;
		box-sizing: border-box;
	}

	.active {
		animation: moveUp 0.5s ease-out forwards;
		// transform: scale(1.2);
	}

	.carousel-con:last-child {
		margin-right: 0;
	}

	/* 定义动画 */
	@keyframes moveUp {
		from {
			transform: translateY(0);
			/* 起始位置 */
		}

		to {
			transform: translateY(-6px) scale(1.2);
			/* 结束位置，往上移动2px */
		}
	}
}
</style>
