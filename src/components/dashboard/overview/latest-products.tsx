import React, { useState } from 'react';
import {
  Card, CardHeader, Divider, List, ListItem, ListItemAvatar, ListItemText, Box, Grid, Button,
  Dialog, DialogTitle, DialogContent, TextField, DialogActions, IconButton, CardActions
} from '@mui/material';
import * as XLSX from 'xlsx';
import type { SxProps } from '@mui/material/styles';
import { ArrowRight as ArrowRightIcon } from '@phosphor-icons/react/dist/ssr/ArrowRight';
import { DotsThreeVertical as DotsThreeVerticalIcon } from '@phosphor-icons/react/dist/ssr/DotsThreeVertical';
import dayjs from 'dayjs';
import { Evaluation, getEvaluationTypeDescription } from '@/types/dashboard';
import { string } from 'zod';
import { getCurrentUser, UserRole } from '@/types/user';
import axios from 'axios';
import { API_BASE_URL } from '@/config';
import { Export, PencilCircle, PencilSimple } from '@phosphor-icons/react';

export interface Product {
  id: string;
  image: string;
  name: string;
  updatedAt: Date;
}

export interface LatestProductsProps {
  products?: Evaluation[];
  sx?: SxProps;
  title: string;
}

export function LatestProducts({ products = [], title, sx }: LatestProductsProps): React.JSX.Element {
  const currentUser = getCurrentUser();
  const [open, setOpen] = useState(false);
  const [selectedEvaluation, setSelectedEvaluation] = useState<Evaluation | null>(null);
  const [newScore, setNewScore] = useState<number | null>(null);

  const handleExportDetails = async (username: string) => {
    try {
      if (Array.isArray(products) && products.length > 0) {
        const data = products.map(products => ({
          '被评价的学生干部': products.studentCadreName,
          '评价者': products.evaluatorName,
          '评价类型': getEvaluationTypeDescription(products.evaluationType),
          '评分': products.score ?? '无',
          '评价内容': products.comments,
          '评价日期': dayjs(products.evaluationDate).format('YYYY-MM-DD'),
        }));

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, `${username}_详细评价`);
        XLSX.writeFile(wb, `${username}_详细评价.xlsx`);
      } else {
        console.error('获取评价数据失败或无数据');
      }
    } catch (error) {
      console.error('导出详细评价失败', error);
    }
  };

  const handleEdit = (evaluation: Evaluation) => {
    setSelectedEvaluation(evaluation);
    setNewScore(evaluation.score);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedEvaluation(null);
    setNewScore(null);
  };

  const handleSave = async () => {
    if (selectedEvaluation && newScore !== null) {
      try {
        await axios.put(`${API_BASE_URL}/api/Evaluation/UpdateEvaluationScore`, { id: selectedEvaluation.id,score: newScore });
        setOpen(false);
        
      } catch (error) {
        console.error('更新评分失败', error);
      }
    }
  };

  return (
    <Card sx={{ ...sx, height: 540, overflow: 'auto' }}>
      <CardHeader title={title} />
      <Divider />
      <List>
        {products.map((product, index) => (
          <ListItem divider={index < products.length - 1} key={index}>
            <ListItemAvatar sx={{ mr: 2 }}>
              <Box
                sx={{
                  borderRadius: '50%',  // 圆角
                  backgroundColor: 'var(--mui-palette-neutral-200)',
                  height: '48px',
                  width: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  fontWeight: 'bold',
                }}
              >
                {index + 1}
              </Box>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={4}>
                    {product.studentCadreName}
                  </Grid>
                  <Grid item xs={4}>
                    评分: {product.score ?? '无'}
                  </Grid>
                </Grid>
              }
              secondary={
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={4}>
                    类型: {getEvaluationTypeDescription(product.evaluationType)}
                  </Grid>
                  <Grid item xs={4}>
                    评分日期: {dayjs(product.evaluationDate).format('YYYY-MM-DD')}
                  </Grid>
                </Grid>
              }
              primaryTypographyProps={{ variant: 'subtitle1' }}
            />
            {currentUser?.role === UserRole.admin && (
              <IconButton edge="end" onClick={() => handleEdit(product)}>
                <PencilSimple />
              </IconButton>
            )}
          </ListItem>
        ))}
      </List>
      <Divider />
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button
          color="inherit"
          endIcon={<Export fontSize="var(--icon-fontSize-md)" />}
          size="small"
          variant="text"
          onClick={() => handleExportDetails('历史评价')}
        >
          导出
        </Button>
      </CardActions>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>编辑评分</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="评分"
            type="number"
            fullWidth
            value={newScore ?? ''}
            onChange={(e) => setNewScore(parseFloat(e.target.value))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">取消</Button>
          <Button onClick={handleSave} color="primary">保存</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}