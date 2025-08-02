import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  useCounter,
  useIncrementCounter,
  useDecrementCounter,
  useUpdateCounter,
  useResetCounter,
} from "../hooks/useCounterQuery";
import { useCounterStore } from "../stores/counterStore";
import { Plus, Minus, RotateCcw, Save } from "lucide-react";

interface CounterProps {
  id: string;
  title?: string;
}

const Counter: React.FC<CounterProps> = ({ id, title = "Counter" }) => {
  const [inputValue, setInputValue] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // TanStack Query hooks
  const { data: counter, isLoading, error } = useCounter(id);
  const incrementMutation = useIncrementCounter();
  const decrementMutation = useDecrementCounter();
  const updateMutation = useUpdateCounter();
  const resetMutation = useResetCounter();

  // Zustand store
  const {
    getCounter,
    isLoading: storeLoading,
    error: storeError,
  } = useCounterStore();
  const storeValue = getCounter(id);

  const handleIncrement = () => {
    incrementMutation.mutate(id);
  };

  const handleDecrement = () => {
    decrementMutation.mutate(id);
  };

  const handleReset = () => {
    resetMutation.mutate(id);
  };

  const handleSetValue = () => {
    const value = parseInt(inputValue);
    if (!isNaN(value)) {
      updateMutation.mutate({ id, value });
      setInputValue("");
      setIsEditing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSetValue();
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-sm">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
            <div className="h-8 bg-muted rounded w-1/2 mb-4"></div>
            <div className="flex space-x-2">
              <div className="h-10 bg-muted rounded flex-1"></div>
              <div className="h-10 bg-muted rounded flex-1"></div>
              <div className="h-10 bg-muted rounded flex-1"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-sm border-destructive">
        <CardContent className="p-6">
          <p className="text-destructive text-center">Error loading counter</p>
        </CardContent>
      </Card>
    );
  }

  const currentValue = counter?.value || 0;
  const isMutating =
    incrementMutation.isPending ||
    decrementMutation.isPending ||
    updateMutation.isPending ||
    resetMutation.isPending;

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-center font-family-zilla">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Value Display */}
        <div className="text-center">
          <div className="text-4xl font-bold text-foreground mb-2">
            {currentValue}
          </div>
          <div className="text-sm text-muted-foreground">
            Store Value: {storeValue} | DB Value: {currentValue}
          </div>
        </div>

        {/* Error Display */}
        {(storeError || incrementMutation.error || decrementMutation.error) && (
          <div className="text-sm text-destructive text-center p-2 bg-destructive/10 rounded">
            {storeError ||
              incrementMutation.error?.message ||
              decrementMutation.error?.message}
          </div>
        )}

        {/* Controls */}
        <div className="flex space-x-2">
          <Button
            onClick={handleDecrement}
            disabled={isMutating}
            variant="outline"
            className="flex-1"
          >
            <Minus size={16} />
          </Button>

          <Button
            onClick={handleIncrement}
            disabled={isMutating}
            variant="outline"
            className="flex-1"
          >
            <Plus size={16} />
          </Button>

          <Button
            onClick={handleReset}
            disabled={isMutating}
            variant="outline"
            size="sm"
          >
            <RotateCcw size={16} />
          </Button>
        </div>

        {/* Set Value Input */}
        <div className="space-y-2">
          {isEditing ? (
            <div className="flex space-x-2">
              <Input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter value"
                className="flex-1"
              />
              <Button
                onClick={handleSetValue}
                disabled={isMutating || !inputValue}
                size="sm"
              >
                <Save size={16} />
              </Button>
              <Button
                onClick={() => {
                  setIsEditing(false);
                  setInputValue("");
                }}
                variant="outline"
                size="sm"
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              className="w-full"
            >
              Set Value
            </Button>
          )}
        </div>

        {/* Status */}
        <div className="text-xs text-muted-foreground text-center">
          {isMutating ? "Updating..." : "Ready"}
        </div>
      </CardContent>
    </Card>
  );
};

export default Counter;
