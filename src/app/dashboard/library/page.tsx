'use client'

import { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Button,
  CardActions,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
} from '@mui/material'
import {
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  FilterList as FilterListIcon,
  Schedule as ScheduleIcon,
  Analytics as AnalyticsIcon,
  ContentCopy as ContentCopyIcon,
  Instagram as InstagramIcon,
  Twitter as TwitterIcon,
  Facebook as FacebookIcon,
  LinkedIn as LinkedInIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material'
import { SaveContentData } from '@/components/Dashboard/ContentManager/SaveContentModal'

interface PlatformSchedule {
  platform: string;
  scheduledDate?: string;
  status: 'scheduled' | 'posted' | 'draft';
}

interface ContentItem extends SaveContentData {
  id: string;
  createdAt: string;
  platforms?: PlatformSchedule[];
  analytics?: {
    views: number;
    engagement: number;
    clicks: number;
  };
}

export default function ContentLibraryPage() {
  const [content, setContent] = useState<ContentItem[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [menuAnchorEl, setMenuAnchorEl] = useState<{ [key: string]: HTMLElement | null }>({})
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false)
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null)
  const [repurposeDialogOpen, setRepurposeDialogOpen] = useState(false)

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/content/save')
      if (!response.ok) {
        throw new Error('Failed to fetch content')
      }
      const data = await response.json()
      setContent(data)
    } catch (error) {
      console.error('Error fetching content:', error)
    }
  }

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget)
  }

  const handleFilterClose = () => {
    setFilterAnchorEl(null)
  }

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, id: string) => {
    setMenuAnchorEl({ ...menuAnchorEl, [id]: event.currentTarget })
  }

  const handleMenuClose = (id: string) => {
    setMenuAnchorEl({ ...menuAnchorEl, [id]: null })
  }

  const handleScheduleClick = (item: ContentItem) => {
    setSelectedContent(item)
    setScheduleDialogOpen(true)
    handleMenuClose(item.id)
  }

  const handleRepurposeClick = (item: ContentItem) => {
    setSelectedContent(item)
    setRepurposeDialogOpen(true)
    handleMenuClose(item.id)
  }

  const platformIcons = {
    instagram: <InstagramIcon />,
    twitter: <TwitterIcon />,
    facebook: <FacebookIcon />,
    linkedin: <LinkedInIcon />,
  }

  const filteredContent = content.filter((item) => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesType = !selectedType || item.contentType === selectedType
    const matchesStatus = !selectedStatus || item.status === selectedStatus

    return matchesSearch && matchesType && matchesStatus
  })

  const contentTypes = Array.from(new Set(content.map(item => item.contentType)))
  const statusTypes = ['draft', 'final']

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Content Library</Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={handleFilterClick}
          >
            Filter
          </Button>
          <Button
            variant="contained"
            href="/dashboard/content"
          >
            Create New Content
          </Button>
        </Stack>
      </Box>

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search content..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      <Menu
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl)}
        onClose={handleFilterClose}
      >
        <MenuItem disabled>
          <Typography variant="subtitle2">Content Type</Typography>
        </MenuItem>
        <MenuItem
          onClick={() => {
            setSelectedType(null)
            handleFilterClose()
          }}
        >
          All Types
        </MenuItem>
        {contentTypes.map((type) => (
          <MenuItem
            key={type}
            onClick={() => {
              setSelectedType(type)
              handleFilterClose()
            }}
          >
            {type}
          </MenuItem>
        ))}
        <MenuItem disabled>
          <Typography variant="subtitle2">Status</Typography>
        </MenuItem>
        <MenuItem
          onClick={() => {
            setSelectedStatus(null)
            handleFilterClose()
          }}
        >
          All Status
        </MenuItem>
        {statusTypes.map((status) => (
          <MenuItem
            key={status}
            onClick={() => {
              setSelectedStatus(status)
              handleFilterClose()
            }}
          >
            {status}
          </MenuItem>
        ))}
      </Menu>

      <Grid container spacing={3}>
        {filteredContent.map((item) => (
          <Grid item xs={12} md={6} lg={4} key={item.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Typography variant="h6" gutterBottom noWrap sx={{ maxWidth: '80%' }}>
                    {item.title}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuClick(e, item.id)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 2,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {item.content}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                  <Chip
                    label={item.contentType}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                  <Chip
                    label={item.status}
                    size="small"
                    color={item.status === 'final' ? 'success' : 'default'}
                    variant="outlined"
                  />
                  {item.platforms?.map((platform) => (
                    <Tooltip 
                      key={platform.platform} 
                      title={`${platform.platform}: ${platform.status}${platform.scheduledDate ? ` for ${new Date(platform.scheduledDate).toLocaleDateString()}` : ''}`}
                    >
                      <Chip
                        icon={platformIcons[platform.platform as keyof typeof platformIcons]}
                        size="small"
                        color={platform.status === 'posted' ? 'success' : platform.status === 'scheduled' ? 'primary' : 'default'}
                        variant="outlined"
                      />
                    </Tooltip>
                  ))}
                </Box>

                {item.analytics && (
                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <Tooltip title="Views">
                      <Typography variant="body2" color="text.secondary">
                        👁️ {item.analytics.views}
                      </Typography>
                    </Tooltip>
                    <Tooltip title="Engagement Rate">
                      <Typography variant="body2" color="text.secondary">
                        ❤️ {item.analytics.engagement}%
                      </Typography>
                    </Tooltip>
                    <Tooltip title="Link Clicks">
                      <Typography variant="body2" color="text.secondary">
                        🔗 {item.analytics.clicks}
                      </Typography>
                    </Tooltip>
                  </Box>
                )}

                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                  {item.tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </CardContent>

              <CardActions sx={{ justifyContent: 'flex-end' }}>
                <Tooltip title="Schedule">
                  <IconButton size="small" onClick={() => handleScheduleClick(item)}>
                    <ScheduleIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Analytics">
                  <IconButton size="small">
                    <AnalyticsIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Repurpose">
                  <IconButton size="small" onClick={() => handleRepurposeClick(item)}>
                    <ContentCopyIcon />
                  </IconButton>
                </Tooltip>
              </CardActions>

              <Menu
                anchorEl={menuAnchorEl[item.id]}
                open={Boolean(menuAnchorEl[item.id])}
                onClose={() => handleMenuClose(item.id)}
              >
                <MenuItem onClick={() => handleMenuClose(item.id)}>
                  <ListItemIcon>
                    <EditIcon fontSize="small" />
                  </ListItemIcon>
                  Edit
                </MenuItem>
                <MenuItem onClick={() => handleScheduleClick(item)}>
                  <ListItemIcon>
                    <ScheduleIcon fontSize="small" />
                  </ListItemIcon>
                  Schedule
                </MenuItem>
                <MenuItem onClick={() => handleRepurposeClick(item)}>
                  <ListItemIcon>
                    <ContentCopyIcon fontSize="small" />
                  </ListItemIcon>
                  Repurpose
                </MenuItem>
                <MenuItem onClick={() => handleMenuClose(item.id)} sx={{ color: 'error.main' }}>
                  <ListItemIcon>
                    <DeleteIcon fontSize="small" color="error" />
                  </ListItemIcon>
                  Delete
                </MenuItem>
              </Menu>
            </Card>
          </Grid>
        ))}

        {filteredContent.length === 0 && (
          <Grid item xs={12}>
            <Box
              sx={{
                textAlign: 'center',
                py: 8,
                bgcolor: 'background.paper',
                borderRadius: 1,
              }}
            >
              <Typography color="text.secondary">
                No content found
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>

      {/* Schedule Dialog */}
      <Dialog 
        open={scheduleDialogOpen} 
        onClose={() => setScheduleDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Schedule Content</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            {Object.keys(platformIcons).map((platform) => (
              <Box key={platform} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {platformIcons[platform as keyof typeof platformIcons]}
                <TextField
                  type="datetime-local"
                  fullWidth
                  label={platform.charAt(0).toUpperCase() + platform.slice(1)}
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setScheduleDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setScheduleDialogOpen(false)}>Schedule</Button>
        </DialogActions>
      </Dialog>

      {/* Repurpose Dialog */}
      <Dialog 
        open={repurposeDialogOpen} 
        onClose={() => setRepurposeDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Repurpose Content</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            {Object.keys(platformIcons).map((platform) => (
              <Button
                key={platform}
                variant="outlined"
                startIcon={platformIcons[platform as keyof typeof platformIcons]}
                fullWidth
              >
                Optimize for {platform.charAt(0).toUpperCase() + platform.slice(1)}
              </Button>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRepurposeDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
