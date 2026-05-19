<template>
  <el-row style="height: 100%">
    <el-col :span="20" :offset="2" style="height: 100%; overflow: auto">
      <el-card>
        <template #header>
          <el-row>
            <el-col :span="24">
              <el-button
                @click="onSubmit"
                :loading="loading"
                icon="plus"
                type="primary"
              >
                保存
              </el-button>
              <el-button @click="reset" icon="Refresh" :loading="loading"
                >恢复默认设置</el-button
              >
              <el-button
                @click="formDialogRef.openDialog(form.templateId)"
                icon="view"
                >登录页效果预览</el-button
              >
            </el-col>
          </el-row>
        </template>
        <!-- <div class="carousel-box">
					<div v-for="(item, i) in templateData" :key="i"
						:class="`carousel-con ${item.value == form.templateId ? 'active' : ''}`">
						<img class="pngBg" :src="getImageSrc(`imageFile/loginTemplate/${item.bgUrl}`)"
							style="height: 100%; " @click="templateChange(item.value)" />
					</div>
				</div> -->

        <div class="login-box-con">
          <div class="left">
            <TemplateReview
              v-if="tabValue == '登录缩略图'"
              :templateId="form.templateId"
              :scale="0.4"
            />
            <NewCodeEditor
              v-else
              :height="`${100 * 0.4}vh; `"
              :style="`width: ${95 * 0.4}vw;`"
              v-model="form.templateScript"
              :read-only="true"
              language="text"
              :isShowTheme="true"
              :showToolbar="false"
            />
            <div class="tab-box">
              <el-segmented
                v-model="tabValue"
                :options="tabOptions"
                size="default"
              />
            </div>
          </div>
          <div class="right">
            <el-form
              ref="dataFormRef"
              :model="form"
              :rules="dataRules"
              label-width="140px"
              v-loading="loading"
            >
              <el-form-item label="登录页标题" prop="title">
                <el-input v-model="form.title" placeholder="请输入登录页标题" />
              </el-form-item>

              <el-form-item label="登录页功能" prop="menuDisplay">
                <el-select
                  placeholder="请选择功能"
                  multiple
                  v-model="form.menuDisplay"
                >
                  <el-option
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                    v-for="(item, index) in menuOptions"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="登录背景颜色" prop="backgroundColor">
                <ColorPicker v-model="form.backgroundColor"></ColorPicker>
              </el-form-item>
              <el-form-item label="登录logo图片" prop="middleLogoUrl">
                <el-row :gutter="24">
                  <el-col :span="12">
                    <UploadImg
                      class="systemSmallLogo"
                      v-model:imageUrl="form.middleLogoUrl"
                    >
                      <template #empty>
                        <span>图标48*48</span>
                      </template>
                    </UploadImg>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item label="登录页背景" prop="backgroundUrl">
                <UploadImg
                  v-model:imageUrl="form.backgroundUrl"
                  class="systemBackground"
                >
                  <template #empty>
                    <span>登录页背景</span>
                  </template>
                </UploadImg>
              </el-form-item>

              <el-form-item label="登录底部版权信息" prop="copyRightDisplay">
                <el-switch
                  v-model="form.copyRightDisplay"
                  class="ml-2"
                  style="
                    --el-switch-on-color: #13ce66;
                    --el-switch-off-color: #ff4949;
                    width: 200px;
                  "
                  inactive-text="关闭"
                  active-text="开启"
                  :active-value="'1'"
                  :inactive-value="'0'"
                />
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-card>
    </el-col>
  </el-row>
  <!-- 编辑、新增  -->
  <form-dialog ref="formDialogRef" />
</template>

<script lang="ts" name="loginPage" setup>
import { useI18n } from "vue-i18n";
import { useMessage } from "/@/hooks/message";
import {
  templateData,
  templateDrawDownList,
  templateFormData,
} from "./indexConfig";
import {
  updateTemplate,
  getTemplateList,
} from "/@/api/systemConfiguration/basicConfig";
import { storeToRefs } from "pinia";
import { Local } from "/@/utils/storage";
import { useThemeConfig } from "/@/stores/themeConfig";
// 引入组件
const FormDialog = defineAsyncComponent(() => import("./form.vue"));
const ColorPicker = defineAsyncComponent(
  () => import("/@/components/ColorPicker/index.vue"),
);
const NewCodeEditor = defineAsyncComponent(
  () => import("/@/components/newCodeEditor/index.vue"),
);
const TemplateReview = defineAsyncComponent(
  () => import("./component/templateReview.vue"),
);

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
  title: "",
  menuDisplay: ["1"],
  backgroundColor: "",
  middleLogoUrl: "",
  backgroundUrl: "",
  copyRightDisplay: "1",
  appIconDisplay: "1",
  templateId: "1", //登录模板
  templateScript: "",
}) as any;
// 定义校验规则
const dataRules = ref({
  title: [{ required: true, message: "登录页标题不能为空", trigger: "blur" }],
  // menuDisplay: [{ required: true, message: '登录页功能', trigger: 'blur' }],
  backgroundColor: [
    { required: true, message: "登录背景颜色", trigger: "blur" },
  ],
  middleLogoUrl: [
    { required: true, message: "登录logo图片不能为空", trigger: "blur" },
  ],
  backgroundUrl: [
    { required: true, message: "登录页背景图片不能为空", trigger: "blur" },
  ],
  copyRightDisplay: [
    { required: true, message: "请选择登录底部版权信息", trigger: "blur" },
  ],
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
  Local.remove("themeConfig");
  Local.set("themeConfig", getThemeConfig.value);
};

const menuOptions = ref();
// 提交表单数据
const formList = ref([]);
// 初始化表单数据
const getDatasourceConfData = () => {
  // 获取数据 type 1门户2登录
  getTemplateList({ type: "2" }).then((res: any) => {
    formList.value = res?.data;
    let obj = formList.value.filter(
      (item: any) => item.isSelected == 1,
    ) as any[];
    if (obj.length) {
      setFormValue(obj);
      moveToFirstByValue(templateData, obj[0].templateId);
    } else {
      menuOptions.value = templateDrawDownList.get("1");
      Object.assign(form, templateFormData[0]);
    }
  });
};
const setFormValue = (obj: any, key?: any) => {
  if (obj.length) {
    Object.assign(form, obj[0]); // 表单数据
    form.menuDisplay = form.menuDisplay ? form.menuDisplay.split(",") : [];
    menuOptions.value = templateDrawDownList.get(form.templateId);
    form.copyRightDisplay = form.copyRightDisplay.toString();
    form.appIconDisplay = form.appIconDisplay.toString();
    form.templateScript = form.templateScript
      ? JSON.parse(form.templateScript)
      : "";
  } else {
    Object.assign(
      form,
      templateFormData.filter((item) => item.templateId == key)[0],
    );
  }
  getThemeConfig.value.loginConfig = JSON.parse(JSON.stringify(form));
  setLocalThemeConfig();
};
// 方法：筛选出 item.isSelected ==1 的对象并移动到数组第一个位置
function moveToFirstByValue(array: any, value: any) {
  // console.log(333,value)
  const item = array.value.find((item: any) => item.value === value);
  if (item) {
    const index = array.value.indexOf(item);
    if (index > -1) {
      array.value.splice(index, 1); // 从原位置移除
      array.value.unshift(item); // 移动到数组第一个位置
    }
  }
  //   console.log(2222,templateData)
}

// 相关
const tabOptions: any = ref(["登录缩略图", "登录css脚本"]);
const tabValue = ref("登录缩略图");

// 提交
const onSubmit = async () => {
  const valid = await dataFormRef.value.validate().catch(() => {});
  if (!valid) return false;

  let p = JSON.parse(JSON.stringify(form));
  p.menuDisplay = p.menuDisplay.toString();
  p.templateScript = p.templateScript ? JSON.stringify(p.templateScript) : "";
  try {
    loading.value = true;
    const res = await updateTemplate({ ...p, isSelected: "1", type: "2" });
    if (res.data) {
      useMessage().success(t("common.editSuccessText"));
      getDatasourceConfData(); // 初始化表单数据
      getThemeConfig.value.loginConfig = JSON.parse(JSON.stringify(p));
      setLocalThemeConfig(); // 存储布局配置
    }
  } catch (err: any) {
    useMessage().error(err.msg);
  } finally {
    loading.value = false;
  }
};
//恢复默认设置
const reset = async () => {
  Object.assign(
    form,
    templateFormData.filter((item) => item.templateId == form.templateId)[0],
  );
  onSubmit();
};
</script>

<style lang="scss">
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

.login-box-con {
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
  height: 168px;

  .carousel-con {
    flex: 0 0 15%;
    margin-right: 10px;
    padding: 10px;
    box-sizing: border-box;
    animation: moveUpBack 0.5s ease-out forwards;
  }

  .active {
    animation: moveUp 0.5s ease-out forwards;
    // transform: scale(1.2);
  }

  /* 定义动画 */
  @keyframes moveUpBack {
    from {
      transform: translateY(-3px) scale(1.1);
    }

    to {
      transform: translateY(0);
    }
  }
}

/* 定义动画 */
@keyframes moveUp {
  from {
    transform: translateY(0);
    /* 起始位置 */
  }

  to {
    transform: translateY(-3px) scale(1.1);
    /* 结束位置，往上移动2px */
  }
}
</style>
