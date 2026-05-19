import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useThemeConfig } from '/@/stores/themeConfig';
import { DEFAULT_THEME_SKIN } from '/@/theme/config/skin';
import { getThemeBySkin, resolveThemeSkin } from '/@/utils/themeSkin';
import { useChangeColor } from '/@/utils/theme';

export type ThemeLayoutIconKey = 'brandMark';

type ThemeLayoutIconOptions = {
	skin?: ThemeSkin;
	primary?: string;
};

const encodeSvg = (svg: string) => `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;

const buildBrandMarkSvg = (primary: string) => {
	const { getDarkColor, getLightColor } = useChangeColor();
	const accent = getDarkColor(primary, 0.12);
	const soft = getLightColor(primary, 0.6);
	const glow = getLightColor(primary, 0.82);

	return `
		<svg xmlns="http://www.w3.org/2000/svg" width="68" height="36" viewBox="0 0 68 36" fill="none">
			<defs>
				<linearGradient id="brandMarkGradient" x1="8" y1="6" x2="56" y2="30" gradientUnits="userSpaceOnUse">
					<stop stop-color="${soft}" />
					<stop offset="1" stop-color="${primary}" />
				</linearGradient>
			</defs>
			<path
				d="M12.75 19C8.47 19 5 22.47 5 26.75C5 31.03 8.47 34.5 12.75 34.5C17.03 34.5 20.5 31.03 20.5 26.75V25.9C20.5 22.09 17.41 19 13.6 19H12.75Z"
				fill="url(#brandMarkGradient)"
			/>
			<path
				d="M31.5 3.5C26.53 3.5 22.5 7.53 22.5 12.5C22.5 17.47 26.53 21.5 31.5 21.5C36.47 21.5 40.5 17.47 40.5 12.5C40.5 7.53 36.47 3.5 31.5 3.5Z"
				fill="url(#brandMarkGradient)"
			/>
			<path
				d="M47.25 19C43.44 19 40.35 22.09 40.35 25.9V26.75C40.35 31.03 43.82 34.5 48.1 34.5H56.6C60.88 34.5 64.35 31.03 64.35 26.75C64.35 22.47 60.88 19 56.6 19H47.25Z"
				fill="url(#brandMarkGradient)"
			/>
			<circle cx="15.3" cy="26.15" r="2.05" fill="${glow}" />
			<circle cx="31.5" cy="12.5" r="2.35" fill="${glow}" />
			<circle cx="53.5" cy="26.15" r="2.05" fill="${glow}" />
			<path
				d="M13.1 26.4C18.27 19.18 24.28 14.2 31.13 11.46C37.99 8.73 45.35 8.21 53.2 9.91"
				stroke="${accent}"
				stroke-width="2.4"
				stroke-linecap="round"
				stroke-opacity="0.14"
			/>
		</svg>
	`;
};

const resolvePrimary = (skin: ThemeSkin, primary?: string) => primary || getThemeBySkin(skin).color.primary.normal;

export const getThemeLayoutIcon = (key: ThemeLayoutIconKey, options: ThemeLayoutIconOptions = {}) => {
	const skin = resolveThemeSkin(options.skin || DEFAULT_THEME_SKIN);
	const primary = resolvePrimary(skin, options.primary);

	switch (key) {
		case 'brandMark':
			return encodeSvg(buildBrandMarkSvg(primary));
		default:
			return '';
	}
};

export const useThemeLayoutIcon = (key: ThemeLayoutIconKey) => {
	const storesThemeConfig = useThemeConfig();
	const { themeConfig } = storeToRefs(storesThemeConfig);

	return computed(() => {
		const skin = resolveThemeSkin(themeConfig.value.skin);
		return getThemeLayoutIcon(key, {
			skin,
			primary: themeConfig.value.primary,
		});
	});
};
