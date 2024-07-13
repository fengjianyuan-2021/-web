'use client';

import axios, { AxiosError } from 'axios';
import type { User } from '@/types/user';
import { API_BASE_URL } from '@/config';

function generateToken(): string {
  const arr = new Uint8Array(12);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, (v) => v.toString(16).padStart(2, '0')).join('');
}

// const user = {
//   id: 'USR-000',
//   avatar: '/assets/avatar.png',
//   firstName: 'Sofia',
//   lastName: 'Rivers',
//   username: 'sofia@devias.io',
// } satisfies User;

export interface SignUpParams {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
}


export interface SignInWithOAuthParams {
  provider: 'google' | 'discord';
}

export interface SignInWithPasswordParams {
  username: string;
  password: string;
}

export interface ResetPasswordParams {
  username: string;
  password: string;
}

interface AuthResponse {
  token: string;
}


class AuthClient {
  /**
   * 用户注册
   * @param {SignUpParams} params - 注册参数，包括名、姓、邮箱和密码
   * @returns {Promise<{ error?: string }>} 返回包含错误信息的 Promise 对象
   */
  async signUp(params: SignUpParams): Promise<{ error?: string }> {
    try {
      const response = await axios.post<AuthResponse>(`${API_BASE_URL}/api/Auth/signup`, params);
      const token = response.data.token;
      localStorage.setItem('custom-auth-token', token);
      return {};
    } catch (error) {
      return { error: this.getErrorMessage(error) || '注册失败' };
    }
  }

  /**
   * 使用密码登录
   * @param {SignInWithPasswordParams} params - 登录参数，包括邮箱和密码
   * @returns {Promise<{ error?: string }>} 返回包含错误信息的 Promise 对象
   */
  async signInWithPassword(params: SignInWithPasswordParams): Promise<{ error?: string }> {
    const { username, password } = params;
    try {
      const response = await axios.post<{ token: string; user: User }>(`${API_BASE_URL}/api/Auth/login`, { username, password });
      const { token, user } = response.data;
  
      localStorage.setItem('custom-auth-token', token);
      console.log("useruseruseruser "+user);
      console.log("useruseruseruser123123123 "+JSON.stringify(user));
      localStorage.setItem('current-user', JSON.stringify(user)); // 存储用户信息
  
      return {};
    } catch (error) {
      return { error: this.getErrorMessage(error) || '无效的凭据' };
    }
  }

 /**
   * 重置密码
   * @param {ResetPasswordParams} params - 重置密码参数，包括用户名和新密码
   * @returns {Promise<{ error?: string }>} 返回包含错误信息的 Promise 对象
   */
 async resetPassword(params: ResetPasswordParams): Promise<{ error?: string }> {
  try {
    await axios.post(`${API_BASE_URL}/api/Auth/change-password`, params);
    return {};
  } catch (error) {
    return { error: this.getErrorMessage(error) || '密码重置失败' };
  }
}

  /**
   * 更新密码
   * @param {ResetPasswordParams} params - 更新密码参数，包括邮箱和新密码
   * @returns {Promise<{ error?: string }>} 返回包含错误信息的 Promise 对象
   */
  async updatePassword(params: ResetPasswordParams): Promise<{ error?: string }> {
    try {
      await axios.post(`${API_BASE_URL}/api/Auth/update-password`, params);
      return {};
    } catch (error) {
      return { error: this.getErrorMessage(error) || '密码更新失败' };
    }
  }

/**
 * 获取指定用户ID的用户信息
 * @param {string} userId - 用户ID
 * @returns {Promise<{ data?: User | null; error?: string }>} 返回包含用户信息或错误信息的 Promise 对象
 */
async getUser(userId: string): Promise<{ data?: User | null; error?: string }> {
  const token = localStorage.getItem('custom-auth-token');
  if (!token) {
    return { data: null };
  }
  try {
    const response = await axios.get<User>(`${API_BASE_URL}/api/Auth/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json' // 确保设置了 Content-Type
      },
    });
    return { data: response.data };
  } catch (error) {
    return { error: this.getErrorMessage(error) || '获取用户信息失败' };
  }
}

  /**
   * 用户登出
   * @returns {Promise<{ error?: string }>} 返回包含错误信息的 Promise 对象
   */
  async signOut(): Promise<{ error?: string }> {
    localStorage.removeItem('custom-auth-token');
    return {};
  }

  /**
   * 获取错误信息
   * @param {unknown} error - 错误对象
   * @returns {string | undefined} 错误信息
   */
  private getErrorMessage(error: unknown): string | undefined {
    if (axios.isAxiosError(error)) {
      return error.response?.data?.message;
    } else {
      return String(error);
    }
  }
}

export const authClient = new AuthClient();
