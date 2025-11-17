import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/features/auth/authSlice';
import { useLoginMutation } from '@/features/auth/authApiSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError(''); // Clear any previous email errors
    
    // Basic validation
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    try {
      const userData = await login({ email: email.toLowerCase().trim(), password }).unwrap();
      // Transform backend response to match frontend auth state structure
      dispatch(setCredentials({
        user: {
          id: userData._id,
          name: userData.name,
          email: userData.email,
          campus: userData.campus,
          role: userData.role,
        },
        accessToken: userData.token,
      }));
      toast.success('Welcome back!');
      
      // Redirect based on user role
      if (userData.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/profile');
      }
    } catch (err: any) {
      // RTK Query error structure: err.data for response body, err.status for status code
      let errorMessage = 'Failed to login. Please try again.';
      
      if (err?.data?.message) {
        errorMessage = err.data.message;
      } else if (err?.error) {
        errorMessage = err.error;
      } else if (err?.status === 'FETCH_ERROR') {
        errorMessage = 'Unable to connect to server. Please check if the backend is running.';
      }
      
      toast.error(errorMessage);
      console.error('Login error details:', {
        error: err,
        status: err?.status,
        data: err?.data,
        originalStatus: err?.originalStatus,
      });
      
      // If it's an email-related error, show it in the email field
      if (errorMessage.toLowerCase().includes('email')) {
        setEmailError(errorMessage);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/20 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <Card className="glass-card border-white/20">
          <CardHeader className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
              CM
            </div>
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>Sign in to your Campus Marketplace account</CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link to="/forgot-password" className="text-sm text-accent hover:underline">
                    Forgot?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
              
              <div className="text-center text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link to="/register" className="text-accent hover:underline font-medium">
                  Sign up
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
