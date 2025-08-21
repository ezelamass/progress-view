import { Calendar, FileText, CreditCard, Folder } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const QuickActions = () => {
  const paymentHistory = [
    { date: "Jan 15, 2024", amount: "$5,000", status: "Paid", method: "Bank Transfer" },
    { date: "Dec 15, 2023", amount: "$5,000", status: "Paid", method: "Bank Transfer" },
    { date: "Nov 15, 2023", amount: "$5,000", status: "Paid", method: "Credit Card" },
    { date: "Oct 15, 2023", amount: "$5,000", status: "Paid", method: "Bank Transfer" },
  ];

  const actions = [
    {
      icon: Calendar,
      label: "Schedule Follow-up",
      description: "Book a meeting",
      action: () => window.open("https://calendly.com", "_blank"),
      variant: "default" as const,
    },
    {
      icon: FileText,
      label: "View Deliverables",
      description: "See project outputs",
      action: () => console.log("Navigate to deliverables"),
      variant: "outline" as const,
    },
    {
      icon: Folder,
      label: "Manage Files",
      description: "Access project files",
      action: () => window.open("https://drive.google.com", "_blank"),
      variant: "outline" as const,
    },
  ];

  return (
    <Card className="bg-gradient-card border-border/50 shadow-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant={action.variant}
            className="w-full justify-start h-auto p-4"
            onClick={action.action}
          >
            <action.icon className="h-5 w-5 mr-3" />
            <div className="text-left">
              <div className="font-medium">{action.label}</div>
              <div className="text-xs text-muted-foreground">{action.description}</div>
            </div>
          </Button>
        ))}
        
        {/* Payment History Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full justify-start h-auto p-4">
              <CreditCard className="h-5 w-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">Payment History</div>
                <div className="text-xs text-muted-foreground">View all transactions</div>
              </div>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Payment History</DialogTitle>
              <DialogDescription>
                Complete record of all payments and transactions
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              {paymentHistory.map((payment, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-border bg-card/50">
                  <div>
                    <div className="font-medium text-foreground">{payment.amount}</div>
                    <div className="text-sm text-muted-foreground">{payment.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-success">{payment.status}</div>
                    <div className="text-xs text-muted-foreground">{payment.method}</div>
                  </div>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default QuickActions;