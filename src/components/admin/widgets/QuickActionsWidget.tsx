import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AddClientButton from "../buttons/AddClientButton";
import CreateProjectButton from "../buttons/CreateProjectButton";
import RecordPaymentButton from "../buttons/RecordPaymentButton";
import AddDeliverableButton from "../buttons/AddDeliverableButton";
import { Zap } from "lucide-react";

interface QuickActionsWidgetProps {
  onClientAdded?: (client: any) => void;
  onProjectCreated?: (project: any) => void;
  onPaymentRecorded?: (payment: any) => void;
  onDeliverableAdded?: (deliverable: any) => void;
}

export default function QuickActionsWidget({
  onClientAdded,
  onProjectCreated,
  onPaymentRecorded,
  onDeliverableAdded
}: QuickActionsWidgetProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Add New Client */}
          <div className="flex flex-col">
            <AddClientButton 
              onClientAdded={onClientAdded}
              variant="default"
              size="default"
            >
              Add New Client
            </AddClientButton>
            <p className="text-sm text-muted-foreground mt-2">
              Create a new client profile and begin your relationship
            </p>
          </div>

          {/* Create Project */}
          <div className="flex flex-col">
            <CreateProjectButton
              onProjectCreated={onProjectCreated}
              variant="outline"
              size="default"
            >
              Create Project
            </CreateProjectButton>
            <p className="text-sm text-muted-foreground mt-2">
              Start a new project with phases and ROI configuration
            </p>
          </div>

          {/* Record Payment */}
          <div className="flex flex-col">
            <RecordPaymentButton
              onPaymentRecorded={onPaymentRecorded}
              variant="outline"
              size="default"
            >
              Record Payment
            </RecordPaymentButton>
            <p className="text-sm text-muted-foreground mt-2">
              Log incoming payments and track financial progress
            </p>
          </div>

          {/* Add Deliverable */}
          <div className="flex flex-col">
            <AddDeliverableButton
              onDeliverableAdded={onDeliverableAdded}
              variant="outline"
              size="default"
            >
              Add Deliverable
            </AddDeliverableButton>
            <p className="text-sm text-muted-foreground mt-2">
              Create project deliverables and track milestones
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}