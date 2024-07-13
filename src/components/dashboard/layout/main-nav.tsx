'use client';

import React,{ useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { Bell as BellIcon } from '@phosphor-icons/react/dist/ssr/Bell';
import { List as ListIcon } from '@phosphor-icons/react/dist/ssr/List';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { Users as UsersIcon } from '@phosphor-icons/react/dist/ssr/Users';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Grid,
  Stack,
  Typography,
  Button,
  TextField,
  Paper,
  ListItemText,
  List,
  Popover,
  ListItem,
  Box,
} from '@mui/material';
import { usePopover } from '@/hooks/use-popover';

import { MobileNav } from './mobile-nav';
import { UserPopover } from './user-popover';
import { getCurrentUser } from '@/types/user';
import axios from 'axios';
import { Announcement } from '@/types/dashboard';
import { API_BASE_URL } from '@/config';
import { debounce } from 'lodash';


export function MainNav(): React.JSX.Element {
  const [openNav, setOpenNav] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [unreadAnnouncements, setUnreadAnnouncements] = useState([]);
  const currentUser = getCurrentUser();
;
  const userPopover = usePopover<HTMLDivElement>();
  const fetchUnreadAnnouncements = async (userId :number) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/announcements/unread?userId=${userId}`);
      setUnreadAnnouncements(response.data);
    } catch (error) {
      console.error('获取公告失败', error);
    }
  };

  // 使用lodash的防抖函数
  const debouncedFetchUnreadAnnouncements = debounce(fetchUnreadAnnouncements, 300);

  useEffect(() => {
    if (currentUser) {
      debouncedFetchUnreadAnnouncements(parseInt(currentUser.id,10));
    }
    
    // 清除防抖定时器
    return () => {
      debouncedFetchUnreadAnnouncements.cancel();
    };
  }, [currentUser]);
  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <React.Fragment>
      <Box
        component="header"
        sx={{
          borderBottom: '1px solid var(--mui-palette-divider)',
          backgroundColor: 'var(--mui-palette-background-paper)',
          position: 'sticky',
          top: 0,
          zIndex: 'var(--mui-zIndex-appBar)',
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{ alignItems: 'center', justifyContent: 'space-between', minHeight: '64px', px: 2 }}
        >
          <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
            <IconButton
              onClick={(): void => {
                setOpenNav(true);
              }}
              sx={{ display: { lg: 'none' } }}
            >
              <ListIcon />
            </IconButton>
            <Tooltip title="Search">
              <IconButton>
                <MagnifyingGlassIcon />
              </IconButton>
            </Tooltip>
          </Stack>
          <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
            <Tooltip title="通知">
              <Badge badgeContent={unreadAnnouncements.length} color="success" variant="dot">
                <IconButton onClick={handleOpenPopover}>
                  <BellIcon />
                </IconButton>
              </Badge>
            </Tooltip>
            <Avatar
              onClick={userPopover.handleOpen}
              ref={userPopover.anchorRef}
              src={`data:image/png;base64,${currentUser?.avatar}`}
              sx={{ cursor: 'pointer' }}
            />
          </Stack>
        </Stack>
      </Box>
      <UserPopover anchorEl={userPopover.anchorRef.current} onClose={userPopover.handleClose} open={userPopover.open} />
      <MobileNav
        onClose={() => {
          setOpenNav(false);
        }}
        open={openNav}
      />
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Box sx={{ p: 2, width: '300px' }}>
          <Typography variant="h6">公告</Typography>
          <List>
            {unreadAnnouncements.length === 0 ? (
              <ListItem>
                <ListItemText primary="没有未读取公告" />
              </ListItem>
            ) : (
              unreadAnnouncements.map((announcement :Announcement) => (
                <ListItem key={announcement.id}>
                  <ListItemText primary={announcement.title} secondary={announcement.content} />
                </ListItem>
              ))
            )}
          </List>
        </Box>
      </Popover>
    </React.Fragment>
  );
}