import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMeetings } from "@/hooks/useMeetings";
import { useProjectOptional } from "@/contexts/ProjectContext";
import { Calendar, ExternalLink, Video } from "lucide-react";
import { format } from "date-fns";

export const MeetingHistory = () => {
  const projectContext = useProjectOptional();
  const project = projectContext?.selectedProject;
  const { meetings, loading } = useMeetings(project?.id);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            Meeting History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!project) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            Meeting History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Select a project to view meeting history
          </p>
        </CardContent>
      </Card>
    );
  }

  const recentMeetings = meetings.slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="h-5 w-5" />
          Meeting History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recentMeetings.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No meetings recorded yet
          </p>
        ) : (
          <div className="space-y-3">
            {recentMeetings.map((meeting) => (
              <div
                key={meeting.id}
                className="border rounded-lg p-3 space-y-2"
              >
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-sm">{meeting.title}</h4>
                  <Badge variant="secondary" className="text-xs">
                    <Calendar className="h-3 w-3 mr-1" />
                    {format(new Date(meeting.meeting_date), 'MMM dd')}
                  </Badge>
                </div>
                
                {meeting.description && (
                  <p className="text-xs text-muted-foreground">
                    {meeting.description}
                  </p>
                )}
                
                {meeting.recording_url && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => window.open(meeting.recording_url!, '_blank')}
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Watch Recording
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};