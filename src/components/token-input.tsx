"use client";

import { useState } from "react";
import { ChevronDown, ExternalLink, Eye, EyeOff, Key } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TokenInputProps {
  onTokenChange: (token: string | null) => void;
  disabled?: boolean;
  required?: boolean;
}

export function TokenInput({ onTokenChange, disabled = false, required = false }: TokenInputProps) {
  const [isExpanded, setIsExpanded] = useState(required);
  const [token, setToken] = useState("");
  const [showToken, setShowToken] = useState(false);

  const handleTokenChange = (value: string) => {
    setToken(value);
    onTokenChange(value.trim() || null);
  };

  const handleClear = () => {
    setToken("");
    onTokenChange(null);
  };

  if (!isExpanded && !required) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        disabled={disabled}
        className="text-muted-foreground hover:text-foreground inline-flex cursor-pointer items-center gap-1.5 text-sm transition-colors disabled:opacity-50"
      >
        <Key className="h-3.5 w-3.5" />
        Add token for more requests
        <ChevronDown className="h-3.5 w-3.5" />
      </button>
    );
  }

  return (
    <div className="w-full space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            type={showToken ? "text" : "password"}
            value={token}
            onChange={(e) => handleTokenChange(e.target.value)}
            placeholder="ghp_xxxxxxxxxxxx"
            disabled={disabled}
            className="pr-10 font-mono text-sm"
          />
          <button
            type="button"
            onClick={() => setShowToken(!showToken)}
            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
            tabIndex={-1}
          >
            {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {token && (
          <Button variant="ghost" size="sm" onClick={handleClear} disabled={disabled}>
            Clear
          </Button>
        )}
      </div>

      <div className="text-muted-foreground space-y-2 text-xs">
        <p>
          <strong className="text-foreground/80">Why?</strong> GitHub limits unauthenticated
          requests to 60/hour. A token increases this to 5,000/hour.
        </p>
        <p>
          <strong className="text-foreground/80">Is it safe?</strong> Your token stays in your
          browser and is never stored or sent anywhere except GitHub.
        </p>
        <p>
          <a
            href="https://github.com/settings/tokens/new?description=starcorn&scopes="
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary inline-flex items-center gap-1 hover:underline"
          >
            Create a token (no scopes needed)
            <ExternalLink className="h-3 w-3" />
          </a>
        </p>
      </div>

      {!required && (
        <button
          onClick={() => {
            setIsExpanded(false);
            handleClear();
          }}
          className="text-muted-foreground hover:text-foreground cursor-pointer text-xs"
        >
          Hide
        </button>
      )}
    </div>
  );
}
