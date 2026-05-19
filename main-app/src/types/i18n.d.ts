import 'vue-i18n';

declare module 'vue' {
	interface ComponentCustomProperties {
		$t: (key: string, ...args: any[]) => string;
	}
}

declare module '@vue/runtime-core' {
	interface ComponentCustomProperties {
		$t: (key: string, ...args: any[]) => string;
	}
}