'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Eye as EyeIcon } from '@phosphor-icons/react/dist/ssr/Eye';
import { EyeSlash as EyeSlashIcon } from '@phosphor-icons/react/dist/ssr/EyeSlash';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import { paths } from '@/paths';
import { authClient } from '@/lib/auth/client';
import { useUser } from '@/hooks/use-user';

const schema = zod.object({
  username: zod.string().min(1, { message: '账号必须填写' }),
  password: zod.string().min(1, { message: '密码必须填写' }),
});

type Values = zod.infer<typeof schema>;

const defaultValues = { username: 'admin', password: '123' } satisfies Values;

export function SignInForm(): React.JSX.Element {
  const router = useRouter();

  const { checkSession } = useUser();

  const [showPassword, setShowPassword] = React.useState<boolean>();

  const [isPending, setIsPending] = React.useState<boolean>(false);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

/**
 * 提交登录表单
 * 
 * @param {Values} values - 表单输入的值，包括用户名和密码
 * @returns {Promise<void>} 一个 Promise，表示异步操作完成
 */
const onSubmit = React.useCallback(
  async (values: Values): Promise<void> => {
    setIsPending(true); // 设置提交状态为进行中

    // 调用 authClient 的 signInWithPassword 方法进行用户认证
    const { error } = await authClient.signInWithPassword(values);

    // 如果认证失败，设置表单错误信息，并终止操作
    if (error) {
      setError('root', { type: 'server', message: error });
      setIsPending(false);
      return;
    }

    // 刷新认证状态
    await checkSession?.();

    // 在刷新后，GuestGuard 将处理重定向
    router.refresh();
  },
  [checkSession, router, setError]
);


  return (
    <Stack spacing={4}>
      <Stack spacing={1}>
        <Typography variant="h4">登录</Typography>
        <Typography color="text.secondary" variant="body2">
          没有账号?{' '}
          <Link component={RouterLink} href={paths.auth.signUp} underline="hover" variant="subtitle2">
            注册
          </Link>
        </Typography>
      </Stack>
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
            name="password"
            render={({ field }) => (
              <FormControl error={Boolean(errors.password)}>
                <InputLabel>密码</InputLabel>
                <OutlinedInput
                  {...field}
                  endAdornment={
                    showPassword ? (
                      <EyeIcon
                        cursor="pointer"
                        fontSize="var(--icon-fontSize-md)"
                        onClick={(): void => {
                          setShowPassword(false);
                        }}
                      />
                    ) : (
                      <EyeSlashIcon
                        cursor="pointer"
                        fontSize="var(--icon-fontSize-md)"
                        onClick={(): void => {
                          setShowPassword(true);
                        }}
                      />
                    )
                  }
                  label="密码"
                  type={showPassword ? 'text' : 'password'}
                />
                {errors.password ? <FormHelperText>{errors.password.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <div>
            <Link component={RouterLink} href={paths.auth.resetPassword} variant="subtitle2">
              忘记密码？
            </Link>
          </div>
          {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
          <Button disabled={isPending} type="submit" variant="contained">
            登录
          </Button>
        </Stack>
      </form>
      <Alert color="warning">
        初始账号为{' '}
        <Typography component="span" sx={{ fontWeight: 700 }} variant="inherit">
          admin
        </Typography>{' '}
        初始密码{' '}
        <Typography component="span" sx={{ fontWeight: 700 }} variant="inherit">
          123
        </Typography>
      </Alert>
    </Stack>
  );
}
