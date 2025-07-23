import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const Register = () => {
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleRegister = async () => {
    try {
      await login(); // Azure AD B2C handles both login and registration
      toast.success("Account created successfully!");
    } catch (error) {
      toast.error("Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen gradient-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Link to="/" className="flex items-center text-blue-600 hover:text-blue-700 transition-colors hover-glow">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <Card className="glass-card hover-glow">
          <CardHeader className="text-center">
            <div className="w-12 h-12 gradient-primary rounded-full mx-auto mb-4 shadow-lg"></div>
            <CardTitle className="text-2xl font-bold text-gradient">Create Your Account</CardTitle>
            <CardDescription className="text-muted-foreground">
              Join the SnackTrack community with your Microsoft account
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <Button 
              onClick={handleRegister} 
              className="w-full gradient-primary hover-glow text-white shadow-lg" 
              disabled={isLoading}
              size="lg"
            >
              {isLoading ? "Creating Account..." : "Create Account with Microsoft"}
            </Button>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Secure authentication powered by Azure AD B2C
              </p>
            </div>

            <div className="text-center">
              <p className="text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-600 hover:underline font-semibold">
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;