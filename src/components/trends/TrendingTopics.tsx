import { Card, CardContent, Typography, Chip, Box } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

interface TrendingTopic {
  name: string;
  score: number;
}

interface TrendingTopicsProps {
  topics: TrendingTopic[];
  title: string;
}

export default function TrendingTopics({ topics, title }: TrendingTopicsProps) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {topics.map((topic) => (
            <Chip
              key={topic.name}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <span>{topic.name}</span>
                  <Typography variant="caption" sx={{ opacity: 0.7 }}>
                    {topic.score.toFixed(1)}
                  </Typography>
                </Box>
              }
              icon={<TrendingUpIcon />}
              color="primary"
              variant={topic.score > 0.7 ? 'filled' : 'outlined'}
            />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}
