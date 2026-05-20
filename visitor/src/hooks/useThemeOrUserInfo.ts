import { useUserInfo } from '/@/stores/userInfo';
import { useThemeConfig } from '/@/stores/themeConfig';
import { storeToRefs } from 'pinia';
export function useThemeOrUserInfo() {
	const userInfoStore = useUserInfo();
	const { userInfos } = storeToRefs(userInfoStore);
	const storesThemeConfig = useThemeConfig();
	const { themeConfig } = storeToRefs(storesThemeConfig);
	return {
		userInfos,
		themeConfig,
	};
}
