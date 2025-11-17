import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function ResolveReports() {
  const navigate = useNavigate();
  const [reports, setReports] = useState<any[]>([]);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [resolution, setResolution] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockReports = [
        {
          _id: '1',
          type: 'listing',
          reportedBy: { name: 'John Doe', email: 'john@chitkara.edu.in' },
          reportedItem: { id: 'listing1', title: 'Suspicious Laptop Listing' },
          reason: 'Suspected scam - price too low',
          description: 'This listing seems fake. The price is unrealistically low.',
          status: 'pending',
          createdAt: new Date('2025-10-22'),
        },
        {
          _id: '2',
          type: 'user',
          reportedBy: { name: 'Jane Smith', email: 'jane@chitkara.edu.in' },
          reportedItem: { id: 'user1', title: 'User: Bob Wilson' },
          reason: 'Harassment',
          description: 'This user sent inappropriate messages.',
          status: 'pending',
          createdAt: new Date('2025-10-20'),
        },
      ];
      setReports(mockReports);
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleResolveReport = async (reportId: string, action: 'resolved' | 'dismissed') => {
    if (!resolution.trim() && action === 'resolved') {
      toast.error('Please provide a resolution note');
      return;
    }

    try {
      // API call would go here
      setReports(reports.map(report =>
        report._id === reportId ? { ...report, status: action, resolution } : report
      ));
      toast.success(`Report ${action} successfully`);
      setSelectedReport(null);
      setResolution('');
    } catch (error) {
      toast.error(`Failed to ${action} report`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => navigate('/admin')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-3xl font-bold">Resolve Reports</h1>
                <p className="text-muted-foreground">Review and resolve user reports</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Pending Reports ({reports.filter(r => r.status === 'pending').length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Reported Item</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Reporter</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reports.map((report) => (
                        <TableRow key={report._id}>
                          <TableCell>
                            <Badge variant="secondary">{report.type}</Badge>
                          </TableCell>
                          <TableCell className="font-medium">
                            {report.reportedItem.title}
                          </TableCell>
                          <TableCell>{report.reason}</TableCell>
                          <TableCell>{report.reportedBy.name}</TableCell>
                          <TableCell>
                            {new Date(report.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {report.status === 'pending' ? (
                              <Badge variant="outline" className="text-orange-600">
                                <AlertCircle className="w-3 h-3 mr-1" />
                                Pending
                              </Badge>
                            ) : report.status === 'resolved' ? (
                              <Badge className="bg-green-500">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Resolved
                              </Badge>
                            ) : (
                              <Badge variant="secondary">
                                <XCircle className="w-3 h-3 mr-1" />
                                Dismissed
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedReport(report)}
                              disabled={report.status !== 'pending'}
                            >
                              Review
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Report Details</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedReport ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Reported Item</h3>
                      <p className="text-sm text-muted-foreground">{selectedReport.reportedItem.title}</p>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Reason</h3>
                      <p className="text-sm text-muted-foreground">{selectedReport.reason}</p>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Description</h3>
                      <p className="text-sm text-muted-foreground">{selectedReport.description}</p>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Reported By</h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedReport.reportedBy.name}<br />
                        {selectedReport.reportedBy.email}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Resolution Notes</h3>
                      <Textarea
                        placeholder="Enter resolution notes..."
                        value={resolution}
                        onChange={(e) => setResolution(e.target.value)}
                        rows={4}
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={() => handleResolveReport(selectedReport._id, 'resolved')}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Resolve
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleResolveReport(selectedReport._id, 'dismissed')}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Dismiss
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Select a report to review</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
