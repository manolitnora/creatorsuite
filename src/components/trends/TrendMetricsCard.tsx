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

  return (
    <Card>
      <CardContent>
        <Typography variant="subtitle2" color="textSecondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4" component="div">
          {value.toLocaleString()}{unit}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          {isPositive ? (
            <TrendingUpIcon color="success" fontSize="small" />
          ) : (
            <TrendingDownIcon color="error" fontSize="small" />
          )}
          <Typography
            variant="body2"
            color={isPositive ? 'success.main' : 'error.main'}
            sx={{ ml: 0.5 }}
          >
            {Math.abs(change)}%
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
            vs last period
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
