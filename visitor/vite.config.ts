import vue from '@vitejs/plugin-vue';
import qiankun from 'vite-plugin-qiankun';
import { resolve } from 'path';
import { defineConfig, loadEnv, ConfigEnv } from 'vite';
import VueSetupExtend from 'unplugin-vue-setup-extend/vite';
import AutoImport from 'unplugin-auto-import/vite';
import topLevelAwait from 'vite-plugin-top-level-await';
import viteCompression from 'vite-plugin-compression';

const pathResolve = (dir: string) => {
	return resolve(__dirname, '.', dir);
};

const alias: Record<string, string> = {
	'/@': pathResolve('./src/'),
	'@common': pathResolve('../components/src/'),
	// 用绝对路径,确保从 `file:` 软链(`@zhqc-smart/*` 公共包)里 import `vue-i18n`
	// 时也能解析到 visitor 自身 `node_modules/vue-i18n`,而不是从软链目标位置去找。
	'vue-i18n': pathResolve('./node_modules/vue-i18n/dist/vue-i18n.cjs.js'),
};

const viteConfig = defineConfig((mode: ConfigEnv) => {
	const env = loadEnv(mode.mode, process.cwd());
	const isDev = env.ENV === 'development';
	return {
		plugins: [
			vue(),
			qiankun('asset', {
				useDevMode: true,
			}),
			VueSetupExtend({}),
			AutoImport({
				imports: ['vue', 'vue-router', 'pinia'],
				dts: './auto-imports.d.ts',
			}),
			topLevelAwait({
				promiseExportName: '__tla',
				promiseImportName: (i) => `__tla_${i}`,
			}),
			viteCompression({
				deleteOriginFile: false,
			}),
		],
		root: process.cwd(),
		resolve: {
			alias,
			// 把 `@zhqc-smart/*` 公共包(`file:` 软链)和 visitor 自己共用同一份运行时实例,
			// 避免 Rollup 在生产构建时从软链目标位置查不到 peer 依赖。
			dedupe: ['vue', 'vue-router', 'pinia', 'vue-i18n', 'element-plus', '@element-plus/icons-vue', '@vueuse/core', 'sortablejs', 'screenfull'],
		},
		base: mode.command === 'serve' ? './' : env.VITE_PUBLIC_PATH,
		optimizeDeps: {
			include: ['element-plus/es/locale/lang/zh-cn', 'element-plus/es/locale/lang/en'],
			// `@zhqc-smart/*` 公共包通过 `file:` 软链引入,内部以 `new URL('../../asset/...', import.meta.url)`
			// 方式引用图片资源(如左侧菜单底部折叠/展开图标 fold/expand)。若让 Vite/esbuild 预打包,
			// 这些 URL 会被绑定到 `node_modules/.vite/deps/` 下的伪路径,导致图片 404。
			// 与 access / parking 子应用保持一致,统一从预构建里排除,改由 Vite 直接以 ESM 源码处理。
			exclude: ['@zhqc-smart/layout', '@zhqc-smart/table', '@zhqc-smart/settings', '@zhqc-smart/admin'],
		},
		server: {
			host: '0.0.0.0',
			port: env.VITE_PORT as unknown as number,
			open: env.VITE_OPEN === 'true',
			cors: true,
			proxy: {
				'/api': {
					target: env.VITE_ADMIN_PROXY_PATH,
					ws: true,
					changeOrigin: true,
					rewrite: (path) => path.replace(/^\/api/, ''),
				},
				'^/ws/info/.*': {
					target: env.VITE_ADMIN_PROXY_PATH,
					ws: true,
					changeOrigin: true,
				},
			},
			allowedHosts: ['localhost', '127.0.0.1', '.ngrok-free.app'],
			// `@zhqc-smart/*` 公共包通过 `file:../components/packages/*` 软链引入,Vite 默认 `preserveSymlinks: false` 会
			// 把 `node_modules/@zhqc-smart/layout/**` 解析到 `components/packages/layout/**` 真实路径(位于 visitor 项目根之外)。
			// Vite 5 默认 `server.fs.strict = true`,根外文件会被 dev 服务器拦截 → `fold.png` / `expand.png` 等通过
			// `new URL('../../asset/images/*.png', import.meta.url)` 引用的资源在 dev 模式下 403/404,
			// 表现为左侧菜单底部折叠/展开图标不可见。与 access / parking 子应用一致,显式放行 `../components`。
			fs: {
				allow: [resolve(__dirname), resolve(__dirname, '../components')],
			},
		},
		build: {
			outDir: 'dist',
			chunkSizeWarningLimit: 1500,
			minify: isDev ? 'esbuild' : 'terser',
			terserOptions: {
				compress: {
					drop_console: true,
					drop_debugger: true,
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
					manualChunks: {
						vue: ['vue', 'vue-router', 'pinia'],
						echarts: ['echarts'],
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
