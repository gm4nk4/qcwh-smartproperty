import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useThemeConfig } from '/@/stores/themeConfig';
import { DEFAULT_THEME_SKIN } from '/@/theme/config/skin';
import { getThemeBySkin, resolveThemeSkin } from '/@/utils/themeSkin';
import { useChangeColor } from '/@/utils/theme';

type ThemeSidebarOptions = {
	skin?: ThemeSkin;
	primary?: string;
};

export type ThemeSidebarTokens = {
	iconBg: string;
	iconColor: string;
	activeIconBg: string;
	activeIconColor: string;
	activeMarkerColor: string;
	textColor: string;
	subTextColor: string;
	activeShadow: string;
};

export const getThemeSidebarTokens = (options: ThemeSidebarOptions = {}): ThemeSidebarTokens => {
	const skin = resolveThemeSkin(options.skin || DEFAULT_THEME_SKIN);
	const theme = getThemeBySkin(skin);
	const primary = options.primary || theme.color.primary.normal;
	const { getLightColor } = useChangeColor();

	return {
		iconBg: 'transparent',
		iconColor: '#566073',
		activeIconBg: getLightColor(primary, 0.92),
		activeIconColor: primary,
		activeMarkerColor: primary,
		textColor: '#566073',
		subTextColor: '#1F2D3D',
		activeShadow: '0 20px 27px 0 rgba(0, 0, 0, 0.05)',
	};
};

export const useThemeSidebarTokens = () => {
	const storesThemeConfig = useThemeConfig();
	const { themeConfig } = storeToRefs(storesThemeConfig);

	return computed(() =>
		getThemeSidebarTokens({
			skin: themeConfig.value.skin,
			primary: themeConfig.value.primary,
		})
	);
};
