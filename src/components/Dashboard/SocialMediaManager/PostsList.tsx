'use client'

import { useState, useEffect } from 'react'
import {
  List,
  ListItem,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Stack,
  Box,
  Menu,
  MenuItem,
  Button,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
} from '@mui/material'
import {
  MoreVert,
  Search,
  FilterList,
  Analytics,
  Edit,
  Delete,
} from '@mui/icons-material'
import { Platform } from '@/types/content'
import { formatDistanceToNow } from 'date-fns'
import { socialService, Post } from '@/services/social'
import { useDebounce } from '@/hooks/useDebounce'

export default function PostsList() {
  const [searchTerm, setSearchTerm] = useState('')
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedPost, setSelectedPost] = useState<string | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<Post['status'] | ''>('')
  const [platformFilter, setPlatformFilter] = useState<Platform | ''>('')

  const debouncedSearch = useDebounce(searchTerm, 500)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
        setError(null)
        const filters: {
          platform?: Platform
          status?: Post['status']
          search?: string
        } = {}

        if (platformFilter) filters.platform = platformFilter
        if (statusFilter) filters.status = statusFilter
        if (debouncedSearch) filters.search = debouncedSearch

        const data = await socialService.getPosts(filters)
        setPosts(data)
      } catch (err) {
        setError('Failed to load posts')
        console.error('Error fetching posts:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [debouncedSearch, platformFilter, statusFilter])

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, postId: string) => {
    setAnchorEl(event.currentTarget)
    setSelectedPost(postId)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedPost(null)
  }

  const handleDelete = async (postId: string) => {
    try {
      await socialService.deletePost(postId)
      setPosts(posts.filter(post => post.id !== postId))
      handleMenuClose()
    } catch (err) {
      console.error('Error deleting post:', err)
      setError('Failed to delete post')
    }
  }

  const handleViewAnalytics = async (postId: string) => {
    try {
      const analytics = await socialService.getAnalytics(postId)
      // TODO: Show analytics in a modal or navigate to analytics page
      console.log('Post analytics:', analytics)
      handleMenuClose()
    } catch (err) {
      console.error('Error fetching analytics:', err)
      setError('Failed to load analytics')
    }
  }

  if (loading && posts.length === 0) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Stack direction="row" spacing={2} mb={2}>
        <TextField
          size="small"
          placeholder="Search posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ flexGrow: 1 }}
        />
        <Button
          variant="outlined"
          startIcon={<FilterList />}
          onClick={() => {/* TODO: Open filter dialog */}}
        >
          Filter
        </Button>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading && posts.length > 0 && (
        <Box display="flex" justifyContent="center" mb={2}>
          <CircularProgress size={24} />
        </Box>
      )}

      <List>
        {posts.map((post) => (
          <ListItem
            key={post.id}
            sx={{
              mb: 2,
              border: 1,
              borderColor: 'divider',
              borderRadius: 1,
              display: 'block',
            }}
          >
            <Box sx={{ p: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  mb: 1,
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip
                    label={post.platform}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                  <Chip
                    label={post.status}
                    size="small"
                    color={
                      post.status === 'published'
                        ? 'success'
                        : post.status === 'scheduled'
                        ? 'info'
                        : 'default'
                    }
                  />
                </Stack>
                <IconButton
                  size="small"
                  onClick={(e) => handleMenuClick(e, post.id)}
                >
                  <MoreVert />
                </IconButton>
              </Box>

              <Typography variant="body1" sx={{ mb: 1 }}>
                {post.content}
              </Typography>

              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{ color: 'text.secondary' }}
              >
                <Typography variant="body2">
                  {post.publishedTime
                    ? `Published ${formatDistanceToNow(new Date(post.publishedTime))} ago`
                    : post.scheduledTime
                    ? `Scheduled for ${new Date(post.scheduledTime).toLocaleString()}`
                    : 'Draft'}
                </Typography>
                {post.engagement && (
                  <Stack direction="row" spacing={2}>
                    <Typography variant="body2">
                      {post.engagement.likes} likes
                    </Typography>
                    <Typography variant="body2">
                      {post.engagement.comments} comments
                    </Typography>
                    <Typography variant="body2">
                      {post.engagement.shares} shares
                    </Typography>
                  </Stack>
                )}
              </Stack>
            </Box>
          </ListItem>
        ))}
      </List>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() => {
            handleViewAnalytics(selectedPost!)
          }}
        >
          <Analytics sx={{ mr: 1 }} /> View Analytics
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Edit sx={{ mr: 1 }} /> Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleDelete(selectedPost!)
          }}
          sx={{ color: 'error.main' }}
        >
          <Delete sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>
    </Box>
  )
}
