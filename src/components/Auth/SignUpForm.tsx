import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import {
  Box,
  Button,
  TextField,
  Divider,
  Stack,
  Alert,
  IconButton,
  InputAdornment,
  Checkbox,
  FormControlLabel,
} from '@mui/material'
import {
  Google as GoogleIcon,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import api from '@/services/api'

interface SignUpFormInputs {
  name: string
  email: string
  password: string
  confirmPassword: string
  acceptTerms: boolean
}

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormInputs>()

  const password = watch('password')

  const onSubmit = async (data: SignUpFormInputs) => {
    try {
      // Register user
      await api.post('/auth/register', {
        name: data.name,
        email: data.email,
        password: data.password,
      })

      // Sign in the user
      const result = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      })

      if (result?.error) {
        setError('Error signing in after registration')
        return
      }

      router.push('/')
    } catch (error: any) {
      setError(error.response?.data?.message || 'An error occurred during registration')
    }
  }

  const handleGoogleSignUp = () => {
    signIn('google', { callbackUrl: '/' })
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%' }}>
      <Stack spacing={3}>
        {error && <Alert severity="error">{error}</Alert>}

        <TextField
          label="Full Name"
          fullWidth
          {...register('name', {
            required: 'Full name is required',
            minLength: {
              value: 2,
              message: 'Name must be at least 2 characters',
            },
          })}
          error={!!errors.name}
          helperText={errors.name?.message}
        />

        <TextField
          label="Email"
          type="email"
          fullWidth
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          })}
          error={!!errors.email}
          helperText={errors.email?.message}
        />

        <TextField
          label="Password"
          type={showPassword ? 'text' : 'password'}
          fullWidth
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 8,
              message: 'Password must be at least 8 characters',
            },
            pattern: {
              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
              message:
                'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
            },
          })}
          error={!!errors.password}
          helperText={errors.password?.message}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <TextField
          label="Confirm Password"
          type={showPassword ? 'text' : 'password'}
          fullWidth
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (value) =>
              value === password || 'The passwords do not match',
          })}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
        />

        <FormControlLabel
          control={
            <Checkbox
              {...register('acceptTerms', {
                required: 'You must accept the terms and conditions',
              })}
            />
          }
          label={
            <span>
              I agree to the{' '}
              <Link href="/terms" style={{ color: 'primary.main' }}>
                Terms and Conditions
              </Link>
            </span>
          }
        />
        {errors.acceptTerms && (
          <Alert severity="error">{errors.acceptTerms.message}</Alert>
        )}

        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating Account...' : 'Create Account'}
        </Button>

        <Divider>or</Divider>

        <Button
          variant="outlined"
          size="large"
          fullWidth
          startIcon={<GoogleIcon />}
          onClick={handleGoogleSignUp}
        >
          Sign up with Google
        </Button>

        <Box sx={{ textAlign: 'center' }}>
          Already have an account?{' '}
          <Link href="/auth/signin" style={{ color: 'primary.main' }}>
            Sign in
          </Link>
        </Box>
      </Stack>
    </Box>
  )
}
