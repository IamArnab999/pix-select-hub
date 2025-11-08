import { History, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface SearchHistoryItem {
  term: string;
  timestamp: string;
}

interface SearchHistoryProps {
  history: SearchHistoryItem[];
  onHistoryClick: (term: string) => void;
}

export const SearchHistory = ({ history, onHistoryClick }: SearchHistoryProps) => {
  if (!history.length) return null;

  return (
    <div className="bg-card rounded-2xl p-6 shadow-soft border border-border">
      <div className="flex items-center gap-2 mb-4">
        <History className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold">Your Search History</h2>
      </div>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {history.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary cursor-pointer transition-colors group"
            onClick={() => onHistoryClick(item.term)}
          >
            <span className="font-medium group-hover:text-primary transition-colors">
              {item.term}
            </span>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
