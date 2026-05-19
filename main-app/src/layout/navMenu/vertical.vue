<template>
	<el-menu
		class="layout-nav-menu"
		router
		:default-active="state.defaultActive"
		:style="sidebarCssVars"
		background-color="transparent"
		:collapse="state.isCollapse"
		:unique-opened="getThemeConfig.isUniqueOpened"
		:collapse-transition="false"
	>
		<template v-for="val in menuLists">
			<el-sub-menu class="layout-nav-menu__group" :index="val.path" v-if="val.children && val.children.length > 0" :key="val.path">
				<template #title>
					<span class="layout-nav-menu__icon" :class="{ 'is-empty': !hasMenuIcon(val) }">
						<SvgIcon v-if="hasMenuIcon(val)" :name="val.meta.icon" :size="15" :color="sidebarTokens.iconColor" />
					</span>
					<span class="layout-nav-menu__label">{{ other.setMenuI18n(val) }}</span>
				</template>
				<SubItem :chil="val.children" :depth="1" />
			</el-sub-menu>
			<template v-else>
				<el-menu-item class="layout-nav-menu__leaf" :class="{ 'is-no-icon': !hasMenuIcon(val) }" :index="val.path" :key="val.path">
					<span class="layout-nav-menu__icon" :class="{ 'is-empty': !hasMenuIcon(val) }">
						<SvgIcon v-if="hasMenuIcon(val)" :name="val.meta.icon" :size="15" :color="getLeafIconColor(val)" />
					</span>
					<template #title v-if="!val.meta.isLink || (val.meta.isLink && val.meta.isIframe)">
						<span class="layout-nav-menu__label">{{ other.setMenuI18n(val) }}</span>
					</template>
					<template #title v-else>
						<a class="w100 layout-nav-menu__label" @click.prevent="onALinkClick(val)">{{ other.setMenuI18n(val) }}</a>
					</template>
				</el-menu-item>
			</template>
		</template>
	</el-menu>
</template>

<script setup lang="ts" name="navMenuVertical">
import { RouteRecordRaw } from 'vue-router';
import { useThemeConfig } from '/@/stores/themeConfig';
import other from '/@/utils/other';
import { useThemeSidebarTokens } from '/@/utils/themeSidebar';

// 引入组件
const SubItem = defineAsyncComponent(() => import('/@/layout/navMenu/subItem.vue'));

// 定义父组件传过来的值
const props = defineProps({
	// 菜单列表
	menuList: {
		type: Array<RouteRecordRaw>,
		default: () => [],
	},
});

// 定义变量内容
const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);
const route = useRoute();
const themeSidebarTokens = useThemeSidebarTokens();
const state = reactive({
	defaultActive: route.meta.isDynamic ? route.meta.isDynamicPath : route.path,
	isCollapse: false,
});

// 获取父级菜单数据
const menuLists = computed(() => {
	return <RouteItems>props.menuList;
});
// 获取布局配置信息
const getThemeConfig = computed(() => {
	return themeConfig.value;
});
const sidebarTokens = computed(() => themeSidebarTokens.value);
const sidebarCssVars = computed(() => ({
	'--layout-sidebar-menu-icon-bg': sidebarTokens.value.iconBg,
	'--layout-sidebar-menu-icon-color': sidebarTokens.value.iconColor,
	'--layout-sidebar-menu-icon-active-bg': sidebarTokens.value.activeIconBg,
	'--layout-sidebar-menu-icon-active-color': sidebarTokens.value.activeIconColor,
	'--layout-sidebar-menu-marker-color': sidebarTokens.value.activeMarkerColor,
	'--layout-sidebar-menu-text-color': sidebarTokens.value.textColor,
	'--layout-sidebar-menu-subtext-color': sidebarTokens.value.subTextColor,
	'--layout-sidebar-menu-active-shadow': sidebarTokens.value.activeShadow,
}));
// 菜单高亮（详情时，父级高亮）
const setParentHighlight = (currentRoute: RouteToFrom) => {
	const { path, meta } = currentRoute;
	const pathSplit = meta?.isDynamic ? meta.isDynamicPath!.split('/') : path!.split('/');
	if (pathSplit.length >= 4 && meta?.isHide) return pathSplit.splice(0, 3).join('/');
	else return path;
};
const hasMenuIcon = (val: RouteItem) => Boolean(val.meta?.icon);
const isLeafActive = (val: RouteItem) => state.defaultActive === val.path;
const getLeafIconColor = (val: RouteItem) => {
	return isLeafActive(val) ? sidebarTokens.value.activeIconColor : sidebarTokens.value.iconColor;
};
// 打开外部链接
const onALinkClick = (val: RouteItem) => {
	other.handleOpenLink(val);
};
// 页面加载时
onMounted(() => {
	state.defaultActive = setParentHighlight(route);
});
// 路由更新时
onBeforeRouteUpdate((to) => {
	state.defaultActive = setParentHighlight(to);
	const clientWidth = document.body.clientWidth;
	if (clientWidth < 1000) themeConfig.value.isCollapse = false;
});
// 设置菜单的收起/展开
watch(
	themeConfig.value,
	() => {
		document.body.clientWidth <= 1000 ? (state.isCollapse = false) : (state.isCollapse = themeConfig.value.isCollapse);
	},
	{
		immediate: true,
	}
);
</script>

<style scoped lang="scss">
.layout-nav-menu {
	padding: 6px 0 18px !important;
	--layout-sidebar-item-height: 44px;

	:deep(.el-menu-item),
	:deep(.el-sub-menu__title) {
		border-radius: 13px;
		background: transparent !important;
		display: flex;
		align-items: center;
		min-width: 0;
	}

	:deep(.layout-nav-menu__leaf) {
		position: relative;
		width: auto;
		margin: 0 var(--layout-sidebar-item-offset) 8px !important;
		padding: 0 14px !important;
		height: var(--layout-sidebar-item-height) !important;
		line-height: var(--layout-sidebar-item-height) !important;
		color: var(--layout-sidebar-menu-text-color);
		font-size: 16px;
		font-weight: 600;
		border-radius: 13px;
	}

	:deep(.layout-nav-menu__leaf::before) {
		content: '';
		position: absolute;
		left: calc(var(--layout-sidebar-item-offset) * -1);
		top: 50%;
		width: 6px;
		height: 24px;
		border-radius: 0 6px 6px 0;
		background: transparent;
		transform: translateY(-50%);
		box-shadow: none;
		transition:
			background 0.2s ease,
			box-shadow 0.2s ease;
	}

	:deep(.layout-nav-menu__leaf.is-active) {
		background: #ffffff !important;
		background-color: #ffffff !important;
		box-shadow: var(--layout-sidebar-menu-active-shadow);
		color: var(--layout-sidebar-menu-icon-active-color) !important;
	}

	:deep(.layout-nav-menu__leaf.is-active::before) {
		background: var(--layout-sidebar-menu-marker-color);
		box-shadow: 0 20px 27px 0 rgba(0, 0, 0, 0.05);
	}

	:deep(.layout-nav-menu__leaf .layout-nav-menu__icon) {
		background: transparent !important;
	}

	:deep(.layout-nav-menu__leaf.is-active .layout-nav-menu__icon) {
		background: transparent !important;
	}

	:deep(.layout-nav-menu__group) {
		width: auto;
		margin-bottom: 4px;
	}

	:deep(.layout-nav-menu__group > .el-sub-menu__title) {
		width: auto;
		margin: 0 var(--layout-sidebar-item-offset) 8px !important;
		padding: 0 38px 0 14px !important;
		height: var(--layout-sidebar-item-height) !important;
		line-height: var(--layout-sidebar-item-height) !important;
		color: var(--layout-sidebar-menu-text-color);
		font-size: 16px;
		font-weight: 600;
		border-radius: 13px;
		position: relative;
	}

	:deep(.layout-nav-menu__group.is-active > .el-sub-menu__title),
	:deep(.layout-nav-menu__group.is-opened > .el-sub-menu__title) {
		color: #1F2D3D;
		span {
font-weight: 700;
		}
		
		background: transparent !important;
	}

	:deep(.layout-nav-menu__group > .el-sub-menu__title:hover) {
		background: transparent !important;
	}

	:deep(.layout-nav-menu__icon) {
		width: 16px;
		height: 16px;
		margin-right: 10px;
		border-radius: 5px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex: none;
		background: transparent !important;
		transition: background 0.2s ease;
	}

	:deep(.layout-nav-menu__icon.is-empty) {
		background: transparent !important;
	}

	:deep(.layout-nav-menu__label) {
		display: inline-flex;
		align-items: center;
		flex: 1;
		min-width: 0;
		max-width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		letter-spacing: 0.01em;
		padding-right: 2px;
	}

	:deep(.el-sub-menu__icon-arrow) {
		position: absolute !important;
		right: 14px;
		top: 50%;
		margin-top: -6px;
		font-size: 12px;
		font-weight: 600;
		color: var(--layout-sidebar-menu-subtext-color);
		
	}

	:deep(.el-menu--inline) {
		padding: 2px 0 4px !important;
	}

	:deep(.layout-nav-menu__child),
	:deep(.layout-nav-menu__child-group > .el-sub-menu__title) {
		position: relative;
		margin: 0 var(--layout-sidebar-item-offset) 8px 36px !important;
		padding: 0 14px !important;
		height: var(--layout-sidebar-item-height) !important;
		line-height: var(--layout-sidebar-item-height) !important;
		color: var(--layout-sidebar-menu-text-color) !important;
		font-size: 16px;
		font-weight: 600;
		border-radius: 13px;
		background: transparent !important;
		transition:
			background 0.2s ease,
			color 0.2s ease,
			box-shadow 0.2s ease;
	}

	:deep(.layout-nav-menu__child::before),
	:deep(.layout-nav-menu__child-group > .el-sub-menu__title::before) {
		content: '';
		position: absolute;
		left: -36px;
		top: 50%;
		width: 6px;
		height: 24px;
		border-radius: 0 6px 6px 0;
		background: transparent;
		transform: translateY(-50%);
		box-shadow: none;
		transition:
			background 0.2s ease,
			box-shadow 0.2s ease;
	}

	:deep(.layout-nav-menu__child.is-active) {
		background: #ffffff !important;
		background-color: #ffffff !important;
		box-shadow: var(--layout-sidebar-menu-active-shadow);
		color: var(--layout-sidebar-menu-icon-active-color) !important;
	}

	:deep(.layout-nav-menu__child.is-active::before) {
		background: var(--layout-sidebar-menu-marker-color);
		box-shadow: 0 20px 27px 0 rgba(0, 0, 0, 0.05);
	}

	:deep(.layout-nav-menu__child-group.is-active > .el-sub-menu__title.is-active::before) {
		background: var(--layout-sidebar-menu-marker-color);
		box-shadow: 0 20px 27px 0 rgba(0, 0, 0, 0.05);
	}

	:deep(.layout-nav-menu__child:hover),
	:deep(.layout-nav-menu__child-group > .el-sub-menu__title:hover) {
		background: transparent !important;
	}

	:deep(.layout-nav-menu__child-group.is-active > .el-sub-menu__title),
	:deep(.layout-nav-menu__child-group.is-opened.is-active > .el-sub-menu__title),
	:deep(.layout-nav-menu__child-group.is-opened > .el-sub-menu__title) {
		background: transparent !important;
		background-color: transparent !important;
		box-shadow: none !important;
		color: var(--layout-sidebar-menu-subtext-color) !important;
	}

	:deep(.layout-nav-menu__child .layout-nav-menu__label),
	:deep(.layout-nav-menu__child-group > .el-sub-menu__title .layout-nav-menu__label) {
		margin-left: 0;
	}

	:deep(.el-menu--collapse .layout-nav-menu__icon) {
		margin-right: 0;
	}

	:deep(.el-menu--collapse .layout-nav-menu__leaf),
	:deep(.el-menu--collapse .layout-nav-menu__group > .el-sub-menu__title) {
		width: calc(100% - 8px) !important;
		margin-left: auto !important;
		margin-right: auto !important;
		padding: 0 !important;
		justify-content: center;
	}

	:deep(.el-menu--collapse .layout-nav-menu__group) {
		width: calc(100% - 8px) !important;
		margin-left: auto !important;
		margin-right: auto !important;
	}

	:deep(.el-menu--collapse .layout-nav-menu__leaf::before) {
		opacity: 0;
	}
}
</style>
