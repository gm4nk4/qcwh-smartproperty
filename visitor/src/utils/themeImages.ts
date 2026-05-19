import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useThemeConfig } from '/@/stores/themeConfig';
import { DEFAULT_THEME_SKIN, isThemeSkin, themeSkins } from '/@/theme/config/skin';
import { resolveThemeSkin } from '/@/utils/themeSkin';

const themeImageModules = import.meta.glob('/src/assets/images/theme/*/*.png', { eager: true, import: 'default' }) as Record<string, string>;

type RegisteredThemeImageCatalogItem = {
	key: string;
	label: string;
	fileName: string;
	category: string;
	description: string;
	keywords: readonly string[];
};

const registeredThemeImageCatalog = [
	{
		key: 'monitor',
		label: '监控',
		fileName: 'monitor',
		category: '监控与设备',
		description: '通用监控入口图标',
		keywords: ['monitor', '监控'],
	},
	{
		key: 'rule',
		label: '规则',
		fileName: 'rule',
		category: '告警与规则',
		description: '通用规则能力图标',
		keywords: ['rule', '规则'],
	},
	{
		key: 'client',
		label: '客户端',
		fileName: 'client',
		category: '平台与接入',
		description: '客户端或接入端能力图标',
		keywords: ['client', '客户端', '接入'],
	},
	{
		key: 'capabilityPlatform',
		label: '能力平台',
		fileName: 'capability-platform',
		category: '平台与接入',
		description: '平台能力或能力中心图标',
		keywords: ['platform', '能力平台'],
	},
	{
		key: 'onlineDevice',
		label: '在线设备',
		fileName: 'online-device',
		category: '监控与设备',
		description: '在线设备状态图标',
		keywords: ['device', 'online', '在线设备'],
	},
	{
		key: 'offlineDevice',
		label: '离线设备',
		fileName: 'offline-device',
		category: '监控与设备',
		description: '离线设备状态图标',
		keywords: ['device', 'offline', '离线设备'],
	},
	{
		key: 'pendingActivationDevice',
		label: '待激活设备',
		fileName: 'pending-activation-device',
		category: '监控与设备',
		description: '待激活设备状态图标',
		keywords: ['device', 'pending activation', '待激活设备'],
	},
	{
		key: 'pendingAlertFeedback',
		label: '待反馈告警',
		fileName: 'pending-alert-feedback',
		category: '告警与规则',
		description: '待处理或待反馈告警图标',
		keywords: ['alert', 'pending', '待反馈告警'],
	},
	{
		key: 'handledAlert',
		label: '已反馈告警',
		fileName: 'handled-alert',
		category: '告警与规则',
		description: '已处理或已反馈告警图标',
		keywords: ['alert', 'handled', '已反馈告警'],
	},
	{
		key: 'onlineMonitoring',
		label: '在线监控',
		fileName: 'online-monitoring',
		category: '监控与设备',
		description: '在线监控场景图标',
		keywords: ['monitoring', 'online', '在线监控'],
	},
	{
		key: 'offlineMonitoring',
		label: '离线监控',
		fileName: 'offline-monitoring',
		category: '监控与设备',
		description: '离线监控场景图标',
		keywords: ['monitoring', 'offline', '离线监控'],
	},
	{
		key: 'dataCollection',
		label: '采集数据',
		fileName: 'data-collection',
		category: '数据链路',
		description: '数据采集节点图标',
		keywords: ['collection', 'data', '采集数据'],
	},
	{
		key: 'dataDistribution',
		label: '分发数据',
		fileName: 'data-distribution',
		category: '数据链路',
		description: '数据分发节点图标',
		keywords: ['distribution', 'data', '分发数据'],
	},
	{
		key: 'redisVersion',
		label: 'redis版本',
		fileName: 'redis-version',
		category: '存储与性能',
		description: 'Redis 版本或中间件信息图标',
		keywords: ['redis', 'version', 'redis版本'],
	},
	{
		key: 'aof',
		label: 'AOF',
		fileName: 'aof',
		category: '存储与性能',
		description: 'AOF 持久化状态图标',
		keywords: ['aof', 'storage'],
	},
	{
		key: 'rdb',
		label: 'RDB',
		fileName: 'rdb',
		category: '存储与性能',
		description: 'RDB 持久化状态图标',
		keywords: ['rdb', 'storage'],
	},
	{
		key: 'runtime',
		label: '运行时间',
		fileName: 'runtime',
		category: '存储与性能',
		description: '运行时长或 uptime 图标',
		keywords: ['runtime', 'uptime', '运行时间'],
	},
	{
		key: 'memoryUsage',
		label: '使用内存',
		fileName: 'memory-usage',
		category: '存储与性能',
		description: '内存占用图标',
		keywords: ['memory', 'usage', '使用内存'],
	},
	{
		key: 'product',
		label: '产品',
		fileName: 'product',
		category: '平台与接入',
		description: '产品或产品线图标',
		keywords: ['product', '产品'],
	},
	{
		key: 'electricityUsage',
		label: '用电',
		fileName: 'electricity-usage',
		category: '能源指标',
		description: '用电指标卡片图标',
		keywords: ['electricity', 'usage', 'power', '用电'],
	},
	{
		key: 'waterUsage',
		label: '用水',
		fileName: 'water-usage',
		category: '能源指标',
		description: '用水指标卡片图标',
		keywords: ['water', 'usage', '用水'],
	},
	{
		key: 'gasUsage',
		label: '用气',
		fileName: 'gas-usage',
		category: '能源指标',
		description: '用气指标卡片图标',
		keywords: ['gas', 'usage', '用气'],
	},
	{
		key: 'cost',
		label: '费用',
		fileName: 'cost',
		category: '能源指标',
		description: '费用指标卡片图标',
		keywords: ['cost', 'fee', 'money', '费用'],
	},
	{
		key: 'metricCardBackground',
		label: '统计卡片背景',
		fileName: 'metric-card-background',
		category: '能源指标',
		description: '顶部统计卡片通用背景图',
		keywords: ['metric', 'card', 'background', '统计卡片背景'],
	},
	{
		key: 'device',
		label: '设备',
		fileName: 'device',
		category: '监控与设备',
		description: '通用设备图标',
		keywords: ['device', '设备'],
	},
	{
		key: 'alert',
		label: '告警',
		fileName: 'alert',
		category: '告警与规则',
		description: '通用告警图标',
		keywords: ['alert', '告警'],
	},
	{
		key: 'ruleEnabled',
		label: '启用规则',
		fileName: 'rule-enabled',
		category: '告警与规则',
		description: '规则启用状态图标',
		keywords: ['rule', 'enabled', '启用规则'],
	},
	{
		key: 'ruleDisabled',
		label: '禁用规则',
		fileName: 'rule-disabled',
		category: '告警与规则',
		description: '规则禁用状态图标',
		keywords: ['rule', 'disabled', '禁用规则'],
	},
	{
		key: 'published',
		label: '已发布',
		fileName: 'published',
		category: '发布状态',
		description: '已发布状态图标',
		keywords: ['published', 'release', '已发布'],
	},
	{
		key: 'unpublished',
		label: '未发布',
		fileName: 'unpublished',
		category: '发布状态',
		description: '未发布状态图标',
		keywords: ['unpublished', 'draft', '未发布'],
	},
	{
		key: 'loginBackground',
		label: '登录页背景',
		fileName: 'login-background',
		category: '品牌与登录',
		description: '登录页整屏背景图',
		keywords: ['login', 'background', '登录页背景'],
	},
	{
		key: 'brandBadge',
		label: '品牌图标',
		fileName: 'idea-bulb-badge',
		category: '品牌与登录',
		description: '登录页或品牌区使用的主题图标',
		keywords: ['brand', 'logo', 'badge', 'login', '品牌图标'],
	},
] as const satisfies readonly RegisteredThemeImageCatalogItem[];

export type RegisteredThemeImageKey = (typeof registeredThemeImageCatalog)[number]['key'];
export type ThemeImageKey = RegisteredThemeImageKey | (string & {});

export type ThemeImageCatalogItem = {
	key: ThemeImageKey;
	label: string;
	fileName: string;
	category: string;
	description: string;
	keywords: readonly string[];
	source: 'registered' | 'auto';
	availableSkins: readonly ThemeSkin[];
};

type ThemeImageEntry = {
	[K in ThemeSkin]?: string;
};

const themeImageFilesBySkin = themeSkins.reduce(
	(acc, skin) => {
		acc[skin] = new Set<string>();
		return acc;
	},
	{} as Record<ThemeSkin, Set<string>>
);

Object.keys(themeImageModules).forEach((modulePath) => {
	const matched = modulePath.match(/^\/src\/assets\/images\/theme\/([^/]+)\/(.+)\.png$/);
	if (!matched) return;

	const [, skin, fileName] = matched;
	if (!isThemeSkin(skin)) return;

	themeImageFilesBySkin[skin].add(fileName);
});

const themeImageFileNameSet = new Set(themeSkins.flatMap((skin) => Array.from(themeImageFilesBySkin[skin])));
const registeredThemeImageCatalogMapByFileName = new Map(registeredThemeImageCatalog.map((item) => [item.fileName, item]));
const acronymTokens = new Set(['aof', 'cop', 'rdb']);

const buildThemeImageTokens = (fileName: string) => fileName.split('-').filter(Boolean);

const formatThemeImageToken = (token: string) => {
	const normalizedToken = token.toLowerCase();
	if (acronymTokens.has(normalizedToken)) return normalizedToken.toUpperCase();
	return normalizedToken.charAt(0).toUpperCase() + normalizedToken.slice(1);
};

const toThemeImageKeyBase = (fileName: string) => {
	return buildThemeImageTokens(fileName)
		.map((token, index) => {
			const normalizedToken = token.toLowerCase();
			if (index === 0) return normalizedToken;
			if (acronymTokens.has(normalizedToken)) return normalizedToken.toUpperCase();
			return normalizedToken.charAt(0).toUpperCase() + normalizedToken.slice(1);
		})
		.join('');
};

const inferThemeImageCategory = (fileName: string) => {
	const tokens = buildThemeImageTokens(fileName).map((token) => token.toLowerCase());
	const hasToken = (values: readonly string[]) => values.some((value) => tokens.includes(value));

	if (hasToken(['alert', 'notice', 'rule'])) return '告警与规则';
	if (hasToken(['device', 'devices', 'monitor', 'monitoring', 'circuits', 'elevator', 'elevators'])) return '监控与设备';
	if (hasToken(['data', 'distribution', 'collection'])) return '数据链路';
	if (hasToken(['redis', 'aof', 'rdb', 'memory', 'runtime', 'storage', 'snapshot'])) return '存储与性能';
	if (hasToken(['login', 'badge', 'brand'])) return '品牌与登录';
	if (hasToken(['published', 'unpublished'])) return '发布状态';
	if (
		hasToken([
			'electricity',
			'water',
			'gas',
			'heat',
			'power',
			'energy',
			'pressure',
			'temperature',
			'flow',
			'loss',
			'efficiency',
			'quota',
			'rate',
			'consumption',
			'supply',
			'load',
			'cooling',
			'cop',
			'voltage',
			'frequency',
			'leakage',
			'natural',
			'tank',
			'pipeline',
			'transformer',
			'meter',
			'quality',
			'factor',
			'blended',
			'improvement',
			'lighting',
			'return',
			'line',
			'running',
		])
	) {
		return '能源指标';
	}

	return '自动发现';
};

const createAvailableSkins = (fileName: string) => {
	return themeSkins.filter((skin) => themeImageFilesBySkin[skin].has(fileName));
};

const usedThemeImageKeys = new Set<string>(registeredThemeImageCatalog.map((item) => item.key));

const createAutoThemeImageKey = (fileName: string): ThemeImageKey => {
	const baseKey = toThemeImageKeyBase(fileName) || 'themeImage';
	if (!usedThemeImageKeys.has(baseKey)) {
		usedThemeImageKeys.add(baseKey);
		return baseKey;
	}

	let suffix = 2;
	let fallbackKey = `${baseKey}Image`;
	while (usedThemeImageKeys.has(fallbackKey)) {
		fallbackKey = `${baseKey}Image${suffix}`;
		suffix += 1;
	}

	usedThemeImageKeys.add(fallbackKey);
	return fallbackKey;
};

const createThemeImageCatalogItem = (fileName: string): ThemeImageCatalogItem => {
	const registeredItem = registeredThemeImageCatalogMapByFileName.get(fileName);
	const availableSkins = createAvailableSkins(fileName);

	if (registeredItem) {
		return {
			...registeredItem,
			source: 'registered',
			availableSkins,
		};
	}

	const tokens = buildThemeImageTokens(fileName).map((token) => token.toLowerCase());
	return {
		key: createAutoThemeImageKey(fileName),
		label: buildThemeImageTokens(fileName).map(formatThemeImageToken).join(' '),
		fileName,
		category: inferThemeImageCategory(fileName),
		description: '从主题图片目录自动扫描生成的资源',
		keywords: [fileName, ...tokens],
		source: 'auto',
		availableSkins,
	};
};

const registeredThemeImageCatalogItems = registeredThemeImageCatalog
	.filter((item) => themeImageFileNameSet.has(item.fileName))
	.map((item) => createThemeImageCatalogItem(item.fileName));

const autoThemeImageCatalogItems = Array.from(themeImageFileNameSet)
	.filter((fileName) => !registeredThemeImageCatalogMapByFileName.has(fileName))
	.sort((left, right) => left.localeCompare(right))
	.map((fileName) => createThemeImageCatalogItem(fileName));

export const themeImageCatalog: readonly ThemeImageCatalogItem[] = [...registeredThemeImageCatalogItems, ...autoThemeImageCatalogItems];

const themeImageCatalogMap = Object.fromEntries(themeImageCatalog.map((item) => [item.key, item])) as Record<string, ThemeImageCatalogItem>;

const createThemeImageEntry = (fileName: string): ThemeImageEntry => ({
	'light-blue': themeImageModules[`/src/assets/images/theme/light-blue/${fileName}.png`],
	'light-green': themeImageModules[`/src/assets/images/theme/light-green/${fileName}.png`],
});

export const themeImageRegistry = Object.fromEntries(themeImageCatalog.map((item) => [item.key, createThemeImageEntry(item.fileName)])) as Record<
	string,
	ThemeImageEntry
>;

const warnedFallbacks = new Set<string>();
const themeImageFallbackOrder: Record<ThemeSkin, ThemeSkin[]> = {
	'light-blue': ['light-blue', 'light-green'],
	'light-green': ['light-green', 'light-blue'],
};

const warnFallback = (key: ThemeImageKey, preferredSkin: ThemeSkin, fallbackSkin: ThemeSkin) => {
	if (!import.meta.env.DEV) return;

	const warningId = `${key}:${preferredSkin}->${fallbackSkin}`;
	if (warnedFallbacks.has(warningId)) return;

	warnedFallbacks.add(warningId);
	console.warn(`[theme-image] "${key}" missing for skin "${preferredSkin}", fallback to "${fallbackSkin}".`);
};

export const getThemeImageMeta = (key: ThemeImageKey) => themeImageCatalogMap[key];

export const getThemeImage = (key: ThemeImageKey, skin: ThemeSkin = DEFAULT_THEME_SKIN) => {
	const preferredSkin = resolveThemeSkin(skin);
	const themeImage = themeImageRegistry[key];
	if (!themeImage) return '';

	const matchedSkin = themeImageFallbackOrder[preferredSkin].find((item) => Boolean(themeImage[item]));
	if (!matchedSkin) return '';
	if (matchedSkin !== preferredSkin) warnFallback(key, preferredSkin, matchedSkin);

	return themeImage[matchedSkin] || '';
};

export const getThemeImageGetterSnippet = (key: ThemeImageKey) => {
	return `getThemeImage('${key}')`;
};

export const getThemeImageHookSnippet = (key: ThemeImageKey) => {
	return `useThemeImage('${key}')`;
};

export const useThemeImage = (key: ThemeImageKey) => {
	const storesThemeConfig = useThemeConfig();
	const { themeConfig } = storeToRefs(storesThemeConfig);

	return computed(() => getThemeImage(key, resolveThemeSkin(themeConfig.value.skin)));
};
