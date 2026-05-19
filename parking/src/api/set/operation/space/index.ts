import request from '/@/utils/request';
/**接口类型 通用响应 */
export interface ICommonResponse<T> {
	code: number;
	msg: string;
	data: T;
}

/**接口类型 空间管理列表查询响应
 * @param id 空间ID
 * @param parentId 父空间ID
 * @param weight 权重
 * @param name 空间名称
 * @param deviceNum 设备数量
 * @param children 子空间列表
 */
export interface ISpaceRecord {
	id: number;
	parentId: number;
	weight: number;
	name: string;
	deviceNum: number;
	children?: ISpaceRecord[];
}

/**空间管理列表查询  hasExtra 需要传递true*/
export function fetchSpaceList(spaceName?: string): Promise<ICommonResponse<ISpaceRecord>> {
	return request({
		url: '/platform/space/tree',
		method: 'get',
		params: {
			hasExtra: true,
			spaceName: spaceName || undefined,
		},
	});
}

/** 通过id删除设备空间表*/
export function deleteSpaceById(id: number): Promise<ICommonResponse<boolean>> {
	return request({
		url: '/platform/space/delete',
		method: 'post',
		data: [id],
	});
}

/**接口类型 添加和修改空间参数 */
export interface ISpaceQuery {
	spaceId?: number;
	spaceName: string;
	parentId?: number;
	seq: number;
}

/**
 * 添加设备空间表
 * @param spaceEntity 空间实体
 * @return Promise<ICommonResponse<boolean>>
 */

export function addSpace(spaceEntity: ISpaceQuery): Promise<ICommonResponse<boolean>> {
	return request({
		url: '/platform/space/add',
		method: 'post',
		data: spaceEntity,
	});
}

/**
 * 修改设备空间表
 * @param spaceEntity 空间实体
 * @return Promise<ICommonResponse<boolean>>
 */
export function updateSpace(spaceEntity: ISpaceQuery): Promise<ICommonResponse<boolean>> {
	return request({
		url: '/platform/space/update',
		method: 'post',
		data: spaceEntity,
	});
}
