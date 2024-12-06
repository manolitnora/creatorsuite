'use client'

import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import {
  Person as PersonIcon,
  Link as LinkIcon,
  Notifications as NotificationsIcon,
  Group as GroupIcon,
  Key as KeyIcon,
} from '@mui/icons-material'
import { useRouter, usePathname } from 'next/navigation'

const navigationItems = [
  {
    label: 'Profile',
    icon: <PersonIcon />,
    path: '/settings/profile',
  },
  {
    label: 'Platform Connections',
    icon: <LinkIcon />,
    path: '/settings/connections',
  },
  {
    label: 'Notifications',
    icon: <NotificationsIcon />,
    path: '/settings/notifications',
  },
  {
    label: 'Team',
    icon: <GroupIcon />,
    path: '/settings/team',
  },
  {
    label: 'API Configuration',
    icon: <KeyIcon />,
    path: '/settings/api',
  },
]

export default function SettingsNavigation() {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      <List component="nav">
        {navigationItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              selected={pathname === item.path}
              onClick={() => router.push(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )
}
