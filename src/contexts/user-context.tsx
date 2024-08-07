'use client';

import * as React from 'react';

import type { User } from '@/types/user';
import {getCurrentUser } from  '@/types/user'
import { authClient } from '@/lib/auth/client';
import { logger } from '@/lib/default-logger';

export interface UserContextValue {
  user: User | null;
  error: string | null;
  isLoading: boolean;
  checkSession?: () => Promise<void>;
}

export const UserContext = React.createContext<UserContextValue | undefined>(undefined);

export interface UserProviderProps {
  children: React.ReactNode;
}

export function UserProvider({ children }: UserProviderProps): React.JSX.Element {
  const [state, setState] = React.useState<{ user: User | null; error: string | null; isLoading: boolean }>({
    user: null,
    error: null,
    isLoading: true,
  });

  const checkSession = React.useCallback(async (): Promise<void> => {
    try {
      // 获取并记录当前用户信息
      const user = getCurrentUser();
      //检查用户ID是否存在
      if (user?.id !== null && user?.id !== undefined && user?.id.trim() !== '' && user?.id !== 'undefined' && user?.id !== 'null'){
        const { data, error } = await authClient.getUser(user.id);
        if (error) {
          setState((prev) => ({ ...prev, user: null, error: '出现错误', isLoading: false }));
          return;
        }
        setState((prev) => ({ ...prev, user: data ?? null, error: null, isLoading: false }));
      }else
      {
        setState((prev) => ({ ...prev, user: null, error: null, isLoading: false }));
      }

    } catch (err) {
      logger.error(err);
      setState((prev) => ({ ...prev, user: null, error: '出现错误', isLoading: false }));
    }
  }, []);

  React.useEffect(() => {
    checkSession().catch((err: unknown) => {
      logger.error(err);
      // noop
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Expected
  }, []);

  return <UserContext.Provider value={{ ...state, checkSession }}>{children}</UserContext.Provider>;
}

export const UserConsumer = UserContext.Consumer;
