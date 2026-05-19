export const themeSkins = ['light-blue', 'light-green'] as const;

export type ThemeSkin = (typeof themeSkins)[number];

export const DEFAULT_THEME_SKIN: ThemeSkin = 'light-blue';

export const isThemeSkin = (value: unknown): value is ThemeSkin => {
	return typeof value === 'string' && themeSkins.includes(value as ThemeSkin);
};
