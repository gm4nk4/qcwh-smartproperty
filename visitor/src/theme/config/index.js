// 蓝色主题配置
const blueTheme = {
	color: {
		// 主色配置
		primary: {
			normal: '#1677FF', // 主色-常规状态（蓝色主题）
			hover: '#0086E6', // 主色-鼠标悬浮状态
			disabled: '#BDDBF2', // 主色-禁用状态
		},
		// 渐变背景色
		gradient: {
			start: '#00B6E8', // 渐变色-起始颜色
			end: '#015CF8', // 渐变色-结束颜色
		},
		// 图表系列色（饼图/柱状图/折线图自动循环使用）
		chart: ['#1677FF', '#00CAE8', '#F59E0B', '#E8BB19', '#BD74E6','#9cb5c8','#F85A5A'],
		gradientChart: ['#D9E3ED', '#E6F5F8', '#EDE2D9', '', '','#FBFDFF','#EDD9D9'],
		// 功能状态色
		functional: {
			error: '#F85A5A', // 错误/失败/危险
			warning: '#E98A1D', // 提醒/告警/橙色
			success: '#46B538', // 成功/完成/通过
		},
		// 文字颜色体系
		text: {
			system: '#000F2C', // 系统级主文本（最深）
			dataAssist: '#566073', // 数据辅助文本
			primaryTitle: '#333333', // 一级标题文本
			assist: '#999999', // 次要辅助文本（最浅）
		},
	},
	// 字体配置
	font: {
		// 中文专用：思源黑体 CN
		sourceHanSansCN: {
			sizes: ['20px', '18px', '16px', '14px', '12px'], // 标准字号
			weights: ['Regular', 'Medium', 'Bold'], // 字重
		},
		// 数字/英文专用：D-DIN
		dDin: {
			sizes: ['32px', '30px', '28px', '26px', '24px'], // 数字展示字号
			weights: ['Bold'], // 字重
		},
	},
	// 布局间距配置
	layout: {
		padding: {
			horizontal: '20px', // 水平内边距
			vertical: '16px', // 垂直内边距
		},
		sidebarWidth: '220px', // 侧边栏宽度
		headerHeight: '45px', // 顶部导航栏高度
	},
};

// 绿色主题配置
const greenTheme = {
	color: {
		// 主色配置
		primary: {
			normal: '#4BA6A9', // 主色-常规状态（绿色主题）
			hover: '#298B8E', // 主色-鼠标悬浮状态
			disabled: '#D2E9EA', // 主色-禁用状态
		},
		// 渐变背景色
		gradient: {
			start: '#00B6E8', // 渐变色-起始颜色
			end: '#4BA6A9', // 渐变色-结束颜色
		},
		// 图表系列色
		chart: ['#4BA6A9', '#00CAE8', '#F59E0B', '#E8BB19', '#BD74E6','#9cb5c8','#F85A5A'],
		gradientChart: ['#D9EDED', '#E6F5F8', '#EDE2D9', '', '','#FBFDFF','#EDD9D9'],
		// 功能状态色
		functional: {
			error: '#F85A5A', // 错误/失败
			warning: '#E98A1D', // 告警/提醒
			success: '#46B538', // 成功/完成
		},
		// 文字颜色体系
		text: {
			system: '#000F2C', // 系统级主文本
			dataAssist: '#566073', // 数据辅助文本
			primaryTitle: '#333333', // 一级标题
			assist: '#999999', // 次要辅助文本
		},
	},
	// 字体配置（与蓝色主题一致）
	font: {
		sourceHanSansCN: {
			sizes: ['20px', '18px', '16px', '14px', '12px'],
			weights: ['Regular', 'Medium', 'Bold'],
		},
		dDin: {
			sizes: ['32px', '30px', '28px', '26px', '24px'],
			weights: ['Bold'],
		},
	},
	// 布局配置（与蓝色主题一致）
	layout: {
		padding: {
			horizontal: '20px',
			vertical: '16px',
		},
		sidebarWidth: '220px',
		headerHeight: '45px',
	},
};
// 导出两个主题，供全局使用
export { blueTheme, greenTheme };

// 主题配置映射表
export const themeConfigMap = {
	'light-blue': blueTheme,
	'light-green': greenTheme,
};
