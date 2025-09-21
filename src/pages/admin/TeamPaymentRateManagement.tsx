import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Clock, DollarSign } from 'lucide-react';
import { useTeamPaymentRates } from '@/hooks/useTeamPaymentRates';
import { useUsers } from '@/hooks/useUsers';
import { useProjects } from '@/hooks/useProjects';
import { format } from 'date-fns';

const TeamPaymentRateManagement = () => {
  const { rates, loading, createRate, updateRate, deleteRate } = useTeamPaymentRates();
  const { users } = useUsers();
  const { projects } = useProjects();
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingRate, setEditingRate] = useState<any>(null);
  const [formData, setFormData] = useState({
    user_id: '',
    project_id: '',
    rate_type: 'hourly',
    rate_amount: '',
    currency: 'USD',
    effective_from: '',
    effective_until: '',
    is_active: true
  });

  const teamMembers = users.filter(user => user.role === 'team');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const rateData = {
      ...formData,
      rate_amount: parseFloat(formData.rate_amount),
      project_id: formData.project_id || null,
      effective_until: formData.effective_until || null,
    };

    if (editingRate) {
      await updateRate(editingRate.id, rateData);
      setEditingRate(null);
    } else {
      await createRate(rateData);
      setIsCreateDialogOpen(false);
    }

    setFormData({
      user_id: '',
      project_id: '',
      rate_type: 'hourly',
      rate_amount: '',
      currency: 'USD',
      effective_from: '',
      effective_until: '',
      is_active: true
    });
  };

  const handleEdit = (rate: any) => {
    setEditingRate(rate);
    setFormData({
      user_id: rate.user_id,
      project_id: rate.project_id || '',
      rate_type: rate.rate_type,
      rate_amount: rate.rate_amount.toString(),
      currency: rate.currency,
      effective_from: rate.effective_from,
      effective_until: rate.effective_until || '',
      is_active: rate.is_active
    });
  };

  const getRateTypeIcon = (type: string) => {
    switch (type) {
      case 'hourly': return '⏰';
      case 'salary': return '💼';
      case 'bonus': return '🎁';
      case 'commission': return '📊';
      default: return '💰';
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
          <h1 className="text-3xl font-bold">Payment Rate Management</h1>
          <p className="text-muted-foreground">Set payment rates for your team members</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Rate
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Payment Rate</DialogTitle>
              <DialogDescription>
                Set a new payment rate for a team member
              </DialogDescription>
            </DialogHeader>
            
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
                  <Label htmlFor="project_id">Project (Optional)</Label>
                  <Select value={formData.project_id} onValueChange={(value) => setFormData({...formData, project_id: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All projects</SelectItem>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rate_type">Rate Type</Label>
                  <Select value={formData.rate_type} onValueChange={(value) => setFormData({...formData, rate_type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="salary">Monthly Salary</SelectItem>
                      <SelectItem value="bonus">Project Bonus</SelectItem>
                      <SelectItem value="commission">Commission %</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="rate_amount">Amount</Label>
                  <Input
                    id="rate_amount"
                    type="number"
                    step="0.01"
                    value={formData.rate_amount}
                    onChange={(e) => setFormData({...formData, rate_amount: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={formData.currency} onValueChange={(value) => setFormData({...formData, currency: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="effective_from">Effective From</Label>
                  <Input
                    id="effective_from"
                    type="date"
                    value={formData.effective_from}
                    onChange={(e) => setFormData({...formData, effective_from: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="effective_until">Effective Until (Optional)</Label>
                  <Input
                    id="effective_until"
                    type="date"
                    value={formData.effective_until}
                    onChange={(e) => setFormData({...formData, effective_until: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Create Rate
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Payment Rates
          </CardTitle>
          <CardDescription>
            Active payment rates for team members
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Team Member</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Rate Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Effective Period</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rates.map((rate) => (
                <TableRow key={rate.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {rate.profiles?.first_name} {rate.profiles?.last_name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {rate.profiles?.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {rate.projects?.name || 'All projects'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getRateTypeIcon(rate.rate_type)}</span>
                      <span className="capitalize">{rate.rate_type}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {rate.currency} {Number(rate.rate_amount).toLocaleString()}
                      {rate.rate_type === 'hourly' && '/hr'}
                      {rate.rate_type === 'salary' && '/month'}
                      {rate.rate_type === 'commission' && '%'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>From: {format(new Date(rate.effective_from), 'MMM dd, yyyy')}</div>
                      {rate.effective_until && (
                        <div>Until: {format(new Date(rate.effective_until), 'MMM dd, yyyy')}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={rate.is_active ? "default" : "secondary"}>
                      {rate.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(rate)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteRate(rate.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {rates.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No payment rates found. Create your first rate to get started.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingRate} onOpenChange={() => setEditingRate(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Payment Rate</DialogTitle>
            <DialogDescription>
              Update the payment rate details
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit_user_id">Team Member</Label>
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
                <Label htmlFor="edit_rate_type">Rate Type</Label>
                <Select value={formData.rate_type} onValueChange={(value) => setFormData({...formData, rate_type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="salary">Monthly Salary</SelectItem>
                    <SelectItem value="bonus">Project Bonus</SelectItem>
                    <SelectItem value="commission">Commission %</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit_rate_amount">Amount</Label>
                <Input
                  id="edit_rate_amount"
                  type="number"
                  step="0.01"
                  value={formData.rate_amount}
                  onChange={(e) => setFormData({...formData, rate_amount: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit_is_active">Status</Label>
                <Select value={formData.is_active.toString()} onValueChange={(value) => setFormData({...formData, is_active: value === 'true'})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setEditingRate(null)}>
                Cancel
              </Button>
              <Button type="submit">
                Update Rate
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeamPaymentRateManagement;