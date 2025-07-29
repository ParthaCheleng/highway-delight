import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Mail, Lock, User, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SignUpFormProps {
  onSwitchToSignIn: () => void;
  onSignUpSuccess: () => void;
}

export function SignUpForm({ onSwitchToSignIn, onSignUpSuccess }: SignUpFormProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
  if (!formData.firstName || !formData.lastName) {
    toast({ title: "Validation Error", description: "Name is required", variant: "destructive" });
    return false;
  }
  if (!/\S+@\S+\.\S+/.test(formData.email)) {
    toast({ title: "Validation Error", description: "Invalid email", variant: "destructive" });
    return false;
  }
  if (formData.phone && !/^\+?[0-9]{7,15}$/.test(formData.phone)) {
    toast({ title: "Validation Error", description: "Invalid phone number", variant: "destructive" });
    return false;
  }
  if (!formData.password || formData.password.length < 6) {
    toast({ title: "Validation Error", description: "Password must be at least 6 characters", variant: "destructive" });
    return false;
  }
  if (formData.password !== formData.confirmPassword) {
    toast({ title: "Validation Error", description: "Passwords do not match", variant: "destructive" });
    return false;
  }
  return true;
};


  const handleSignUp = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    const { email, password, firstName, lastName } = formData;

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error || !data.user) {
      toast({ title: "Signup Failed", description: error?.message || "Unknown error", variant: "destructive" });
      setIsLoading(false);
      return;
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .upsert({
        id: data.user.id,
        full_name: `${firstName} ${lastName}`,
        email: formData.email,
        phone: formData.phone,
      } satisfies Database["public"]["Tables"]["profiles"]["Insert"]);

    if (profileError) {
      console.error("Profile insert error:", profileError);
    }

    toast({ title: "Success!", description: "Account created. You can now sign in." });
    onSignUpSuccess();
    setIsLoading(false);
  };

  return (
    <Card className="auth-card w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Create Account</CardTitle>
        <CardDescription>Enter your information to sign up</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Input id="firstName" placeholder="First Name" value={formData.firstName} onChange={e => handleInputChange("firstName", e.target.value)} />
          <Input id="lastName" placeholder="Last Name" value={formData.lastName} onChange={e => handleInputChange("lastName", e.target.value)} />
        </div>
        <Input id="email" type="email" placeholder="Email" value={formData.email} onChange={e => handleInputChange("email", e.target.value)} />
        <Input id="phone" placeholder="Phone (optional)" value={formData.phone} onChange={e => handleInputChange("phone", e.target.value)} />
        <Input id="password" type="password" placeholder="Password" value={formData.password} onChange={e => handleInputChange("password", e.target.value)} />
        <Input id="confirmPassword" type="password" placeholder="Confirm Password" value={formData.confirmPassword} onChange={e => handleInputChange("confirmPassword", e.target.value)} />
        <Button onClick={handleSignUp} disabled={isLoading} className="w-full">
          {isLoading ? "Signing up..." : "Create Account"}
        </Button>
        <Separator />
        <Button variant="outline" className="w-full">Continue with Google</Button>
        <p className="text-center text-sm mt-2">
          Already have an account? <span className="text-primary cursor-pointer" onClick={onSwitchToSignIn}>Sign in</span>
        </p>
      </CardContent>
    </Card>
  );
}
