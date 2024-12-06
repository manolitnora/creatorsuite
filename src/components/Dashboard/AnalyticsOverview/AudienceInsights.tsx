'use client'

import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import { TimeRange, AudienceDemographics } from '@/types/analytics'
import { analyticsService } from '@/services/analytics'
import { useState, useEffect } from 'react'

interface AudienceInsightsProps {
  timeRange: TimeRange
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

const RADIAN = Math.PI / 180
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
  const radius = outerRadius * 1.1
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text
      x={x}
      y={y}
      fill="#666"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
    >
      {`${name} (${(percent * 100).toFixed(0)}%)`}
    </text>
  )
}

export default function AudienceInsights({ timeRange }: AudienceInsightsProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [audienceData, setAudienceData] = useState<AudienceDemographics | null>(null)

  useEffect(() => {
    const fetchAudienceData = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await analyticsService.getAudienceInsights(timeRange)
        setAudienceData(data)
      } catch (err) {
        setError('Failed to load audience insights')
        console.error('Error fetching audience data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAudienceData()
  }, [timeRange])

  if (loading) {
    return (
      <Card>
        <CardHeader title="Audience Insights" />
        <CardContent sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </CardContent>
      </Card>
    )
  }

  if (error || !audienceData) {
    return (
      <Card>
        <CardHeader title="Audience Insights" />
        <CardContent>
          <Typography color="error" align="center">
            {error || 'No audience data available'}
          </Typography>
        </CardContent>
      </Card>
    )
  }

  const { ageDemographics, locations, interests } = audienceData

  return (
    <Card>
      <CardHeader title="Audience Insights" />
      <CardContent>
        <Grid container spacing={3}>
          {/* Age Demographics */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Age Distribution
            </Typography>
            <Box sx={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={ageDemographics}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={renderCustomizedLabel}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {ageDemographics.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Grid>

          {/* Geographic Distribution */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Top Locations
            </Typography>
            <Box sx={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart
                  data={locations}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="country" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="users" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Grid>

          {/* Interests */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Interests
            </Typography>
            <Box sx={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart
                  data={interests}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" unit="%" />
                  <YAxis dataKey="category" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="percentage" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}
