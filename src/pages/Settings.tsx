
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTheme } from '@/hooks/use-theme';

const Settings: React.FC = () => {
  const { theme, setTheme } = useTheme();
  
  return (
    <div className="container max-w-4xl mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize how CodeWeave looks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="theme">Dark Mode</Label>
              <p className="text-sm text-muted-foreground">
                Switch between dark and light theme
              </p>
            </div>
            <Switch 
              id="theme"
              checked={theme === 'dark'} 
              onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Visualization Preferences</CardTitle>
          <CardDescription>Adjust how visualizations behave</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="animations">Animations</Label>
              <p className="text-sm text-muted-foreground">
                Enable or disable animations
              </p>
            </div>
            <Switch id="animations" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="descriptions">Show Descriptions</Label>
              <p className="text-sm text-muted-foreground">
                Show text descriptions during visualization steps
              </p>
            </div>
            <Switch id="descriptions" defaultChecked />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
          <CardDescription>Manage your account preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="save-progress">Save Progress</Label>
              <p className="text-sm text-muted-foreground">
                Save your learning progress locally
              </p>
            </div>
            <Switch id="save-progress" defaultChecked />
          </div>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2">
          <p className="text-sm text-muted-foreground">
            Account data is stored locally in your browser
          </p>
          <Button variant="destructive" size="sm">Reset All Progress</Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>About CodeWeave</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>Version 1.0.0</p>
          <p className="text-sm text-muted-foreground">
            CodeWeave is an interactive platform for visualizing data structures and algorithms.
            Created to help students, educators, and programming enthusiasts understand complex 
            computer science concepts through visual representation.
          </p>
        </CardContent>
        <CardFooter>
          <Button variant="outline" asChild>
            <a href="#" target="_blank" rel="noopener noreferrer">GitHub Repository</a>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Settings;
