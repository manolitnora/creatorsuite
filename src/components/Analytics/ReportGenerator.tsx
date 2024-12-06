import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Alert,
} from '@mui/material';
import { DateRangePicker } from '../Common/DateRangePicker';
import { LoadingButton } from '@mui/lab';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useQuery } from '@tanstack/react-query';

interface ReportGeneratorProps {
  platform?: string;
}

export const ReportGenerator: React.FC<ReportGeneratorProps> = ({ platform }) => {
  const [format, setFormat] = React.useState('pdf');
  const [dateRange, setDateRange] = React.useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    endDate: new Date(),
  });
  const [isGenerating, setIsGenerating] = React.useState(false);

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      const params = new URLSearchParams({
        format,
        ...(platform && { platform }),
        start_date: dateRange.startDate.toISOString(),
        end_date: dateRange.endDate.toISOString(),
      });

      const response = await fetch(
        `/api/v1/reports/analytics-report?${params}`,
        {
          method: 'GET',
          headers: {
            Accept: format === 'pdf' ? 'application/pdf' : 'text/csv',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to generate report');
      }

      // Create blob and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics_report.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error generating report:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Generate Report
        </Typography>
        <Stack spacing={3}>
          <FormControl fullWidth>
            <InputLabel>Format</InputLabel>
            <Select
              value={format}
              label="Format"
              onChange={(e) => setFormat(e.target.value)}
            >
              <MenuItem value="pdf">PDF</MenuItem>
              <MenuItem value="csv">CSV</MenuItem>
            </Select>
          </FormControl>

          <DateRangePicker
            startDate={dateRange.startDate}
            endDate={dateRange.endDate}
            onChange={setDateRange}
          />

          <LoadingButton
            loading={isGenerating}
            loadingPosition="start"
            startIcon={<FileDownloadIcon />}
            variant="contained"
            onClick={handleGenerateReport}
            fullWidth
          >
            Generate Report
          </LoadingButton>

          <Alert severity="info">
            Reports include content performance metrics, Pareto analysis, and A/B
            testing insights for the selected date range.
          </Alert>
        </Stack>
      </CardContent>
    </Card>
  );
};
