'use client'

import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material'
import {
  Dashboard as DashboardIcon,
  Create as CreateIcon,
  Share as ShareIcon,
  Analytics as AnalyticsIcon,
  Schedule as ScheduleIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

const navigationItems = [
  {
    label: 'Overview',
    icon: <DashboardIcon />,
    path: '/dashboard',
  },
  {
    label: 'Content Generator',
    icon: <CreateIcon />,
    path: '/dashboard/content',
  },
  {
    label: 'Social Media Manager',
    icon: <ShareIcon />,
    path: '/dashboard/social',
  },
  {
    label: 'Analytics',
    icon: <AnalyticsIcon />,
    path: '/dashboard/analytics',
  },
  {
    label: 'Schedule',
    icon: <ScheduleIcon />,
    path: '/dashboard/schedule',
  },
  {
    label: 'Settings',
    icon: <SettingsIcon />,
    path: '/dashboard/settings',
  },
]

export default function DashboardNavigation() {
  const pathname = usePathname()

  return (
    <Box sx={{ width: '100%', py: 2 }}>
      <Box sx={{ px: 3, mb: 3 }}>
        <Typography variant="h6" color="text.primary">
          CreatorSuite
        </Typography>
      </Box>
      <List>
        {navigationItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <Link 
              href={item.path}
              style={{ 
                textDecoration: 'none', 
                width: '100%',
                color: 'inherit'
              }}
            >
              <ListItemButton
                selected={pathname === item.path}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'inherit',
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ color: pathname === item.path ? 'inherit' : 'text.secondary' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.label}
                  primaryTypographyProps={{
                    sx: { 
                      fontWeight: pathname === item.path ? 600 : 400
                    }
                  }}
                />
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>
    </Box>
  )
}
