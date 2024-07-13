import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';
import { UrlRole } from '@/types/role'; // 引入角色枚举

export const navItems: NavItemConfig[] = [
  { key: 'overviewStudent', title: '个人信息统计', href: paths.dashboardStudent.overviewStudent, icon: 'chart-pie', role: UrlRole.StudentCadre },
  { key: 'customerStudent', title: '学生干部评价', href: paths.dashboardStudent.customerStudent, icon: 'users', role: UrlRole.StudentCadre },
  // { key: 'accountStudent', title: '学生干部基本信息', href: paths.dashboardStudent.accountStudent, icon: 'user', role: UrlRole.StudentCadre },
  
  { key: 'overviewTeacher', title: '学生评价统计--教师', href: paths.dashboardTeacher.overviewTeacher, icon: 'chart-pie', role: UrlRole.Teacher },
  { key: 'customersTeacher', title: '学生评分界面', href: paths.dashboardTeacher.customersTeacher, icon: 'users', role: UrlRole.Teacher },
  
  // { key: 'overviewAdmin', title: '管理员界面', href: paths.dashboard.overviewAdmin, icon: 'chart-pie', role: UrlRole.Admin },
  { key: 'customersAdmin', title: '管理员信息管理界面', href: paths.dashboard.customersAdmin, icon: 'users', role: UrlRole.Admin },

  // { key: 'integrations', title: 'Integrations', href: paths.dashboard.integrations, icon: 'plugs-connected', role: UrlRole.Admin },
  
  { key: 'Announcement ', title: '公告查看界面', href: paths.dashboard.settings, icon: 'gear-six', role: UrlRole.Everyone },
  { key: 'account', title: '个人信息管理', href: paths.dashboard.account, icon: 'user', role: UrlRole.Everyone },
  // { key: 'error', title: 'Error', href: paths.errors.notFound, icon: 'x-square', role: UrlRole.Everyone },
];
