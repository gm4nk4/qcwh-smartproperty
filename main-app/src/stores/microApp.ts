import { defineStore } from 'pinia';
interface MicroAppState {
	currentMicroApp: any;
	isScreenfull: boolean;
}
export const useMicroApp = defineStore('microApp', {
	state: (): MicroAppState => ({
		currentMicroApp: {},
		isScreenfull: false,
	}),

	actions: {
		setCurrentMicroApp(appItem: any) {
			this.currentMicroApp = appItem;
		},
		setIsScreenfull(isScreenfull: boolean) {
			this.isScreenfull = isScreenfull;
		},
	},
});
