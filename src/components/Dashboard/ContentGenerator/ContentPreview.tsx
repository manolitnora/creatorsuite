import {
  Box,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  Button,
  Stack,
  Chip,
} from '@mui/material'
import { useState } from 'react'
import { Schedule, Share } from '@mui/icons-material'
import { Platform } from '@/types/content'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`content-tabpanel-${index}`}
      aria-labelledby={`content-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

export default function ContentPreview() {
  const [selectedTab, setSelectedTab] = useState(0)
  const [generatedContent, setGeneratedContent] = useState<
    Array<{
      platform: Platform
      content: string
      predictedPerformance: number
    }>
  >([
    {
      platform: 'Twitter',
      content: 'Check out our latest AI-powered features! 🚀 #AI #Innovation',
      predictedPerformance: 85,
    },
    {
      platform: 'LinkedIn',
      content: 'Excited to announce our newest AI-powered features that are revolutionizing how we work. #Innovation #AI #FutureOfWork',
      predictedPerformance: 92,
    },
  ])

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue)
  }

  if (generatedContent.length === 0) {
    return null
  }

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Generated Content
        </Typography>
        
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          aria-label="content preview tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          {generatedContent.map((content, index) => (
            <Tab
              key={content.platform}
              label={content.platform}
              id={`content-tab-${index}`}
            />
          ))}
        </Tabs>

        {generatedContent.map((content, index) => (
          <TabPanel key={content.platform} value={selectedTab} index={index}>
            <Stack spacing={2}>
              <Typography variant="body1">{content.content}</Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip
                  label={`Predicted Performance: ${content.predictedPerformance}%`}
                  color={content.predictedPerformance >= 90 ? 'success' : 'primary'}
                />
              </Box>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<Share />}
                  onClick={() => {
                    // TODO: Implement post functionality
                  }}
                >
                  Post Now
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Schedule />}
                  onClick={() => {
                    // TODO: Implement schedule functionality
                  }}
                >
                  Schedule
                </Button>
              </Box>
            </Stack>
          </TabPanel>
        ))}
      </CardContent>
    </Card>
  )
}
