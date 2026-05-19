import request from '/@/utils/request';

// 分页查询告警规则
export const getAlarmRulePage = (data: any) => {
  return request({
    url: '/platform/alarm/rule/page',
    method: 'post',
    data,
  });
};


// 新增或更新告警规则
export const saveOrUpdateAlarmRule = (data: any) => {
  return request({
    url: '/platform/alarm/rule/saveOrUpdate',
    method: 'post',
    data,
  });
};

// 获取告警规则详情
export const getAlarmRuleDetail = (id: number) => {
  return request({
    url: `/platform/alarm/rule/detail/${id}`,
    method: 'get',
  });
};

// 批量删除告警规则
export const deleteBatchAlarmRule = (data: any) => {
  return request({
    url: '/platform/alarm/rule/deleteBatch',
    method: 'post',
    data,
  });
};

// 批量启用/禁用告警规则
export const changeStatusBatchAlarmRule = (data: any) => {
  return request({
    url: '/platform/alarm/rule/changeStatusBatch',
    method: 'post',
    data,
  });
};