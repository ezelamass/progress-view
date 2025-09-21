import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  user_id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role: 'admin' | 'client' | 'team';
  created_at: string;
  updated_at: string;
}

interface CreateUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'client' | 'team';
}

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        toast({
          title: "Error",
          description: "Failed to fetch users.",
          variant: "destructive"
        });
        return;
      }

      setUsers(data || []);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch users.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (userData: CreateUserData) => {
    try {
      // First, create the user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            role: userData.role
          },
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (authError) {
        throw new Error(authError.message);
      }

      if (!authData.user) {
        throw new Error('Failed to create user account');
      }

      // The profile will be created automatically via the trigger
      // Let's wait a moment and then refresh the users list
      setTimeout(() => {
        fetchUsers();
      }, 1000);

      return authData.user;
    } catch (error: any) {
      console.error('Error creating user:', error);
      throw error;
    }
  };

  const updateUserRole = async (userId: string, newRole: 'admin' | 'client' | 'team') => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole, updated_at: new Date().toISOString() })
        .eq('id', userId);

      if (error) {
        throw new Error(error.message);
      }

      // Update local state
      setUsers(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, role: newRole, updated_at: new Date().toISOString() }
          : user
      ));
    } catch (error: any) {
      console.error('Error updating user role:', error);
      throw error;
    }
  };

  const refetch = () => {
    fetchUsers();
  };

  useEffect(() => {
    fetchUsers();

    // Set up real-time subscription for profiles table
    const subscription = supabase
      .channel('profiles_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'profiles'
      }, () => {
        fetchUsers();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    users,
    loading,
    createUser,
    updateUserRole,
    refetch
  };
};