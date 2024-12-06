import { Card, CardContent, Typography, Box } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

interface EngagementData {
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
}

interface EngagementChartProps {
  data: EngagementData[];
  title: string;
}

export default function EngagementChart({ data, title }: EngagementChartProps) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Box sx={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={(value) => format(new Date(value), 'MMM d')}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(value) => format(new Date(value), 'MMM d, yyyy')}
              />
              <Line
                type="monotone"
                dataKey="likes"
                stroke="#8884d8"
                name="Likes"
              />
              <Line
                type="monotone"
                dataKey="comments"
                stroke="#82ca9d"
                name="Comments"
              />
              <Line
                type="monotone"
                dataKey="shares"
                stroke="#ffc658"
                name="Shares"
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
}
