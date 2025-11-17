import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCredentials, logout } from '../features/auth/authSlice';
import { useUpdateProfileMutation } from '../features/auth/authApiSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { User, Mail, MapPin, Lock, Package, ShoppingBag, LogOut, Edit2, Save, X } from 'lucide-react';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: any) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [campus, setCampus] = useState('');
  const [password, setPassword] = useState('');
  const [userListings, setUserListings] = useState([]);
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setCampus(user.campus || '');
    }
  }, [user]);

  useEffect(() => {
    // Fetch user's listings
    const fetchUserListings = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/listings`);
        const data = await response.json();
        // Filter listings by current user (in real app, backend should filter)
        const filtered = data.filter((listing: any) => listing.seller?._id === user?.id);
        setUserListings(filtered);
      } catch (error) {
        console.error('Failed to fetch listings:', error);
      }
    };
    
    if (user?.id) {
      fetchUserListings();
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updateData: any = { name, email, campus };
      if (password) {
        updateData.password = password;
      }
      
      const userData = await updateProfile(updateData).unwrap();
      const credentials = {
        user: {
          id: userData._id,
          name: userData.name,
          email: userData.email,
          campus: userData.campus,
        },
        accessToken: userData.token,
      };
      dispatch(setCredentials(credentials));
      toast.success('Profile updated successfully!');
      setIsEditing(false);
      setPassword('');
    } catch (err: any) {
      console.error('Failed to update profile:', err);
      toast.error(err?.data?.message || 'Failed to update profile');
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const handleDeleteListing = async (id: string) => {
    // Confirm deletion
    if (!window.confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      await fetch(`http://localhost:3000/api/listings/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setUserListings(userListings.filter((listing: any) => listing._id !== id));
      toast.success('Listing deleted successfully');
    } catch (error) {
      console.error('Error deleting listing:', error);
      toast.error('Failed to delete listing');
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="pt-6">
            <p>Please log in to view your profile.</p>
            <Button onClick={() => navigate('/login')} className="mt-4">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/20 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="glass-card border-white/20 mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <Avatar className="w-24 h-24 border-4 border-primary/20">
                  <AvatarFallback className="text-2xl bg-gradient-to-br from-primary to-accent text-white">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold">{user.name}</h1>
                    <Badge variant="secondary" className="w-fit mx-auto md:mx-0">
                      {user.role === 'admin' ? 'Admin' : 'Member'}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 text-muted-foreground mb-4">
                    <div className="flex items-center gap-2 justify-center md:justify-start">
                      <Mail className="w-4 h-4" />
                      <span>{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2 justify-center md:justify-start">
                      <MapPin className="w-4 h-4" />
                      <span>{user.campus || 'No campus set'}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleLogout}
                      className="text-red-600 hover:text-red-700"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex gap-6 md:gap-4 md:flex-col">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{userListings.length}</div>
                    <div className="text-sm text-muted-foreground">Listings</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent">0</div>
                    <div className="text-sm text-muted-foreground">Sold</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs Section */}
        <Tabs defaultValue="listings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="listings">
              <Package className="w-4 h-4 mr-2" />
              My Listings
            </TabsTrigger>
            <TabsTrigger value="settings">
              <User className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* My Listings Tab */}
          <TabsContent value="listings">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="glass-card border-white/20">
                <CardHeader>
                  <CardTitle>My Listings</CardTitle>
                  <CardDescription>Manage your posted items</CardDescription>
                </CardHeader>
                <CardContent>
                  {userListings.length === 0 ? (
                    <div className="text-center py-12">
                      <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No listings yet</h3>
                      <p className="text-muted-foreground mb-4">Start selling by creating your first listing</p>
                      <Button onClick={() => navigate('/post-listing')}>
                        Create Listing
                      </Button>
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {userListings.map((listing: any) => (
                        <Card key={listing._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                          <div className="aspect-video relative overflow-hidden bg-muted group">
                            <img
                              src={listing.images?.[0]?.secure_url || '/placeholder.jpg'}
                              alt={listing.title}
                              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute top-2 right-2">
                              <Badge className="bg-black/50 text-white">
                                {new Date(listing.createdAt).toLocaleDateString()}
                              </Badge>
                            </div>
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-semibold mb-1 truncate" title={listing.title}>
                              {listing.title}
                            </h3>
                            <p className="text-2xl font-bold text-primary mb-2">₹{listing.price}</p>
                            <div className="flex gap-2 mb-3">
                              <Badge variant="secondary">{listing.category}</Badge>
                              <Badge variant="outline">{listing.condition}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                              {listing.description}
                            </p>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1"
                                onClick={() => navigate(`/product/${listing._id}`)}
                              >
                                View Details
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteListing(listing._id)}
                                title="Delete listing"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="glass-card border-white/20">
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>Update your profile information</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">
                        <User className="w-4 h-4 inline mr-2" />
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={!isEditing}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">
                        <Mail className="w-4 h-4 inline mr-2" />
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={!isEditing}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="campus">
                        <MapPin className="w-4 h-4 inline mr-2" />
                        Campus
                      </Label>
                      <Select value={campus} onValueChange={setCampus} disabled={!isEditing}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your campus" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="chitkara-rajpura">Chitkara University Rajpura</SelectItem>
                          <SelectItem value="chitkara-baddi">Chitkara University Baddi</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {isEditing && (
                      <div className="space-y-2">
                        <Label htmlFor="password">
                          <Lock className="w-4 h-4 inline mr-2" />
                          New Password (leave blank to keep current)
                        </Label>
                        <Input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter new password"
                        />
                      </div>
                    )}

                    {isEditing && (
                      <div className="flex gap-3 pt-4">
                        <Button type="submit" disabled={isLoading} className="flex-1">
                          <Save className="w-4 h-4 mr-2" />
                          {isLoading ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setIsEditing(false);
                            setName(user.name);
                            setEmail(user.email);
                            setCampus(user.campus);
                            setPassword('');
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
