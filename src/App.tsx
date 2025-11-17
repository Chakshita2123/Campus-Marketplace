import { Provider } from 'react-redux';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import store from "./store/store";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Browse from "./pages/Browse";
import ProductDetail from "./pages/ProductDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PostListing from "./pages/PostListing";
import ChatInbox from "./pages/ChatInbox";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile.tsx";
import Pickup from "./pages/Pickup";
import AdminDashboard from "./pages/AdminDashboard";
import ManageUsers from "./pages/ManageUsers";
import ManageListings from "./pages/ManageListings";
import ResolveReports from "./pages/ResolveReports";
import SendNotification from "./pages/SendNotification";
import { useSelector } from 'react-redux';
import { RootState } from './store/store';

const queryClient = new QueryClient();

const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  if (!isAuthenticated) {
    return <Login />;
  }
  
  if (user?.role !== 'admin') {
    return <NotFound />;
  }
  
  return children;
};

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/post" element={<PostListing />} />
            <Route path="/post-listing" element={<PostListing />} />
            <Route path="/chat" element={<ChatInbox />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/pickup" element={<Pickup />} />
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><ManageUsers /></AdminRoute>} />
            <Route path="/admin/listings" element={<AdminRoute><ManageListings /></AdminRoute>} />
            <Route path="/admin/reports" element={<AdminRoute><ResolveReports /></AdminRoute>} />
            <Route path="/admin/notifications" element={<AdminRoute><SendNotification /></AdminRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;
