'use client'

import { useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  Chip,
  Avatar,
  Alert,
  Snackbar,
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material'

interface TeamMember {
  id: string
  name: string
  email: string
  role: 'admin' | 'editor' | 'viewer'
  status: 'active' | 'pending' | 'inactive'
  avatar?: string
}

export default function TeamManagement() {
  const [members, setMembers] = useState<TeamMember[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'admin',
      status: 'active',
      avatar: 'https://mui.com/static/images/avatar/1.jpg',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'editor',
      status: 'active',
      avatar: 'https://mui.com/static/images/avatar/2.jpg',
    },
  ])
  
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editMember, setEditMember] = useState<TeamMember | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'viewer' as TeamMember['role'],
  })

  const handleOpenDialog = (member?: TeamMember) => {
    if (member) {
      setEditMember(member)
      setFormData({
        name: member.name,
        email: member.email,
        role: member.role,
      })
    } else {
      setEditMember(null)
      setFormData({
        name: '',
        email: '',
        role: 'viewer',
      })
    }
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setEditMember(null)
    setFormData({
      name: '',
      email: '',
      role: 'viewer',
    })
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      if (editMember) {
        // TODO: Implement update team member
        // await fetch(`/api/team/${editMember.id}`, {
        //   method: 'PUT',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(formData),
        // })
        setMembers(prev =>
          prev.map(member =>
            member.id === editMember.id
              ? { ...member, ...formData }
              : member
          )
        )
        setMessage({ type: 'success', text: 'Team member updated successfully' })
      } else {
        // TODO: Implement invite team member
        // const response = await fetch('/api/team/invite', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(formData),
        // })
        const newMember: TeamMember = {
          id: Date.now().toString(),
          ...formData,
          status: 'pending',
        }
        setMembers(prev => [...prev, newMember])
        setMessage({ type: 'success', text: 'Invitation sent successfully' })
      }
      handleCloseDialog()
    } catch (error) {
      setMessage({
        type: 'error',
        text: editMember
          ? 'Failed to update team member'
          : 'Failed to send invitation',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (memberId: string) => {
    try {
      setLoading(true)
      // TODO: Implement delete team member
      // await fetch(`/api/team/${memberId}`, {
      //   method: 'DELETE',
      // })
      setMembers(prev => prev.filter(member => member.id !== memberId))
      setMessage({ type: 'success', text: 'Team member removed successfully' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to remove team member' })
    } finally {
      setLoading(false)
    }
  }

  const getRoleColor = (role: TeamMember['role']) => {
    switch (role) {
      case 'admin':
        return 'error'
      case 'editor':
        return 'primary'
      case 'viewer':
        return 'default'
    }
  }

  const getStatusColor = (status: TeamMember['status']) => {
    switch (status) {
      case 'active':
        return 'success'
      case 'pending':
        return 'warning'
      case 'inactive':
        return 'error'
    }
  }

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">Team Members</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Invite Member
        </Button>
      </Stack>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Member</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar src={member.avatar} alt={member.name}>
                        {member.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2">{member.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {member.email}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                      color={getRoleColor(member.role)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                      color={getStatusColor(member.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(member)}
                      disabled={loading}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(member.id)}
                      disabled={loading}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editMember ? 'Edit Team Member' : 'Invite Team Member'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            />
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={formData.role}
                label="Role"
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as TeamMember['role'] }))}
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="editor">Editor</MenuItem>
                <MenuItem value="viewer">Viewer</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Saving...' : editMember ? 'Save' : 'Send Invitation'}
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
