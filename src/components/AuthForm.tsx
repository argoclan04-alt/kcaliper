import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner';
import { Loader2, Mail, Lock, User, UserPlus, LogIn } from 'lucide-react';

interface AuthFormProps {
  onSuccess: () => void;
}

export function AuthForm({ onSuccess }: AuthFormProps) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'coach' | 'client'>('client');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Welcome back!');
      onSuccess();
    }
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: role,
        }
      }
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Registration successful! Please check your email.');
    }
    setLoading(false);
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-gray-200 dark:border-white/10 shadow-2xl overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 pointer-events-none" />
      
      <CardHeader className="relative space-y-1 text-center">
        <div className="mx-auto w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20">
          <Lock className="w-6 h-6 text-white" />
        </div>
        <CardTitle className="text-3xl font-bold tracking-tight dark:text-white">ARGO</CardTitle>
        <CardDescription className="text-gray-500 dark:text-gray-400">
          Enter your credentials to access the platform
        </CardDescription>
      </CardHeader>

      <CardContent className="relative">
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-100 dark:bg-gray-900 p-1 rounded-lg">
            <TabsTrigger value="login" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
              <LogIn className="w-4 h-4 mr-2" />
              Login
            </TabsTrigger>
            <TabsTrigger value="register" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
              <UserPlus className="w-4 h-4 mr-2" />
              Register
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                    required
                  />
                </div>
              </div>
              <Button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 h-11 text-lg font-medium">
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Sign In'}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="name"
                    placeholder="Carlos Rodriguez"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-10 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="reg-email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="reg-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Account Type</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    type="button"
                    variant={role === 'client' ? 'default' : 'outline'}
                    onClick={() => setRole('client')}
                    className="h-10"
                  >
                    Athlete
                  </Button>
                  <Button
                    type="button"
                    variant={role === 'coach' ? 'default' : 'outline'}
                    onClick={() => setRole('coach')}
                    className="h-10 transition-all"
                  >
                    Coach
                  </Button>
                </div>
              </div>

              <Button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 h-11 text-lg font-medium">
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Create Account'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter className="relative flex flex-col space-y-4">
        <div className="text-center text-sm text-gray-500 dark:text-gray-400 px-6">
          By continuing, you agree to ARGO's Terms of Service and Privacy Policy.
        </div>
      </CardFooter>
    </Card>
  );
}
