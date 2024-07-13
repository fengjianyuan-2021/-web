'use client'
import React, { useEffect, useState } from 'react';
import {
  Card, CardHeader, Divider, CardContent, Grid, Stack, Typography,
  FormGroup, FormControlLabel, Checkbox, CardActions, Button, TextField,
  Paper
} from '@mui/material';

import axios from 'axios';
import { getCurrentUser, UserRole } from '@/types/user';
import { API_BASE_URL } from '@/config';
import { Box } from '@mui/system';
import { Announcement } from '@/types/dashboard';

export function Notifications(): React.JSX.Element {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [newAnnouncement, setNewAnnouncement] = useState<Announcement>({ id: 0, title: '', content: '', isRead: false });
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const currentUser = getCurrentUser();

  const markAsRead = async (announcementId: number, userId: number) => {
    try {
      await axios.post(`${API_BASE_URL}/api/Announcements/mark-as-read/${announcementId}`, { userId:userId ,announcementId:announcementId});
    } catch (error) {
      console.error('标记已读失败', error);
    }
  };

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get<Announcement[]>(`${API_BASE_URL}/api/Announcements?userId=${currentUser?.id}`);
        setAnnouncements(response.data);
      } catch (error) {
        console.error('获取公告失败', error);
      }
    };

    fetchAnnouncements();
  }, [currentUser?.id]);

  const handleSave = async () => {
    try {
      if (isEditing && editingAnnouncement) {
        await axios.put(`${API_BASE_URL}/api/Announcements/${editingAnnouncement.id}`, editingAnnouncement);
      } else {
        await axios.post(`${API_BASE_URL}/api/Announcements`, newAnnouncement);
      }
      const response = await axios.get<Announcement[]>(`${API_BASE_URL}/api/Announcements?userId=${currentUser?.id}`);
      setAnnouncements(response.data);
      setNewAnnouncement({ id: 0, title: '', content: '', isRead: false });
      setEditingAnnouncement(null);
      setIsEditing(false);
    } catch (error) {
      console.error('保存公告失败', error);
    }
  };

  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setIsEditing(true);
  };

  const handleMarkAsRead = async (announcementId: number) => {
    if (currentUser) {
      console.log("222222222 +" +JSON.stringify(currentUser));
      await markAsRead(announcementId, parseInt(currentUser?.id, 10));
      const updatedAnnouncements = announcements.map((announcement) => {
        if (announcement.id === announcementId) {
          return { ...announcement, isRead: true };
        }
        return announcement;
      });
      setAnnouncements(updatedAnnouncements);
    }

  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        handleSave();
      }}
    >
      <Card>
        <CardHeader subheader="管理通知" title="通知" />
        <Divider />
        <CardContent>
          <Grid container spacing={4} wrap="wrap">
            {announcements.map((announcement) => (
              <Grid item key={announcement.id} md={4} sm={6} xs={12}>
                <Paper elevation={3} sx={{ padding: 2 }}>
                  <Stack spacing={1}>
                    <Typography variant="h6">{announcement.title}</Typography>
                    <Box
                      sx={{
                        maxHeight: 100, // 限制内容的最大高度
                        overflowY: 'auto', // 纵向滚动条
                        overflowX: 'hidden', // 水平滚动条隐藏
                      }}
                    >
                      <Typography variant="body2">{announcement.content}</Typography>
                    </Box>
                    {currentUser?.role === UserRole.admin && (
                      <Button variant="outlined" onClick={() => handleEdit(announcement)}>编辑</Button>
                    )}
                    {currentUser?.role !== UserRole.admin && !announcement.isRead && (
                      <Button variant="contained" onClick={() => handleMarkAsRead(announcement.id)}>标记为已读</Button>
                    )}
                  </Stack>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </CardContent>
        {currentUser?.role === UserRole.admin && (
          <>
            <Divider />
            <CardContent>
              <Stack spacing={2}>
                <TextField
                  label="标题"
                  value={isEditing && editingAnnouncement ? editingAnnouncement.title : newAnnouncement.title}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (isEditing && editingAnnouncement) {
                      setEditingAnnouncement({ ...editingAnnouncement, title: value });
                    } else {
                      setNewAnnouncement({ ...newAnnouncement, title: value });
                    }
                  }}
                  variant="outlined"
                  fullWidth
                />
                <TextField
                  label="内容"
                  value={isEditing && editingAnnouncement ? editingAnnouncement.content : newAnnouncement.content}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (isEditing && editingAnnouncement) {
                      setEditingAnnouncement({ ...editingAnnouncement, content: value });
                    } else {
                      setNewAnnouncement({ ...newAnnouncement, content: value });
                    }
                  }}
                  multiline
                  rows={4}
                  variant="outlined"
                  fullWidth
                />
              </Stack>
            </CardContent>
            <Divider />
            <CardActions sx={{ justifyContent: 'flex-end' }}>
              <Button type="submit" variant="contained" color="primary">保存</Button>
            </CardActions>
          </>
        )}
      </Card>
    </form>
  );
}
