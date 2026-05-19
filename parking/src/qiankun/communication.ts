// 全局状态类型（根据你的业务修改）
export type GlobalState = {
	token?: string;
	themeConfig?: any;
	userInfos?: any;
  apiPrefix?: string;
  test?: any;
  isScreenfull?: boolean;
	[key: string]: any;
};

// 子应用发送给主应用的消息类型
export type ActionType =
	| 'update:theme' // 切换主题
	| 'update:userInfo' // 更新用户信息
	| 'logout' // 退出登录
	| string;

export type Message = {
	type: ActionType;
	data?: any;
};
