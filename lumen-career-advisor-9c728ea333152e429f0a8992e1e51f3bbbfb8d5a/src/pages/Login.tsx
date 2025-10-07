import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GraduationCap, Sparkles } from 'lucide-react';

const mockUsers = [
  {
    id: '1',
    email: 'dharshandhiren@gmail.com',
    password: '12345678',
    name: 'Admin User',
    role: 'admin',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    email: 'student@example.com',
    password: 'student123',
    name: 'Student User',
    role: 'student',
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    email: 'mentor@example.com',
    password: 'mentor123',
    name: 'Mentor User',
    role: 'mentor',
    createdAt: new Date().toISOString()
  }
];

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUserState] = useState(null);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'student' as const
  });
  const [registeredUsers, setRegisteredUsers] = useState(mockUsers);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } text-white`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  const handleLogin = async () => {
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const user = registeredUsers.find(
        u => u.email === loginData.email && u.password === loginData.password
      );

      if (!user) {
        throw new Error('Invalid email or password');
      }

      setCurrentUserState(user);
      showToast('Login successful!', 'success');
      setLoginData({ email: '', password: '' });
    } catch (error: any) {
      showToast(error.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const userExists = registeredUsers.some(user => user.email === signupData.email);
      
      if (userExists) {
        throw new Error('Email already in use');
      }

      if (signupData.password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      const newUser = {
        id: `user_${Date.now()}`,
        ...signupData,
        createdAt: new Date().toISOString()
      };

      setRegisteredUsers([...registeredUsers, newUser]);
      setCurrentUserState(newUser);
      showToast('Account created successfully!', 'success');
      
      setSignupData({
        email: '',
        password: '',
        name: '',
        role: 'student'
      });
    } catch (error: any) {
      showToast(error.message || 'Failed to create account', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setCurrentUserState(null);
    showToast('Logged out successfully', 'success');
  };

  if (currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  {currentUser.role === 'admin' ? '👨‍💼 Admin Dashboard' : 
                   currentUser.role === 'mentor' ? '👨‍🏫 Mentor Dashboard' : 
                   currentUser.role === 'graduate' ? '🎓 Graduate Dashboard' : 
                   '📚 Student Dashboard'}
                </h1>
                <p className="text-gray-600 mt-2">Welcome back, {currentUser.name}!</p>
              </div>
              <Button onClick={handleLogout} variant="outline">
                Logout
              </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Your Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p><strong>Name:</strong> {currentUser.name}</p>
                    <p><strong>Email:</strong> {currentUser.email}</p>
                    <p><strong>Role:</strong> {currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}</p>
                    <p><strong>Member since:</strong> {new Date(currentUser.createdAt).toLocaleDateString()}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p>🎯 Assessments: 0</p>
                    <p>📊 Career Matches: 0</p>
                    <p>💬 Messages: 0</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">No recent activity</p>
                </CardContent>
              </Card>
            </div>

            {currentUser.role === 'admin' && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-800">Admin Controls</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Manage Users</CardTitle>
                      <CardDescription>View and manage all users</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">Total Users: {registeredUsers.length}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>System Settings</CardTitle>
                      <CardDescription>Configure system preferences</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full">Open Settings</Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {currentUser.role === 'student' && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-800">Your Career Journey</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Take Assessment</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full">Start Now</Button>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Explore Careers</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full">Browse</Button>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Find Mentor</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full">Search</Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-2xl">
              <GraduationCap className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Career Advisor
          </h1>
          <p className="text-gray-600">
            AI-powered career guidance for your future
          </p>
        </div>

        <Card className="border-2">
          <CardHeader>
            <CardTitle>Get Started</CardTitle>
            <CardDescription>Login or create a new account</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="your@email.com"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                    />
                  </div>
                  <Button onClick={handleLogin} className="w-full" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="signup">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input
                      id="signup-name"
                      placeholder="John Doe"
                      value={signupData.name}
                      onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your@email.com"
                      value={signupData.email}
                      onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Min. 6 characters"
                      value={signupData.password}
                      onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-role">I am a</Label>
                    <select
                      id="signup-role"
                      className="w-full p-2 border rounded-md bg-white"
                      value={signupData.role}
                      onChange={(e) => setSignupData({ ...signupData, role: e.target.value as any })}
                    >
                      <option value="student">Student (12th Grade)</option>
                      <option value="graduate">Graduate</option>
                      <option value="mentor">Mentor</option>
                    </select>
                  </div>
                  <Button onClick={handleSignup} className="w-full" disabled={loading}>
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-700 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-blue-600" />
                Admin login: dharshandhiren@gmail.com / 12345678
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;