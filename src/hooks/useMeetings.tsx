import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

type Meeting = Database['public']['Tables']['meetings']['Row'];
type MeetingInsert = Database['public']['Tables']['meetings']['Insert'];
type MeetingUpdate = Database['public']['Tables']['meetings']['Update'];

export interface MeetingWithProject extends Meeting {
  projects?: {
    id: string;
    name: string;
    clients?: {
      company: string;
    };
  };
}

export const useMeetings = (projectId?: string) => {
  const [meetings, setMeetings] = useState<MeetingWithProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('meetings')
        .select(`
          *,
          projects:project_id (
            id,
            name,
            clients:client_id (
              company
            )
          )
        `)
        .order('meeting_date', { ascending: false });

      if (projectId) {
        query = query.eq('project_id', projectId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setMeetings(data || []);
    } catch (error) {
      console.error('Error fetching meetings:', error);
      toast({
        title: "Error",
        description: "Failed to fetch meetings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createMeeting = async (meetingData: MeetingInsert) => {
    try {
      setSubmitting(true);
      const { error } = await supabase
        .from('meetings')
        .insert(meetingData);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Meeting created successfully",
      });

      await fetchMeetings();
      return true;
    } catch (error) {
      console.error('Error creating meeting:', error);
      toast({
        title: "Error",
        description: "Failed to create meeting",
        variant: "destructive",
      });
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const updateMeeting = async (id: string, meetingData: MeetingUpdate) => {
    try {
      setSubmitting(true);
      const { error } = await supabase
        .from('meetings')
        .update(meetingData)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Meeting updated successfully",
      });

      await fetchMeetings();
      return true;
    } catch (error) {
      console.error('Error updating meeting:', error);
      toast({
        title: "Error",
        description: "Failed to update meeting",
        variant: "destructive",
      });
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const deleteMeeting = async (id: string) => {
    try {
      setSubmitting(true);
      const { error } = await supabase
        .from('meetings')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Meeting deleted successfully",
      });

      await fetchMeetings();
      return true;
    } catch (error) {
      console.error('Error deleting meeting:', error);
      toast({
        title: "Error",
        description: "Failed to delete meeting",
        variant: "destructive",
      });
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, [projectId]);

  return {
    meetings,
    loading,
    submitting,
    createMeeting,
    updateMeeting,
    deleteMeeting,
    refetch: fetchMeetings,
  };
};