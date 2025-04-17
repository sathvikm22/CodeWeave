import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, BarChart, Code, Sparkles } from 'lucide-react';

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const { setUser, isLoggedIn } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (isLogin) {
      // Login validation
      if (!email || !password) {
        setError('Please fill in all fields');
        return;
      }
    } else {
      // Registration validation
      if (!name || !email || !password || !confirmPassword) {
        setError('Please fill in all fields');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (name.trim().length < 2) {
        setError('Name must be at least 2 characters long');
        return;
      }
    }
    
    // Simulate successful login/registration
    setUser({
      name: name.trim() || email.split('@')[0],
      preferences: {
        theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light',
        recentStructures: [],
        preferredLanguage: 'javascript'
      }
    });
    
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background overflow-hidden">
      {/* Left Side - Login Form */}
      <div className="w-full md:w-1/2 p-6 flex items-center justify-center">
        <div className="w-full max-w-md space-y-6 animate-fade-in">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <img src="/CodeWeaveLogo.png" alt="CodeWeave Logo" className="w-16 h-16" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground mb-2">CodeWeave</h1>
            <p className="text-muted-foreground text-lg">
              Master algorithms through interactive visualization
            </p>
          </div>

          <Card className="w-full shadow-lg border-primary/20">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">{isLogin ? 'Welcome back' : 'Create Account'}</CardTitle>
              <CardDescription>
                {isLogin ? 'Sign in to continue your learning journey' : 'Sign up to start your learning journey'}
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full"
                      required
                    />
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full"
                    required
                  />
                </div>

                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full"
                      required
                    />
                  </div>
                )}

                {error && <p className="text-destructive text-sm">{error}</p>}
                
                {isLogin && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="remember" 
                        checked={rememberMe}
                        onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                      />
                      <label
                        htmlFor="remember"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Remember me
                      </label>
                    </div>
                    <Button variant="link" className="px-0" type="button">
                      Forgot password?
                    </Button>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button type="submit" className="w-full">
                  {isLogin ? 'Sign In' : 'Create Account'}
                </Button>
                <Button
                  type="button"
                  variant="link"
                  className="text-sm text-muted-foreground"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError('');
                  }}
                >
                  {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
      
      {/* Right Side - Features Showcase */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-primary/10 to-primary/5 p-6 flex items-center justify-center">
        <div className="max-w-lg space-y-12 py-10">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold mb-6">Visualize & Master Algorithms</h2>
            <p className="text-muted-foreground text-lg mb-10">
              Understand complex data structures through interactive visualizations and hands-on practice
            </p>
          </div>
          
          <div className="grid gap-8">
            <div className="flex items-start space-x-4">
              <div className="bg-primary/10 p-3 rounded-full text-primary">
                <Sparkles size={24} />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Interactive Visualizations</h3>
                <p className="text-muted-foreground">
                  Watch algorithms come to life with real-time animations that help you grasp complex concepts effortlessly
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-primary/10 p-3 rounded-full text-primary">
                <Code size={24} />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Code Integration</h3>
                <p className="text-muted-foreground">
                  See how algorithms are implemented in multiple programming languages with side-by-side visualization
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-primary/10 p-3 rounded-full text-primary">
                <BarChart size={24} />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Performance Analysis</h3>
                <p className="text-muted-foreground">
                  Understand time and space complexity to choose the right algorithm for your specific needs
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-primary/10 p-3 rounded-full text-primary">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Interview Preparation</h3>
                <p className="text-muted-foreground">
                  Master algorithms and data structures for technical interviews with hands-on experience
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
