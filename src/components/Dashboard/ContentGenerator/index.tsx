import { useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  Stack,
  FormControlLabel,
  Switch,
  FormGroup,
  Chip,
  Box,
  IconButton,
  Tooltip,
} from '@mui/material'
import { AutoAwesome, Help } from '@mui/icons-material'
import PlatformSelector from './PlatformSelector'
import ContentPreview from './ContentPreview'
import { Platform } from '@/types/content'

export default function ContentGenerator() {
  const [baseContent, setBaseContent] = useState('')
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([])
  const [enableABTesting, setEnableABTesting] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    if (!baseContent || selectedPlatforms.length === 0) return
    
    setIsGenerating(true)
    try {
      // TODO: Implement API call to generate content
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulated delay
    } catch (error) {
      console.error('Error generating content:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Card>
      <CardHeader
        title="Content Generator"
        action={
          <Tooltip title="Generate optimized content for multiple platforms with optional A/B testing">
            <IconButton>
              <Help />
            </IconButton>
          </Tooltip>
        }
      />
      <CardContent>
        <Stack spacing={3}>
          <TextField
            label="Base Content"
            multiline
            rows={4}
            value={baseContent}
            onChange={(e) => setBaseContent(e.target.value)}
            placeholder="Enter your content idea here..."
            fullWidth
          />
          
          <PlatformSelector
            selectedPlatforms={selectedPlatforms}
            onPlatformsChange={setSelectedPlatforms}
          />

          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={enableABTesting}
                  onChange={(e) => setEnableABTesting(e.target.checked)}
                />
              }
              label="Enable A/B Testing"
            />
          </FormGroup>

          {selectedPlatforms.length > 0 && (
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {selectedPlatforms.map((platform) => (
                <Chip
                  key={platform}
                  label={platform}
                  onDelete={() => 
                    setSelectedPlatforms(prev => 
                      prev.filter(p => p !== platform)
                    )
                  }
                />
              ))}
            </Box>
          )}

          <Button
            variant="contained"
            onClick={handleGenerate}
            disabled={!baseContent || selectedPlatforms.length === 0 || isGenerating}
            startIcon={<AutoAwesome />}
            size="large"
          >
            {isGenerating ? 'Generating...' : 'Generate Content'}
          </Button>

          <ContentPreview />
        </Stack>
      </CardContent>
    </Card>
  )
}
