import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl mb-4 shadow-medium">
            <Search className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
            ImageVault
          </h1>
          <p className="text-muted-foreground">
            Discover and collect beautiful images
          </p>
        </div>

        <div className="bg-card rounded-2xl shadow-medium p-8">
          <SupabaseAuth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: 'hsl(189 85% 45%)',
                    brandAccent: 'hsl(189 75% 55%)',
                  },
                  radii: {
                    borderRadiusButton: '0.75rem',
                    inputBorderRadius: '0.75rem',
                  },
                },
              },
            }}
            providers={["google", "github", "facebook"]}
            redirectTo={`${window.location.origin}/`}
          />
        </div>
      </div>
    </div>
  );
};

export default Auth;
