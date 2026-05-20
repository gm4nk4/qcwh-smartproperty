// ESLint 配置文件（Vue3 + TypeScript 项目）
module.exports = {
	//  ESLint 停止向上级目录查找配置文件
	root: true,

	//  指定运行环境
	env: {
		browser: true, //  浏览器环境
		es2021: true, //  支持 ES2021 语法
		node: true, //  Node.js 环境
	},

	//  解析器配置
	parser: 'vue-eslint-parser', //  用于解析 .vue 文件
	parserOptions: {
		ecmaVersion: 12, //  ECMAScript 版本
		parser: '@typescript-eslint/parser', //  TypeScript 解析器
		sourceType: 'module', //  使用 ES 模块
	},

	//  继承规则集
	extends: [
		'plugin:vue/vue3-essential', //  Vue3 基础规则
		'plugin:vue/essential', //  Vue 基础规则（兼容）
		'eslint:recommended', //  ESLint 官方推荐规则
	],

	//  使用的插件
	plugins: [
		'vue', //  Vue 官方 ESLint 插件
		'@typescript-eslint', //  TypeScript ESLint 插件
	],

	//  针对特定文件的覆盖规则
	overrides: [
		{
			files: ['*.ts', '*.tsx', '*.vue'], //  只对 TS / Vue 文件生效
			rules: {
				'no-undef': 'off', //  关闭未定义变量检查（TS 已自带）
			},
		},
	],

	//  自定义规则
	rules: {
		// -------------------------- TypeScript 相关规则 --------------------------
		'@typescript-eslint/ban-ts-ignore': 'off', //  允许使用 @ts-ignore
		'@typescript-eslint/explicit-function-return-type': 'off', //  不强制函数写返回值类型
		'@typescript-eslint/no-explicit-any': 'off', //  允许使用 any 类型
		'@typescript-eslint/no-var-requires': 'off', //  允许使用 require()
		'@typescript-eslint/no-empty-function': 'off', //  允许空函数
		'@typescript-eslint/no-use-before-define': 'off', //  允许变量先使用后定义
		'@typescript-eslint/ban-ts-comment': 'off', //  允许使用 @ts 注释
		'@typescript-eslint/ban-types': 'off', //  允许使用禁止的内置类型
		'@typescript-eslint/no-non-null-assertion': 'off', //  允许使用 ! 非空断言
		'@typescript-eslint/explicit-module-boundary-types': 'off', //  不强制模块导出写类型
		'@typescript-eslint/no-redeclare': 'error', //  禁止重复定义（报错）
		'@typescript-eslint/no-non-null-asserted-optional-chain': 'off', //  允许可选链后用非空断言
		'@typescript-eslint/no-unused-vars': [
			'error',
			{ argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
		], //  未使用变量（报错），以下划线前缀可豁免

		// -------------------------- Vue 相关规则 --------------------------
		'vue/custom-event-name-casing': 'off', //  不限制自定义事件命名格式
		'vue/attributes-order': 'off', //  不强制属性顺序
		'vue/one-component-per-file': 'off', //  允许一个文件多个组件
		'vue/html-closing-bracket-newline': 'off', //  不强制标签括号换行
		'vue/max-attributes-per-line': 'off', //  不限制每行属性数量
		'vue/multiline-html-element-content-newline': 'off', //  不强制多行内容换行
		'vue/singleline-html-element-content-newline': 'off', //  不强制单行内容换行
		'vue/attribute-hyphenation': 'off', //  不强制属性连字符格式
		'vue/html-self-closing': 'off', //  不强制 HTML 自闭合标签
		'vue/no-multiple-template-root': 'off', //  允许 template 多根节点（Vue3 支持）
		'vue/require-default-prop': 'off', //  不强制 props 写默认值
		'vue/no-v-model-argument': 'off', //  允许 v-model 使用参数
		'vue/no-arrow-functions-in-watch': 'off', //  允许 watch 使用箭头函数
		'vue/no-template-key': 'off', //  允许 template 上写 key
		'vue/no-v-html': 'off', //  允许使用 v-html
		'vue/comment-directive': 'off', //  关闭注释指令校验
		'vue/no-mutating-props': 'off', //  允许修改 props
		'vue/no-parsing-error': 'off', //  关闭模板解析错误
		'vue/no-deprecated-v-on-native-modifier': 'off', //  允许使用废弃的 native 修饰符
		'vue/multi-word-component-names': 'off', //  不强制组件名多单词

		// -------------------------- 原生 JS 规则 --------------------------
		'no-useless-escape': 'off', //  允许不必要的转义
		'no-sparse-arrays': 'off', //  允许稀疏数组 [1,,2]
		'no-prototype-builtins': 'off', //  允许直接调用 Object.prototype 方法
		'no-constant-condition': 'off', //  允许常量条件 if (true)
		'no-use-before-define': 'off', //  允许先使用后定义
		'no-restricted-globals': 'off', //  允许使用受限全局变量
		'no-restricted-syntax': 'off', //  允许受限语法
		'generator-star-spacing': 'off', //  不强制 generator 空格格式
		'no-unreachable': 'off', //  允许不可达代码
		'no-case-declarations': 'off', //  允许 case 内声明变量
		'no-console': 'warn', //  console 仅警告，不阻塞 lint（Phase 2 P2-3 决议）
		'no-redeclare': 'off', //  允许重复声明
		'no-mixed-spaces-and-tabs': 'off', //  允许空格和 tab 混用
		'no-unused-vars': 'off', //  关闭（与 @typescript-eslint/no-unused-vars 重复，由 TS 版本统一处理）
	},
};
