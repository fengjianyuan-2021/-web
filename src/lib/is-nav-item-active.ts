import type { NavItemConfig } from '@/types/nav';
import { UrlRole } from '@/types/role';
import { getCurrentUser } from '@/types/user';

//通过Pick从NavItemConfig里挑选出需要的属性
export function isNavItemActive({
  disabled,
  external,
  href,
  matcher,
  pathname,
}: Pick<NavItemConfig, 'disabled' | 'external' | 'href' | 'matcher'> & { pathname: string }): boolean {
  if (disabled || !href || external) {
    return false;
  }
  if (matcher) {
    if (matcher.type === 'startsWith') {
      return pathname.startsWith(matcher.href);
    }

    if (matcher.type === 'equals') {
      return pathname === matcher.href;
    }

    return false;
  }

  return pathname === href;
}

/**
 * 检查当前用户是否有访问某个导航项的权限
 * @param {object} param0 - 包含导航项要求的角色的对象
 * @param {UrlRole | undefined} param0.role - 导航项要求的角色
 * @returns {boolean} 返回用户是否有权限访问该导航项
 */
export function hasAccess({ role }: Pick<NavItemConfig, 'role'>): boolean {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    return false;
  }
  if (role === UrlRole.Everyone || currentUser.role === role) {
    return true;
  }
  return false;
}
