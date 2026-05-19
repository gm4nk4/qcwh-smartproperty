import { parseTime, parseDate, dateTimeStr, dateStr, timeStr } from '@/utils/formatTime';

// 正确扩展 Vue 全局属性（不会覆盖原有类型）
declare module '@vue/runtime-core' {
	interface ComponentCustomProperties {
		// 时间工具
		parseTime: typeof parseTime;
		parseDate: typeof parseDate;
		dateTimeStr: typeof dateTimeStr;
		dateStr: typeof dateStr;
		timeStr: typeof timeStr;

		// 基础路径
		baseURL: string;

		// 国际化 $t
		$t: (key: string, ...args: any[]) => string;
	}
}

export {};
