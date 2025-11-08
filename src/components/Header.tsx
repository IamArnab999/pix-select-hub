import { Search, LogOut, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  selectedCount: number;
}

export const Header = ({ selectedCount }: HeaderProps) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <header className="bg-card border-b border-border shadow-soft sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-primary rounded-xl">
              <Search className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              ImageVault
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {selectedCount > 0 && (
              <Badge variant="secondary" className="px-4 py-2 bg-accent text-accent-foreground">
                <CheckSquare className="w-4 h-4 mr-2" />
                Selected: {selectedCount} {selectedCount === 1 ? 'image' : 'images'}
              </Badge>
            )}
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
