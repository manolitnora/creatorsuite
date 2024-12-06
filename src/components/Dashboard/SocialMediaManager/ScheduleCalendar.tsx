import { useState, useEffect } from 'react'
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  IconButton,
  Stack,
  Chip,
  CircularProgress,
} from '@mui/material'
import {
  ChevronLeft,
  ChevronRight,
  Add,
  Schedule,
} from '@mui/icons-material'
import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isToday,
  isSameMonth,
  addWeeks,
  subWeeks,
} from 'date-fns'
import { Platform } from '@/types/content'
import SchedulePostModal from './SchedulePostModal'

interface ScheduledPost {
  id: string
  content: string
  platform: Platform
  scheduledTime: string
}

export default function ScheduleCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false)
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Fetch scheduled posts
  const fetchScheduledPosts = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/v1/social/scheduled')
      if (!response.ok) {
        throw new Error('Failed to fetch scheduled posts')
      }
      const data = await response.json()
      setScheduledPosts(data)
    } catch (error) {
      console.error('Error fetching scheduled posts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch posts on mount and when date changes
  useEffect(() => {
    fetchScheduledPosts()
  }, [currentDate])

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 })
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd })

  const getPostsForDate = (date: Date) => {
    return scheduledPosts.filter(
      (post) =>
        format(new Date(post.scheduledTime), 'yyyy-MM-dd') ===
        format(date, 'yyyy-MM-dd')
    )
  }

  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <IconButton onClick={() => setCurrentDate(subWeeks(currentDate, 1))}>
            <ChevronLeft />
          </IconButton>
          <Typography variant="h6">
            {format(currentDate, 'MMMM yyyy')}
          </Typography>
          <IconButton onClick={() => setCurrentDate(addWeeks(currentDate, 1))}>
            <ChevronRight />
          </IconButton>
        </Stack>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setIsScheduleModalOpen(true)}
        >
          Schedule Post
        </Button>
      </Stack>

      <Grid container spacing={2}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          days.map((day) => (
            <Grid item xs key={day.toISOString()}>
              <Paper
                elevation={selectedDate?.toDateString() === day.toDateString() ? 3 : 1}
                sx={{
                  p: 2,
                  height: '200px',
                  cursor: 'pointer',
                  bgcolor: isToday(day) ? 'action.hover' : 'background.paper',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
                onClick={() => setSelectedDate(day)}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: !isSameMonth(day, currentDate)
                      ? 'text.disabled'
                      : 'text.primary',
                  }}
                >
                  {format(day, 'EEE d')}
                </Typography>
                <Box sx={{ mt: 1 }}>
                  {getPostsForDate(day).map((post) => (
                    <Box
                      key={post.id}
                      sx={{
                        mb: 1,
                        p: 1,
                        borderRadius: 1,
                        bgcolor: 'background.default',
                      }}
                    >
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Schedule fontSize="small" />
                        <Typography variant="caption" noWrap>
                          {format(new Date(post.scheduledTime), 'HH:mm')}
                        </Typography>
                        <Chip
                          label={post.platform}
                          size="small"
                          sx={{ ml: 'auto' }}
                        />
                      </Stack>
                      <Typography variant="body2" noWrap>
                        {post.content}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Grid>
          ))
        )}
      </Grid>

      <SchedulePostModal
        open={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        onSchedule={async (data) => {
          try {
            const response = await fetch('/api/schedule', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(data),
            })

            if (!response.ok) {
              throw new Error('Failed to schedule post')
            }

            // Refresh scheduled posts
            await fetchScheduledPosts()
          } catch (error) {
            console.error('Error scheduling post:', error)
          }
        }}
      />
    </Box>
  )
}
