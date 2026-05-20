<template>
	<!-- 左侧用户信息栏 -->
	<div class="left-sidebar">
		<!-- 用户卡片 -->
		<div class="user-card">
			<div class="user-avatar-wrapper">
				<el-avatar :size="72" :src="userAvatarUrl" />
			</div>
			<div class="user-info-text">
				<div class="user-name-row">
					<span class="username">{{ userInfo.username }}</span>
					<span v-if="userInfo.isOnline" class="online-badge">在线</span>
				</div>
				<el-tag class="position-tag" effect="plain" type="primary">
					{{ userInfo.position }}
				</el-tag>
			</div>
		</div>

		<!-- 基础信息 -->
		<div class="info-section">
			<h4 class="section-title">基础信息</h4>
			<div class="info-list">
				<div class="info-item">
					<span class="info-label">用户ID：</span>
					<span class="info-value">{{ userInfo.userId }}</span>
				</div>
				<div class="info-item">
					<span class="info-label">所属部门：</span>
					<span class="info-value">{{ userInfo.department }}</span>
				</div>
				<div class="info-item">
					<span class="info-label">手机号码：</span>
					<span class="info-value">{{ userInfo.phone }}</span>
				</div>
				<div class="info-item">
					<span class="info-label">电子邮箱：</span>
					<span class="info-value">{{ userInfo.email }}</span>
				</div>
				<div class="info-item">
					<span class="info-label">创建时间：</span>
					<span class="info-value">{{ userInfo.createTime }}</span>
				</div>
				<div class="info-item">
					<span class="info-label">最后登录：</span>
					<span class="info-value">{{ userInfo.lastLogin }}</span>
				</div>
			</div>
		</div>

		<!-- 登录日志 -->
		<div class="info-section">
			<h4 class="section-title">登录日志（近5次）</h4>
			<div class="login-log-list">
				<div v-for="(log, index) in loginLogs" :key="index" class="log-item">
					<span class="log-time">{{ log.time }}</span>
					<span class="log-detail">{{ log.terminal }} · {{ log.ip }}</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
/**
 * @component UserInfoPanel
 * @description 用户信息面板组件
 * @props user-info - 用户基本信息
 * @props login-logs - 登录日志列表
 */
import { computed } from 'vue';
import type { UserInfo, LoginLog } from '../type';

const props = defineProps<{
	userInfo: UserInfo;
	loginLogs: LoginLog[];
}>();

/**
 * 用户头像 URL（使用 placeholder）
 */
const userAvatarUrl = computed(() => {
	return 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png';
});
</script>

<style lang="scss" scoped>
.left-sidebar {
	width: 280px;
	padding: 24px 20px;
	background: #f5f7fa;
	border-right: 1px solid #ebeef5;

	.user-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-bottom: 20px;
		border-bottom: 1px solid #ebeef5;
		margin-bottom: 20px;

		.user-avatar-wrapper {
			position: relative;
			margin-bottom: 12px;

			.online-status {
				position: absolute;
				bottom: -4px;
				right: 50%;
				transform: translateX(50%);
				display: flex;
				align-items: center;
				gap: 4px;
				padding: 2px 8px;
				background: #fff;
				border-radius: 12px;
				box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
				font-size: 12px;
				color: #00b42a;

				.status-dot {
					width: 8px;
					height: 8px;
					background: #00b42a;
					border-radius: 50%;
				}
			}
		}

		.user-info-text {
			text-align: center;

			.user-name-row {
				display: flex;
				align-items: center;
				justify-content: center;
				gap: 8px;
				margin-bottom: 8px;

				.username {
					font-size: 18px;
					font-weight: 600;
					color: #333;
				}

				.online-badge {
					font-size: 12px;
					color: #00b42a;
				}
			}

			.position-tag {
				border-color: #0088ff;
				color: #0088ff;
				background: rgba(0, 136, 255, 0.08);
			}
		}
	}

	.info-section {
		margin-bottom: 24px;

		.section-title {
			font-size: 14px;
			font-weight: 600;
			color: #333;
			margin-bottom: 12px;
		}

		.info-list {
			display: flex;
			flex-direction: column;
			gap: 10px;

			.info-item {
				display: flex;
				font-size: 13px;

				.info-label {
					color: #909399;
					min-width: 72px;
				}

				.info-value {
					color: #333;
					flex: 1;
				}
			}
		}

		.login-log-list {
			display: flex;
			flex-direction: column;
			gap: 8px;

			.log-item {
				display: flex;
				flex-direction: column;
				gap: 2px;

				.log-time {
					font-size: 12px;
					color: #606266;
				}

				.log-detail {
					font-size: 12px;
					color: #909399;
				}
			}
		}
	}
}
</style>
