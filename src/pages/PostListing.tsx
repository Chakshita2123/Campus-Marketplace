import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createListing } from '@/features/listings/listingsSlice';
import { RootState, AppDispatch } from '@/store/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, X, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function PostListing() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [condition, setCondition] = useState('');
  const [campus, setCampus] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  // Check authentication on mount
  useEffect(() => {
    if (!isAuthenticated || !user) {
      toast.error('Please login to create a listing');
      navigate('/login');
    }
  }, [isAuthenticated, user, navigate]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Max 5MB.`);
        return;
      }

      // Validate file type
      if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
        toast.error(`${file.name} must be PNG or JPG.`);
        return;
      }

      // Convert to base64 for preview/storage
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setImages((prev) => [...prev, result]);
        toast.success(`${file.name} added`);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check authentication again before submitting
    if (!isAuthenticated || !user) {
      toast.error('Please login to create a listing');
      navigate('/login');
      return;
    }
    
    // Validation
    if (!title.trim() || !description.trim() || !price || !category || !condition) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (parseInt(price) <= 0) {
      toast.error('Price must be greater than 0');
      return;
    }

    if (!campus) {
      toast.error('Please select a campus');
      return;
    }

    setIsSubmitting(true);

    try {
      // If no images provided, use a default placeholder
      const listingImages = images.length > 0 
        ? images.map(url => ({ secure_url: url, public_id: '' }))
        : [{ secure_url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400', public_id: '' }];

      const listingData = {
        title: title.trim(),
        description: description.trim(),
        price: parseInt(price),
        category,
        condition,
        campus,
        images: listingImages,
      };

      console.log('Creating listing with data:', listingData);
      const result = await dispatch(createListing(listingData)).unwrap();
      console.log('Listing created:', result);
      toast.success('Listing created successfully!');
      navigate('/browse');
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to create listing. Please try again.';
      toast.error(errorMessage);
      console.error('Error creating listing:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading or redirect message while checking auth
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
            <p className="text-muted-foreground mb-4">
              You need to be logged in to create a listing.
            </p>
            <Button onClick={() => navigate('/login')}>Go to Login</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-2xl">Post a New Listing</CardTitle>
              <CardDescription>Fill in the details to create your listing</CardDescription>
            </CardHeader>
            
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Physics Textbook - 5th Edition"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your item in detail..."
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (₹) *</Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="500"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Books">Books</SelectItem>
                        <SelectItem value="Electronics">Electronics</SelectItem>
                        <SelectItem value="Clothes">Clothes</SelectItem>
                        <SelectItem value="Furniture">Furniture</SelectItem>
                        <SelectItem value="Sports">Sports</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="condition">Condition *</Label>
                    <Select value={condition} onValueChange={setCondition}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Like New">Like New</SelectItem>
                          <SelectItem value="Excellent">Excellent</SelectItem>
                          <SelectItem value="Good">Good</SelectItem>
                          <SelectItem value="Fair">Fair</SelectItem>
                          <SelectItem value="Poor">Poor</SelectItem>
                        </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="campus">Campus *</Label>
                    <Select value={campus} onValueChange={setCampus}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select campus" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="chitkara-rajpura">Chitkara University Rajpura</SelectItem>
                        <SelectItem value="chitkara-baddi">Chitkara University Baddi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Images</Label>
                  <input
                    type="file"
                    id="imageInput"
                    multiple
                    accept="image/png,image/jpeg,image/jpg"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="imageInput"
                    className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-accent transition-colors cursor-pointer block"
                  >
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-1">Click to upload images</p>
                    <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
                  </label>

                  {images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                      {images.map((img, idx) => (
                        <div key={idx} className="relative group">
                          <img src={img} alt={`preview-${idx}`} className="w-full h-24 object-cover rounded" />
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                        Creating...
                      </>
                    ) : (
                      'Post Listing'
                    )}
                  </Button>
                  <Button type="button" variant="outline" size="lg" onClick={() => navigate(-1)} disabled={isSubmitting}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
