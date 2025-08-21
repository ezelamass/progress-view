import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, Users, CreditCard, Bell, Shield, Database } from "lucide-react";

export default function AdminSettings() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Admin Settings</h1>
        <p className="text-muted-foreground">
          Configure system settings and preferences
        </p>
      </div>

      {/* Settings Categories */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-gradient-card hover:shadow-hover transition-shadow cursor-pointer">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Users className="h-6 w-6 text-primary" />
              <CardTitle className="text-foreground">User Management</CardTitle>
            </div>
            <CardDescription>
              Manage admin users, roles, and permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Configure Users
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card hover:shadow-hover transition-shadow cursor-pointer">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <CreditCard className="h-6 w-6 text-primary" />
              <CardTitle className="text-foreground">Payment Settings</CardTitle>
            </div>
            <CardDescription>
              Configure payment gateways and billing options
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Payment Config
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card hover:shadow-hover transition-shadow cursor-pointer">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Bell className="h-6 w-6 text-primary" />
              <CardTitle className="text-foreground">Notifications</CardTitle>
            </div>
            <CardDescription>
              Set up email notifications and alerts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Notification Settings
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card hover:shadow-hover transition-shadow cursor-pointer">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-primary" />
              <CardTitle className="text-foreground">Security</CardTitle>
            </div>
            <CardDescription>
              Security settings and access controls
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Security Config
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card hover:shadow-hover transition-shadow cursor-pointer">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Database className="h-6 w-6 text-primary" />
              <CardTitle className="text-foreground">Data Management</CardTitle>
            </div>
            <CardDescription>
              Backup, export, and data management tools
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Data Settings
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card hover:shadow-hover transition-shadow cursor-pointer">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Settings className="h-6 w-6 text-primary" />
              <CardTitle className="text-foreground">General Settings</CardTitle>
            </div>
            <CardDescription>
              System preferences and general configuration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              General Config
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Coming Soon Notice */}
      <Card>
        <CardContent className="p-8 text-center">
          <Settings className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">Settings Coming Soon</h3>
          <p className="text-muted-foreground">
            Detailed configuration options will be available in the next update. 
            For now, basic admin functionality is accessible through the other sections.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}