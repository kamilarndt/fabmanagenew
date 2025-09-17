/**
 * useTimelineAI Hook
 * Manages AI-powered features and smart suggestions for TimelineX
 */

import { useState, useCallback, useEffect } from 'react';
import { aiService, AISuggestion, SmartScheduleOptions } from '../services/aiService';

interface UseTimelineAIOptions {
  items: any[];
  groups: any[];
  constraints?: SmartScheduleOptions;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export function useTimelineAI({
  items,
  groups,
  constraints = {
    workingHours: { start: 9, end: 17 },
    weekends: false,
    holidays: [],
    resourceConstraints: {},
    dependencies: [],
  },
  autoRefresh = false,
  refreshInterval = 30000, // 30 seconds
}: UseTimelineAIOptions) {
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSmartSuggestionsOpen, setIsSmartSuggestionsOpen] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Load suggestions
  const loadSuggestions = useCallback(async () => {
    if (items.length === 0) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const newSuggestions = await aiService.generateSuggestions(items, groups, constraints);
      setSuggestions(newSuggestions);
      setLastUpdate(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load suggestions');
      console.error('AI suggestions error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [items, groups, constraints]);

  // Auto-schedule items
  const autoSchedule = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const scheduledItems = await aiService.autoSchedule(items, constraints);
      return scheduledItems;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to auto-schedule');
      console.error('Auto-schedule error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [items, constraints]);

  // Optimize timeline
  const optimizeTimeline = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await aiService.optimizeTimeline(items, groups, constraints);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to optimize timeline');
      console.error('Timeline optimization error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [items, groups, constraints]);

  // Predict completion
  const predictCompletion = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const prediction = await aiService.predictCompletion(items, groups, constraints);
      return prediction;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to predict completion');
      console.error('Prediction error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [items, groups, constraints]);

  // Apply suggestion
  const applySuggestion = useCallback((suggestion: AISuggestion) => {
    try {
      suggestion.action();
      
      // Remove applied suggestion from list
      setSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
      
      // Refresh suggestions after applying
      setTimeout(() => {
        loadSuggestions();
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to apply suggestion');
      console.error('Apply suggestion error:', err);
    }
  }, [loadSuggestions]);

  // Dismiss suggestion
  const dismissSuggestion = useCallback((suggestionId: string) => {
    setSuggestions(prev => prev.filter(s => s.id !== suggestionId));
  }, []);

  // Clear all suggestions
  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
  }, []);

  // Get suggestions by type
  const getSuggestionsByType = useCallback((type: AISuggestion['type']) => {
    return suggestions.filter(s => s.type === type);
  }, [suggestions]);

  // Get high-priority suggestions
  const getHighPrioritySuggestions = useCallback(() => {
    return suggestions.filter(s => s.impact === 'high' && s.confidence > 0.7);
  }, [suggestions]);

  // Get suggestion statistics
  const getSuggestionStats = useCallback(() => {
    const stats = {
      total: suggestions.length,
      byType: {} as Record<string, number>,
      byImpact: {} as Record<string, number>,
      highConfidence: suggestions.filter(s => s.confidence > 0.8).length,
      highImpact: suggestions.filter(s => s.impact === 'high').length,
    };

    suggestions.forEach(suggestion => {
      stats.byType[suggestion.type] = (stats.byType[suggestion.type] || 0) + 1;
      stats.byImpact[suggestion.impact] = (stats.byImpact[suggestion.impact] || 0) + 1;
    });

    return stats;
  }, [suggestions]);

  // Auto-refresh suggestions
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      loadSuggestions();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, loadSuggestions]);

  // Load suggestions when items change
  useEffect(() => {
    if (items.length > 0) {
      loadSuggestions();
    }
  }, [items.length, loadSuggestions]);

  return {
    // State
    suggestions,
    isLoading,
    error,
    isSmartSuggestionsOpen,
    lastUpdate,
    
    // Actions
    loadSuggestions,
    autoSchedule,
    optimizeTimeline,
    predictCompletion,
    applySuggestion,
    dismissSuggestion,
    clearSuggestions,
    
    // UI state
    setIsSmartSuggestionsOpen,
    
    // Utilities
    getSuggestionsByType,
    getHighPrioritySuggestions,
    getSuggestionStats,
  };
}
