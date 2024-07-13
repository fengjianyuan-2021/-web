'use client';
import * as React from 'react';
import type { Metadata } from 'next';
import Grid from '@mui/material/Unstable_Grid2';
import dayjs from 'dayjs';

import { config } from '@/config';
import { Budget } from '@/components/dashboard/overview/budget';
import { StudentEvaluationSummaryList } from '@/components/dashboard/overview/studentEvaluationSummaryList';
import { LatestProducts } from '@/components/dashboard/overview/latest-products';
import { EvaluatedStudentCount } from '@/components/dashboard/overview/evaluatedStudentCount';
import { StudentCount } from '@/components/dashboard/overview/studentCount';
import { UnevaluatedStudentCount } from '@/components/dashboard/overview/unevaluatedStudentCount';
import { EvaluationCategory } from '@/components/dashboard/overview/evaluationCategory';
import { dashboardClient } from '@/lib/dashboard/dashboardClient';
import { Dashboard } from '@/types/dashboard';
import { getCurrentUser } from '@/types/user';

export default function Page(): React.JSX.Element {
  const [dashboardTeacher, setDashboardTeacher] = React.useState<Dashboard>();

  React.useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const currentUser = getCurrentUser();
        if (currentUser) {
          //  const userRole = currentUser?.role !== undefined ? currentUser.role : UserRole.admin;
          const customers = await dashboardClient.GetDashboardStudent(parseInt(currentUser?.id, 10));
          console.log("获取统计信息列表", customers);
          console.log("valuePercentage={parseInt(dashboardTeacher?" + parseInt(dashboardTeacher?.evaluatedStudentPercentage ?? "0", 10))
          if (typeof customers != "string") {
            setDashboardTeacher(customers);

          }
        }
      } catch (error) {
        if (error instanceof Error) {

        } else {

        }
      }
    };

    fetchCustomers();
  }, []);

  return (
    <Grid container spacing={3}>
      {/* 上方标签 */}
      <Grid lg={3} sm={6} xs={12}>
        <StudentCount diff={16} trend="down" sx={{ height: '100%' }} value={dashboardTeacher?.classHourCount.toString() ?? "0"} title='学时统计' />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <EvaluatedStudentCount sx={{ height: '100%' }} value={parseInt(dashboardTeacher?.evaluatedStudentCount ?? "0", 10)} EvaluationType='已评价学生数' valuePercentage={parseInt(dashboardTeacher?.evaluatedStudentPercentage ?? "0", 10)} />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <UnevaluatedStudentCount sx={{ height: '100%' }} value={parseInt(dashboardTeacher?.unevaluatedStudentCount ?? "0", 10)} EvaluationType='未评价学生数' valuePercentage={parseInt(dashboardTeacher?.unevaluatedStudentPercentage ?? "0", 10)} />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <Budget diff={12} trend="up" sx={{ height: '100%' }} value={dashboardTeacher?.averageScore} />
      </Grid>
      {/* <Grid lg={8} xs={12}>
        <Sales
          chartSeries={[
            { name: 'This year', data: [18, 16, 5, 8, 3, 14, 14, 16, 17, 19, 18, 20] },
            { name: 'Last year', data: [12, 11, 4, 6, 2, 9, 9, 10, 11, 12, 13, 13] },
          ]}
          sx={{ height: '100%' }}
        />
      </Grid> */}
      {/* 评价类别 */}
      <Grid lg={4} md={6} xs={12}>
        <EvaluationCategory chartSeries={[dashboardTeacher?.selfPercentage ?? 0, dashboardTeacher?.peerPercentage ?? 0]} labels={['自评', '互评']} title='个人评价类别' sx={{ height: '100%' }} />
      </Grid>
      <Grid lg={8} md={6} xs={12}>
        <LatestProducts
          title='我的历史评价'
          products={dashboardTeacher?.evaluationDtos}
          sx={{ height: '100%' }}
        />
      </Grid>
      <Grid lg={12} md={12} xs={12}>
        <StudentEvaluationSummaryList
          orders={dashboardTeacher?.studentEvaluationSummaryDtos}
          sx={{ height: '100%' }}
        />
      </Grid>
    </Grid>
  );
}

