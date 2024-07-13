'use client';

import axios, { AxiosError } from 'axios';
import type { User, UserRole } from '@/types/user';
import { API_BASE_URL } from '@/config';
import { Dashboard, Evaluation } from '@/types/dashboard';

class DashboardClient {
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
 * 获取统计信息 教师查看
 * 
 * @returns {Promise<User[] | string>} 用户列表或错误信息
 */
async GetDashboardTeacher(): Promise<Dashboard | string> {
  try {
    const response = await axios.post<Dashboard>(`${API_BASE_URL}/api/dashboard/GetDashboardTeacher`, {}, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log(response);
    return response.data;
  } catch (error) {
    return this.getErrorMessage(error) || '获取统计信息失败';
  }
}

 /**
 * 获取统计信息 学生查看
 * 
 * @returns {Promise<User[] | string>} 用户列表或错误信息
 */
 async GetDashboardStudent(userId : number): Promise<Dashboard | string> {
  try {
    const response = await axios.post<Dashboard>(`${API_BASE_URL}/api/dashboard/GetDashboardStudent`, {userId: userId}, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log(response);
    return response.data;
  } catch (error) {
    return this.getErrorMessage(error) || '获取统计信息失败';
  }
}

/**
 * 根据用户ID获取评价列表
 * @param {number} userId - 用户ID
 */
 async getEvaluationsByUserId(userId: number): Promise<{result: null, value: Evaluation[]}> {
  try {
    const response = await axios.get<{result: null, value: Evaluation[]}>(`${API_BASE_URL}/api/dashboard/GetEvaluationsByUserId/${userId}`);
    return response.data;
  } catch (error) {
    console.error('获取评价数据失败', error);
    throw new Error('获取评价数据失败');
  }
}


}

export const dashboardClient = new DashboardClient();
