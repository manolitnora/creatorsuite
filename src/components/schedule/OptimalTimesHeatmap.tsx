import { Card, CardContent, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

interface OptimalTime {
  hour: number;
  day: number;
  expectedEngagement: number;
}

interface OptimalTimesHeatmapProps {
  data: OptimalTime[];
}

const HeatmapCell = styled(Box)<{ engagement: number }>(({ theme, engagement }) => ({
  width: 40,
  height: 40,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: `rgba(66, 165, 245, ${engagement})`,
  color: engagement > 0.5 ? theme.palette.common.white : theme.palette.text.primary,
  fontSize: '0.75rem',
  border: `1px solid ${theme.palette.divider}`,
}));

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const hours = Array.from({ length: 24 }, (_, i) => i);

export default function OptimalTimesHeatmap({ data }: OptimalTimesHeatmapProps) {
  // Create a 2D array to store engagement values
  const heatmapData = Array.from({ length: 7 }, () =>
    Array.from({ length: 24 }, () => 0)
  );

  // Fill the heatmap data
  data.forEach(({ hour, day, expectedEngagement }) => {
    heatmapData[day][hour] = expectedEngagement;
  });

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Optimal Posting Times
        </Typography>
        <Box sx={{ overflowX: 'auto' }}>
          <Box sx={{ display: 'flex', mb: 1 }}>
            <Box sx={{ width: 40 }} /> {/* Empty corner cell */}
            {hours.map((hour) => (
              <Typography
                key={hour}
                sx={{
                  width: 40,
                  textAlign: 'center',
                  fontSize: '0.75rem',
                }}
              >
                {hour}
              </Typography>
            ))}
          </Box>
          {days.map((day, dayIndex) => (
            <Box key={day} sx={{ display: 'flex' }}>
              <Typography
                sx={{
                  width: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                }}
              >
                {day}
              </Typography>
              {hours.map((hour) => (
                <HeatmapCell
                  key={`${day}-${hour}`}
                  engagement={heatmapData[dayIndex][hour]}
                >
                  {Math.round(heatmapData[dayIndex][hour] * 100)}
                </HeatmapCell>
              ))}
            </Box>
          ))}
        </Box>
        <Typography variant="caption" sx={{ display: 'block', mt: 2 }}>
          Numbers indicate expected engagement rate (%)
        </Typography>
      </CardContent>
    </Card>
  );
}
