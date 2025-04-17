import React, { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import Navbar from '@/components/Navbar';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  SunMoon, 
  Monitor, 
  Moon, 
  Sun, // Import Sun icon
  Volume2, 
  Eye, 
  Clock,
  Save
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Settings: React.FC = () => {
  const { user, updatePreferences } = useUser();
  const [animationSpeed, setAnimationSpeed] = useState<number>(
    user?.preferences.animationSpeed || 50
  );
  const [soundEnabled, setSoundEnabled] = useState<boolean>(
    user?.preferences.sound || false
  );
  const [darkMode, setDarkMode] = useState<boolean>(
    document.documentElement.classList.contains('dark')
  );
  const [highContrast, setHighContrast] = useState<boolean>(
    user?.preferences.highContrast || false
  );
  const { toast } = useToast();
  
  const handleSaveSettings = () => {
    // In a real app, these would be saved to user preferences
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully",
    });
    
    if (user) {
      updatePreferences({
        theme: darkMode ? 'dark' : 'light',
        animationSpeed,
        sound: soundEnabled,
        highContrast
      });
    }
  };
  
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-3xl">
          Customize your experience by adjusting these settings to match your preferences.
        </p>
        
        <Tabs defaultValue="appearance" className="w-full">
          <TabsList className="grid grid-cols-1 md:grid-cols-3 mb-8">
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="visualization">Visualization</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>
          
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>
                  Customize how CodeWeave looks and feels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-medium">Dark Mode</h4>
                    <p className="text-sm text-muted-foreground">
                      Switch between light and dark themes
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Sun size={18} className="text-muted-foreground" />
                    <Switch 
                      checked={darkMode} 
                      onCheckedChange={toggleDarkMode} 
                    />
                    <Moon size={18} className="text-muted-foreground" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-medium">High Contrast</h4>
                    <p className="text-sm text-muted-foreground">
                      Increase contrast for better visibility
                    </p>
                  </div>
                  <Switch 
                    checked={highContrast} 
                    onCheckedChange={setHighContrast} 
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="visualization">
            <Card>
              <CardHeader>
                <CardTitle>Visualization Settings</CardTitle>
                <CardDescription>
                  Configure how algorithms and data structures are visualized
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Animation Speed</h4>
                    <span className="text-sm text-muted-foreground">
                      {animationSpeed < 30 ? 'Slow' : animationSpeed < 70 ? 'Medium' : 'Fast'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock size={18} className="text-muted-foreground" />
                    <Slider
                      value={[animationSpeed]}
                      max={100}
                      step={1}
                      onValueChange={(value) => setAnimationSpeed(value[0])}
                      className="flex-1"
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-medium">Sound Effects</h4>
                    <p className="text-sm text-muted-foreground">
                      Enable sound effects during visualizations
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Volume2 size={18} className="text-muted-foreground" />
                    <Switch 
                      checked={soundEnabled} 
                      onCheckedChange={setSoundEnabled} 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account and profile information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Username</h4>
                  <p className="text-sm bg-muted p-2 rounded-md">
                    {user?.name || 'Guest User'}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Email</h4>
                  <p className="text-sm bg-muted p-2 rounded-md">
                    {user?.email || 'Not available'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end mt-8">
          <Button onClick={handleSaveSettings}>
            <Save className="mr-2 h-4 w-4" />
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
