'use client'

import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Divider,
  Alert,
  IconButton,
  InputAdornment,
  Snackbar,
} from '@mui/material'
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  )
}

export default function SettingsPage() {
  const [tabValue, setTabValue] = useState(0)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [openAIKey, setOpenAIKey] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    // Load saved API key from local storage
    const savedKey = localStorage.getItem('openai_api_key')
    if (savedKey) {
      setOpenAIKey(savedKey)
    }
  }, [])

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const handleSaveApiKey = async () => {
    try {
      // Save to local storage
      localStorage.setItem('openai_api_key', openAIKey)
      
      // Test the API key with a simple completion request
      const response = await fetch('/api/test-openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey: openAIKey }),
      })

      if (!response.ok) {
        throw new Error('Invalid API key')
      }

      setSuccessMessage('API key saved and verified successfully')
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to save API key')
      // Remove invalid key from storage
      localStorage.removeItem('openai_api_key')
    }
  }

  const handleCloseMessage = () => {
    setSuccessMessage(null)
    setErrorMessage(null)
  }

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      <Paper sx={{ mt: 3, overflow: 'hidden' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="settings tabs"
          sx={{ 
            borderBottom: 1, 
            borderColor: 'divider',
            bgcolor: 'background.paper',
            px: { xs: 2, sm: 3 },
          }}
        >
          <Tab label="General" />
          <Tab label="Notifications" />
          <Tab label="Account" />
        </Tabs>

        <Box sx={{ px: { xs: 2, sm: 3 } }}>
          <TabPanel value={tabValue} index={0}>
            <Card elevation={0}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  API Configuration
                </Typography>
                <Box sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    label="OpenAI API Key"
                    value={openAIKey}
                    onChange={(e) => setOpenAIKey(e.target.value)}
                    type={showKey ? 'text' : 'password'}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle key visibility"
                            onClick={() => setShowKey(!showKey)}
                            edge="end"
                          >
                            {showKey ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 2 }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleSaveApiKey}
                    disabled={!openAIKey}
                  >
                    Save API Key
                  </Button>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" gutterBottom>
                  Appearance
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={darkMode}
                      onChange={(e) => setDarkMode(e.target.checked)}
                    />
                  }
                  label="Dark Mode"
                />
                
                <Divider sx={{ my: 3 }} />
                
                <Typography variant="h6" gutterBottom>
                  Language
                </Typography>
                <TextField
                  select
                  fullWidth
                  value="en"
                  SelectProps={{
                    native: true,
                  }}
                  sx={{ maxWidth: 200 }}
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                </TextField>
              </CardContent>
            </Card>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Card elevation={0}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Email Notifications
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={emailNotifications}
                      onChange={(e) => setEmailNotifications(e.target.checked)}
                    />
                  }
                  label="Receive email notifications"
                />
                
                <Divider sx={{ my: 3 }} />
                
                <Typography variant="h6" gutterBottom>
                  Push Notifications
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={pushNotifications}
                      onChange={(e) => setPushNotifications(e.target.checked)}
                    />
                  }
                  label="Receive push notifications"
                />
              </CardContent>
            </Card>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Card elevation={0}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Profile Information
                </Typography>
                <Box sx={{ maxWidth: 400 }}>
                  <TextField
                    fullWidth
                    label="Display Name"
                    defaultValue="John Doe"
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Email"
                    defaultValue="john@example.com"
                    margin="normal"
                  />
                  
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 3 }}
                  >
                    Save Changes
                  </Button>
                </Box>
                
                <Divider sx={{ my: 4 }} />
                
                <Typography variant="h6" gutterBottom color="error">
                  Danger Zone
                </Typography>
                <Button
                  variant="outlined"
                  color="error"
                  sx={{ mt: 1 }}
                >
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </TabPanel>
        </Box>
      </Paper>

      <Snackbar
        open={!!successMessage || !!errorMessage}
        autoHideDuration={6000}
        onClose={handleCloseMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseMessage}
          severity={successMessage ? 'success' : 'error'}
          sx={{ width: '100%' }}
        >
          {successMessage || errorMessage}
        </Alert>
      </Snackbar>
    </>
  )
}
