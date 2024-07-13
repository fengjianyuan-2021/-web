'use client';

import axios, { AxiosError } from 'axios';
import type { User, UserRole } from '@/types/user';
import { API_BASE_URL } from '@/config';

class UserClient {
  /**
   * 获取错误信息
   * @param {unknown} error - 错误对象
   * @returns {string | undefined} 错误信息
   */
  public getErrorMessage(error: unknown): string | undefined {
    console.log("用户接口调用异常  "+error );
    if (axios.isAxiosError(error)) {
      return error.response?.data?.message;
    } else {
      return String(error);
    }
  }

 /**
 * 根据权限获取所有用户
 * @param {UserRole} selectUserRole - 选择的用户角色
 * @returns {Promise<User[] | string>} 用户列表或错误信息
 */
async getUsers(selectUserRole: number): Promise<User[] | string> {
  try {
    const response = await axios.post<User[]>(`${API_BASE_URL}/api/user/GetUsersInRole`, { selectuserrole: selectUserRole }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    return this.getErrorMessage(error) || '获取用户列表失败';
  }
}


  /**
   * 获取单个用户
   * @param {number} id - 用户ID
   * @returns {Promise<User | string>} 用户对象或错误信息
   */
  async getUser(id: number): Promise<User | string> {
    try {
      const response = await axios.get<User>(`${API_BASE_URL}/api/user/${id}`);
      return response.data;
    } catch (error) {
      return this.getErrorMessage(error) || '获取用户信息失败';
    }
  }

    /**
   * 获取单个用户
   * @param {number} id - 用户ID
   * @returns {Promise<User | string>} 用户对象或错误信息
   */
    async GetUserAndEvaluationAsync(id: string): Promise<User | string> {
      try {
        const response = await axios.get<User>(`${API_BASE_URL}/api/user/GetUserAndEvaluation/${id}`);
        return response.data;   
      } catch (error) {
        return this.getErrorMessage(error) || '获取用户信息失败';
      }
    }

 /**
   * 创建新用户
   * @param {FormData} formData - 包含用户数据和头像文件的 FormData 对象
   * @returns {Promise<User | string>} 创建的用户对象或错误信息
   */
 async createUser(formData: FormData): Promise<any> {
  try {
    const response = await axios.post<User>(`${API_BASE_URL}/api/user/CreateUser`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    return this.getErrorMessage(error) || '创建用户失败';
  }
}

 /**
 * 更新用户信息
 * @param {FormData} formData - 用户信息和文件
 * @returns {Promise<any>} 返回更新后的用户信息或错误信息
 */
  async updateUser(formData: FormData): Promise<any> {
    try {
      const response = await axios.put(`${API_BASE_URL}/api/user/UpdateUser`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return this.getErrorMessage(error) || '更新用户信息失败';
    }
  }

 /**
 * 删除用户
 * @param {number} id - 用户ID
 * @returns {Promise<void | string>} 空或错误信息
 */
async deleteUser(id: number): Promise<void | string> {
  try {
    await axios.delete(`${API_BASE_URL}/api/user/${id}`);
    return; // 删除成功时返回空值
  } catch (error) {
    return this.getErrorMessage(error) || '删除用户失败';
  }
}
}

export const userClient = new UserClient();
