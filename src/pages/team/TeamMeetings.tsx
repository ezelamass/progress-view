import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useMeetings } from "@/hooks/useMeetings";
import { useProject } from "@/contexts/ProjectContext";
import { Calendar, ExternalLink, Video } from "lucide-react";
import { format } from "date-fns";
import ProjectBreadcrumb from "@/components/ProjectBreadcrumb";

export default function TeamMeetings() {
  const { selectedProject } = useProject();
  const { meetings, loading } = useMeetings();

  // Filter meetings for the selected project
  const projectMeetings = meetings.filter(m => m.project_id === selectedProject?.id);

  if (!selectedProject) {
    return (
      <div className="space-y-6">
        <ProjectBreadcrumb pageName="Meetings" />
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No Project Selected</h3>
              <p className="text-muted-foreground">
                Please select a project to view meetings.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProjectBreadcrumb pageName="Meetings" />
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Project Meetings</h1>
          <p className="text-muted-foreground">
            View meetings for {selectedProject.name}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            Meetings ({projectMeetings.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading meetings...</div>
          ) : projectMeetings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No meetings found</h3>
              <p className="text-muted-foreground">
                No meetings have been scheduled for this project yet.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Recording</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projectMeetings.map((meeting) => (
                  <TableRow key={meeting.id}>
                    <TableCell>
                      <div className="font-medium">{meeting.title}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        <Calendar className="h-3 w-3 mr-1" />
                        {format(new Date(meeting.meeting_date), 'MMM dd, yyyy')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {meeting.recording_url ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(meeting.recording_url!, '_blank')}
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          View Recording
                        </Button>
                      ) : (
                        <span className="text-muted-foreground text-sm">No recording</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        {meeting.description ? (
                          <p className="text-sm text-muted-foreground truncate">
                            {meeting.description}
                          </p>
                        ) : (
                          <span className="text-muted-foreground text-sm">No description</span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}