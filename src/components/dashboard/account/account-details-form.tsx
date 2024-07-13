'use client';
import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
  Snackbar,
  Alert
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { UserRole, Gender, User, getCurrentUser, UserRoleMap } from '@/types/user';
import { userClient } from '@/lib/user/userclint';
import { json } from 'stream/consumers';

const validationSchema = yup.object({
  fullname: yup.string().required('姓名是必填项'),
  gender: yup.string().required('性别是必填项'),
  email: yup.string().email('请输入有效的邮箱地址'),
  passwordHash: yup.string(),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('passwordHash'), undefined], '两次输入的密码必须匹配')
    .when('passwordHash', {
      is: (passwordHash: string) => !!passwordHash,
      then: (schema) => schema.required('请确认您的密码'),
    }),
  position: yup.string(),
  organization: yup.string(),
  selfEvaluation: yup.string(),
  selfScore: yup.number(),  // 自我评分
});

export function AccountDetailsForm(): React.JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean, message: string, severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  useEffect( () => {
    const fetchCustomers = async () => {
      try {
        const currentUser = getCurrentUser();
       
        if (currentUser) {
          const userid = currentUser.id;
          const customers = await userClient.GetUserAndEvaluationAsync(userid);
          console.log("获取用户列表", customers);
          
          console.log("typeof customers  "+typeof customers);
          if(typeof customers != 'string')
          {
            console.log("获取用户列表1231231", customers);
            setUser(customers);
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

  const formik = useFormik({
    initialValues: user || {
      id: '',
      fullname: '',
      gender: Gender.male,
      email: '',
      role: UserRole.studentCadre,
      passwordHash: '',
      confirmPassword: '',
      position: '',
      avatar: '',
      username: '',
      organization: '',
      selfEvaluation: '',
      selfScore: '',  // 自我评分
      peerAverageScore:'0',  // 互评平均分数
      teacherAverageScore:'0',  // 教师评价分数
    },
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        formData.append(key, (values as any)[key]);
      });

      formData.append('avatarFile', "");
      const response = await userClient.updateUser(formData);
      if (typeof response === 'string') {
        setSnackbar({ open: true, message: '保存失败', severity: 'error' });
        console.error(response);
      } else {
        setSnackbar({ open: true, message: '保存成功', severity: 'success' });
        localStorage.setItem('current-user', JSON.stringify({ ...values }));
      }
    },
  });

  if (!user) {
    return <Typography>加载中...</Typography>;
  }

  return (
    <>
    <form onSubmit={formik.handleSubmit}>
      <Card>
        <CardHeader subheader="可以编辑信息" title="用户资料" />
        <Divider />
        <CardContent>
          <Grid container spacing={3} sx={{ mt: 0}}>
            <Grid item md={6} xs={12}>
              <FormControl fullWidth disabled>
                <InputLabel>用户账号</InputLabel>
                <OutlinedInput value={formik.values.username} label="用户账号" name="username" />
              </FormControl>
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                required
                label="用户名"
                name="fullname"
                value={formik.values.fullname}
                onChange={formik.handleChange}
                error={formik.touched.fullname && Boolean(formik.errors.fullname)}
                helperText={formik.touched.fullname && formik.errors.fullname}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>性别</InputLabel>
                <Select
                  value={formik.values.gender}
                  onChange={formik.handleChange}
                  label="性别"
                  name="gender"
                  error={formik.touched.gender && Boolean(formik.errors.gender)}
                >
                  <MenuItem value={Gender.male}>男</MenuItem>
                  <MenuItem value={Gender.female}>女</MenuItem>
                </Select>
                {formik.touched.gender && formik.errors.gender && (
                  <Typography color="error">{formik.errors.gender}</Typography>
                )}
              </FormControl>
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="邮箱"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="密码"
                name="passwordHash"
                type="password"
                value={formik.values.passwordHash}
                onChange={formik.handleChange}
                error={formik.touched.passwordHash && Boolean(formik.errors.passwordHash)}
                helperText={formik.touched.passwordHash && formik.errors.passwordHash}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="确认密码"
                name="confirmPassword"
                type="password"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="职位"
                name="position"
                value={formik.values.position}
                onChange={formik.handleChange}
                error={formik.touched.position && Boolean(formik.errors.position)}
                helperText={formik.touched.position && formik.errors.position}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="组织"
                name="organization"
                value={formik.values.organization}
                onChange={formik.handleChange}
                error={formik.touched.organization && Boolean(formik.errors.organization)}
                helperText={formik.touched.organization && formik.errors.organization}
              />
            </Grid>
            <Grid item md={12} xs={12}>
              <FormControl fullWidth disabled>
                <InputLabel>权限</InputLabel>
                <OutlinedInput value={UserRoleMap[formik.values.role]} label="权限" name="role" />
              </FormControl>
            </Grid>
            {user.role === UserRole.studentCadre && (
               <>
               <Grid item md={12} xs={12}>
                 <TextField
                   fullWidth
                   label="自我评分"
                   name="selfScore"
                   value={formik.values.selfScore}
                   onChange={formik.handleChange}
                   error={formik.touched.selfScore && Boolean(formik.errors.selfScore)}
                   helperText={formik.touched.selfScore && formik.errors.selfScore}
                   InputLabelProps={{
                    shrink: Boolean(formik.values.selfScore),
                  }}
                 />
               </Grid>
               <Grid item md={6} xs={12}>
                 <Typography variant="body1" sx={{ mt: 2 }}>
                   互评平均分数: {formik.values.peerAverageScore}
                 </Typography>
               </Grid>
               <Grid item md={6} xs={12}>
                 <Typography variant="body1" sx={{ mt: 2 }}>
                   教师评价分数: {formik.values.teacherAverageScore}
                 </Typography>
               </Grid>
             </>
            )}
          </Grid>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button type="submit" variant="contained">
            保存信息
          </Button>
        </CardActions>
      </Card>
    </form>
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
