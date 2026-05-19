import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { defineConfig, loadEnv, ConfigEnv } from 'vite';
import VueSetupExtend from 'unplugin-vue-setup-extend/vite';
import AutoImport from 'unplugin-auto-import/vite';
import topLevelAwait from 'vite-plugin-top-level-await';
import viteCompression from 'vite-plugin-compression';
// @ts-ignore
import { svgBuilder } from '/@/components/IconSelector/index';
// @ts-ignore
import { createProxy } from '/@/config/proxy';

const pathResolve = (dir: string) => {
	return resolve(__dirname, '.', dir);
};

const alias: Record<string, string> = {
	'/@': pathResolve('./src/'),
	'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
};
// @ts-ignore
const viteConfig = defineConfig((mode: ConfigEnv) => {
	const env = loadEnv(mode.mode, process.cwd());
	// 判断是否开发环境
	const isDev = env.ENV === 'development';
	return {
		plugins: [
			vue(), // Vue 插件
			svgBuilder('./src/assets/icons/'), // 将 SVG 文件转换成 Vue 组件
			VueSetupExtend({}), // setup语法糖增强插件
			AutoImport({
				imports: ['vue', 'vue-router', 'pinia'], // 自动导入的依赖库数组
				dts: './auto-imports.d.ts', // 自动导入类型定义文件路径
			}),
			topLevelAwait({
				promiseExportName: '__tla', // TLA Promise 变量名
				promiseImportName: (i) => `__tla_${i}`, // TLA Promise 导入名
			}),
			viteCompression({
				deleteOriginFile: false, // 压缩后删除原来的文件
			}),
		],
		root: process.cwd(), // 项目根目录
		resolve: { alias }, // 路径别名配置
		base: mode.command === 'serve' ? './' : env.VITE_PUBLIC_PATH,
		optimizeDeps: {
			include: ['element-plus/es/locale/lang/zh-cn', 'element-plus/es/locale/lang/en'],
			exclude: ['@zhqc-smart/layout', '@zhqc-smart/table', '@zhqc-smart/settings', '@zhqc-smart/admin', '@zhqc-smart/login'],
		},
		server: {
			host: '0.0.0.0', // 服务器地址
			port: env.VITE_PORT as unknown as number, // 服务器端口号
			open: env.VITE_OPEN === 'true', // 是否自动打开浏览器
			hmr: true, // 启用热更新
			proxy: createProxy(env),
			allowedHosts: [
				// 本地环境
				'localhost',
				'127.0.0.1',
			],
			fs: {
				allow: [resolve(__dirname), resolve(__dirname, '../components')],
			},
		},
		build: {
			outDir: 'dist',
			chunkSizeWarningLimit: 2000,
			minify: isDev ? 'esbuild' : 'terser',
			terserOptions: {
				compress: {
					drop_console: true, // 移除 console.log 等语句
					drop_debugger: true, // 移除 debugger 语句
				},
				format: {
					comments: false,
				},
			},
			rollupOptions: {
				output: {
					entryFileNames: `assets/[name].[hash].js`,
					chunkFileNames: `assets/[name].[hash].js`,
					assetFileNames: `assets/[name].[hash].[ext]`,
					compact: true,
					// 自定义代码分割策略
					manualChunks(id) {
						if (id.includes('node_modules')) {
							const mods = id.split('node_modules/')[1]?.split('/')[0] || '';
							if (mods.startsWith('element-plus') || mods.startsWith('@element-plus')) {
								return 'elementPlus';
							}
							if (mods.startsWith('@iconify') || mods.startsWith('@wangeditor')) {
								return 'icons';
							}
						}
					},
				},
			},
		},
		css: { preprocessorOptions: { css: { charset: false } } },
		define: {
			__VUE_I18N_LEGACY_API__: JSON.stringify(false),
			__VUE_I18N_FULL_INSTALL__: JSON.stringify(false),
			__INTLIFY_PROD_DEVTOOLS__: JSON.stringify(false),
			__VERSION__: JSON.stringify(process.env.npm_package_version),
			__NEXT_NAME__: JSON.stringify(process.env.npm_package_name),
		},
	};
});

export default viteConfig;
