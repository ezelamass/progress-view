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
      <Card className="bg-gradient-card border-border/50 shadow-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">Meeting History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!project) {
    return (
      <Card className="bg-gradient-card border-border/50 shadow-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">Meeting History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="text-muted-foreground mb-2">📹</div>
              <p className="text-sm text-muted-foreground">
                Select a project to view meeting history
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const recentMeetings = meetings.slice(0, 5);

  return (
    <Card className="bg-gradient-card border-border/50 shadow-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">Meeting History</CardTitle>
      </CardHeader>
      <CardContent>
        {recentMeetings.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="text-muted-foreground mb-2">📹</div>
              <p className="text-sm text-muted-foreground">
                No meetings recorded yet
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {recentMeetings.map((meeting) => (
              <div
                key={meeting.id}
                className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 p-3 rounded-lg hover:bg-secondary/20 transition-colors"
              >
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Video className="h-4 w-4 text-primary" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {meeting.title}
                      </p>
                      {meeting.description && (
                        <p className="text-sm text-muted-foreground mt-1 overflow-hidden">
                          {meeting.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <p className="text-xs text-muted-foreground whitespace-nowrap hidden sm:block">
                        {format(new Date(meeting.meeting_date), 'MMM dd, yyyy')}
                      </p>
                      <Badge 
                        variant="outline"
                        className="text-xs flex-shrink-0 ml-0 bg-primary/20 text-primary border-primary/30"
                      >
                        <Calendar className="h-3 w-3 mr-1" />
                        {format(new Date(meeting.meeting_date), 'MMM dd')}
                      </Badge>
                    </div>
                  </div>

                  {meeting.recording_url && (
                    <div className="mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full sm:w-auto"
                        onClick={() => window.open(meeting.recording_url!, '_blank')}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Watch Recording
                      </Button>
                      {/* show full date under the button on small screens */}
                      <p className="text-xs text-muted-foreground mt-2 block sm:hidden">
                        {format(new Date(meeting.meeting_date), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};