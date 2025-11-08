import { TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TopSearchesProps {
  searches: Array<{ term: string; count: number }>;
  onSearchClick: (term: string) => void;
}

export const TopSearches = ({ searches, onSearchClick }: TopSearchesProps) => {
  if (!searches.length) return null;

  return (
    <div className="bg-card rounded-2xl p-6 shadow-soft border border-border">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-accent" />
        <h2 className="text-lg font-semibold">Trending Searches</h2>
      </div>
      <div className="flex flex-wrap gap-2">
        {searches.map((search, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors px-4 py-2 text-sm"
            onClick={() => onSearchClick(search.term)}
          >
            {search.term}
            <span className="ml-2 text-xs opacity-70">({search.count})</span>
          </Badge>
        ))}
      </div>
    </div>
  );
};
