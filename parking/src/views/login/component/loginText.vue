<template>
  <div class="project-management-page">
    <div class="container">
      <h1 class="page-title">统一项目管理平台</h1>
      <div class="bars-container">
        <div class="bar bar-blue"></div>
        <div class="bar bar-purple"></div>
        <div class="bar bar-cyan"></div>
      </div>
      <div class="card-group">
        <div class="function-card">
          <div class="card-icon-wrapper card-icon-wrapper-1">
            <el-icon class="card-icon"><Grid /></el-icon>
          </div>
          <div class="card-text">
            <div class="card-title">工作台看板</div>
            <div class="card-desc">消息待办一触即达</div>
          </div>
        </div>

        <div class="function-card">
          <div class="card-icon-wrapper card-icon-wrapper-2">
            <el-icon class="card-icon"><Refresh /></el-icon>
          </div>
          <div class="card-text">
            <div class="card-title">全流程管理</div>
            <div class="card-desc">售前交付售后全覆盖</div>
          </div>
        </div>

        <div class="function-card">
          <div class="card-icon-wrapper card-icon-wrapper-3">
            <el-icon class="card-icon"><TrendCharts /></el-icon>
          </div>
          <div class="card-text">
            <div class="card-title">数据可视化</div>
            <div class="card-desc">多维度统计看板</div>
          </div>
        </div>

        <div class="function-card">
          <div class="card-icon-wrapper card-icon-wrapper-4">
            <el-icon class="card-icon"><User color="#eee7e7"/></el-icon>
          </div>
          <div class="card-text">
            <div class="card-title">多角色权限</div>
            <div class="card-desc">灵活完善权限体系</div>
          </div>
        </div>
      </div>

      <div class="bottom-tags">
        智能化 <span class="tag-sep">·</span> 可视化 <span class="tag-sep">·</span> 协同化 <span class="tag-sep">·</span> 数字化
      </div>
    </div>
  </div>
</template>

<script setup>
import { Grid, Refresh, TrendCharts, User } from '@element-plus/icons-vue'
</script>

<style scoped>
.project-management-page {
  padding: 2rem 0;
}
.page-title{
  font-size: 4rem;
  color: #fff;
  background-image: linear-gradient(to right, #ffffff 0%, #e0edff 30%, #ffffff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin-bottom: 2rem;
}
.container {
  max-width: 70%;
  margin: 0 auto;
  padding: 0 2rem;
}
.bars-container {
  display: flex;
  flex-direction: row;
  gap: 12px;
  margin-bottom: 3rem;
  width: fit-content;
}

.bar {
  height: 4px;
  border-radius: 2px;
  flex-shrink: 0;
}

.bar-blue {
  width: 50px;
  background: linear-gradient(90deg, #60a5fa, #3b82f6);
}

.bar-purple {
  width: 30px;
  background: linear-gradient(90deg, #c084fc, #a855f7);
}

.bar-cyan {
  width: 15px;
  background: linear-gradient(90deg, #67e8f9, #22d3ee );
}
.card-group {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
}

.function-card {
  flex: 1 1 calc(50% - 1rem);
  min-width: 260px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  border-radius: 8px;
  padding: 1.5rem;
  color: #fff;
  transition: transform 0.3s ease, border-color 0.3s ease;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.function-card:hover {
  transform: translateY(-5px);
  border-color: rgba(255, 255, 255, 0.25);
}

.card-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.15);
  transition: border-color 0.3s ease;
}

.function-card:hover .card-icon-wrapper {
  border-color: rgba(255, 255, 255, 0.25);
}

.card-icon-wrapper-1 {
  background: rgba(59, 130, 246, 0.4);
}
.card-icon-wrapper-2 {
  background: rgba(34, 211, 238, 0.4);
}
.card-icon-wrapper-3 {
  background: rgba(168, 85, 247, 0.4);
}
.card-icon-wrapper-4 {
  background: rgba(99, 102, 241, 0.45);
}

.card-icon {
  font-size: 1.6rem;
}

.card-icon-wrapper-1 .card-icon {
  color: #93c5fd;
}
.card-icon-wrapper-2 .card-icon {
  color: #67e8f9;
}
.card-icon-wrapper-3 .card-icon {
  color: #d8b4fe;
}
.card-icon-wrapper-4 .card-icon {
  color: transparent;
  stroke: #f0f9ff;
  stroke-width: 2.5;
  fill: transparent;
}

.card-text {
  flex: 1;
}
.card-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.4rem;
}
.card-desc {
  font-size: 0.9rem;
  opacity: 0.8;
}

.bottom-tags {
  margin-top: 3rem;
  font-size: 0.9rem;
  color: #5980bf;
}
.tag-sep {
  margin: 0 12px;
}
</style>