import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Form, FormField } from '../../components/common/Form';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { toast } from 'react-hot-toast';
import { composeValidators, email, required } from '../../utils/validation';

export function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailError = composeValidators(required, email)(formData.email);
    if (emailError) {
      toast.error(emailError);
      return;
    }

    setLoading(true);

    try {
      await resetPassword(formData.email);
      setEmailSent(true);
      toast.success('Password reset instructions have been sent to your email');
    } catch (error) {
      toast.error('Failed to send reset instructions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <Card>
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Check your email
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                We've sent password reset instructions to {formData.email}
              </p>
              <div className="pt-4">
                <Link
                  to="/auth/login"
                  className="text-primary-600 hover:text-primary-500"
                >
                  Return to login
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Reset your password
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Enter your email address and we'll send you instructions to reset your password
          </p>
        </div>

        <Card>
          <Form onSubmit={handleSubmit} className="space-y-6">
            <FormField
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              loading={loading}
            >
              Send Reset Instructions
            </Button>

            <div className="text-center text-sm">
              <Link
                to="/auth/login"
                className="text-primary-600 hover:text-primary-500"
              >
                Back to login
              </Link>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
}
