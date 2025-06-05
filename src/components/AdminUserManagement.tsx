import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, UserPlus, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface User {
  id: string;
  username: string | null;
  display_name: string | null;
  role: string | null;
  created_at: string;
}

const AdminUserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [roleFilter, setRoleFilter] = useState('all');
  const [showAlert, setShowAlert] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [alertForm, setAlertForm] = useState({
    title: '',
    message: ''
  });

  const PAGE_SIZE = 10;

  useEffect(() => {
    loadUsers();
  }, [currentPage, searchTerm, roleFilter]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      // Build query
      let query = supabase
        .from('profiles')
        .select(`
          id,
          username,
          display_name,
          role,
          created_at
        `, { count: 'exact' });

      // Apply filters
      if (searchTerm) {
        query = query.or(`username.ilike.%${searchTerm}%,display_name.ilike.%${searchTerm}%`);
      }

      if (roleFilter !== 'all') {
        query = query.eq('role', roleFilter);
      }

      // Apply pagination
      const from = (currentPage - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      
      const { data, count, error } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      setUsers(data || []);
      setTotalPages(Math.ceil((count || 0) / PAGE_SIZE));
    } catch (error: any) {
      toast.error('Failed to load users: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;
      
      toast.success('User role updated successfully!');
      loadUsers();
    } catch (error: any) {
      toast.error('Failed to update user role: ' + error.message);
    }
  };

  const sendAlert = async () => {
    if (!selectedUser) return;

    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) return;

      const { error } = await supabase
        .from('user_alerts')
        .insert({
          admin_id: currentUser.id,
          user_id: selectedUser.id,
          title: alertForm.title,
          message: alertForm.message
        });

      if (error) throw error;
      
      toast.success('Alert sent successfully!');
      setShowAlert(false);
      setAlertForm({ title: '', message: '' });
    } catch (error: any) {
      toast.error('Failed to send alert: ' + error.message);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            User Management
          </CardTitle>
          <CardDescription>
            Manage users, roles, and send alerts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Filters */}
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search by username or display name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="moderator">Moderator</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Users Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      Loading users...
                    </TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {user.display_name || 'No display name'}
                          </div>
                          <div className="text-sm text-muted-foreground truncate">
                            {user.id.slice(0, 8)}...
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.username || 'No username'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          user.role === 'admin' ? 'destructive' :
                          user.role === 'moderator' ? 'default' : 'secondary'
                        }>
                          {user.role || 'user'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {formatDate(user.created_at)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Select 
                            value={user.role || 'user'} 
                            onValueChange={(value) => updateUserRole(user.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">User</SelectItem>
                              <SelectItem value="moderator">Moderator</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedUser(user);
                              setShowAlert(true);
                            }}
                          >
                            <MessageSquare className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {Math.min((currentPage - 1) * PAGE_SIZE + 1, users.length)} to{' '}
              {Math.min(currentPage * PAGE_SIZE, users.length)} of {users.length} users
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Send Alert Dialog */}
      <Dialog open={showAlert} onOpenChange={setShowAlert}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Alert to User</DialogTitle>
            <DialogDescription>
              Send a custom alert message to {selectedUser?.display_name || selectedUser?.username || 'this user'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="alert_title">Alert Title</Label>
              <Input
                id="alert_title"
                value={alertForm.title}
                onChange={(e) => setAlertForm({...alertForm, title: e.target.value})}
                placeholder="Enter alert title"
              />
            </div>
            <div>
              <Label htmlFor="alert_message">Message</Label>
              <Textarea
                id="alert_message"
                value={alertForm.message}
                onChange={(e) => setAlertForm({...alertForm, message: e.target.value})}
                placeholder="Enter your message"
                rows={4}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={sendAlert} disabled={!alertForm.title || !alertForm.message}>
                Send Alert
              </Button>
              <Button variant="outline" onClick={() => setShowAlert(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUserManagement;