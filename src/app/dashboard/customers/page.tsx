'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import {
  Stack,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  MenuItem,
  Avatar,
} from '@mui/material';
import type { Metadata } from 'next';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { userClient } from '@/lib/user/userclint';
import { config } from '@/config';
import { CustomersFilters } from '@/components/dashboard/customer/customers-filters';
import { CustomersTable } from '@/components/dashboard/customer/customers-table';
import { useFormik, FormikHelpers } from 'formik';
import { User, UserRole, Gender, getCurrentUser, GenderMap, UserRoleMap } from '@/types/user';
import * as yup from 'yup';
import * as XLSX from 'xlsx';
import { json } from 'node:stream/consumers';
import { Export } from '@phosphor-icons/react';

const validationSchema = yup.object({
  fullname: yup.string().required('姓名是必填项'),
  gender: yup.string().required('性别是必填项'),
  email: yup.string().email('请输入有效的邮箱地址'),
  passwordHash: yup.string().required('密码是必填项'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('passwordHash'), undefined], '两次输入的密码必须匹配')
    .required('请确认您的密码'),
  role: yup.string().required('角色是必填项'),
});

const Page: React.FC = () => {
  const [customers, setCustomers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openAdd, setOpenAdd] = useState(false);
  const [newUsername, setNewUsername] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
      const currentUser = getCurrentUser();
       const userRole = currentUser?.role !== undefined ? currentUser.role : UserRole.admin;
       const customers = await userClient.getUsers(userRole);
        console.log("获取用户列表", customers);
        if (!Array.isArray(customers)) {
          throw new Error('Invalid data format');
        }
        setCustomers(customers);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('未知错误');
        }
      }
    };

    fetchCustomers();
  }, []);

  const handlePageChange = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenAdd = () => {
    setNewUsername(generateUniqueUsername()); // 生成新的用户名
    setOpenAdd(true);
  };

  const handleCloseAdd = () => {
    setOpenAdd(false);
  };

  const generateUniqueUsername = () => {
    let username: string;
    const timestamp = Date.now();
    do {
      username = `user_${Math.floor(Math.random() * 1000000)}_${timestamp}`;
    } while (customers.some(customer => customer.username === username));
    return username;
  };

  const handleExport = () => {
    const data = paginatedCustomers.map(row => ({
      姓名: row.fullname,
      账号: row.username,
      性别: GenderMap[row.gender],
      邮箱: row.email,
      角色: UserRoleMap[row.role],
      组织: row.organization,
      职位: row.position,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, '学生数据.xlsx');
  };

  const handleAddUser = async (values: User, { setSubmitting }: FormikHelpers<User>) => {
    const newUser: User = {
      ...values,
      username: newUsername || generateUniqueUsername(),
      id: '',
      avatarpath: '',
      avatar: values.avatarFile ? URL.createObjectURL(values.avatarFile) : '',
      position: '',
      organization: '',
      totalScore: '0',
      passwordHash: values.passwordHash, // 从表单获取的密码
    };

    const formData = new FormData();
    formData.append('fullname', newUser.fullname);
    formData.append('username', newUser.username);
    formData.append('gender', newUser.gender.toString());
    formData.append('passwordHash', newUser.passwordHash); // 添加 passwordHash 字段
    formData.append('role', newUser.role.toString());

    if (newUser.avatarFile) {
      formData.append('avatarFile', newUser.avatarFile);
    }

    try {
      const createdUser = await userClient.createUser(formData);
      if (typeof createdUser === 'string') {
        setError(createdUser);
      } else {
        setCustomers([createdUser, ...customers]);
        setOpenAdd(false);
      }
    } catch (error) {
      const errorMessage = (error as Error).message;
      setError(errorMessage);
    }

    setSubmitting(false);
  };
  
  const formik = useFormik<User>({
    initialValues: {
      id: '',
      username: '',
      fullname: '',
      avatarpath: '',
      avatar: '',
      email: '',
      role: UserRole.studentCadre,
      gender: Gender.male,
      position: '',
      organization: '',
      totalScore: '0',
      passwordHash: '',
      avatarFile: null, // 初始化 avatarFile
      evaluatorId:'',
      evaluatorsorce:0,
      peerAverageScore:'',
      teacherAverageScore:'',
      classhour:0,
    },
    validationSchema: validationSchema,
    onSubmit: handleAddUser,
  });

  if (error) {
    return (
      <Stack spacing={3}>
        <Typography variant="h4" color="error">
          获取用户数据失败: {error}
        </Typography>
      </Stack>
    );
  }
  const currentUser = getCurrentUser();
  const paginatedCustomers = applyPagination(customers, page, rowsPerPage);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">用户管理界面</Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Button color="inherit" onClick={handleExport} startIcon={<Export fontSize="var(--icon-fontSize-md)" />}>
              导出
            </Button>
          </Stack>
        </Stack>
        <div>
        {currentUser?.role === UserRole.admin && (
          <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained" onClick={handleOpenAdd}>
            添加
          </Button>
        )}
        </div>
      </Stack>
      <CustomersTable
        count={customers.length}
        page={page}
        rows={paginatedCustomers}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        setCustomers={setCustomers} // 传递更新函数
      />

      <Dialog open={openAdd} onClose={handleCloseAdd}>
        <DialogTitle>添加用户</DialogTitle>
        <DialogContent sx={{ width:500}}>
          <form onSubmit={formik.handleSubmit}>
            <Stack spacing={2}>
            <Box sx={{ textAlign: 'center' }}>
                <Avatar src={formik.values.avatarFile ? URL.createObjectURL(formik.values.avatarFile) : ''} sx={{ width: 100, height: 100, mx: 'auto' }} />
                <Button variant="contained" component="label" sx={{ mt: 2 }}>
                  上传头像
                  <input type="file" hidden onChange={(event) => {
                    const file = event.currentTarget.files?.[0];
                    if (file) {
                      formik.setFieldValue('avatarFile', file);
                    }
                  }} />
                </Button>
              </Box>
              <TextField
                fullWidth
                label="用户账号"
                name="username"
                value={newUsername || ''}
                disabled
              />
              <TextField
                fullWidth
                label="用户名"
                name="fullname"
                value={formik.values.fullname}
                onChange={formik.handleChange}
                error={formik.touched.fullname && Boolean(formik.errors.fullname)}
                helperText={formik.touched.fullname && formik.errors.fullname}
              />
              <TextField
                fullWidth
                type="password"
                label="密码"
                name="passwordHash"
                value={formik.values.passwordHash}
                onChange={formik.handleChange}
                error={formik.touched.passwordHash && Boolean(formik.errors.passwordHash)}
                helperText={formik.touched.passwordHash && formik.errors.passwordHash}
              />
              <TextField
                fullWidth
                type="password"
                label="确认密码"
                name="confirmPassword"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
              />
              
              <TextField
                select
                fullWidth
                label="性别"
                name="gender"
                value={formik.values.gender}
                onChange={formik.handleChange}
                error={formik.touched.gender && Boolean(formik.errors.gender)}
                helperText={formik.touched.gender && formik.errors.gender}
              >
                <MenuItem value={Gender.male}>男</MenuItem>
                <MenuItem value={Gender.female}>女</MenuItem>
              </TextField>
              <TextField
                select
                fullWidth
                label="权限"
                name="role"
                value={formik.values.role}
                onChange={formik.handleChange}
                error={formik.touched.role && Boolean(formik.errors.role)}
                helperText={formik.touched.role && formik.errors.role}
              >
                <MenuItem value={UserRole.admin}>管理员</MenuItem>
                <MenuItem value={UserRole.teacher}>教师</MenuItem>
                <MenuItem value={UserRole.studentCadre}>学生干部</MenuItem>
              </TextField>
            </Stack>
            <DialogActions>
              <Button onClick={handleCloseAdd} color="secondary">取消</Button>
              <Button type="submit" color="primary">确认</Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </Stack>
  );
};

export default Page;

function applyPagination(rows: User[], page: number, rowsPerPage: number): User[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}