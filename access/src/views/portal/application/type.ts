/**
 * @file type.ts
 * @description 子应用管理模块类型定义
 * @module portal/application/type
 */

/**
 * 统计数据类型
 */
export interface StatsData {
	/** 已授权应用数 */
	totalApps: number;
	/** 已激活应用数 */
	activeApps: number;
	/** 第三方应用数 */
	thirdPartyApps: number;
	/** 待授权应用数 */
	pendingApps: number;
	/** AI工具数 */
	aiTools: number;
	/** 总授权用户数 */
	totalUsers: number;
}

/**
 * 查询参数类型
 */
export interface QueryParams {
	/** 应用名称 */
	appName: string;
	/** 应用状态 */
	appStatus: string;
	/** 应用分类 */
	appCategory: string;
}

/**
 * 应用数据类型
 */
export interface ApplicationItem {
  /** 应用ID */
  id: number;
  /** 应用名称 */
  name: string;
  /** 应用版本 */
  version: string;
  /** 应用状态：active-已激活，inactive-已停用，testing-测试中 */
  status: 'active' | 'inactive' | 'testing';
  /** 应用描述 */
  description: string;
  /** 应用分类 */
  category: string;
  /** 应用编码 */
  code: string;
  /** 授权用户数 */
  userCount: number;
  /** 授权有效期 */
  validPeriod: string;
  /** 功能模块列表 */
  modules: string[];
  /** AI工具数 */
  aiToolCount: number;
  /** 访问地址配置 */
  accessUrls: AccessUrlItem[];
}

/**
 * 访问地址配置项类型
 */
export interface AccessUrlItem {
  /** 类型 */
  type: string;
  /** 地址 */
  url: string;
  /** 显示方式 */
  displayMode: 'always' | 'never' | 'role';
  /** 是否开启 */
  enabled: boolean;
}

/**
 * 应用详情数据类型
 */
export interface ApplicationDetail {
  /** 基本信息 */
  basicInfo: {
    /** 版本 */
    version: string;
    /** 授权用户数 */
    userCount: number;
    /** AI工具数 */
    aiToolCount: number;
    /** 分类 */
    category: string;
  };
  /** 应用凭证信息 */
  credentials: {
    /** 应用编码 */
    appCode: string;
    /** Token */
    token: string;
    /** Refresh Token */
    refreshToken: string;
  };
  /** 授权配置信息 */
  authConfig: {
    /** 用户标识 */
    userCode: string;
    /** 授权项目 */
    project: string;
    /** 应用编码 */
    appCode: string;
    /** 产品版本 */
    productVersion: string;
    /** 配置版本 */
    configVersion: string;
    /** 生成时间 */
    generateTime: string;
    /** 授权有效期 */
    validPeriod: string;
    /** 邮件发送地址 */
    email: string;
  };
  /** 功能权限列表 */
  permissions: string[];
  /** 额度限制 */
  quota: {
    /** 月工单上限 */
    monthlyOrderLimit: number;
    /** 最大用户数 */
    maxUsers: number;
  };
  /** 文件信息 */
  fileInfo: {
    /** 文件名 */
    fileName: string;
    /** 文件内容 */
    fileContent: string;
  };
}

/**
 * 新增应用表单数据类型
 */
export interface AddAppFormData {
  /** 应用名称 */
  appName: string;
  /** 应用编码 */
  appCode: string;
  /** 应用分类 */
  appCategory: string;
  /** Token */
  token: string;
  /** Refresh Token */
  refreshToken: string;
  /** 授权模式 */
  authMode: string;
  /** 二次登录 */
  secondaryLogin: boolean;
  /** SSO开关 */
  ssoEnabled: boolean;
  /** 信息同步地址 */
  syncAddress: string;
  /** Token签发地址 */
  tokenAddress: string;
  /** 登录跳转地址 */
  loginRedirectAddress: string;
  /** 登出地址 */
  logoutAddress: string;
  /** 应用描述 */
  description: string;
  /** 访问地址配置 */
  accessUrls: AccessUrlItem[];
}
