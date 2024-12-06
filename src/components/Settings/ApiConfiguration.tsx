'use client'

import { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
  Snackbar,
  IconButton,
  InputAdornment,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from '@mui/material'
import {
  Visibility,
  VisibilityOff,
  ContentCopy,
  Add as AddIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material'
import { apiKeyService } from '@/services/api'
import { ApiKey } from '@/types/settings'

export default function ApiConfiguration() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [showKey, setShowKey] = useState<Record<string, boolean>>({})
  const [dialogOpen, setDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [newKeyName, setNewKeyName] = useState('')
  const [selectedScopes, setSelectedScopes] = useState<string[]>(['read'])

  const availableScopes = ['read', 'write', 'analytics', 'admin']

  useEffect(() => {
    loadApiKeys()
  }, [])

  const loadApiKeys = async () => {
    try {
      const keys = await apiKeyService.listApiKeys()
      setApiKeys(keys)
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load API keys' })
    } finally {
      setIsInitialLoading(false)
    }
  }

  const handleCreateKey = async () => {
    try {
      setLoading(true)
      const newKey = await apiKeyService.createApiKey(newKeyName, selectedScopes)
      setApiKeys(prev => [...prev, newKey])
      setMessage({ type: 'success', text: 'API key created successfully' })
      setDialogOpen(false)
      setNewKeyName('')
      setSelectedScopes(['read'])
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to create API key' })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteKey = async (keyId: string) => {
    try {
      setLoading(true)
      await apiKeyService.deleteApiKey(keyId)
      setApiKeys(prev => prev.filter(key => key.id !== keyId))
      setMessage({ type: 'success', text: 'API key deleted successfully' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete API key' })
    } finally {
      setLoading(false)
    }
  }

  const handleRegenerateKey = async (keyId: string) => {
    try {
      setLoading(true)
      const updatedKey = await apiKeyService.regenerateApiKey(keyId)
      setApiKeys(prev => prev.map(key => 
        key.id === keyId ? updatedKey : key
      ))
      setMessage({ type: 'success', text: 'API key regenerated successfully' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to regenerate API key' })
    } finally {
      setLoading(false)
    }
  }

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key)
    setMessage({ type: 'success', text: 'API key copied to clipboard' })
  }

  const toggleShowKey = (keyId: string) => {
    setShowKey(prev => ({
      ...prev,
      [keyId]: !prev[keyId],
    }))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">API Keys</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDialogOpen(true)}
          disabled={loading}
        >
          Create New Key
        </Button>
      </Stack>

      <Card>
        {isInitialLoading ? (
          <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>API Key</TableCell>
                  <TableCell>Scopes</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Last Used</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {apiKeys.map((apiKey) => (
                  <TableRow key={apiKey.id}>
                    <TableCell>{apiKey.name}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <TextField
                          size="small"
                          type={showKey[apiKey.id] ? 'text' : 'password'}
                          value={apiKey.key}
                          InputProps={{
                            readOnly: true,
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => toggleShowKey(apiKey.id)}
                                  edge="end"
                                >
                                  {showKey[apiKey.id] ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                        <IconButton
                          onClick={() => handleCopyKey(apiKey.key)}
                          size="small"
                        >
                          <ContentCopy />
                        </IconButton>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        {apiKey.scopes.map((scope) => (
                          <Chip
                            key={scope}
                            label={scope}
                            size="small"
                            color={scope === 'admin' ? 'error' : 'default'}
                          />
                        ))}
                      </Stack>
                    </TableCell>
                    <TableCell>{formatDate(apiKey.createdAt)}</TableCell>
                    <TableCell>
                      {apiKey.lastUsed ? formatDate(apiKey.lastUsed) : 'Never'}
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <IconButton
                          onClick={() => handleRegenerateKey(apiKey.id)}
                          color="primary"
                          size="small"
                          disabled={loading}
                        >
                          <RefreshIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteKey(apiKey.id)}
                          color="error"
                          size="small"
                          disabled={loading}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New API Key</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Key Name"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              placeholder="e.g., Production API Key"
            />
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Scopes
              </Typography>
              <Stack direction="row" spacing={1}>
                {availableScopes.map((scope) => (
                  <Chip
                    key={scope}
                    label={scope}
                    color={selectedScopes.includes(scope) ? 'primary' : 'default'}
                    onClick={() => {
                      setSelectedScopes(prev =>
                        prev.includes(scope)
                          ? prev.filter(s => s !== scope)
                          : [...prev, scope]
                      )
                    }}
                  />
                ))}
              </Stack>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleCreateKey}
            variant="contained"
            disabled={loading || !newKeyName || selectedScopes.length === 0}
          >
            Create Key
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!message}
        autoHideDuration={6000}
        onClose={() => setMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        {message && (
          <Alert
            onClose={() => setMessage(null)}
            severity={message.type}
            sx={{ width: '100%' }}
          >
            {message.text}
          </Alert>
        )}
      </Snackbar>
    </Box>
  )
}
