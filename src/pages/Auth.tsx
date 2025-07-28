import { useState } from "react";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { SignInForm } from "@/components/auth/SignInForm";

interface AuthProps {
  onAuthSuccess: () => void;
}

export function Auth({ onAuthSuccess }: AuthProps) {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="auth-container flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {isSignUp ? (
          <SignUpForm
            onSwitchToSignIn={() => setIsSignUp(false)}
            onSignUpSuccess={onAuthSuccess}
          />
        ) : (
          <SignInForm
            onSwitchToSignUp={() => setIsSignUp(true)}
            onSignInSuccess={onAuthSuccess}
          />
        )}
      </div>
    </div>
  );
}