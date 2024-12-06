import { useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  Tabs,
  Tab,
  Box,
  IconButton,
  Tooltip,
} from '@mui/material'
import { Settings } from '@mui/icons-material'
import PostsList from './PostsList'
import ScheduleCalendar from './ScheduleCalendar'
import PlatformHealth from './PlatformHealth'
import { TabPanel } from '@/components/common/TabPanel'

export default function SocialMediaManager() {
  const [activeTab, setActiveTab] = useState(0)

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  return (
    <Card>
      <CardHeader
        title="Social Media Manager"
        action={
          <Tooltip title="Configure social media accounts">
            <IconButton>
              <Settings />
            </IconButton>
          </Tooltip>
        }
      />
      <CardContent>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="social media manager tabs"
          >
            <Tab label="Posts" />
            <Tab label="Schedule" />
            <Tab label="Platform Health" />
          </Tabs>
        </Box>

        <TabPanel value={activeTab} index={0}>
          <PostsList />
        </TabPanel>
        <TabPanel value={activeTab} index={1}>
          <ScheduleCalendar />
        </TabPanel>
        <TabPanel value={activeTab} index={2}>
          <PlatformHealth />
        </TabPanel>
      </CardContent>
    </Card>
  )
}
