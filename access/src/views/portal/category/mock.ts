/**
 * 应用分类模拟数据
 */

import type { CategoryInfo, StatCardData } from './type';

/**
 * 分类数据
 */
export const mockCategories: CategoryInfo[] = [
  {
    id: 1,
    name: '客户服务',
    appCount: 6,
    activeAppCount: 5,
    activeText: '已激活 5/6',
    apps: [
      {
        id: 101,
        name: '工单管理',
        icon: 'Document',
        active: true,
        activeText: '已激活'
      },
      {
        id: 102,
        name: '物业缴费',
        icon: 'Wallet',
        active: true,
        activeText: '已激活'
      },
      {
        id: 103,
        name: '社区运营',
        icon: 'ChatDotRound',
        active: true,
        activeText: '已激活'
      },
      {
        id: 104,
        name: '客户评价',
        icon: 'Star',
        active: true,
        activeText: '已激活'
      },
      {
        id: 105,
        name: '公告管理',
        icon: 'Bell',
        active: true,
        activeText: '已激活'
      },
      {
        id: 106,
        name: '智慧访客',
        icon: 'User',
        active: false,
        activeText: '未激活'
      }
    ],
    uncategorizedApps: [
      {
        id: 107,
        name: '企业微信',
        icon: 'ChatLineSquare',
        active: false,
        activeText: '未激活'
      },
      {
        id: 108,
        name: '钉钉集成',
        icon: 'ChatDotRound',
        active: false,
        activeText: '未激活'
      }
    ]
  },
  {
    id: 2,
    name: '空间与设备',
    appCount: 7,
    activeAppCount: 6,
    activeText: '已激活 6/7',
    apps: [
      {
        id: 201,
        name: '物联网底座',
        icon: 'Connection',
        active: true,
        activeText: '已激活'
      },
      {
        id: 202,
        name: '数据治理',
        icon: 'DataAnalysis',
        active: true,
        activeText: '已激活'
      },
      {
        id: 203,
        name: '设备监控',
        icon: 'Monitor',
        active: true,
        activeText: '已激活'
      },
      {
        id: 204,
        name: '安防告警',
        icon: 'Warning',
        active: true,
        activeText: '已激活'
      },
      {
        id: 205,
        name: '能耗监测',
        icon: 'Odometer',
        active: true,
        activeText: '已激活'
      },
      {
        id: 206,
        name: '设备状态',
        icon: 'Cpu',
        active: true,
        activeText: '已激活'
      },
      {
        id: 207,
        name: '空间管理',
        icon: 'OfficeBuilding',
        active: false,
        activeText: '未激活'
      }
    ],
    uncategorizedApps: [
      {
        id: 208,
        name: '企业微信',
        icon: 'ChatLineSquare',
        active: false,
        activeText: '未激活'
      },
      {
        id: 209,
        name: '钉钉集成',
        icon: 'ChatDotRound',
        active: false,
        activeText: '未激活'
      }
    ]
  },
  {
    id: 3,
    name: '系统管理',
    appCount: 2,
    activeAppCount: 2,
    activeText: '已激活 2/0',
    hidden: true,
    hiddenText: '已隐藏',
    apps: [
      {
        id: 301,
        name: '权限管理',
        icon: 'Lock',
        active: true,
        activeText: '已激活'
      },
      {
        id: 302,
        name: '用户管理',
        icon: 'UserFilled',
        active: true,
        activeText: '已激活'
      }
    ],
    uncategorizedApps: []
  }
];

/**
 * 统计卡片数据
 */
export const mockStatCards: StatCardData[] = [
  {
    title: '分类数量',
    value: 4,
    icon: 'Grid',
    iconColor: '#3b82f6',
    bgColor: '#f0f7ff'
  },
  {
    title: '已归类应用',
    value: 17,
    icon: 'Box',
    iconColor: '#10b981',
    bgColor: '#f0fdf4'
  },
  {
    title: '未归类应用',
    value: 2,
    icon: 'FolderOpened',
    iconColor: '#f59e0b',
    bgColor: '#fffbeb'
  },
  {
    title: '可见分类',
    value: 4,
    icon: 'View',
    iconColor: '#8b5cf6',
    bgColor: '#faf5ff'
  }
];
