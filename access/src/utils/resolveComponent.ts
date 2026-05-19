import type { Component } from 'vue';
import * as SettingsComponents from '@zhqc-smart/settings';
import * as AdminComponents from '@zhqc-smart/admin';

type LazyComponent = () => Promise<Component>;

const componentMap: Record<string, Component> = {
	'/set/daemon/extCache/index': SettingsComponents.SetDaemonExtCache,
	'/set/daemon/logs/index': SettingsComponents.SetDaemonLogs,
	'/set/daemon/logs/loginLog/index': SettingsComponents.SetDaemonLoginLog,
	'/set/daemon/logs/operateLog/index': SettingsComponents.SetDaemonOperateLog,
	'/set/daemon/onlineUsers/index': SettingsComponents.SetDaemonOnlineUsers,
	'/set/menu/index': SettingsComponents.SetMenu,
	'/set/operation/holiday/index': SettingsComponents.SetOperationHoliday,
	'/set/operation/interface/index': SettingsComponents.SetOperationInterface,
	'/set/operation/notice/index': SettingsComponents.SetOperationNotice,
	'/set/operation/space/index': SettingsComponents.SetOperationSpace,
	'/set/systemConfiguration/basicConfig/index': SettingsComponents.SetSystemConfigurationBasicConfig,
	'/set/systemConfiguration/basicConfig/loginConfig/index': SettingsComponents.SetSystemConfigurationLoginConfig,
	'/set/systemConfiguration/basicConfig/loginPage/index': SettingsComponents.SetSystemConfigurationLoginPage,
	'/set/systemConfiguration/basicConfig/pwdConfig/index': SettingsComponents.SetSystemConfigurationPwdConfig,
	'/set/systemConfiguration/basicConfig/systemAppearance/index': SettingsComponents.SetSystemConfigurationSystemAppearance,
	'/set/systemConfiguration/iPblackAndWhite/index': SettingsComponents.SetSystemConfigurationIPBlackAndWhite,
	'/set/systemConfiguration/systemParam/index': SettingsComponents.SetSystemConfigurationSystemParam,
	'/set/systemDictionary/index': SettingsComponents.SetSystemDictionary,
	'/set/systemDictionary/dictItem/index': SettingsComponents.SetSystemDictionaryDictItem,
	'/admin/client/index': AdminComponents.AdminClient,
	'/admin/dept/index': AdminComponents.AdminDept,
	'/admin/dict/index': AdminComponents.AdminDict,
	'/admin/dict/dictItem/index': AdminComponents.AdminDictDictItem,
	'/admin/file/index': AdminComponents.AdminFile,
	'/admin/log/index': AdminComponents.AdminLog,
	'/admin/menu/index': AdminComponents.AdminMenu,
	'/admin/param/index': AdminComponents.AdminParam,
	'/admin/post/index': AdminComponents.AdminPost,
	'/admin/role/index': AdminComponents.AdminRole,
	'/admin/token/index': AdminComponents.AdminToken,
	'/admin/user/index': AdminComponents.AdminUser,
	'/admin/user/personal.vue': AdminComponents.AdminUserPersonal,
};

const viewsModules: Record<string, LazyComponent> = import.meta.glob('../views/**/*.{vue,tsx}') as Record<string, LazyComponent>;

export function getSharedComponent(path: string): Component | undefined {
	return componentMap[path];
}

export function isSharedComponent(path: string): boolean {
	return path in componentMap;
}

export function resolveComponent(path: string): Component | undefined {
	if (isSharedComponent(path)) {
		return getSharedComponent(path);
	}
	return localDynamicImport(path);
}

function localDynamicImport(component: string): Component | undefined {
	const keys = Object.keys(viewsModules);
	const normalizedComponent = component.startsWith('/') ? component.slice(1) : component;

	const matchKeys = keys.filter((key) => {
		const k = key.replace(/..\/views|../, '');
		return (
			k === `/${normalizedComponent}.vue` ||
			k === `/${normalizedComponent}/index.vue` ||
			k.startsWith(`/${normalizedComponent}.vue`) ||
			k.startsWith(`/${normalizedComponent}/index.vue`) ||
			k === `${normalizedComponent}.vue` ||
			k === `${normalizedComponent}/index.vue`
		);
	});

	if (matchKeys?.length === 1) {
		return viewsModules[matchKeys[0]];
	}
	if (matchKeys?.length > 1) {
		console.warn(`Multiple components found for path ${component}, using the first one`);
		return viewsModules[matchKeys[0]];
	}
	return undefined;
}
