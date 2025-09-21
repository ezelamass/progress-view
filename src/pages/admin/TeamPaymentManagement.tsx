import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2, DollarSign, BarChart3 } from 'lucide-react';
import { useTeamPayments } from '@/hooks/useTeamPayments';
import { useUsers } from '@/hooks/useUsers';
import { useProjects } from '@/hooks/useProjects';
import { format } from 'date-fns';
import TeamAnalyticsDashboard from '@/components/admin/TeamAnalyticsDashboard';

const TeamPaymentManagement = () => {
  const { payments, loading, createPayment, updatePayment, deletePayment } = useTeamPayments();
  const { users } = useUsers();
  const { projects } = useProjects();
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<any>(null);
  const [formData, setFormData] = useState({
    user_id: '',
    project_id: '',
    amount: '',
    currency: 'USD',
    payment_type: 'salary',
    status: 'pending',
    due_date: '',
    description: '',
    hours_worked: '',
    payment_method: '',
    notes: ''
  });

  const teamMembers = users.filter(user => user.role === 'team');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const paymentData = {
      ...formData,
      amount: parseFloat(formData.amount),
      hours_worked: formData.hours_worked ? parseFloat(formData.hours_worked) : null,
      project_id: formData.project_id || null,
      due_date: formData.due_date || null,
    };

    if (editingPayment) {
      await updatePayment(editingPayment.id, paymentData);
      setEditingPayment(null);
    } else {
      await createPayment(paymentData);
      setIsCreateDialogOpen(false);
    }

    setFormData({
      user_id: '',
      project_id: '',
      amount: '',
      currency: 'USD',
      payment_type: 'salary',
      status: 'pending',
      due_date: '',
      description: '',
      hours_worked: '',
      payment_method: '',
      notes: ''
    });
  };

  const handleEdit = (payment: any) => {
    setEditingPayment(payment);
    setFormData({
      user_id: payment.user_id,
      project_id: payment.project_id || '',
      amount: payment.amount.toString(),
      currency: payment.currency,
      payment_type: payment.payment_type,
      status: payment.status,
      due_date: payment.due_date || '',
      description: payment.description || '',
      hours_worked: payment.hours_worked?.toString() || '',
      payment_method: payment.payment_method || '',
      notes: payment.notes || ''
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Team Payment Management</h1>
          <p className="text-muted-foreground">Manage payments for your team members</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Payment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="user_id">Team Member</Label>
                  <Select value={formData.user_id} onValueChange={(value) => setFormData({...formData, user_id: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select team member" />
                    </SelectTrigger>
                    <SelectContent>
                      {teamMembers.map((member) => (
                        <SelectItem key={member.user_id} value={member.user_id}>
                          {member.first_name} {member.last_name} ({member.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Create Payment
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="payments" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="payments" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Payments
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="payments" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Team Payments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Team Member</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {payment.profiles?.first_name} {payment.profiles?.last_name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {payment.profiles?.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {payment.currency} {payment.amount}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(payment.status)}>
                          {payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(payment)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deletePayment(payment.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="mt-6">
          <TeamAnalyticsDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeamPaymentManagement;