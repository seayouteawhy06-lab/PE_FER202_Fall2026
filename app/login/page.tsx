'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

export default function LoginPage() {
  const { signIn } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [authError, setAuthError] = useState('');
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
    return '';
  };

  const emailError = hasSubmitted ? validateEmail(email) : '';
  const passwordError = hasSubmitted ? validatePassword(password) : '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);
    setAuthError('');

    const eErr = validateEmail(email);
    const pErr = validatePassword(password);

    if (eErr || pErr) {
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await signIn(email, password);
      if (error) {
        setAuthError(error.message);
      } else {
        router.push('/books');
      }
    } catch (err: any) {
      setAuthError(err?.message || 'Failed to login');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-md border-slate-200">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-slate-900">Sign In</CardTitle>
          <CardDescription>Enter your email and password to access your shelf</CardDescription>
        </CardHeader>
        <CardContent>
          <form data-testid="login-form" noValidate onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                data-testid="login-email"
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
                data-testid="login-password"
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

            {authError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p data-testid="error-auth" className="text-sm text-red-600 font-medium">
                  {authError}
                </p>
              </div>
            )}

            <Button
              type="submit"
              data-testid="login-submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing in...' : 'Login'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center text-sm text-slate-500">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="ml-1 text-blue-600 hover:underline font-medium">
            Register here
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
