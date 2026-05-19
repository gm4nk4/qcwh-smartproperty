/**
 * @file mock.ts
 * @description 子应用管理模块模拟数据
 * @module portal/application/mock
 */

import type { StatsData, ApplicationItem, ApplicationDetail, AddAppFormData } from './type';
import type { StatItem } from './components/StatCards.vue';

/**
 * 统计数据
 */
export const mockStatsData: StatsData = {
  totalApps: 17,
  activeApps: 16,
  thirdPartyApps: 2,
  pendingApps: 2,
  aiTools: 21,
  totalUsers: 137,
};

/**
 * 应用列表数据
 */
export const mockApplicationList: ApplicationItem[] = [
  {
    id: 1,
    name: '工单管理',
    version: 'V3.2',
    status: 'active',
    description: '全生命工单周期闭环管理、AI智能派单、人员排班',
    category: '客户服务',
    code: 'EDGE-WO-001',
    userCount: 8,
    validPeriod: '2024-01-15 ~ 2027-01-15',
    modules: ['module_workorder', 'module_dispatch', 'module_schedule'],
    aiToolCount: 3,
    accessUrls: [
      { type: 'PC Web', url: 'https://example.com/wo', displayMode: 'always', enabled: true },
      { type: 'Mobile H5', url: 'https://example.com/wo/mobile', displayMode: 'always', enabled: true },
    ],
  },
  {
    id: 2,
    name: '物业缴费',
    version: 'V3.2',
    status: 'active',
    description: '账单管理、在线缴费、催缴预警、合同管理',
    category: '客户服务',
    code: 'EDGE-WO-002',
    userCount: 2,
    validPeriod: '2024-01-15 ~ 2027-01-15',
    modules: ['module_bill', 'module_payment', 'module_contract'],
    aiToolCount: 3,
    accessUrls: [
      { type: 'PC Web', url: 'https://example.com/fee', displayMode: 'always', enabled: true },
    ],
  },
  {
    id: 3,
    name: '社区运营',
    version: 'V3.2',
    status: 'active',
    description: '活动管理、邻里圈、邻里互助',
    category: '客户服务',
    code: 'EDGE-WO-003',
    userCount: 8,
    validPeriod: '2024-01-15 ~ 2027-01-15',
    modules: ['module_activity', 'module_circle', 'module_help'],
    aiToolCount: 3,
    accessUrls: [],
  },
  {
    id: 4,
    name: '客户评价',
    version: 'V3.2',
    status: 'active',
    description: '全生命工单周期闭环管理、AI智能派单、人员排班',
    category: '客户服务',
    code: 'EDGE-WO-004',
    userCount: 8,
    validPeriod: '2024-01-15 ~ 2027-01-15',
    modules: ['module_evaluation', 'module_feedback'],
    aiToolCount: 3,
    accessUrls: [],
  },
  {
    id: 5,
    name: '公告管理',
    version: 'V3.2',
    status: 'active',
    description: '全生命工单周期闭环管理、AI智能派单、人员排班',
    category: '客户服务',
    code: 'EDGE-WO-005',
    userCount: 8,
    validPeriod: '2024-01-15 ~ 2027-01-15',
    modules: ['module_announcement', 'module_notice'],
    aiToolCount: 3,
    accessUrls: [],
  },
  {
    id: 6,
    name: '安防监控',
    version: 'V3.2',
    status: 'active',
    description: '全生命工单周期闭环管理、AI智能派单、人员排班',
    category: '空间与设备',
    code: 'EDGE-WO-006',
    userCount: 8,
    validPeriod: '2024-01-15 ~ 2027-01-15',
    modules: ['module_monitor', 'module_alarm'],
    aiToolCount: 3,
    accessUrls: [],
  },
  {
    id: 7,
    name: '停车管理',
    version: 'V3.2',
    status: 'active',
    description: '全生命工单周期闭环管理、AI智能派单、人员排班',
    category: '空间与设备',
    code: 'EDGE-WO-007',
    userCount: 8,
    validPeriod: '2024-01-15 ~ 2027-01-15',
    modules: ['module_parking', 'module_card'],
    aiToolCount: 3,
    accessUrls: [],
  },
  {
    id: 8,
    name: '门禁管理',
    version: 'V3.2',
    status: 'testing',
    description: '全生命工单周期闭环管理、AI智能派单、人员排班',
    category: '空间与设备',
    code: 'EDGE-WO-008',
    userCount: 8,
    validPeriod: '2024-01-15 ~ 2027-01-15',
    modules: ['module_access', 'module_face'],
    aiToolCount: 3,
    accessUrls: [],
  },
  {
    id: 9,
    name: '资产管理',
    version: 'V3.2',
    status: 'active',
    description: '全生命工单周期闭环管理、AI智能派单、人员排班',
    category: '空间与设备',
    code: 'EDGE-WO-009',
    userCount: 8,
    validPeriod: '2024-01-15 ~ 2027-01-15',
    modules: ['module_asset', 'module_inventory'],
    aiToolCount: 3,
    accessUrls: [],
  },
  {
    id: 10,
    name: '能源管理',
    version: 'V3.2',
    status: 'active',
    description: '全生命工单周期闭环管理、AI智能派单、人员排班',
    category: '空间与设备',
    code: 'EDGE-WO-010',
    userCount: 8,
    validPeriod: '2024-01-15 ~ 2027-01-15',
    modules: ['module_energy', 'module_statistics'],
    aiToolCount: 3,
    accessUrls: [],
  },
  {
    id: 11,
    name: '企业微信',
    version: 'V1.5',
    status: 'active',
    description: '企业集成连接、消息推送、通讯录同步',
    category: '第三方应用',
    code: 'EXT-WECOM-001',
    userCount: 1,
    validPeriod: '2024-01-15 ~ 2027-01-15',
    modules: [],
    aiToolCount: 0,
    accessUrls: [
      { type: 'PC Web', url: 'https://example.com/wecom', displayMode: 'role', enabled: true },
      { type: 'Mobile H5', url: 'https://example.com/wecom/mobile', displayMode: 'role', enabled: true },
    ],
  },
];

/**
 * 应用详情数据
 */
export const mockApplicationDetail: ApplicationDetail = {
  basicInfo: {
    version: 'V3.2',
    userCount: 8,
    aiToolCount: 3,
    category: '客户服务',
  },
  credentials: {
    appCode: 'EDGE-WO-001',
    token: 'tk_APP-001_demo',
    refreshToken: 'rt_APP-001_demo',
  },
  authConfig: {
    userCode: 'C001',
    project: '智慧物业管理平台',
    appCode: 'EDGE-WO-001',
    productVersion: 'V2024.01.15',
    configVersion: 'V3.2',
    generateTime: '2024-01-15 10:30:00',
    validPeriod: '36个月',
    email: 'admin@smartproperty.com',
  },
  permissions: ['module_workorder', 'module_dispatch', 'module_ai_dispatch'],
  quota: {
    monthlyOrderLimit: 5000,
    maxUsers: 50,
  },
  fileInfo: {
    fileName: 'license_edge_wo_001_20240115.lic',
    fileContent: `ENCRYPTED LICENSE FILE
USER_ID: C001
PROJECT: 智慧物业管理平台
PAYLOAD: V3.2
SIGNATURE: 464C0606BFCA71B`,
  },
};

/**
 * 新增应用表单默认数据
 */
export const mockAddAppFormData: AddAppFormData = {
	appName: '企业OA',
	appCode: 'ext-oa-system',
	appCategory: '第三方应用',
	token: '',
	refreshToken: '',
	authMode: 'OAuth2.0',
	secondaryLogin: false,
	ssoEnabled: true,
	syncAddress: '',
	tokenAddress: '',
	loginRedirectAddress: '',
	logoutAddress: '',
	description: '简要描述应用功能...',
	accessUrls: [
		{ type: 'PC Web', url: 'https://example.com/app', displayMode: 'always', enabled: true },
		{ type: 'Mobile H5', url: 'https://example.com/app', displayMode: 'always', enabled: true },
	],
};

/**
 * 统计卡片配置数据
 */
export const getStatCardsConfig = (stats: StatsData): StatItem[] => [
	{ title: '已授权应用', value: stats.totalApps, color: '#3b82f6' },
	{ title: '已激活', value: stats.activeApps, color: '#10b981' },
	{ title: '第三方应用', value: stats.thirdPartyApps, color: '#f59e0b' },
	{ title: '待授权', value: stats.pendingApps, color: '#ef4444' },
	{ title: 'AI工具', value: stats.aiTools, color: '#8b5cf6' },
	{ title: '总授权用户', value: stats.totalUsers, color: '#ec4899' },
];

/**
 * 状态选项
 */
export const statusOptions = [
	{ label: '全部状态', value: '' },
	{ label: '已激活', value: 'active' },
	{ label: '已停用', value: 'inactive' },
	{ label: '测试中', value: 'testing' },
];

/**
 * 分类选项
 */
export const categoryOptions = [
	{ label: '全部分类', value: '' },
	{ label: '客户服务', value: '客户服务' },
	{ label: '空间与设备', value: '空间与设备' },
	{ label: '第三方应用', value: '第三方应用' },
];
