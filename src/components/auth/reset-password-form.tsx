'use client';
import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import {
  Stack,
  Typography,
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText,
  Button,
  Alert,
  Snackbar,
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { authClient } from '@/lib/auth/client';
import { useRouter } from 'next/navigation';

const schema = zod.object({
  username: zod.string().min(1, { message: '账号必须填写' }),
  newPassword: zod.string().min(1, { message: '密码必须至少包含1个字符' }),
  confirmPassword: zod.string().min(1, { message: '确认密码必须至少包含1个字符' }),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: '密码和确认密码不匹配',
  path: ['confirmPassword'],
});

type Values = zod.infer<typeof schema>;

const defaultValues = { username: '', newPassword: '', confirmPassword: '' } satisfies Values;

export function ResetPasswordForm(): React.JSX.Element {
  const [isPending, setIsPending] = React.useState<boolean>(false);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const router = useRouter();
  
  const handleGoToSignIn = () => {
    router.push('/auth/sign-in');
  };
  const theme = createTheme({
    palette: {
      success: {
        main: '#4caf50', // 绿色
        contrastText: '#fff', // 白色
      },
    },
  });
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

  const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
      setIsPending(true);

      const { error } = await authClient.resetPassword({
        username: values.username,
        password: values.newPassword,
      });

      if (error) {
        setError('root', { type: 'server', message: error });
        setIsPending(false);
        return;
      }

      setIsPending(false);
      setSuccessMessage('密码重置成功！');
      // Redirect to confirm password reset if needed
    },
    [setError]
  );

  const handleCloseSnackbar = () => {
    setSuccessMessage(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <Stack spacing={4}>
        <Typography variant="h5">重置密码</Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <Controller
              control={control}
              name="username"
              render={({ field }) => (
                <FormControl error={Boolean(errors.username)}>
                  <InputLabel>账号</InputLabel>
                  <OutlinedInput {...field} label="账号" type="text" />
                  {errors.username ? <FormHelperText>{errors.username.message}</FormHelperText> : null}
                </FormControl>
              )}
            />
            <Controller
              control={control}
              name="newPassword"
              render={({ field }) => (
                <FormControl error={Boolean(errors.newPassword)}>
                  <InputLabel>新密码</InputLabel>
                  <OutlinedInput {...field} label="新密码" type="password" />
                  {errors.newPassword ? <FormHelperText>{errors.newPassword.message}</FormHelperText> : null}
                </FormControl>
              )}
            />
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field }) => (
                <FormControl error={Boolean(errors.confirmPassword)}>
                  <InputLabel>确认密码</InputLabel>
                  <OutlinedInput {...field} label="确认密码" type="password" />
                  {errors.confirmPassword ? <FormHelperText>{errors.confirmPassword.message}</FormHelperText> : null}
                </FormControl>
              )}
            />
            {errors.root ? <Alert severity="error">{errors.root.message}</Alert> : null}
            <Button disabled={isPending} type="submit" variant="contained">
              重置密码
            </Button>
            <Button onClick={handleGoToSignIn} variant="outlined" color="primary">
            返回主页
          </Button>
          </Stack>
        </form>
        <Snackbar
          open={Boolean(successMessage)}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          message={successMessage}
          ContentProps={{
            sx: { backgroundColor: theme.palette.success.main, color: theme.palette.success.contrastText },
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
