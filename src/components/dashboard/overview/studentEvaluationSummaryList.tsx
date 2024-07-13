import React, { useState } from 'react';
import { Card, CardHeader, Divider, Box, Table, TableHead, TableRow, TableCell, TableBody, CardActions, Button, Snackbar, Alert } from '@mui/material';
import type { SxProps } from '@mui/material/styles';
import * as XLSX from 'xlsx';
import { ArrowRight as ArrowRightIcon } from '@phosphor-icons/react/dist/ssr/ArrowRight';
import dayjs from 'dayjs';
import { Evaluation, getEvaluationTypeDescription, type StudentEvaluationSummary } from '@/types/dashboard';
import { dashboardClient } from '@/lib/dashboard/dashboardClient';
import { getEnabledCategories } from 'trace_events';

export interface StudentEvaluationSummaryProps {
  orders?: StudentEvaluationSummary[];
  sx?: SxProps;
}

export function StudentEvaluationSummaryList({ orders = [], sx }: StudentEvaluationSummaryProps): React.JSX.Element {
  const [snackbar, setSnackbar] = useState<{ open: boolean, message: string, severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleExport = () => {
    try {
      const data = orders.map(order => ({
        学生ID: order.username,
        学生名: order.fullname,
        教师评价分数: order.averageScore
      }));

      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      XLSX.writeFile(wb, '学生评价统计.xlsx');

      setSnackbar({ open: true, message: '导出成功', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: '导出失败', severity: 'error' });
    }
  };

  const handleExportDetails = async (username: number,fullname:string) => {
    try {
      const response = await dashboardClient.getEvaluationsByUserId(username);
      let evaluations: Evaluation[] = [];

      if (typeof response.value === 'string') {
        evaluations = JSON.parse(response.value);
      } else if (Array.isArray(response.value)) {
        evaluations = response.value;
      }

      if (Array.isArray(evaluations) && evaluations.length > 0) {
        const data = evaluations.map(evaluation => ({
          被评价的学生干部: evaluation.studentCadreName,
          评价者: evaluation.evaluatorName,
          评价类型: evaluation.evaluationType,
          评分: evaluation.score,
          评价内容: evaluation.comments,
          评价日期: evaluation.evaluationDate,
        }));

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, `${fullname}_详细评价`);
        XLSX.writeFile(wb, `${fullname}_详细评价.xlsx`);

        setSnackbar({ open: true, message: '详细评价导出成功', severity: 'success' });
      } else {
        setSnackbar({ open: true, message: '获取评价数据失败或无数据', severity: 'error' });
      }
    } catch (error) {
      setSnackbar({ open: true, message: '导出详细评价失败', severity: 'error' });
    }
  };

  return (
    <>
      <Card sx={sx}>
        <CardHeader title="学生评价统计" />
        <Divider />
        <Box sx={{ overflowX: 'auto' }}>
          <Table sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow>
                <TableCell>学生ID</TableCell>
                <TableCell>学生名</TableCell>
                <TableCell>教师评价分数(平均分)</TableCell>
                <TableCell>操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow hover key={order.id}>
                  <TableCell>{order.username}</TableCell>
                  <TableCell>{order.fullname}</TableCell>
                  <TableCell>{order.averageScore}</TableCell>
                  <TableCell>
                    <Button
                      color="primary"
                      onClick={() => handleExportDetails(order.id,order.fullname)}
                    >
                      导出关联评价
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button
            color="inherit"
            endIcon={<ArrowRightIcon fontSize="var(--icon-fontSize-md)" />}
            size="small"
            variant="text"
            onClick={handleExport}
          >
            全部导出
          </Button>
        </CardActions>
      </Card>
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}