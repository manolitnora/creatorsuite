'use client'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material'
import { useState } from 'react'

interface SaveContentModalProps {
  open: boolean
  onClose: () => void
  onSave: (data: SaveContentData) => void
  initialContent: string
  contentType: string
}

export interface SaveContentData {
  title: string
  content: string
  contentType: string
  tags: string[]
  status: 'draft' | 'final'
}

export default function SaveContentModal({
  open,
  onClose,
  onSave,
  initialContent,
  contentType,
}: SaveContentModalProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState(initialContent)
  const [tag, setTag] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [status, setStatus] = useState<'draft' | 'final'>('draft')

  const handleAddTag = () => {
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag])
      setTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove))
  }

  const handleStatusChange = (event: SelectChangeEvent) => {
    setStatus(event.target.value as 'draft' | 'final')
  }

  const handleSave = () => {
    onSave({
      title,
      content,
      contentType,
      tags,
      status,
    })
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Save Content</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <TextField
            fullWidth
            label="Content"
            multiline
            rows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select value={status} label="Status" onChange={handleStatusChange}>
              <MenuItem value="draft">Draft</MenuItem>
              <MenuItem value="final">Final</MenuItem>
            </Select>
          </FormControl>

          <Box>
            <TextField
              label="Add Tags"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddTag()
                }
              }}
              fullWidth
              helperText="Press Enter to add a tag"
            />
            <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  onDelete={() => handleRemoveTag(tag)}
                />
              ))}
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={!title.trim() || !content.trim()}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}
