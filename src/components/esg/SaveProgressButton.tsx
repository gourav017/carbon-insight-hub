import { useState, useEffect } from "react";
import { Save, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatLastSaved } from "@/lib/esg/storage";

interface SaveProgressButtonProps {
  onSave: () => void;
  lastSaved: number;
  autoSaving?: boolean;
}

export function SaveProgressButton({ onSave, lastSaved, autoSaving }: SaveProgressButtonProps) {
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    if (autoSaving) {
      setShowSaved(true);
      const timer = setTimeout(() => setShowSaved(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [autoSaving, lastSaved]);

  const handleSave = () => {
    onSave();
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  };

  return (
    <div className="flex items-center gap-4">
      {lastSaved > 0 && (
        <span className="text-sm text-muted-foreground">
          Last saved: {formatLastSaved(lastSaved)}
        </span>
      )}
      <Button
        type="button"
        variant="outline"
        onClick={handleSave}
        disabled={showSaved}
        className="flex items-center gap-2"
      >
        {showSaved ? (
          <>
            <CheckCircle className="w-4 h-4" />
            Saved
          </>
        ) : (
          <>
            <Save className="w-4 h-4" />
            Save Progress
          </>
        )}
      </Button>
    </div>
  );
}
