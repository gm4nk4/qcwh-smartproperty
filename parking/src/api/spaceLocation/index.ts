import request from '/@/utils/request';

/**
 * 获取空间树形结构
 */
export const getSpaceTree = () => {
  return request({
    url: '/platform/base/space/tree',
    method: 'get',
  });
};

/**
 * 新增空间
 * @param data 空间数据
 */
export const addSpace = (data: any) => {
  return request({
    url: '/platform/base/space/add',
    method: 'post',
    data,
  });
};

/**
 * 更新空间
 * @param data 空间数据
 */
export const updateSpace = (data: any) => {
  return request({
    url: '/platform/base/space/update',
    method: 'post',
    data,
  });
};

/**
 * 获取空间详情
 * @param id 空间ID
 */
export const getSpaceDetail = (id: string) => {
  return request({
    url: `/platform/base/space/detail/${id}`,
    method: 'get',
  });
};

/**
 * 删除空间
 * @param id 空间ID
 */
export const deleteSpace = (id: string) => {
  return request({
    url: `/platform/base/space/${id}`,
    method: 'delete',
  });
};

/**
 * 获取空间能耗统计
 * @param id 空间ID
 */
export const getSpaceEnergyStats = (id: string) => {
  return request({
    url: `/platform/base/space/getEnergyStats/${id}`,
    method: 'get',
  });
};

/**
 * 根据ID获取子空间列表
 * @param id 空间ID
 */
export const getChildList = (id: string) => {
  return request({
    url: `/platform/base/space/getChildList/${id}`,
    method: 'get',
  });
};
