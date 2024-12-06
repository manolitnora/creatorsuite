import { Card, CardContent, CardHeader, Box } from '@mui/material'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { TimeRange } from '@/types/analytics'

interface EngagementChartProps {
  timeRange: TimeRange
}

export default function EngagementChart({ timeRange }: EngagementChartProps) {
  // Mock data - replace with API call
  const data = [
    {
      date: '2024-01-01',
      likes: 4000,
      shares: 2400,
      comments: 1800,
    },
    {
      date: '2024-01-02',
      likes: 4500,
      shares: 2600,
      comments: 2000,
    },
    {
      date: '2024-01-03',
      likes: 4200,
      shares: 2800,
      comments: 1900,
    },
    {
      date: '2024-01-04',
      likes: 5000,
      shares: 3000,
      comments: 2200,
    },
    {
      date: '2024-01-05',
      likes: 4800,
      shares: 2900,
      comments: 2100,
    },
    {
      date: '2024-01-06',
      likes: 5200,
      shares: 3100,
      comments: 2300,
    },
    {
      date: '2024-01-07',
      likes: 5500,
      shares: 3300,
      comments: 2500,
    },
  ]

  return (
    <Card>
      <CardHeader title="Engagement Over Time" />
      <CardContent>
        <Box sx={{ width: '100%', height: 400 }}>
          <ResponsiveContainer>
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="likes"
                stackId="1"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.3}
              />
              <Area
                type="monotone"
                dataKey="shares"
                stackId="1"
                stroke="#82ca9d"
                fill="#82ca9d"
                fillOpacity={0.3}
              />
              <Area
                type="monotone"
                dataKey="comments"
                stackId="1"
                stroke="#ffc658"
                fill="#ffc658"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  )
}
