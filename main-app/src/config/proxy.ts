type Env = Record<string, string>;
import { subApps, SubApp } from './apps';

function escapeRegExp(str: string): string {
	return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function createProxy(env: Env) {
	const proxy: Record<string, any> = {};

	subApps.forEach((item: SubApp) => {
		if (!item.apiPrefix) return;
		const prefix = escapeRegExp(item.apiPrefix);
		proxy[item.apiPrefix] = {
			target: env.VITE_ADMIN_PROXY_PATH,
			changeOrigin: true,
			secure: false,
			rewrite: (path: string) => path.replace(new RegExp(`^${prefix}`), ''),
		};
	});

	proxy['/api'] = {
		target: env.VITE_ADMIN_PROXY_PATH,
		changeOrigin: true,
		secure: false,
		rewrite: (path: string) => path.replace(/^\/api/, ''),
	};
	proxy['/gen-api'] = {
		target: env.VITE_GEN_PROXY_PATH,
		changeOrigin: true,
		secure: false,
		rewrite: (path: string) => path.replace(/^\/gen-api/, ''),
	};
	proxy['^/ws/info/.*'] = {
		target: env.VITE_ADMIN_PROXY_PATH,
		ws: true,
		changeOrigin: true,
	};

	return proxy;
}
