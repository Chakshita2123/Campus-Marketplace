import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, Send, Bell } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function SendNotification() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [recipient, setRecipient] = useState('all');
  const [sending, setSending] = useState(false);

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !message.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setSending(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // API call would go here
      toast.success('Notification sent successfully!');
      
      // Reset form
      setTitle('');
      setMessage('');
      setRecipient('all');
      
      // Navigate back after short delay
      setTimeout(() => {
        navigate('/admin');
      }, 1000);
    } catch (error) {
      toast.error('Failed to send notification');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate('/admin')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Send Notification</h1>
              <p className="text-muted-foreground">Send notifications to platform users</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Details
              </CardTitle>
              <CardDescription>
                Compose and send notifications to users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSendNotification} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="recipient">Recipients</Label>
                  <RadioGroup value={recipient} onValueChange={setRecipient}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id="all" />
                      <Label htmlFor="all" className="cursor-pointer">
                        All Users
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sellers" id="sellers" />
                      <Label htmlFor="sellers" className="cursor-pointer">
                        Sellers Only
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="buyers" id="buyers" />
                      <Label htmlFor="buyers" className="cursor-pointer">
                        Buyers Only
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Notification Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter notification title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Enter your message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={6}
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    {message.length} / 500 characters
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">Preview</h3>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-start gap-3">
                      <Bell className="w-5 h-5 text-blue-600 mt-1" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">
                          {title || 'Notification Title'}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {message || 'Your message will appear here...'}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          Just now • Campus Marketplace
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={sending}
                  >
                    {sending ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Notification
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/admin')}
                    disabled={sending}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
