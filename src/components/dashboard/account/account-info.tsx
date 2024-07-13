'use client';
import { getCurrentUser, User } from '@/types/user';
import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { userClient } from '@/lib/user/userclint';

export function AccountInfo(): React.JSX.Element {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = getCurrentUser();
      setUser(currentUser);
    };

    fetchUser();
  }, []);

  if (!user) {
    return <Typography>加载中...</Typography>;
  }

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('avatarFile', file);
      formData.append('id', user.id.toString());

      try {
        const response = await userClient.updateUser(formData);
        console.log("response  " +  response);
        if (response && typeof response === 'object' && response.user) {
          const updatedUser = { ...user, avatar: response.user.avatar };
          setUser(updatedUser);
          localStorage.setItem('current-user', JSON.stringify(updatedUser));
        }
      } catch (error) {
        console.error('更新头像失败', error);
      }
    }
  };

  return (
    <Card>
      <CardContent>
        <Stack spacing={2} sx={{ alignItems: 'center' }}>
          <div>
            <Avatar src={`data:image/png;base64,${user.avatar}`} sx={{ height: '80px', width: '80px' }} />
          </div>
          <Stack spacing={1} sx={{ textAlign: 'center' }}>
            <Typography variant="h5">{user.fullname}</Typography>
            <Typography color="text.secondary" variant="body2">
              {user.email}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              {user.position}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
      <Divider />
      <CardActions>
        <Button fullWidth variant="text" component="label">
          上传头像
          <input type="file" hidden onChange={handleAvatarChange} />
        </Button>
      </CardActions>
    </Card>
  );
}
