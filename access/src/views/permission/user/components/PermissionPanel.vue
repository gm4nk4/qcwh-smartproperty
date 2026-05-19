<template>
	<!-- 右侧权限主内容区 -->
	<main class="right-content">
		<!-- 平台角色模块 -->
		<div class="permission-module">
			<h4 class="module-title">
				<span class="title-bar"></span>
				平台角色（已分配 {{ platformRoles.length }} 个）
			</h4>
			<!-- 平台角色卡片列表 -->
			<div class="role-cards">
				<!-- 单张平台角色卡片 -->
				<div v-for="(role, index) in platformRoles" :key="index" class="role-card">
					<div class="role-header">
						<div class="role-icon">{{ role.icon }}</div>
						<div class="role-name">
							{{ role.name }}
							<el-tag v-if="role.isBuiltIn" class="built-in-tag" effect="plain" type="info">
								内置
							</el-tag>
						</div>
					</div>
					<div class="role-desc">{{ role.desc }}</div>
				</div>
			</div>
		</div>

		<!-- 子应用权限合集模块 -->
		<div class="permission-module">
			<h4 class="module-title">
				<span class="title-bar"></span>
				子应用权限合集（覆盖 {{ subAppPermissions.length }} 个子应用，含平台角色继承 + 直接分配）
			</h4>

			<!-- 子应用权限列表 -->
			<div class="sub-app-list">
				<div v-for="(app, appIndex) in subAppPermissions" :key="appIndex" class="sub-app-item">
					<!-- 子应用头部 -->
					<div class="sub-app-header">
						<div class="sub-app-name">
							<el-icon class="app-icon"><CircleCheck /></el-icon>
							{{ app.name }}
						</div>
						<div class="sub-app-roles">
							<el-tag
								v-for="(role, roleIndex) in app.roles"
								:key="roleIndex"
								class="role-tag"
								type="info"
								effect="plain"
							>
								{{ role }}
							</el-tag>
						</div>
						<div class="check-icon">
							<el-icon color="#00b42a"><CircleCheck /></el-icon>
						</div>
					</div>

					<!-- 权限详情 -->
					<div v-if="app.permissions" class="permission-detail">
						<div class="permission-column">
							<div class="column-title">
								<el-icon><Share /></el-icon>
								平台角色继承
							</div>
							<div class="permission-card">
								<div class="permission-header">
									<el-icon color="#0088ff"><CircleCheck /></el-icon>
									<span>系统管理员 · 来自 平台超管</span>
								</div>
								<div class="permission-tags">
									<el-tag
										v-for="(perm, permIndex) in app.permissions.platformInherit"
										:key="permIndex"
										type="warning"
										size="small"
										effect="plain"
									>
										{{ perm }}
									</el-tag>
								</div>
							</div>
						</div>

						<div class="permission-column">
							<div class="column-title">
								<el-icon><CircleCheck /></el-icon>
								直接分配
							</div>
							<div class="permission-card">
								<div class="permission-header">
									<el-icon color="#0088ff"><CircleCheck /></el-icon>
									<span>工单管理员 · 直接分配</span>
								</div>
								<div class="permission-tags">
									<el-tag
										v-for="(perm, permIndex) in app.permissions.direct"
										:key="permIndex"
										type="success"
										size="small"
										effect="plain"
									>
										{{ perm }}
									</el-tag>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</main>
</template>

<script setup lang="ts">
/**
 * @component PermissionPanel
 * @description 权限信息面板组件
 * @props platform-roles - 平台角色列表
 * @props sub-app-permissions - 子应用权限列表
 */
import { CircleCheck, Share } from '@element-plus/icons-vue';
import type { PlatformRole, SubAppPermission } from '../type';

const props = defineProps<{
	platformRoles: PlatformRole[];
	subAppPermissions: SubAppPermission[];
}>();
</script>

<style lang="scss" scoped>
.right-content {
	flex: 1;
	padding: 24px;
	background: #fff;
	overflow-y: auto;

	.permission-module {
		margin-bottom: 28px;

		.module-title {
			display: flex;
			align-items: center;
			gap: 8px;
			font-size: 14px;
			font-weight: 600;
			color: #333;
			margin-bottom: 16px;

			.title-bar {
				width: 4px;
				height: 16px;
				background: #0088ff;
				border-radius: 2px;
			}
		}

		.role-cards {
			display: flex;
			gap: 16px;

			.role-card {
				flex: 1;
				min-width: 180px;
				padding: 16px;
				background: #fff;
				border: 1px solid #ebeef5;
				border-radius: 8px;
				box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

				.role-header {
					display: flex;
					align-items: center;
					gap: 10px;
					margin-bottom: 10px;

					.role-icon {
						width: 36px;
						height: 36px;
						border-radius: 6px;
						background: linear-gradient(135deg, #0088ff 0%, #00a0ff 100%);
						color: #fff;
						display: flex;
						align-items: center;
						justify-content: center;
						font-size: 16px;
						font-weight: 600;
					}

					.role-name {
						display: flex;
						align-items: center;
						gap: 6px;
						font-size: 14px;
						font-weight: 600;
						color: #333;

						.built-in-tag {
							font-size: 11px;
							padding: 0 6px;
							height: 18px;
							line-height: 16px;
						}
					}
				}

				.role-desc {
					font-size: 12px;
					color: #909399;
				}
			}
		}

		.sub-app-list {
			display: flex;
			flex-direction: column;
			gap: 12px;

			.sub-app-item {
				padding: 16px;
				background: #f9fafc;
				border-radius: 8px;

				.sub-app-header {
					display: flex;
					align-items: center;
					gap: 12px;

					.sub-app-name {
						display: flex;
						align-items: center;
						gap: 6px;
						font-size: 14px;
						font-weight: 500;
						color: #333;

						.app-icon {
							color: #606266;
						}
					}

					.sub-app-roles {
						flex: 1;
						display: flex;
						flex-wrap: wrap;
						gap: 6px;

						.role-tag {
							font-size: 12px;
						}
					}

					.check-icon {
						.el-icon {
							font-size: 20px;
						}
					}
				}

				.permission-detail {
					display: flex;
					gap: 16px;
					margin-top: 12px;
					padding-top: 12px;
					border-top: 1px solid #ebeef5;

					.permission-column {
						flex: 1;

						.column-title {
							display: flex;
							align-items: center;
							gap: 6px;
							font-size: 13px;
							color: #606266;
							margin-bottom: 10px;
						}

						.permission-card {
							padding: 12px;
							background: #fff;
							border-radius: 6px;

							.permission-header {
								display: flex;
								align-items: center;
								gap: 6px;
								font-size: 13px;
								color: #333;
								margin-bottom: 8px;
							}

							.permission-tags {
								display: flex;
								flex-wrap: wrap;
								gap: 6px;
							}
						}
					}
				}
			}
		}
	}
}
</style>
