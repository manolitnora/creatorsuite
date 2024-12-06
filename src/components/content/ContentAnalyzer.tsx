import { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';

interface ContentAnalysis {
  trendAlignment: number;
  predictions: {
    predictedLikes: number;
    predictedComments: number;
    predictedShares: number;
    predictedReach: number;
    confidenceScore: number;
  };
  optimizationSuggestions: string[];
}

interface ContentAnalyzerProps {
  onAnalyze: (content: string) => Promise<ContentAnalysis>;
}

export default function ContentAnalyzer({ onAnalyze }: ContentAnalyzerProps) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<ContentAnalysis | null>(null);

  const handleAnalyze = async () => {
    if (!content.trim()) return;

    setLoading(true);
    try {
      const result = await onAnalyze(content);
      setAnalysis(result);
    } catch (error) {
      console.error('Error analyzing content:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Content Analyzer
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter your content to analyze..."
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          onClick={handleAnalyze}
          disabled={!content.trim() || loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Analyze Content'}
        </Button>

        {analysis && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Analysis Results
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="textSecondary">
                Trend Alignment Score
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress
                  variant="determinate"
                  value={analysis.trendAlignment * 100}
                  color={analysis.trendAlignment > 0.7 ? 'success' : 'warning'}
                />
                <Typography>
                  {(analysis.trendAlignment * 100).toFixed(1)}%
                </Typography>
              </Box>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="textSecondary">
                Predicted Performance
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Chip
                  label={`${analysis.predictions.predictedLikes} Likes`}
                  color="primary"
                  variant="outlined"
                />
                <Chip
                  label={`${analysis.predictions.predictedComments} Comments`}
                  color="primary"
                  variant="outlined"
                />
                <Chip
                  label={`${analysis.predictions.predictedShares} Shares`}
                  color="primary"
                  variant="outlined"
                />
                <Chip
                  label={`${analysis.predictions.predictedReach} Reach`}
                  color="primary"
                  variant="outlined"
                />
              </Box>
            </Box>

            <Typography variant="subtitle2" color="textSecondary">
              Optimization Suggestions
            </Typography>
            <List>
              {analysis.optimizationSuggestions.map((suggestion, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <TipsAndUpdatesIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={suggestion} />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
