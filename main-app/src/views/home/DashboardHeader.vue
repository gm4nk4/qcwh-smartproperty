<template>
	<div class="dashboard-header">
		<div class="header-left">
			<div class="user-welcome">
				<el-icon><User /></el-icon>
				<span>下午好，{{ username }}</span>
			</div>
			<div class="header-stats">
				<div class="stat-item">
					<span class="stat-label">今日访客</span>
					<span class="stat-value">128,843</span>
					<span class="stat-trend up">+2.5%</span>
				</div>
				<div class="stat-item">
					<span class="stat-label">在线设备</span>
					<span class="stat-value">1,212</span>
					<span class="stat-trend">+1.2%</span>
				</div>
				<div class="stat-item">
					<span class="stat-label">本月收入</span>
					<span class="stat-value">¥93,85万</span>
					<span class="stat-trend up">+3.1%</span>
				</div>
				<div class="stat-item">
					<span class="stat-label">未处理工单</span>
					<span class="stat-value">8,432</span>
					<span class="stat-trend up">0</span>
				</div>
			</div>
		</div>
		<div class="header-right">
			<i
				@click="onScreenfullClick"
				class="iconfont"
				:title="isScreenfull ? $t('user.title6') : $t('user.title5')"
				:class="!isScreenfull ? 'icon-fullscreen' : 'icon-tuichuquanping'"
			></i>
			<div class="action-buttons">
				<el-button type="primary" class="logout-btn" @click="logout" plain size="small">退出登录</el-button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { User } from '@element-plus/icons-vue';
import screenfull from 'screenfull';
import { ElMessage } from 'element-plus';
import { useMicroApp } from '/@/stores/microApp';

const microAppStore = useMicroApp();

interface Props {
	username?: string;
	isScreenfull?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	username: '管理员',
	isScreenfull: false,
});

const emit = defineEmits<{
	(e: 'logout'): void;
}>();

const logout = () => {
	emit('logout');
};

// 全屏点击时
const onScreenfullClick = () => {
	if (!screenfull.isEnabled) {
		ElMessage.warning('暂不不支持全屏');
		return false;
	}
	screenfull.toggle();
	screenfull.on('change', () => {
		if (screenfull.isFullscreen) {
			microAppStore.setIsScreenfull(true);
		} else {
			microAppStore.setIsScreenfull(false);
		}
	});
};
</script>

<style scoped lang="scss">
.dashboard-header {
	background: linear-gradient(135deg, #1890ff 0%, #722ed1 100%);
	padding: 16px 24px;
	display: flex;
	border-radius: 8px;
	height: 100%;
	overflow: hidden;
	justify-content: space-between;
	align-items: center;

	.header-left {
		display: flex;
		align-items: center;
		gap: 32px;

		.user-welcome {
			display: flex;
			align-items: center;
			gap: 8px;
			color: white;
			font-size: 15px;
		}

		.header-stats {
			display: flex;
			gap: 32px;

			.stat-item {
				display: flex;
				flex-direction: column;
				align-items: center;
				background: rgba(255, 255, 255, 0.15);
				padding: 8px 20px;
				border-radius: 8px;

				.stat-label {
					color: rgba(255, 255, 255, 0.85);
					font-size: 12px;
				}

				.stat-value {
					color: white;
					font-size: 16px;
					font-weight: 600;
				}

				.stat-trend {
					font-size: 11px;
					color: rgba(255, 255, 255, 0.85);

					&.up {
						color: #52c41a;
					}
				}
			}
		}
	}
  .header-right {
    display: flex;
    align-items: center;
    gap: 16px;
    color: white;
    .iconfont {
      font-size: 30px;
      cursor: pointer;
    }
  }
	.logout-btn {
		color: white;
	}
}
</style>
