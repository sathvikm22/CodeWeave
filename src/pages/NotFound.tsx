
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 flex items-center justify-center rounded-full bg-muted text-muted-foreground">
            <FileQuestion size={48} />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8">Page not found</p>
        <Link to="/">
          <Button>Return to Home</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
