import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Mail, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SignInFormProps {
  onSwitchToSignUp: () => void;
  onSignInSuccess: () => void;
}

export function SignInForm({ onSwitchToSignUp, onSignInSuccess }: SignInFormProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return false;
    }
    if (!formData.password.trim()) {
      toast({
        title: "Validation Error",
        description: "Password is required",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const handleSignIn = async () => {
  if (!validateForm()) return;

  setIsLoading(true);
  const { email, password } = formData;

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    toast({ title: "Login Failed", description: error.message, variant: "destructive" });
    setIsLoading(false);
    return;
  }

  toast({ title: "Welcome back!", description: "You have been signed in successfully." });
  onSignInSuccess();
  setIsLoading(false);
};



  const handleForgotPassword = () => {
    if (!formData.email.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your email address first",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Password Reset Email Sent",
      description: "Check your email for password reset instructions",
    });
  };

  return (
    <Card className="auth-card w-full max-w-md mx-auto">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-semibold">Welcome back</CardTitle>
        <CardDescription>
          Enter your credentials to sign in to your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className="input-field pl-10"
              onKeyPress={(e) => e.key === 'Enter' && handleSignIn()}
            />
          </div>
        </div>

        <Button 
          onClick={handleSignIn}
          disabled={isLoading}
          className="primary-button w-full"
        >
          {isLoading ? "Signing In..." : "Sign In"}
        </Button>


        <div className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <button
            type="button"
            className="text-primary hover:underline font-medium"
            onClick={onSwitchToSignUp}
          >
            Sign up
          </button>
        </div>
      </CardContent>
    </Card>
  );
}