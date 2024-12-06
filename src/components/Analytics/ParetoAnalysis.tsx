import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { fetchParetoAnalysis } from '../../api/analytics';
import { DateRangePicker } from '../Common/DateRangePicker';
import { LoadingSpinner } from '../Common/LoadingSpinner';
import { ErrorMessage } from '../Common/ErrorMessage';

interface ParetoAnalysisProps {
  platform?: string;
  metric?: string;
}

export const ParetoAnalysis: React.FC<ParetoAnalysisProps> = ({
  platform,
  metric = 'engagement',
}) => {
  const [dateRange, setDateRange] = React.useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    endDate: new Date(),
  });

  const { data, isLoading, error } = useQuery(
    ['paretoAnalysis', platform, metric, dateRange],
    () =>
      fetchParetoAnalysis({
        platform,
        metric,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      }),
    {
      refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes
    }
  );

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!data) return null;

  const chartData = data.pareto_data.map((item: any) => ({
    content: item.content_id.substring(0, 8),
    metricValue: item.metric_value,
    cumulativePercentage: item.cumulative_percentage,
  }));

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Box sx={{ mb: 2 }}>
          <DateRangePicker
            startDate={dateRange.startDate}
            endDate={dateRange.endDate}
            onChange={setDateRange}
          />
        </Box>
      </Grid>

      <Grid item xs={12} md={8}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Pareto Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="content"
                  angle={-45}
                  textAnchor="end"
                  height={70}
                />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="metricValue"
                  stroke="#8884d8"
                  name="Metric Value"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="cumulativePercentage"
                  stroke="#82ca9d"
                  name="Cumulative %"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Key Insights
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="Top Performers"
                  secondary={`${data.summary.top_performer_count} pieces of content (${data.summary.top_performer_percentage.toFixed(
                    1
                  )}%) generate 80% of your ${metric}`}
                />
              </ListItem>
              <Divider />
              {data.recommendations.map((rec: any, index: number) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemText
                      primary={rec.category}
                      secondary={
                        <>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            {rec.insight}
                          </Typography>
                          <br />
                          {rec.action}
                        </>
                      }
                    />
                  </ListItem>
                  {index < data.recommendations.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};
