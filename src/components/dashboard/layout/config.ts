import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'overviewStduent', title: '学生干部评价信息汇总和导出界面', href: paths.dashboard.overviewStduent, icon: 'chart-pie' },
  { key: 'customerStduent', title: '学生干部信息和评价填写', href: paths.dashboard.customerStduent, icon: 'users' },
  { key: 'overviewTeacher', title: '教师评价统计和导出界面', href: paths.dashboard.overviewTeacher, icon: 'chart-pie' },
  { key: 'customersTeacher', title: '教师评价和查看界面', href: paths.dashboard.customersTeacher, icon: 'users' },
  { key: 'overviewAdmin', title: '管理员界面', href: paths.dashboard.overviewAdmin, icon: 'chart-pie' },
  { key: 'customersAdmin', title: '管理员信息管理界面', href: paths.dashboard.customersAdmin, icon: 'users' },
  { key: 'integrations', title: 'Integrations', href: paths.dashboard.integrations, icon: 'plugs-connected' },
  { key: 'settings', title: '公告查看界面', href: paths.dashboard.settings, icon: 'gear-six' },
  { key: 'account', title: 'Account', href: paths.dashboard.account, icon: 'user' },
  { key: 'account', title: 'Account', href: paths.dashboard.account, icon: 'user' },
  { key: 'account', title: '学生干部基本信息', href: paths.dashboard.account, icon: 'user' },
  { key: 'error', title: 'Error', href: paths.errors.notFound, icon: 'x-square' },
] satisfies NavItemConfig[];
