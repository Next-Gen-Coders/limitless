import React, { useEffect } from "react";
import AppLayout from "./AppLayout";
import Counter from "./Counter";
import { useCounterStore } from "../stores/counterStore";

const TestPage = () => {
  const { loadCounters } = useCounterStore();

  useEffect(() => {
    // Load counters from IndexedDB on component mount
    loadCounters();
  }, [loadCounters]);

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Test Page Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4 font-family-zilla">
            Test Page
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            This is a test page to demonstrate the TanStack Query + Zustand +
            IndexedDB integration. The counter below uses the full stack with
            data persistence.
          </p>
        </div>

        {/* Counter Component */}
        <div className="flex justify-center">
          <Counter id="test-counter" title="Test Counter" />
        </div>

        {/* Additional Test Info */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4 font-family-zilla">
              Integration Features
            </h2>
            <ul className="space-y-2 text-muted-foreground">
              <li>• TanStack Query for data fetching and caching</li>
              <li>• Zustand for client-side state management</li>
              <li>• IndexedDB for data persistence</li>
              <li>• Optimistic updates and error handling</li>
              <li>• Real-time sync between store and database</li>
              <li>• DevTools integration for debugging</li>
            </ul>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default TestPage;
