import { useUserInfo } from '/@/stores/userInfo';
import { useThemeConfig } from '/@/stores/themeConfig';
import { storeToRefs } from 'pinia';
import { useMicroApp } from '/@/stores/microApp';
export function useThemeOrUserInfo() {
	const microAppStore = useMicroApp();
	const userInfoStore = useUserInfo();
	const { userInfos } = storeToRefs(userInfoStore);
	const storesThemeConfig = useThemeConfig();
	const { isScreenfull } = storeToRefs(microAppStore);
	const { themeConfig } = storeToRefs(storesThemeConfig);
	return {
		userInfos,
		themeConfig,
		isScreenfull,
	};
}
