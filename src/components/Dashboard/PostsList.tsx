'use client'

import { Box, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar } from '@mui/material'
import { Article as ArticleIcon } from '@mui/icons-material'

const posts = [
  {
    id: 1,
    title: 'How to Improve Your Content Strategy',
    date: '2024-01-15',
    engagement: '2.5k',
  },
  {
    id: 2,
    title: '10 Tips for Better Social Media Presence',
    date: '2024-01-14',
    engagement: '1.8k',
  },
  {
    id: 3,
    title: 'Understanding Your Audience',
    date: '2024-01-13',
    engagement: '3.2k',
  },
  {
    id: 4,
    title: 'Content Creation Best Practices',
    date: '2024-01-12',
    engagement: '2.1k',
  },
]

export default function PostsList() {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Recent Posts
      </Typography>
      <List>
        {posts.map((post) => (
          <ListItem key={post.id} divider>
            <ListItemAvatar>
              <Avatar>
                <ArticleIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={post.title}
              secondary={`Posted on ${post.date} • ${post.engagement} engagements`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  )
}
