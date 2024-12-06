import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material'
import { Platform } from '@/types/content'

interface PlatformSelectorProps {
  selectedPlatforms: Platform[]
  onPlatformsChange: (platforms: Platform[]) => void
}

const AVAILABLE_PLATFORMS: Platform[] = [
  'Twitter',
  'Instagram',
  'LinkedIn',
  'Facebook',
  'TikTok',
]

export default function PlatformSelector({
  selectedPlatforms,
  onPlatformsChange,
}: PlatformSelectorProps) {
  const handleChange = (event: SelectChangeEvent<Platform[]>) => {
    const value = event.target.value
    onPlatformsChange(typeof value === 'string' ? [value as Platform] : value as Platform[])
  }

  return (
    <FormControl fullWidth>
      <InputLabel>Target Platforms</InputLabel>
      <Select
        multiple
        value={selectedPlatforms}
        onChange={handleChange}
        label="Target Platforms"
        renderValue={(selected) => selected.join(', ')}
      >
        {AVAILABLE_PLATFORMS.map((platform) => (
          <MenuItem key={platform} value={platform}>
            {platform}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
