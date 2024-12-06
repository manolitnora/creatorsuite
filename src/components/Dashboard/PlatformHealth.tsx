'use client'

import { Box, Typography, Grid, LinearProgress } from '@mui/material'

const platforms = [
  {
    name: 'YouTube',
    health: 85,
    color: '#FF0000',
  },
  {
    name: 'Twitter',
    health: 92,
    color: '#1DA1F2',
  },
  {
    name: 'Instagram',
    health: 78,
    color: '#E4405F',
  },
  {
    name: 'LinkedIn',
    health: 95,
    color: '#0A66C2',
  },
]

export default function PlatformHealth() {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Platform Health
      </Typography>
      <Grid container spacing={2}>
        {platforms.map((platform) => (
          <Grid item xs={12} key={platform.name}>
            <Typography variant="body2" color="text.secondary">
              {platform.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={platform.health}
                  sx={{
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: `${platform.color}40`,
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: platform.color,
                    },
                  }}
                />
              </Box>
              <Box sx={{ minWidth: 35 }}>
                <Typography variant="body2" color="text.secondary">{`${Math.round(
                  platform.health,
                )}%`}</Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
