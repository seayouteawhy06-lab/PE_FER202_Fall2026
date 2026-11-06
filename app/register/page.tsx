'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

export default function RegisterPage() {
  const { signUp } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [authError, setAuthError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (val: string) => {
    if (!val || val.trim() === '') {
      return 'Email is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const validatePassword = (val: string) => {
    if (!val) {
      return 'Password is required';
    }
    if (val.length < 6) {
      return 'Password must be at least 6 characters';
    }
    return '';
  };

  const validateConfirmPassword = (val: string, passVal: string) => {
    if (!val) {
      return 'Confirm password is required';
    }
    if (val !== passVal) {
      return 'Passwords do not match';
    }
    return '';
  };

  const emailError = hasSubmitted ? validateEmail(email) : '';
  const passwordError = hasSubmitted ? validatePassword(password) : '';
  const confirmPasswordError = hasSubmitted ? validateConfirmPassword(confirmPassword, password) : '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);
    setAuthError('');
    setSuccessMsg('');

    const eErr = validateEmail(email);
    const pErr = validatePassword(password);
    const cpErr = validateConfirmPassword(confirmPassword, password);

    if (eErr || pErr || cpErr) {
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await signUp(email, password);
      if (error) {
        setAuthError(error.message);
      } else {
        setSuccessMsg('Registration successful');
        // Clear fields on success
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setHasSubmitted(false);
      }
    } catch (err: any) {
      setAuthError(err?.message || 'Failed to register');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-md border-slate-200">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-slate-900">Create an Account</CardTitle>
          <CardDescription>Enter your details below to register for ShelfLife</CardDescription>
        </CardHeader>
        <CardContent>
          <form data-testid="register-form" noValidate onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                data-testid="register-email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (authError) setAuthError('');
                }}
                placeholder="name@example.com"
              />
              {emailError && (
                <p data-testid="error-email" className="text-sm text-red-500 font-medium">
                  {emailError}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                data-testid="register-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (authError) setAuthError('');
                }}
                placeholder="••••••••"
              />
              {passwordError && (
                <p data-testid="error-password" className="text-sm text-red-500 font-medium">
                  {passwordError}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                data-testid="register-confirm-password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (authError) setAuthError('');
                }}
                placeholder="••••••••"
              />
              {confirmPasswordError && (
                <p data-testid="error-confirm-password" className="text-sm text-red-500 font-medium">
                  {confirmPasswordError}
                </p>
              )}
            </div>

            {authError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p data-testid="error-auth" className="text-sm text-red-600 font-medium">
                  {authError}
                </p>
              </div>
            )}

            {successMsg && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                <p data-testid="form-success" className="text-sm text-green-700 font-medium">
                  {successMsg}
                </p>
              </div>
            )}

            <Button
              type="submit"
              data-testid="register-submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Registering...' : 'Register'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link href="/login" className="ml-1 text-blue-600 hover:underline font-medium">
            Login here
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
