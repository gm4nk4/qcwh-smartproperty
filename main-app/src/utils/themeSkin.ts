import { blueTheme, greenTheme, themeConfigMap } from '/@/theme/config/index.js';
import { DEFAULT_THEME_SKIN, isThemeSkin } from '/@/theme/config/skin';
import { useChangeColor } from '/@/utils/theme';

const themeMap = themeConfigMap as Record<ThemeSkin, any>;
const darkTextPalette = {
	system: '#ffffff',
	dataAssist: '#909399',
	primaryTitle: '#dadada',
	assist: '#606266',
};

const setThemeTextVars = (theme: any, isDark: boolean) => {
	const textPalette = isDark ? darkTextPalette : theme.color.text;
	document.documentElement.style.setProperty('--theme-text-system', textPalette.system);
	document.documentElement.style.setProperty('--theme-text-dataAssist', textPalette.dataAssist);
	document.documentElement.style.setProperty('--theme-text-primaryTitle', textPalette.primaryTitle);
	document.documentElement.style.setProperty('--theme-text-assist', textPalette.assist);
};

export const getThemeBySkin = (skin: ThemeSkin) => {
	return themeMap[skin] || blueTheme;
};

export const resolveThemeSkin = (input?: Partial<ThemeConfigState['themeConfig']> | ThemeSkin | null) => {
	if (isThemeSkin(input)) return input;

	const skin = input?.skin;
	if (isThemeSkin(skin)) return skin;

	const primary = input?.currentTheme?.color?.primary?.normal || input?.primary;
	return primary === greenTheme.color.primary.normal ? 'light-green' : DEFAULT_THEME_SKIN;
};

export const applyThemeCssVars = (skin: ThemeSkin, options: { isDark?: boolean; primary?: string } = {}) => {
	const { getDarkColor, getLightColor } = useChangeColor();
	const theme = getThemeBySkin(skin);
	const primary = options.primary || theme.color.primary.normal;
	const shellBorder = getLightColor(primary, 0.86);
	const menuActive = '#ffffff';
	const menuHover = getLightColor(primary, 0.95);

	document.documentElement.style.setProperty('--el-color-primary-dark-2', `${getDarkColor(primary, 0.1)}`);
	document.documentElement.style.setProperty('--el-color-primary', primary);

	for (let i = 1; i <= 9; i++) {
		document.documentElement.style.setProperty(`--el-color-primary-light-${i}`, `${getLightColor(primary, i / 10)}`);
	}

	document.documentElement.style.setProperty('--el-button-hover-color', theme.color.primary.hover);
	document.documentElement.style.setProperty('--el-button-disabled-color', theme.color.primary.disabled);
	document.documentElement.style.setProperty('--theme-gradient-start', theme.color.gradient.start);
	document.documentElement.style.setProperty('--theme-gradient-end', theme.color.gradient.end);
	document.documentElement.style.setProperty('--theme-color-error', theme.color.functional.error);
	document.documentElement.style.setProperty('--theme-color-warning', theme.color.functional.warning);
	document.documentElement.style.setProperty('--theme-color-success', theme.color.functional.success);
	document.documentElement.style.setProperty('--next-bg-main-color', '#f7f9fc');
	document.documentElement.style.setProperty('--next-bg-topBar', '#f7f9fc');
	document.documentElement.style.setProperty('--next-bg-topBarColor', theme.color.text.system);
	document.documentElement.style.setProperty('--next-bg-menuBar', '#f7f9fc');
	document.documentElement.style.setProperty('--next-bg-menuBarColor', theme.color.text.dataAssist);
	document.documentElement.style.setProperty('--next-bg-menuBarActiveColor', menuActive);
	document.documentElement.style.setProperty('--next-border-color-light', shellBorder);
	document.documentElement.style.setProperty('--next-color-user-hover', menuHover);

	setThemeTextVars(theme, Boolean(options.isDark));
};

export const applyThemeMode = (skin: ThemeSkin, isDark: boolean) => {
	const root = document.documentElement as HTMLElement;

	if (isDark) {
		root.setAttribute('data-theme', 'dark');
		root.classList.add('dark');
	} else {
		root.setAttribute('data-theme', 'light');
		root.classList.remove('dark');
	}

	setThemeTextVars(getThemeBySkin(skin), isDark);
};
