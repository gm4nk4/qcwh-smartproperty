import { QueryFormConfig, TableConfig } from '/@/components/ConfigurableComponents'
import { getAlarmRulePage } from '/@/api/basicManagement/alarm'

// 表单配置
export const QUERY_FORM_CONFIG: QueryFormConfig = {
  fields: [
    {
      label: '规则名称',
      value: 'ruleName',
      type: 'input',
      selected: true,
      props: {
        placeholder: '请输入规则名称',
        clearable: true,
        style: {
          width: '180px'
        }
      }
    },
    {
      label: '告警级别',
      value: 'alarmLevel',
      type: 'select',
      selected: true,
      props: {
        placeholder: '请选择告警级别',
        clearable: true,
        style: {
          width: '180px'
        }
      }
    }
  ]
}

// 表格配置
export const TABLE_CONFIG: TableConfig = {
  pageList: getAlarmRulePage,
  autoLoad: true,
  selectionType: 'checkbox',
  columns: [
   
    {
      prop: 'ruleName',
      label: '规则名称',
      showOverflowTooltip: true
    },
    {
      prop: 'alarmType',
      label: '告警类型',
      showOverflowTooltip: true,
      slot: 'alarmType'
    },
    {
      prop: 'alarmLevel',
      label: '告警级别',
      showOverflowTooltip: true,
      slot: 'alarmLevel'
    },
    {
      prop: 'metrics',
      label: '监测指标',
      showOverflowTooltip: true,
      slot: 'metrics'
    },
    {
      prop: 'triggerCondition',
      label: '触发条件',
      showOverflowTooltip: true,
      slot: 'triggerCondition'
    },
    {
      prop: 'threshold',
      label: '阈值',
      showOverflowTooltip: true
    },
    {
      prop: 'notifyMethods',
      label: '通知方式',
      showOverflowTooltip: true,
      slot: 'notifyMethods'
    },
    {
      prop: 'status',
      label: '状态',
      showOverflowTooltip: true,
      slot: 'status'
    },
    {
      prop: 'createTime',
      label: '创建时间',
      showOverflowTooltip: true
    },
    {
      type: 'operation',
      label: '操作',
      width: 200,
      operations: [
        {
          label: '编辑',
          icon: 'edit-pen',
          type: 'primary',
          action: 'edit'
        },
        {
          label: '删除',
          icon: 'delete',
          type: 'danger',
          action: 'delete'
        }
      ]
    }
  ],
  rightToolbar: {
    showSearch: true
  },
  descs: ['create_time']
}
