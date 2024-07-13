'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import { getCurrentUser } from '@/types/user';
import { User, UserRoleMap, GenderMap, UserRole, Gender } from '@/types/user';
import { useSelection } from '@/hooks/use-selection';
import { userClient } from '@/lib/user/userclint';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

function noop(): void {
  // do nothing
}

interface CustomersTableProps {
  count?: number;
  page?: number;
  rows?: User[];
  rowsPerPage?: number;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onPageChange?: (event: unknown, newPage: number) => void;
  onRowsPerPageChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setCustomers: (customers: User[]) => void; // 添加 setCustomers 属性
}

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
  evaluatorsorce: yup.number()
    .typeError("分数必须是数字")
    .when([], {
      is: () => {
        const currentUser = getCurrentUser();
        return currentUser?.role === UserRole.studentCadre || currentUser?.role === UserRole.teacher;
      },
      then: (schema) => schema.required("分数必须填写"),
      otherwise: (schema) => schema.notRequired()
    }),
  selfEvaluation: yup.string(),
});
interface UserFormValues extends User {
  avatarFile?: File | null;
}

//消息通知组件
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export function CustomersTable({
  count = 0,
  rows = [],
  page = 0,
  rowsPerPage = 0,
  onEdit = noop,
  onDelete = noop,
  onPageChange = noop,
  onRowsPerPageChange = noop,
  setCustomers, // 添加 setCustomers 属性
}: CustomersTableProps): React.JSX.Element {
  const currentUser = getCurrentUser();
  const rowIds = React.useMemo(() => {
    return rows.map((customer) => customer.id);
  }, [rows]);

  const { selected } = useSelection(rowIds);

  const [openEdit, setOpenEdit] = React.useState(false);
  const [editUser, setEditUser] = React.useState<User | null>(null);

  const handleEdit = (user: User) => {
    setEditUser(user);
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    setEditUser(null);
  };

  const handleSaveEdit = async (values: UserFormValues) => {
    const formData = new FormData();
    formData.append('id', values.id);
    formData.append('fullname', values.fullname);
    formData.append('gender', values.gender.toString());
    formData.append('email', values.email);
    formData.append('position', values.position);
    formData.append('organization', values.organization);
    formData.append('passwordHash', values.passwordHash);
    formData.append('role',values.role.toString());
    formData.append('evaluatorsorce', values.evaluatorsorce.toString());

    if(currentUser){
      formData.append('evaluatorId', currentUser.id);
    }
    
    if (values.avatarFile) {
      formData.append('avatarFile', values.avatarFile);
    }

    try {
      const response = await userClient.updateUser(formData);
      if (response && typeof response === 'object' && response.user) {
        const updatedUser = response.user;
        setEditUser(updatedUser);
        setUserInRows(updatedUser); // 更新表格中的用户信息
        setSnackbar({ open: true, message: '用户信息更新成功', severity: 'success' });
        handleCloseEdit();
      }
    } catch (error) {
      console.error('更新用户信息失败', error);
      setSnackbar({ open: true, message: '更新用户信息失败', severity: 'error' });
    }
  };

  const setUserInRows = (updatedUser: User) => {
    const updatedRows = rows.map(row => (row.id === updatedUser.id ? updatedUser : row));
    setCustomers(updatedRows); // 使用传递的 setCustomers 更新表格数据
  };

  const handleDelete = async (id: string) => {
    try {
      const result = await userClient.deleteUser(parseInt(id, 10));
      if (typeof result === 'string') {
        setSnackbar({ open: true, message: '删除用户失败  ' + result, severity: 'error' });
      } else {
        const updatedRows = rows.filter(row => row.id !== id);
        setCustomers(updatedRows); // 使用传递的 setCustomers 更新表格数据
        setSnackbar({ open: true, message: '用户删除成功', severity: 'success' });
      }

    } catch (error) {
      console.error('删除用户失败', error);
      setSnackbar({ open: true, message: '删除用户失败', severity: 'error' });
    }
    onDelete(id);
  };

  const formik = useFormik<UserFormValues>({
    initialValues: editUser || {
      id: '',
      fullname: '',
      gender: Gender.male,
      email: '',
      role: UserRole.studentCadre,
      password: '',
      avatarpath: '',
      confirmPassword: '',
      position: '',
      avatar: '',
      username: '',
      organization: '',
      totalScore: '0',
      passwordHash: '',
      evaluatorsorce:0,
      evaluatorId:'',
      peerAverageScore:'',
      teacherAverageScore:''

    },
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting }: FormikHelpers<UserFormValues>) => {
      handleSaveEdit(values);
      setSubmitting(false);
    },
  });

  const [snackbar, setSnackbar] = React.useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  return (
    <>
      <Card>
        <Box sx={{ overflowX: 'auto' }}>
          <Table sx={{ minWidth: '800px' }}>
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>姓名</TableCell>
                <TableCell>账号</TableCell>
                <TableCell>性别</TableCell>
                <TableCell>邮箱</TableCell>
                <TableCell>角色</TableCell>
                <TableCell>职位</TableCell>
                <TableCell>操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => {
                const isSelected = selected?.has(row.id);
                const isCurrentUser = currentUser ? currentUser.id === String(row.id) : false;
                const isAdminUser = currentUser? currentUser.role === UserRole.admin :false;
                const isStudentCadre = currentUser ? currentUser.role === UserRole.studentCadre : false;

                return (
                  <TableRow hover key={row.id} selected={isSelected}>
                    <TableCell></TableCell>
                    <TableCell>
                      <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
                        <Avatar src={`data:image/png;base64,${row.avatar}`} />
                        <Typography variant="subtitle2">{row.fullname}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{row.username}</TableCell>
                    <TableCell>{GenderMap[row.gender]}</TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>{UserRoleMap[row.role]}</TableCell>
                    <TableCell>{row.position}</TableCell>
                    <TableCell>
                      <Button
                        color="primary"
                        onClick={() => handleEdit(row)}
                        size="small"
                        variant="contained"
                        disabled={isCurrentUser}
                        sx={{ mr: 1 }}
                      >
                        { isAdminUser ? '编辑' : '评分'}
                      </Button>
                      <Button
                        color="secondary"
                        onClick={() => handleDelete(row.id)}
                        size="small"
                        variant="contained"
                        disabled={isCurrentUser || isAdminUser === false}
                      >
                        删除
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
        <Divider />
        <TablePagination
          component="div"
          count={count}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
          page={page}
          labelRowsPerPage="每页行数："
          labelDisplayedRows={({ from, to, count }) => `第 ${from} 到 ${to} 行 ，共 ${count !== -1 ? count : `更多`} 行`}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
        <Dialog open={openEdit} onClose={handleCloseEdit}>
          <DialogTitle>{currentUser?.role === UserRole.studentCadre ? '评分' : '编辑用户'}</DialogTitle>
          <DialogContent sx={{ width: 500 }}>
            <form onSubmit={formik.handleSubmit}>
              <Stack spacing={2}>
                <Box sx={{ textAlign: 'center' }}>
                  <Avatar  src={`data:image/png;base64,${formik.values.avatar}`} sx={{ width: 100, height: 100, mx: 'auto' }} />
                  {currentUser?.role === UserRole.admin && (
                    <Button variant="contained" component="label" sx={{ mt: 2 }}>
                      上传头像
                      <input type="file" hidden onChange={(event) => {
                        const file = event.currentTarget.files?.[0];
                        if (file) {
                          formik.setFieldValue('avatarFile', file);
                          const reader = new FileReader();
                          reader.onload = () => {
                            formik.setFieldValue('avatarpath', reader.result);
                          };
                          reader.readAsDataURL(file);
                        }
                      }} />
                    </Button>
                  )}
                </Box>
                <TextField
                  fullWidth
                  label="姓名"
                  name="fullname"
                  value={formik.values.fullname}
                  onChange={formik.handleChange}
                  error={formik.touched.fullname && Boolean(formik.errors.fullname)}
                  helperText={formik.touched.fullname && formik.errors.fullname}
                  disabled={currentUser?.role !== UserRole.admin}
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
                  disabled={currentUser?.role !== UserRole.admin}
                >
                  <MenuItem value={Gender.male}>男</MenuItem>
                  <MenuItem value={Gender.female}>女</MenuItem>
                </TextField>
                <TextField
                  fullWidth
                  label="邮箱"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  disabled={currentUser?.role !== UserRole.admin}
                />
                <TextField
                  select
                  fullWidth
                  label="权限"
                  name="role"
                  value={formik.values.role}
                  onChange={formik.handleChange}
                  error={formik.touched.role && Boolean(formik.errors.role)}
                  helperText={formik.touched.role && formik.errors.role}
                  disabled={currentUser?.role !== UserRole.admin}
                >
                  <MenuItem value={UserRole.admin}>管理员</MenuItem>
                  <MenuItem value={UserRole.teacher}>教师</MenuItem>
                  <MenuItem value={UserRole.studentCadre}>学生干部</MenuItem>
                </TextField>
                <TextField
                  fullWidth
                  label="职位"
                  name="position"
                  value={formik.values.position}
                  onChange={formik.handleChange}
                  error={formik.touched.position && Boolean(formik.errors.position)}
                  helperText={formik.touched.position && formik.errors.position}
                  disabled={currentUser?.role !== UserRole.admin}
                />
                <TextField
                  fullWidth
                  label="组织"
                  name="organization"
                  value={formik.values.organization}
                  onChange={formik.handleChange}
                  error={formik.touched.organization && Boolean(formik.errors.organization)}
                  helperText={formik.touched.organization && formik.errors.organization}
                  disabled={currentUser?.role !== UserRole.admin}
                />
                <TextField
                  fullWidth
                  type="password"
                  label="密码"
                  name="password"
                  value={formik.values.passwordHash}
                  onChange={formik.handleChange}
                  error={formik.touched.passwordHash && Boolean(formik.errors.passwordHash)}
                  helperText={formik.touched.passwordHash && formik.errors.passwordHash}
                  disabled={currentUser?.role !== UserRole.admin}
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
                  disabled={currentUser?.role !== UserRole.admin}
                />
                 {formik.values.role === UserRole.studentCadre && (
                  <TextField
                  fullWidth
                  label="打分"
                  name="evaluatorsorce"
                  value={formik.values.evaluatorsorce}
                  onChange={formik.handleChange}
                  error={formik.touched.evaluatorsorce && Boolean(formik.errors.evaluatorsorce)}
                  helperText={formik.touched.evaluatorsorce && formik.errors.evaluatorsorce}
                />
                 )
                 }
                
              </Stack>
              <DialogActions>
                <Button onClick={handleCloseEdit} color="secondary">取消</Button>
                <Button type="submit" color="primary">确认</Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>

      </Card>
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );


}
