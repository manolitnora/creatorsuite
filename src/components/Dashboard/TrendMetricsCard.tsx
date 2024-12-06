'use client';

import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

interface TrendMetricsCardProps {
  title: string;
  value: number;
  change: number;
  unit?: string;
}

export default function TrendMetricsCard({ title, value, change, unit = '' }: TrendMetricsCardProps) {
  const isPositive = change >= 0;
  const TrendIcon = isPositive ? TrendingUpIcon : TrendingDownIcon;
  const trendColor = isPositive ? 'success.main' : 'error.main';

  return (
    <Card>
      <CardContent>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4" component="div" gutterBottom>
          {value.toLocaleString()}{unit}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TrendIcon sx={{ color: trendColor }} />
          <Typography
            variant="body2"
            sx={{ color: trendColor }}
          >
            {Math.abs(change)}% {isPositive ? 'increase' : 'decrease'}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
