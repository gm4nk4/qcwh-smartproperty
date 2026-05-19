<template>
  <div class="space-location-container">
    <div class="flex">
      <!-- 左侧空间树形结构 -->
      <div class="space-tree-container">
        <div class="tree-header">
          <h2 class="title-with-bar">空间位置树形结构</h2>
          <el-button type="primary" @click="formDialogRef.openDialog()">新增空间</el-button>
        </div>
        <div class="search-box">
          <el-input 
            v-model="searchKeyword" 
            placeholder="搜索空间" 
            prefix-icon="el-icon-search" 
          />
        </div>
        <el-tree
          ref="treeRef"
          v-loading="loading"
          :data="spaceTreeData"
          node-key="id"
          default-expand-all
          highlight-current
          :filter-node-method="filterNode"
          :filter-text="searchKeyword"
          @current-change="handleCurrentChange"
          :props="{ label: 'spaceName', children: 'child', value: 'id' }"
        >
          <template #default="{ node, data }">
            <span class="tree-node">
              <span>{{ node.label }}</span>
              <span class="tree-operations">
                  <img src="/@/assets/icons/add.svg" @click.stop="handleAdd(data)"  />
                 <img src="/@/assets/icons/edit.svg"  @click.stop="handleEdit(data)"/>
                  <img src="/@/assets/icons/del.svg" @click.stop="handleDelete(data)" />
              </span>
            </span>
          </template>
        </el-tree>
      </div>

      <!-- 右侧详情面板 -->
      <div class="space-detail-container">
        <!-- 外部边框容器 -->
        <div class="outer-border-container" :style="dashboardVars" v-loading="detailLoading">
          <!-- 空间基本信息 -->
          <div class="info-card">
            <h3 class="title-with-bar">{{ selectedSpace.name }}</h3>
            <el-descriptions :column="2" border>
              <el-descriptions-item label="空间名称">{{ selectedSpace.name }}</el-descriptions-item>
              <el-descriptions-item label="空间编码">{{ selectedSpace.code }}</el-descriptions-item>
              <el-descriptions-item label="空间类型">{{ selectedSpace.type }}</el-descriptions-item>
              <el-descriptions-item label="上级空间">{{ selectedSpace.parent }}</el-descriptions-item>
              <el-descriptions-item label="建筑面积">{{ selectedSpace.area }}平方米</el-descriptions-item>
              <el-descriptions-item label="设备数量">{{ selectedSpace.deviceCount }}台</el-descriptions-item>
              <el-descriptions-item label="能耗配额">{{ selectedSpace.energyQuota }} kWh/月</el-descriptions-item>
              <el-descriptions-item label="负责人">{{ selectedSpace.manager }}</el-descriptions-item>
              <el-descriptions-item label="联系电话">{{ selectedSpace.phone }}</el-descriptions-item>
              <el-descriptions-item label="创建时间">{{ selectedSpace.createTime }}</el-descriptions-item>
              <el-descriptions-item label="备注">{{ selectedSpace.remark }}</el-descriptions-item>
            </el-descriptions>
          </div>

          <!-- 能耗统计 -->
          <div class="energy-stat-card">
            <h3 class="title-with-bar">能耗统计</h3>
            <div class="metrics-row metric-grid">
              <div class="metric-card">
                <div class="metric-card__content">
                  <p class="metric-card__label">本月用电</p>
                  <div class="metric-card__value">
                    <span>{{ energyStatistics.monthlyElectricity }}</span>
                    <small>kWh</small>
                  </div>
                  <p class="metric-card__context"></p>
                </div>
                <div class="metric-card__visual">
                  <div class="metric-card__icon-shell">
                    <img :src="getMetricImage('electricity-usage')" :alt="'本月用电'" class="metric-icon metric-icon--image" />
                  </div>
                </div>
              </div>
              <div class="metric-card">
                <div class="metric-card__content">
                  <p class="metric-card__label">本月用水</p>
                  <div class="metric-card__value">
                    <span>{{ energyStatistics.monthlyWater }}</span>
                    <small>m³</small>
                  </div>
                  <p class="metric-card__context"></p>
                </div>
                <div class="metric-card__visual">
                  <div class="metric-card__icon-shell">
                    <img :src="getMetricImage('water-usage')" :alt="'本月用水'" class="metric-icon metric-icon--image" />
                  </div>
                </div>
              </div>
              <div class="metric-card">
                <div class="metric-card__content">
                  <p class="metric-card__label">配额使用率</p>
                  <div class="metric-card__value">
                    <span>{{ energyStatistics.quotaUsageRate }}</span>
                    <small>%</small>
                  </div>
                  <p class="metric-card__context"></p>
                </div>
                <div class="metric-card__visual">
                  <div class="metric-card__icon-shell">
                    <img :src="getMetricImage('quota-usage-rate')" :alt="'配额使用率'" class="metric-icon metric-icon--image" />
                  </div>
                </div>
              </div>
             
            </div>
          </div>

          <!-- 子空间列表 -->
          <div class="subspace-table-card">
            <h3 class="title-with-bar">子空间列表</h3>
            <el-table :data="subspaceList" stripe style="width: 100%" border>
              <el-table-column prop="spaceName" label="空间名称" />
              <el-table-column prop="spaceType" label="类型" >
                <template #default="scope">
                  {{ getSpaceTypeLabel(space_type,scope.row.spaceType) }}
                </template>
              </el-table-column>
              <el-table-column prop="deviceCount" label="设备数" />
              <el-table-column prop="buildingArea" label="建筑面积(m²)" />
              <el-table-column prop="energyQuota" label="能耗配额(kWh/月)" />
              <el-table-column label="操作" width="120">
                <template #default="scope">
                  <el-button type="text" @click="handleViewSubspace(scope.row)">查看</el-button>
                  <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 新增空间弹窗组件 -->
  <AddSpaceDialog
    ref="formDialogRef"
    @refresh-tree="fetchSpaceTree"
  />
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { Plus, Edit, Delete, Eleme, Document, Bell, SuccessFilled } from '@element-plus/icons-vue';
import AddSpaceDialog from './components/AddSpaceDialog.vue';
import { useThemeConfig } from '/@/stores/themeConfig';
import { useChangeColor } from '/@/utils/theme';
import { useThemeImage } from '/@/utils/themeImages';
import { getSpaceTree, getSpaceDetail, deleteSpace, getSpaceEnergyStats, getChildList } from '/@/api/spaceLocation';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useDict } from '/@/hooks/dict';
// 引入主题配置和工具
const storesThemeConfig = useThemeConfig();
const { getDarkColor, getLightColor, hexToRgb } = useChangeColor();
const metricCardBackgroundImage = useThemeImage('metricCardBackground');

const { space_type } = useDict('space_type');
// 计算属性
const currentTheme = computed(() => storesThemeConfig.themeConfig.currentTheme);
const primaryColor = computed(() => storesThemeConfig.themeConfig.primary || currentTheme.value?.color?.primary?.normal || '#1677FF');

// 主题变量
const dashboardVars = computed(() => {
  const primary = primaryColor.value;
  return {
    '--dashboard-primary': primary,
    '--dashboard-primary-rgb': Array.isArray(hexToRgb(primary)) ? hexToRgb(primary).join(',') : '0, 148, 255',
    '--dashboard-metric-card-image': `url("${metricCardBackgroundImage.value}")`,
  };
});

// 获取指标卡片图片
const electricityUsageImage = useThemeImage('electricityUsage');
const waterUsageImage = useThemeImage('waterUsage');
const quotaUsageRateImage = useThemeImage('quotaUsageRate');
const efficiencyTargetRateImage = useThemeImage('efficiencyTargetRate');

// 获取图片的函数
const getMetricImage = (key: string) => {
  const imageMap: Record<string, string> = {
    'electricity-usage': electricityUsageImage.value,
    'water-usage': waterUsageImage.value,
    'quota-usage-rate': quotaUsageRateImage.value,
    'efficiency-target-rate': efficiencyTargetRateImage.value,
  };
  return imageMap[key];
};

// 空间树形数据
const spaceTreeData:any = ref([]);
const loading = ref(false);
const searchKeyword = ref('');
const treeRef = ref();



// 获取空间树形结构
const fetchSpaceTree = async () => {
  loading.value = true;
  try {
    const res = await getSpaceTree();
    if (res.code === 0) {
      spaceTreeData.value = res.data || [];
      // 默认选中第一个节点
      if (spaceTreeData.value.length > 0) {
        // 先设置树的当前节点
        if (treeRef.value) {
          treeRef.value.setCurrentKey(spaceTreeData.value[0].id);
        }
        // 然后加载详情
        handleCurrentChange(spaceTreeData.value[0]);
      }
    }
  } catch (error) {
    ElMessage.error('获取空间树形结构失败');
    console.error('获取空间树形结构失败:', error);
  } finally {
    loading.value = false;
  }
};

// 树节点过滤方法
const filterNode = (value:any, data:any) => {
  if (!value) return true;
  return data.spaceName.toLowerCase().includes(value.toLowerCase());
};

// 处理新增空间
const handleAdd = (data:any) => {
  console.log('新增空间:', data);
  // 打开新增弹窗
  formDialogRef.value?.openDialog({ parentId: data.id });
};

// 处理编辑空间
const handleEdit = async (data:any) => {
  console.log('编辑空间:', data);
  try {
    // 调用详情接口获取空间详细信息
    const res = await getSpaceDetail(data.id);
    if (res.code === 0) {
      // 打开编辑弹窗，传递详情数据
      formDialogRef.value?.openDialog(res.data);
    } else {
      ElMessage.error('获取空间详情失败：' + (res.message || '未知错误'));
    }
  } catch (error) {
    ElMessage.error('获取空间详情失败');
    console.error('获取空间详情失败:', error);
  }
};

// 处理删除空间
const handleDelete = async (data:any) => {
  try {
    await ElMessageBox.confirm('确定要删除该空间吗？', '删除确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });
    
    // 调用删除接口
    const res = await deleteSpace(data.id);
    if (res.code === 0) {
      ElMessage.success('删除成功');
      // 重新加载树形数据
      fetchSpaceTree();
    } else {
      ElMessage.error('删除失败：' + (res.message || '未知错误'));
    }
  } catch (error) {
    // 用户取消删除或其他错误
    if (error !== 'cancel') {
      ElMessage.error('删除失败');
      console.error('删除空间失败:', error);
    }
    return;
  }
};

// 处理查看子空间
const handleViewSubspace = async (row: any) => {
  console.log('查看子空间:', row);
  if (row && row.id) {
    // 高亮左侧树对应的节点，这会自动触发current-change事件
    if (treeRef.value) {
      treeRef.value.setCurrentKey(row.id);
    }
  }
};

// 获取空间类型标签
const getSpaceTypeLabel = (options: any, type: string) => {

  return options.find((item :any)=> item.value == type)?.label || '-';
};
// 初始化加载树形数据
onMounted(() => {
  fetchSpaceTree();
});

// 选中的空间信息
const selectedSpace = reactive({
  id: '',
  name: '',
  code: '',
  type: '',
  parent: '',
  area: 0,
  deviceCount: 0,
  energyQuota: 0,
  energyEfficiency: 8,
  manager: '',
  phone: '',
  createTime: '',
  remark: ''
});

// 能耗统计数据
const energyStatistics = reactive({
  monthlyElectricity: 0, // 本月用电 kWh
  monthlyWater: 0, // 本月用水 m³
  quotaUsageRate: 0 // 配额使用率 %
});

// 子空间列表
const subspaceList = ref([]);

// 详情加载状态
const detailLoading = ref(false);

// 加载空间详情
const loadSpaceDetail = async (spaceData: any) => {
  console.log('加载空间详情:', spaceData);
  if (spaceData && spaceData.id) {
    detailLoading.value = true;
    try {
      // 准备需要调用的接口
      const requests = [
        getSpaceDetail(spaceData.id),
        getSpaceEnergyStats(spaceData.id)
      ];
      
      // 只有当空间有子节点时，才调用获取子空间列表的接口
      if (spaceData.child && spaceData.child.length > 0) {
        requests.push(getChildList(spaceData.id));
      }
      
      // 并行调用接口
      const responses = await Promise.all(requests);
      
      // 处理空间详情响应
      const detailRes = responses[0];
      if (detailRes.code === 0) {
        // 更新选中的空间信息
        Object.assign(selectedSpace, {
          id: detailRes.data.id,
          name: detailRes.data.spaceName,
          code: detailRes.data.spaceCode,
          type: detailRes.data.spaceType,
          parent: detailRes.data.parentName || '',
          area: detailRes.data.buildingArea || 0,
          deviceCount: detailRes.data.deviceCount || 0,
          energyQuota: detailRes.data.energyQuota || 0,
          manager: detailRes.data.responsiblePerson || '',
          phone: detailRes.data.phone || '',
          createTime: detailRes.data.createTime || '',
          remark: detailRes.data.remark || ''
        });
      }
      
      // 处理能耗统计响应
      const energyRes = responses[1];
      if (energyRes.code === 0) {
        // 更新能耗统计数据
        Object.assign(energyStatistics, {
          monthlyElectricity: energyRes.data.monthlyElectricity || 0,
          monthlyWater: energyRes.data.monthlyWater === '' ? 0 : (energyRes.data.monthlyWater || 0),
          quotaUsageRate: energyRes.data.quotaUsageRate === '' ? 0 : (energyRes.data.quotaUsageRate || 0)
        });
      }
      
      // 处理子空间列表响应（如果有）
      if (responses.length > 2) {
        const childRes = responses[2];
        if (childRes.code === 0) {
          // 更新子空间列表
          subspaceList.value = childRes.data || [];
        }
      } else {
        // 如果没有调用子空间列表接口，清空子空间列表
        subspaceList.value = [];
      }
    } catch (error) {
      ElMessage.error('获取空间信息失败');
      console.error('获取空间信息失败:', error);
    } finally {
      detailLoading.value = false;
    }
  }
};

// 处理节点选择
const handleCurrentChange = async (data: any) => {
  loadSpaceDetail(data);
};

// 新增空间弹窗引用
const formDialogRef = ref();

</script>

<style scoped>
@import '/@/theme/mixins/index.scss';
.space-location-container {
  padding: 20px;
  height: 100%;
  overflow: hidden;
}

.flex {
  display: flex;
  height: 100%;
  gap: 20px;
}

/* 左侧树形结构 */
.space-tree-container {
  width: var(--layout-tree-width);
  background: var(--next-color-white);
  border-radius: 8px;
  border: 1px solid var(--el-border-color-light, #ebeef5);
  display: flex;
  flex-direction: column;
}

.tree-header {
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .el-button {
    padding: 5px 16px;
    font-size: 14px;
  }
}

.tree-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.search-box {
  padding: 16px;
}

.search-box .el-input {
  width: 100%;
}

.space-tree-container .el-tree {
  flex: 1;
  overflow-y: auto;
  padding: 0 16px 16px;
}

.tree-node {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.tree-operations {
  opacity: 0;
  transition: opacity 0.3s;
  display: flex;
  gap: 12px;
  padding-right: 14px;
}

.tree-node:hover .tree-operations {
  opacity: 1;
}

/* 右侧详情面板 */
.space-detail-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: auto;
}

.outer-border-container {
  border: 1px solid var(--el-border-color-light, #ebeef5);
  border-radius: 8px;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-card h3,
.energy-stat-card h3,
.subspace-table-card h3 {
  margin: 0 0 20px;
  font-size: 18px;
  font-weight: 600;
}

/* 描述组件样式 */
:deep(.el-descriptions) {
  border-radius: 10px;
  overflow: hidden;
}







/* 指标卡片样式 */
.metrics-row {
  margin-bottom: 20px;
}

.metric-grid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  align-items: stretch;
  gap: clamp(12px, 0.83333vw, 16px);
}

.metric-card {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 90px;
  align-items: center;
  height: 110px;
  padding: clamp(14px, 0.83333vw, 16px) clamp(16px, 1.04167vw, 20px);
  border-radius: clamp(16px, 1.04167vw, 20px);
  background-color: #ffffff;
  background-image: var(--dashboard-metric-card-image);
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
  border: none;
  box-shadow: none;
  overflow: hidden;
}

.metric-card__content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: clamp(4px, 0.3125vw, 6px);
  color: var(--theme-text-system);
}

.metric-card__label {
  font-size: 14px;
  font-weight: 700;
  color: var(--theme-text-primaryTitle);
  line-height: 1.2;
  margin: 0;
}

.metric-card__value {
  display: flex;
  align-items: flex-end;
  gap: 6px;
  line-height: 1;
}

.metric-card__value span {
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--theme-text-system);
}

.metric-card__value small {
  margin-bottom: 3px;
  font-size: clamp(14px, 0.83333vw, 16px);
  font-weight: 700;
  color: var(--theme-text-dataAssist);
}

.metric-card__context {
  display: none;
  margin: 0;
}

.metric-card__delta {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  width: fit-content;
  padding: 0;
  border-radius: 0;
  line-height: 1.1;
}

.metric-card__delta.is-up {
  background: transparent;
  color: #ef4444;
}

.metric-card__delta.is-down {
  background: transparent;
  color: #46b538;
}

.metric-card__delta-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--theme-text-dataAssist);
}

.metric-card__delta-value {
  font-size: 16px;
  font-weight: 700;
}

.metric-card__visual {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
  min-height: 0;
  z-index: 1;
}

.metric-card__icon-shell {
  position: relative;
  width: 90px;
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.metric-icon {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 8px 14px var(--metric-accent-soft));
}

.metric-icon--image {
  object-fit: contain;
}

/* 子空间表格 */
.subspace-table-card {
  margin-top: auto;
}

/* 树图标样式 */
.tree-icon {
  width: 16px;
  height: 16px;
  vertical-align: middle;
}
</style>
