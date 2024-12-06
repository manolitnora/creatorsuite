'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Alert,
} from '@mui/material'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { Platform } from '@/types/content'

interface SchedulePostModalProps {
  open: boolean
  onClose: () => void
  onSchedule: (data: {
    content: string
    platforms: Platform[]
    scheduledTime: Date
  }) => void
}

export default function SchedulePostModal({
  open,
  onClose,
  onSchedule,
}: SchedulePostModalProps) {
  const [content, setContent] = useState('')
  const [platforms, setPlatforms] = useState<Platform[]>([])
  const [scheduledTime, setScheduledTime] = useState<Date | null>(new Date())
  const [error, setError] = useState<string | null>(null)

  const handleSchedule = () => {
    if (!content) {
      setError('Please enter content for your post')
      return
    }
    if (platforms.length === 0) {
      setError('Please select at least one platform')
      return
    }
    if (!scheduledTime) {
      setError('Please select a valid schedule time')
      return
    }

    onSchedule({
      content,
      platforms,
      scheduledTime,
    })

    // Reset form
    setContent('')
    setPlatforms([])
    setScheduledTime(new Date())
    setError(null)
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Schedule New Post</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
          {error && <Alert severity="error">{error}</Alert>}
          
          <TextField
            label="Post Content"
            multiline
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            fullWidth
          />

          <FormControl fullWidth>
            <InputLabel>Platforms</InputLabel>
            <Select
              multiple
              value={platforms}
              onChange={(e) => setPlatforms(e.target.value as Platform[])}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Typography key={value} component="span">
                      {value}
                    </Typography>
                  ))}
                </Box>
              )}
            >
              <MenuItem value="Twitter">Twitter</MenuItem>
              <MenuItem value="Facebook">Facebook</MenuItem>
              <MenuItem value="LinkedIn">LinkedIn</MenuItem>
              <MenuItem value="Instagram">Instagram</MenuItem>
            </Select>
          </FormControl>

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              label="Schedule Time"
              value={scheduledTime}
              onChange={(newValue) => setScheduledTime(newValue)}
              disablePast
            />
          </LocalizationProvider>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSchedule} variant="contained">
          Schedule
        </Button>
      </DialogActions>
    </Dialog>
  )
}
