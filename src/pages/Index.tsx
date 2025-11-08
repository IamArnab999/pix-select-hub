import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";
import { TopSearches } from "@/components/TopSearches";
import { ImageGrid } from "@/components/ImageGrid";
import { SearchHistory } from "@/components/SearchHistory";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface Image {
  id: string;
  urls: { small: string; regular: string };
  alt_description: string;
  user: { name: string };
}

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [images, setImages] = useState<Image[]>([]);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [topSearches, setTopSearches] = useState<Array<{ term: string; count: number }>>([]);
  const [searchHistory, setSearchHistory] = useState<Array<{ term: string; timestamp: string }>>([]);
  const [currentSearchTerm, setCurrentSearchTerm] = useState("");

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
      
      if (!session) {
        navigate("/auth");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
      
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      fetchTopSearches();
      fetchSearchHistory();
    }
  }, [user]);

  const fetchTopSearches = async () => {
    const { data, error } = await supabase.functions.invoke("top-searches");
    if (error) {
      console.error("Error fetching top searches:", error);
    } else if (data) {
      setTopSearches(data);
    }
  };

  const fetchSearchHistory = async () => {
    const { data, error } = await supabase.functions.invoke("search-history");
    if (error) {
      console.error("Error fetching search history:", error);
    } else if (data) {
      setSearchHistory(data);
    }
  };

  const handleSearch = async (term: string) => {
    setIsSearching(true);
    setCurrentSearchTerm(term);
    setSelectedImages(new Set());

    try {
      const { data, error } = await supabase.functions.invoke("image-search", {
        body: { term },
      });

      if (error) throw error;

      setImages(data.results || []);
      
      toast({
        title: "Search complete",
        description: `Found ${data.total || 0} results for "${term}"`,
      });

      fetchTopSearches();
      fetchSearchHistory();
    } catch (error) {
      console.error("Search error:", error);
      toast({
        title: "Search failed",
        description: "Unable to search images. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleImageSelect = (id: string, checked: boolean) => {
    setSelectedImages((prev) => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      return newSet;
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-bg flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-bg">
      <Header selectedCount={selectedImages.size} />

      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">Discover Beautiful Images</h2>
            <p className="text-muted-foreground">
              Search millions of high-quality photos from Unsplash
            </p>
          </div>
          <SearchBar onSearch={handleSearch} isLoading={isSearching} />
        </div>

        {topSearches.length > 0 && (
          <TopSearches searches={topSearches} onSearchClick={handleSearch} />
        )}

        {currentSearchTerm && (
          <div className="bg-card rounded-2xl p-4 shadow-soft border border-border">
            <p className="text-center text-lg">
              You searched for <span className="font-bold text-primary">"{currentSearchTerm}"</span> — {images.length} results
            </p>
          </div>
        )}

        {isSearching ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : images.length > 0 ? (
          <ImageGrid
            images={images}
            selectedImages={selectedImages}
            onImageSelect={handleImageSelect}
          />
        ) : null}

        {searchHistory.length > 0 && (
          <SearchHistory history={searchHistory} onHistoryClick={handleSearch} />
        )}
      </main>
    </div>
  );
};

export default Index;
