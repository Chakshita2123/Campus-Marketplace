import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { fetchListingById, addReviewToListing } from '@/features/listings/listingsSlice';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { MapPin, Calendar, MessageSquare, Bookmark, Share2, ShoppingCart, CreditCard, Wallet, Building2, Smartphone, CheckCircle2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import StarRating from '@/components/StarRating';
import { apiClient } from '@/lib/api';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const listing = useSelector((state: RootState) => state.listings.current);
  const { user } = useSelector((state: RootState) => state.auth);
  const [isChatOpen, setChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [isPaymentOpen, setPaymentOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  
  // Payment form states
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [netBankingBank, setNetBankingBank] = useState('');

  const handleSendMessage = async () => {
    if (!chatMessage.trim()) {
      toast.error('Please enter a message');
      return;
    }
    
    if (!user) {
      toast.error('Please login to send messages');
      navigate('/login');
      return;
    }

    if (!listing || !listing.seller) {
      toast.error('Unable to send message. Listing data not available.');
      return;
    }

    try {
      console.log('Sending message to:', listing.seller.name);
      
      await apiClient.sendMessage({
        receiverId: listing.seller._id,
        receiverName: listing.seller.name,
        text: chatMessage.trim(),
        listingId: listing._id,
        listingTitle: listing.title,
      });
      
      toast.success('Message sent successfully!');
      setChatMessage('');
      setChatOpen(false);
      
      // Optionally redirect to chat inbox
      setTimeout(() => {
        navigate('/chat');
      }, 1000);
    } catch (error: any) {
      console.error('Error sending message:', error);
      
      // Better error messages
      let errorMessage = 'Failed to send message';
      
      if (error.message?.includes('404')) {
        errorMessage = 'Messaging service not available. Please restart the backend server.';
      } else if (error.message?.includes('401') || error.message?.includes('403')) {
        errorMessage = 'Authentication error. Please login again.';
      } else if (error.message?.includes('Network')) {
        errorMessage = 'Network error. Please check your connection.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    }
  };

  const handleBuyNow = () => {
    if (!user) {
      toast.error('Please login to buy items');
      navigate('/login');
      return;
    }
    setPaymentOpen(true);
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      toast.success('Payment successful! Order placed.');
      
      // Reset after 3 seconds
      setTimeout(() => {
        setPaymentOpen(false);
        setPaymentSuccess(false);
        // In real app, redirect to orders page
      }, 3000);
    }, 2000);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (id && reviewComment.trim()) {
      try {
        await dispatch(addReviewToListing({
          listingId: id,
          review: {
            author: user?.name || 'Anonymous',
            comment: reviewComment,
            rating: reviewRating,
          },
        })).unwrap();
        setReviewComment('');
        setReviewRating(5);
      } catch (error) {
        console.error('Error adding review:', error);
      }
    }
  };

  useEffect(() => {
    if (id) {
      dispatch(fetchListingById(id));
    }
  }, [dispatch, id]);

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-accent border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Image Section */}
            <div>
              <div className="w-full h-96 rounded-2xl overflow-hidden bg-muted">
                <img
                  src={listing.images?.[0]?.secure_url}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Details Section */}
            <div className="space-y-6">
              <div>
                <div className="flex items-start justify-between mb-2">
                  <h1 className="text-3xl font-bold text-primary">{listing.title}</h1>
                  <div className="flex gap-2">
                    <Button size="icon" variant="outline">
                      <Bookmark className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="outline">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="text-3xl font-bold text-accent mb-4">₹{listing.price}</div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary">{listing.category}</Badge>
                  <Badge variant="outline">{listing.condition}</Badge>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{listing.campus}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Posted {new Date(listing.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground leading-relaxed">{listing.description}</p>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Seller Information</h3>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
                    {listing.seller.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium">{listing.seller.name}</div>
                    <div className="text-sm text-muted-foreground">Active seller</div>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <Button className="w-full gap-2" size="lg" onClick={handleBuyNow}>
                  <ShoppingCart className="w-4 h-4" />
                  Buy Now
                </Button>
                <div className="flex gap-3">
                  <Button 
                    className="flex-1 gap-2" 
                    variant="outline" 
                    size="lg" 
                    onClick={() => {
                      if (!user) {
                        toast.error('Please login to message seller');
                        navigate('/login');
                        return;
                      }
                      if (user.id === listing.seller._id) {
                        toast.info('This is your own listing');
                        return;
                      }
                      setChatOpen(true);
                    }}
                  >
                    <MessageSquare className="w-4 h-4" />
                    Message Seller
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={() => toast.info('Make offer feature coming soon!')}
                  >
                    Make Offer
                  </Button>
                </div>
              </div>
            </div>
          </div>
          {/* Reviews Section */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Reviews</h2>
              {listing.reviews && listing.reviews.length > 0 && (
                <div className="flex items-center gap-3">
                  <StarRating 
                    rating={
                      listing.reviews.reduce((acc, review) => acc + review.rating, 0) / 
                      listing.reviews.length
                    } 
                    readonly 
                    showNumber
                  />
                  <span className="text-sm text-muted-foreground">
                    ({listing.reviews.length} {listing.reviews.length === 1 ? 'review' : 'reviews'})
                  </span>
                </div>
              )}
            </div>
            <div className="space-y-4">
              {listing.reviews && listing.reviews.length > 0 ? (
                listing.reviews.map((review, index) => (
                  <div key={index} className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
                          {review.author.charAt(0)}
                        </div>
                        <div className="ml-3">
                          <div className="font-medium">{review.author}</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <StarRating rating={review.rating} readonly size="sm" />
                    </div>
                    <p className="text-muted-foreground">{review.comment}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No reviews yet. Be the first to review this item!</p>
                </div>
              )}
            </div>

            {/* Add Review Form */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Write a Review</CardTitle>
                <CardDescription>Share your experience with this item</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="rating">Your Rating</Label>
                    <div className="flex items-center gap-3">
                      <StarRating 
                        rating={reviewRating} 
                        onRatingChange={setReviewRating}
                        size="lg"
                      />
                      <span className="text-sm text-muted-foreground">
                        ({reviewRating} {reviewRating === 1 ? 'star' : 'stars'})
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="comment">Your Review</Label>
                    <textarea
                      id="comment"
                      className="w-full p-3 border rounded-lg bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                      rows={4}
                      placeholder="Share your thoughts about this item..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      required
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button type="submit" className="flex-1">
                      Submit Review
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => {
                        setReviewComment('');
                        setReviewRating(5);
                      }}
                    >
                      Clear
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>

      {/* Chat Modal */}
      <AnimatePresence>
        {isChatOpen && listing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setChatOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card p-6 rounded-2xl w-full max-w-md shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Message Seller</h3>
                  <p className="text-sm text-muted-foreground">Chat with {listing.seller?.name || 'Seller'}</p>
                </div>
                <Button size="icon" variant="ghost" onClick={() => setChatOpen(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Product Info */}
              <div className="bg-muted/50 p-3 rounded-lg mb-4 flex gap-3">
                <img
                  src={listing.images?.[0]?.secure_url}
                  alt={listing.title}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{listing.title}</p>
                  <p className="text-sm text-muted-foreground">₹{listing.price}</p>
                </div>
              </div>

              {/* Chat body */}
              <div className="h-48 overflow-y-auto bg-muted/30 p-4 rounded-lg mb-4">
                <p className="text-sm text-muted-foreground text-center">
                  Start your conversation about this item
                </p>
              </div>

              {/* Chat input */}
              <div className="space-y-3">
                <Textarea
                  placeholder="Type your message here..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  rows={3}
                  className="resize-none"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleSendMessage}
                    className="flex-1"
                    disabled={!chatMessage.trim()}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                  <Button variant="outline" onClick={() => setChatOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Payment Modal */}
      <AnimatePresence>
        {isPaymentOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              {paymentSuccess ? (
                <div className="p-8 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                  >
                    <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-4" />
                  </motion.div>
                  <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
                  <p className="text-muted-foreground mb-4">
                    Your order has been placed successfully.
                  </p>
                  <div className="bg-muted/50 p-4 rounded-lg mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-muted-foreground">Item:</span>
                      <span className="font-semibold">{listing.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Amount Paid:</span>
                      <span className="font-bold text-green-600">₹{listing.price}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    The seller will contact you shortly for pickup details.
                  </p>
                </div>
              ) : (
                <>
                  <div className="p-6 border-b">
                    <div className="flex justify-between items-center">
                      <div>
                        <h2 className="text-2xl font-bold">Complete Payment</h2>
                        <p className="text-muted-foreground">Choose your payment method</p>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setPaymentOpen(false)}
                      >
                        <X className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Order Summary */}
                    <Card className="mb-6">
                      <CardHeader>
                        <CardTitle className="text-lg">Order Summary</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex gap-4">
                          <img
                            src={listing.images?.[0]?.secure_url}
                            alt={listing.title}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold">{listing.title}</h3>
                            <p className="text-sm text-muted-foreground">{listing.category}</p>
                          </div>
                        </div>
                        <Separator />
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Item Price</span>
                            <span>₹{listing.price}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Platform Fee</span>
                            <span>₹0</span>
                          </div>
                          <Separator />
                          <div className="flex justify-between text-lg font-bold">
                            <span>Total Amount</span>
                            <span className="text-primary">₹{listing.price}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Payment Methods */}
                    <form onSubmit={handlePayment}>
                      <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                        <div className="space-y-3">
                          {/* UPI Payment */}
                          <Card className={paymentMethod === 'upi' ? 'border-primary' : ''}>
                            <CardHeader className="pb-3">
                              <div className="flex items-center gap-3">
                                <RadioGroupItem value="upi" id="upi" />
                                <Label htmlFor="upi" className="flex items-center gap-2 cursor-pointer flex-1">
                                  <Smartphone className="w-5 h-5 text-primary" />
                                  <span className="font-semibold">UPI</span>
                                </Label>
                              </div>
                            </CardHeader>
                            {paymentMethod === 'upi' && (
                              <CardContent className="space-y-3">
                                <div>
                                  <Label htmlFor="upiId">UPI ID</Label>
                                  <Input
                                    id="upiId"
                                    placeholder="yourname@upi"
                                    value={upiId}
                                    onChange={(e) => setUpiId(e.target.value)}
                                    required
                                  />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  Enter your UPI ID (e.g., 9876543210@paytm)
                                </p>
                              </CardContent>
                            )}
                          </Card>

                          {/* Credit/Debit Card */}
                          <Card className={paymentMethod === 'card' ? 'border-primary' : ''}>
                            <CardHeader className="pb-3">
                              <div className="flex items-center gap-3">
                                <RadioGroupItem value="card" id="card" />
                                <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-1">
                                  <CreditCard className="w-5 h-5 text-primary" />
                                  <span className="font-semibold">Credit/Debit Card</span>
                                </Label>
                              </div>
                            </CardHeader>
                            {paymentMethod === 'card' && (
                              <CardContent className="space-y-3">
                                <div>
                                  <Label htmlFor="cardNumber">Card Number</Label>
                                  <Input
                                    id="cardNumber"
                                    placeholder="1234 5678 9012 3456"
                                    value={cardNumber}
                                    onChange={(e) => setCardNumber(e.target.value)}
                                    maxLength={19}
                                    required
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="cardName">Cardholder Name</Label>
                                  <Input
                                    id="cardName"
                                    placeholder="John Doe"
                                    value={cardName}
                                    onChange={(e) => setCardName(e.target.value)}
                                    required
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <Label htmlFor="cardExpiry">Expiry Date</Label>
                                    <Input
                                      id="cardExpiry"
                                      placeholder="MM/YY"
                                      value={cardExpiry}
                                      onChange={(e) => setCardExpiry(e.target.value)}
                                      maxLength={5}
                                      required
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="cardCvv">CVV</Label>
                                    <Input
                                      id="cardCvv"
                                      type="password"
                                      placeholder="123"
                                      value={cardCvv}
                                      onChange={(e) => setCardCvv(e.target.value)}
                                      maxLength={3}
                                      required
                                    />
                                  </div>
                                </div>
                              </CardContent>
                            )}
                          </Card>

                          {/* Net Banking */}
                          <Card className={paymentMethod === 'netbanking' ? 'border-primary' : ''}>
                            <CardHeader className="pb-3">
                              <div className="flex items-center gap-3">
                                <RadioGroupItem value="netbanking" id="netbanking" />
                                <Label htmlFor="netbanking" className="flex items-center gap-2 cursor-pointer flex-1">
                                  <Building2 className="w-5 h-5 text-primary" />
                                  <span className="font-semibold">Net Banking</span>
                                </Label>
                              </div>
                            </CardHeader>
                            {paymentMethod === 'netbanking' && (
                              <CardContent>
                                <Label htmlFor="bank">Select Bank</Label>
                                <select
                                  id="bank"
                                  className="w-full p-2 border rounded-lg bg-background"
                                  value={netBankingBank}
                                  onChange={(e) => setNetBankingBank(e.target.value)}
                                  required
                                >
                                  <option value="">Choose your bank</option>
                                  <option value="sbi">State Bank of India</option>
                                  <option value="hdfc">HDFC Bank</option>
                                  <option value="icici">ICICI Bank</option>
                                  <option value="axis">Axis Bank</option>
                                  <option value="pnb">Punjab National Bank</option>
                                  <option value="other">Other</option>
                                </select>
                              </CardContent>
                            )}
                          </Card>

                          {/* Wallet */}
                          <Card className={paymentMethod === 'wallet' ? 'border-primary' : ''}>
                            <CardHeader className="pb-3">
                              <div className="flex items-center gap-3">
                                <RadioGroupItem value="wallet" id="wallet" />
                                <Label htmlFor="wallet" className="flex items-center gap-2 cursor-pointer flex-1">
                                  <Wallet className="w-5 h-5 text-primary" />
                                  <span className="font-semibold">Wallet</span>
                                </Label>
                              </div>
                            </CardHeader>
                            {paymentMethod === 'wallet' && (
                              <CardContent>
                                <div className="grid grid-cols-2 gap-3">
                                  <Button type="button" variant="outline" className="h-16">
                                    <div className="text-center">
                                      <div className="font-semibold">Paytm</div>
                                    </div>
                                  </Button>
                                  <Button type="button" variant="outline" className="h-16">
                                    <div className="text-center">
                                      <div className="font-semibold">PhonePe</div>
                                    </div>
                                  </Button>
                                  <Button type="button" variant="outline" className="h-16">
                                    <div className="text-center">
                                      <div className="font-semibold">Google Pay</div>
                                    </div>
                                  </Button>
                                  <Button type="button" variant="outline" className="h-16">
                                    <div className="text-center">
                                      <div className="font-semibold">Amazon Pay</div>
                                    </div>
                                  </Button>
                                </div>
                              </CardContent>
                            )}
                          </Card>
                        </div>
                      </RadioGroup>

                      <div className="mt-6 flex gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          className="flex-1"
                          onClick={() => setPaymentOpen(false)}
                          disabled={isProcessing}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          className="flex-1"
                          disabled={isProcessing}
                        >
                          {isProcessing ? (
                            <>
                              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                              Processing...
                            </>
                          ) : (
                            <>Pay ₹{listing.price}</>
                          )}
                        </Button>
                      </div>
                    </form>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
