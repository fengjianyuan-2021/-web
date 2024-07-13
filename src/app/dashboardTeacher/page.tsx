'use client';
import * as React from 'react';
import type { Metadata } from 'next';
import Grid from '@mui/material/Unstable_Grid2';
import dayjs from 'dayjs';

import { config } from '@/config';
import { Budget } from '@/components/dashboard/overview/budget';
import { StudentEvaluationSummaryList } from '@/components/dashboard/overview/studentEvaluationSummaryList';
import { LatestProducts } from '@/components/dashboard/overview/latest-products';
import { Sales } from '@/components/dashboard/overview/sales';
import { EvaluatedStudentCount } from '@/components/dashboard/overview/evaluatedStudentCount';
import { StudentCount } from '@/components/dashboard/overview/studentCount';
import { UnevaluatedStudentCount } from '@/components/dashboard/overview/unevaluatedStudentCount';
import { EvaluationCategory } from '@/components/dashboard/overview/evaluationCategory';
import { dashboardClient } from '@/lib/dashboard/dashboardClient';
import { Dashboard } from '@/types/dashboard';

export default function Page(): React.JSX.Element {
  const [dashboardTeacher,setDashboardTeacher] =React.useState<Dashboard>();

  React.useEffect(() => {
    const fetchCustomers = async () => {
      try {
      //  const currentUser = getCurrentUser();
      //  const userRole = currentUser?.role !== undefined ? currentUser.role : UserRole.admin;
       const customers = await dashboardClient.GetDashboardTeacher();
        console.log("获取统计信息列表", customers);
        console.log("valuePercentage={parseInt(dashboardTeacher?" + parseInt(dashboardTeacher?.evaluatedStudentPercentage ?? "0",10))
        if(typeof customers != "string")
          {
            setDashboardTeacher(customers);
           
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
        <StudentCount diff={16} trend="down" sx={{ height: '100%' }} value={dashboardTeacher?.studentSums ?? "0"} />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <EvaluatedStudentCount sx={{ height: '100%' }} value={parseInt(dashboardTeacher?.evaluatedStudentCount ?? "0",10)} EvaluationType='教师评价' valuePercentage={parseInt(dashboardTeacher?.evaluatedStudentPercentage ?? "0",10)} />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <UnevaluatedStudentCount sx={{ height: '100%' }} value={parseInt(dashboardTeacher?.unevaluatedStudentCount ?? "0",10)} EvaluationType='教师评价' valuePercentage={parseInt(dashboardTeacher?.unevaluatedStudentPercentage ?? "0",10)} />
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
        <EvaluationCategory chartSeries={[dashboardTeacher?.selfPercentage ?? 0, dashboardTeacher?.peerPercentage ?? 0, dashboardTeacher?.teacherPercentage??0]} labels={['自评', '互评', '教师评价']} sx={{ height: '100%' }} />
      </Grid>
      {/* <Grid lg={4} md={6} xs={12}>
        <LatestProducts
          products={[
            {
              id: 'PRD-005',
              name: 'Soja & Co. Eucalyptus',
              image: '/assets/product-5.png',
              updatedAt: dayjs().subtract(18, 'minutes').subtract(5, 'hour').toDate(),
            },
            {
              id: 'PRD-004',
              name: 'Necessaire Body Lotion',
              image: '/assets/product-4.png',
              updatedAt: dayjs().subtract(41, 'minutes').subtract(3, 'hour').toDate(),
            },
            {
              id: 'PRD-003',
              name: 'Ritual of Sakura',
              image: '/assets/product-3.png',
              updatedAt: dayjs().subtract(5, 'minutes').subtract(3, 'hour').toDate(),
            },
            {
              id: 'PRD-002',
              name: 'Lancome Rouge',
              image: '/assets/product-2.png',
              updatedAt: dayjs().subtract(23, 'minutes').subtract(2, 'hour').toDate(),
            },
            {
              id: 'PRD-001',
              name: 'Erbology Aloe Vera',
              image: '/assets/product-1.png',
              updatedAt: dayjs().subtract(10, 'minutes').toDate(),
            },
          ]}
          sx={{ height: '100%' }}
        />
      </Grid> */}
      <Grid lg={8} md={12} xs={12}>
        <StudentEvaluationSummaryList
          orders = {dashboardTeacher?.studentEvaluationSummaryDtos}
          sx={{ height: '100%' }}
        />
      </Grid>
    </Grid>
  );
}
