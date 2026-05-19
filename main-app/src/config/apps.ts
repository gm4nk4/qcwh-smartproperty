export interface SubApp {
	name: string;
	entry: string;
	container: string;
	routePath: string;
	description: string;
	icon: string;
	color: string;
	apiPrefix?: string;
	defaultPath?: string;
}

export const subApps: SubApp[] = [
	{
		name: 'work-order',
		entry: 'http://localhost:3001',
		container: '#subapp-container',
		routePath: '/work-order',
		description: '工单管理系统',
		icon: 'Document',
		color: '#409EFF',
		apiPrefix: '/workorder-api',
	},
	{
		name: 'asset',
		entry: 'http://localhost:3002',
		container: '#subapp-container',
		routePath: '/asset',
		description: '资产管理系统',
		icon: 'Box',
		color: '#67C23A',
		apiPrefix: '/asset-api',
	},
	{
		name: 'security',
		entry: 'http://localhost:3003',
		container: '#subapp-container',
		routePath: '/security',
		description: '安防监控系统',
		icon: 'Monitor',
		color: '#E6A23C',
		apiPrefix: '/security-api',
	},
	{
		name: 'parking',
		entry: 'http://localhost:3004',
		container: '#subapp-container',
		routePath: '/parking',
		description: '停车管理系统',
		icon: 'Van',
		color: '#909399',
		apiPrefix: '/parking-api',
		defaultPath: '/overview',
	},
	{
		name: 'visitor',
		entry: 'http://localhost:3005',
		container: '#subapp-container',
		routePath: '/visitor',
		description: '访客管理系统',
		icon: 'User',
		color: '#F56C6C',
		apiPrefix: '/visitor-api',
		defaultPath: '/overview',
	},
	{
		name: 'payment',
		entry: 'http://localhost:3006',
		container: '#subapp-container',
		routePath: '/payment',
		description: '物业缴费系统',
		icon: 'Money',
		color: '#67C23A',
		apiPrefix: '/payment-api',
	},
	{
		name: 'notice',
		entry: 'http://localhost:3007',
		container: '#subapp-container',
		routePath: '/notice',
		description: '公告管理系统',
		icon: 'Bell',
		color: '#E6A23C',
		apiPrefix: '/notice-api',
	},
	{
		name: 'portal',
		entry: 'http://localhost:3008',
		container: '#subapp-container',
		routePath: '/portal',
		description: '物业门户CMS',
		icon: 'House',
		color: '#E6A23C',
		apiPrefix: '/portal-api',
	},
	{
		name: 'energy',
		entry: 'http://localhost:3009',
		container: '#subapp-container',
		routePath: '/energy',
		description: '智慧设备管理系统',
		icon: 'Odometer',
		color: '#909399',
		apiPrefix: '/energy-api',
	},
	{
		name: 'access', //必填
		entry: 'http://localhost:3010', //必填
		container: '#subapp-container', //必填
		routePath: '/access', //必填
		description: '应用及权限管理', //必填
		icon: 'Bell', //可选
		color: '#67C23A', //可选
		apiPrefix: '/access-api', //必填
	},
	{
		name: 'power',
		entry: 'http://localhost:3011',
		container: '#subapp-container',
		routePath: '/power',
		description: '能源管理系统',
		icon: 'Odometer',
		color: '#909399',
		apiPrefix: '/power-api',
	},
];

export default subApps;
