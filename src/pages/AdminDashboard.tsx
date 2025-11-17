import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Package, AlertCircle, Mail, Clock, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { logout } from "@/features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const StatCard = ({ 
  title, 
  value, 
  icon, 
  iconColor,
  badge 
}: { 
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconColor: string;
  badge?: number;
}) => (
  <Card className="relative overflow-hidden hover:shadow-lg transition-shadow">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${iconColor}`}>
          {icon}
        </div>
      </div>
      {badge !== undefined && badge > 0 && (
        <Badge className="absolute top-2 right-2 bg-red-500 text-white">
          {badge}
        </Badge>
      )}
    </CardContent>
  </Card>
);

export default function AdminDashboard() {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 1204,
    activeListings: 342,
    pendingReports: 7,
    newMessages: 15,
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity] = useState([
    { date: 'Oct 24, 2025', user: 'John Doe', activity: 'Added a new listing', status: 'Success' as const },
    { date: 'Oct 22, 2025', user: 'Sarah Smith', activity: 'Reported a listing', status: 'Pending' as const },
    { date: 'Oct 20, 2025', user: 'Michael Lee', activity: 'Deleted a listing', status: 'Deleted' as const },
  ]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch real listings count
      const listingsRes = await fetch('http://localhost:3000/api/listings');
      const listingsData = await listingsRes.json();
      
      setStats(prev => ({
        ...prev,
        activeListings: listingsData.length,
      }));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleManageUsers = () => {
    navigate('/admin/users');
  };

  const handleManageListings = () => {
    navigate('/admin/listings');
  };

  const handleApproveListings = () => {
    navigate('/admin/listings');
  };

  const handleResolveReports = () => {
    navigate('/admin/reports');
  };

  const handleSendNotification = () => {
    navigate('/admin/notifications');
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const handleNavigateUsers = () => {
    toast.info('Users page coming soon!');
  };

  const handleNavigatePickup = () => {
    navigate('/pickup');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Package className="w-6 h-6" />
              <h1 className="text-xl font-bold">Campus Marketplace - Admin</h1>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                className="text-white hover:bg-white/20"
                onClick={handleNavigateUsers}
              >
                Users
              </Button>
              <Button
                variant="ghost"
                className="text-white hover:bg-white/20"
                onClick={handleNavigatePickup}
              >
                Pickup
              </Button>
              <Button
                variant="ghost"
                className="text-white hover:bg-white/20"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Notice Alert */}
          <Alert className="border-blue-200 bg-blue-50">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>Notice:</strong> 3 new seller verification requests are pending.
            </AlertDescription>
          </Alert>

          {/* Stats Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Users"
              value={stats.totalUsers.toLocaleString()}
              icon={<Users className="h-6 w-6 text-white" />}
              iconColor="bg-blue-500"
            />
            <StatCard
              title="Active Listings"
              value={stats.activeListings}
              icon={<Package className="h-6 w-6 text-white" />}
              iconColor="bg-green-500"
            />
            <StatCard
              title="Pending Reports"
              value={stats.pendingReports}
              icon={<AlertCircle className="h-6 w-6 text-white" />}
              iconColor="bg-orange-500"
            />
            <StatCard
              title="New Messages"
              value={stats.newMessages}
              icon={<Mail className="h-6 w-6 text-white" />}
              iconColor="bg-purple-500"
              badge={stats.newMessages}
            />
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={handleManageUsers}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  Manage Users
                </Button>
                <Button
                  onClick={handleManageListings}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  Manage Listings
                </Button>
                <Button
                  onClick={handleApproveListings}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Approve Listings
                </Button>
                <Button
                  onClick={handleResolveReports}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  Resolve Reports
                </Button>
                <Button
                  onClick={handleSendNotification}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Send Notification
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>DATE</TableHead>
                      <TableHead>USER</TableHead>
                      <TableHead>ACTIVITY</TableHead>
                      <TableHead>STATUS</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentActivity.map((activity, index) => (
                      <ActivityRow key={index} {...activity} />
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground py-4">
            © 2025 Campus Marketplace. All rights reserved.
          </div>
        </motion.div>
      </div>
    </div>
  );
}

const ActivityRow = ({ date, user, activity, status }: { 
  date: string;
  user: string;
  activity: string;
  status: 'Success' | 'Pending' | 'Deleted';
}) => {
  const statusColors = {
    Success: 'text-green-600',
    Pending: 'text-orange-600',
    Deleted: 'text-red-600',
  };

  return (
    <TableRow>
      <TableCell className="text-muted-foreground">{date}</TableCell>
      <TableCell className="font-medium">{user}</TableCell>
      <TableCell>{activity}</TableCell>
      <TableCell>
        <span className={statusColors[status]}>{status}</span>
      </TableCell>
    </TableRow>
  );
};
