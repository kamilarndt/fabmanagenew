/**
 * TimelineSmartSuggestions Component
 * Displays AI-powered suggestions and recommendations for timeline optimization
 */

import React, { useState, useEffect, useCallback } from 'react';
import { aiService, AISuggestion, SmartScheduleOptions } from '../services/aiService';

interface TimelineSmartSuggestionsProps {
  items: any[];
  groups: any[];
  isOpen: boolean;
  onClose: () => void;
  onApplySuggestion: (suggestion: AISuggestion) => void;
  onAutoSchedule: (scheduledItems: any[]) => void;
  onOptimize: (optimizedItems: any[]) => void;
  constraints?: SmartScheduleOptions;
}

export function TimelineSmartSuggestions({
  items,
  groups,
  isOpen,
  onClose,
  onApplySuggestion,
  onAutoSchedule,
  onOptimize,
  constraints = {
    workingHours: { start: 9, end: 17 },
    weekends: false,
    holidays: [],
    resourceConstraints: {},
    dependencies: [],
  },
}: TimelineSmartSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'suggestions' | 'auto-schedule' | 'optimize' | 'predict'>('suggestions');
  const [prediction, setPrediction] = useState<any>(null);

  const loadSuggestions = useCallback(async () => {
    if (!isOpen) return;
    
    setIsLoading(true);
    try {
      const newSuggestions = await aiService.generateSuggestions(items, groups, constraints);
      setSuggestions(newSuggestions);
    } catch (error) {
      console.error('Failed to load suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  }, [items, groups, constraints, isOpen]);

  const handleAutoSchedule = useCallback(async () => {
    setIsLoading(true);
    try {
      const scheduledItems = await aiService.autoSchedule(items, constraints);
      onAutoSchedule(scheduledItems);
    } catch (error) {
      console.error('Failed to auto-schedule:', error);
    } finally {
      setIsLoading(false);
    }
  }, [items, constraints, onAutoSchedule]);

  const handleOptimize = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await aiService.optimizeTimeline(items, groups, constraints);
      // Apply the first few high-confidence suggestions
      const highConfidenceSuggestions = result.improvements
        .filter(s => s.confidence > 0.7)
        .slice(0, 5);
      
      for (const suggestion of highConfidenceSuggestions) {
        suggestion.action();
      }
      
      onOptimize(items); // In a real implementation, this would return optimized items
    } catch (error) {
      console.error('Failed to optimize:', error);
    } finally {
      setIsLoading(false);
    }
  }, [items, groups, constraints, onOptimize]);

  const handlePredict = useCallback(async () => {
    setIsLoading(true);
    try {
      const predictionResult = await aiService.predictCompletion(items, groups, constraints);
      setPrediction(predictionResult);
    } catch (error) {
      console.error('Failed to predict completion:', error);
    } finally {
      setIsLoading(false);
    }
  }, [items, groups, constraints]);

  useEffect(() => {
    if (isOpen) {
      loadSuggestions();
    }
  }, [loadSuggestions, isOpen]);

  if (!isOpen) return null;

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'tw-text-red-600 tw-bg-red-50';
      case 'medium': return 'tw-text-yellow-600 tw-bg-yellow-50';
      case 'low': return 'tw-text-green-600 tw-bg-green-50';
      default: return 'tw-text-gray-600 tw-bg-gray-50';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'tw-text-green-600';
    if (confidence >= 0.6) return 'tw-text-yellow-600';
    return 'tw-text-red-600';
  };

  return (
    <div className="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-50 tw-flex tw-items-center tw-justify-center tw-z-50">
      <div className="tw-bg-white tw-rounded-lg tw-shadow-xl tw-w-full tw-max-w-4xl tw-max-h-[80vh] tw-overflow-hidden">
        {/* Header */}
        <div className="tw-px-6 tw-py-4 tw-border-b tw-border-gray-200 tw-flex tw-items-center tw-justify-between">
          <h2 className="tw-text-xl tw-font-semibold tw-text-gray-900">
            🤖 AI Smart Suggestions
          </h2>
          <button
            onClick={onClose}
            className="tw-text-gray-400 hover:tw-text-gray-600 tw-text-2xl"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="tw-px-6 tw-py-3 tw-border-b tw-border-gray-200">
          <div className="tw-flex tw-space-x-1">
            {[
              { id: 'suggestions', label: 'Suggestions', icon: '💡' },
              { id: 'auto-schedule', label: 'Auto-Schedule', icon: '📅' },
              { id: 'optimize', label: 'Optimize', icon: '⚡' },
              { id: 'predict', label: 'Predict', icon: '🔮' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`tw-px-4 tw-py-2 tw-rounded-md tw-text-sm tw-font-medium tw-flex tw-items-center tw-space-x-2 ${
                  activeTab === tab.id
                    ? 'tw-bg-blue-100 tw-text-blue-700'
                    : 'tw-text-gray-500 hover:tw-text-gray-700 hover:tw-bg-gray-100'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="tw-px-6 tw-py-4 tw-overflow-y-auto tw-max-h-96">
          {isLoading && (
            <div className="tw-flex tw-items-center tw-justify-center tw-py-8">
              <div className="tw-animate-spin tw-rounded-full tw-h-8 tw-w-8 tw-border-b-2 tw-border-blue-600"></div>
              <span className="tw-ml-3 tw-text-gray-600">Analyzing timeline...</span>
            </div>
          )}

          {!isLoading && activeTab === 'suggestions' && (
            <div className="tw-space-y-4">
              {suggestions.length === 0 ? (
                <div className="tw-text-center tw-py-8 tw-text-gray-500">
                  <div className="tw-text-4xl tw-mb-2">🎉</div>
                  <p>No suggestions at this time. Your timeline looks great!</p>
                </div>
              ) : (
                suggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className="tw-border tw-border-gray-200 tw-rounded-lg tw-p-4 hover:tw-shadow-md tw-transition-shadow"
                  >
                    <div className="tw-flex tw-items-start tw-justify-between">
                      <div className="tw-flex-1">
                        <div className="tw-flex tw-items-center tw-space-x-2 tw-mb-2">
                          <h3 className="tw-font-medium tw-text-gray-900">
                            {suggestion.title}
                          </h3>
                          <span
                            className={`tw-px-2 tw-py-1 tw-rounded-full tw-text-xs tw-font-medium ${getImpactColor(suggestion.impact)}`}
                          >
                            {suggestion.impact}
                          </span>
                          <span
                            className={`tw-text-xs tw-font-medium ${getConfidenceColor(suggestion.confidence)}`}
                          >
                            {Math.round(suggestion.confidence * 100)}% confidence
                          </span>
                        </div>
                        <p className="tw-text-sm tw-text-gray-600 tw-mb-3">
                          {suggestion.description}
                        </p>
                        <button
                          onClick={() => onApplySuggestion(suggestion)}
                          className="tw-px-3 tw-py-1 tw-bg-blue-600 tw-text-white tw-rounded tw-text-sm hover:tw-bg-blue-700 tw-transition-colors"
                        >
                          Apply Suggestion
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {!isLoading && activeTab === 'auto-schedule' && (
            <div className="tw-space-y-4">
              <div className="tw-text-center tw-py-8">
                <div className="tw-text-4xl tw-mb-4">📅</div>
                <h3 className="tw-text-lg tw-font-medium tw-text-gray-900 tw-mb-2">
                  Auto-Schedule Timeline
                </h3>
                <p className="tw-text-gray-600 tw-mb-6">
                  Let AI automatically schedule your timeline items based on dependencies, resources, and constraints.
                </p>
                <button
                  onClick={handleAutoSchedule}
                  className="tw-px-6 tw-py-3 tw-bg-blue-600 tw-text-white tw-rounded-lg hover:tw-bg-blue-700 tw-transition-colors tw-font-medium"
                >
                  Auto-Schedule Now
                </button>
              </div>
            </div>
          )}

          {!isLoading && activeTab === 'optimize' && (
            <div className="tw-space-y-4">
              <div className="tw-text-center tw-py-8">
                <div className="tw-text-4xl tw-mb-4">⚡</div>
                <h3 className="tw-text-lg tw-font-medium tw-text-gray-900 tw-mb-2">
                  Optimize Timeline
                </h3>
                <p className="tw-text-gray-600 tw-mb-6">
                  AI will analyze your timeline and apply optimizations to improve resource utilization and efficiency.
                </p>
                <button
                  onClick={handleOptimize}
                  className="tw-px-6 tw-py-3 tw-bg-green-600 tw-text-white tw-rounded-lg hover:tw-bg-green-700 tw-transition-colors tw-font-medium"
                >
                  Optimize Now
                </button>
              </div>
            </div>
          )}

          {!isLoading && activeTab === 'predict' && (
            <div className="tw-space-y-4">
              <div className="tw-text-center tw-py-8">
                <div className="tw-text-4xl tw-mb-4">🔮</div>
                <h3 className="tw-text-lg tw-font-medium tw-text-gray-900 tw-mb-2">
                  Predict Completion
                </h3>
                <p className="tw-text-gray-600 tw-mb-6">
                  Get AI predictions about project completion, risks, and recommendations.
                </p>
                <button
                  onClick={handlePredict}
                  className="tw-px-6 tw-py-3 tw-bg-purple-600 tw-text-white tw-rounded-lg hover:tw-bg-purple-700 tw-transition-colors tw-font-medium"
                >
                  Predict Now
                </button>
              </div>

              {prediction && (
                <div className="tw-mt-6 tw-space-y-4">
                  <div className="tw-bg-blue-50 tw-border tw-border-blue-200 tw-rounded-lg tw-p-4">
                    <h4 className="tw-font-medium tw-text-blue-900 tw-mb-2">
                      Estimated Completion
                    </h4>
                    <p className="tw-text-blue-800">
                      {prediction.estimatedCompletion.toLocaleDateString()} 
                      <span className="tw-text-sm tw-text-blue-600 tw-ml-2">
                        ({Math.round(prediction.confidence * 100)}% confidence)
                      </span>
                    </p>
                  </div>

                  {prediction.risks.length > 0 && (
                    <div className="tw-bg-red-50 tw-border tw-border-red-200 tw-rounded-lg tw-p-4">
                      <h4 className="tw-font-medium tw-text-red-900 tw-mb-2">
                        Identified Risks
                      </h4>
                      <ul className="tw-list-disc tw-list-inside tw-text-red-800 tw-space-y-1">
                        {prediction.risks.map((risk: string, index: number) => (
                          <li key={index}>{risk}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {prediction.recommendations.length > 0 && (
                    <div className="tw-bg-green-50 tw-border tw-border-green-200 tw-rounded-lg tw-p-4">
                      <h4 className="tw-font-medium tw-text-green-900 tw-mb-2">
                        Recommendations
                      </h4>
                      <ul className="tw-list-disc tw-list-inside tw-text-green-800 tw-space-y-1">
                        {prediction.recommendations.map((rec: string, index: number) => (
                          <li key={index}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="tw-px-6 tw-py-4 tw-border-t tw-border-gray-200 tw-bg-gray-50">
          <div className="tw-flex tw-justify-end tw-space-x-3">
            <button
              onClick={onClose}
              className="tw-px-4 tw-py-2 tw-text-gray-700 tw-bg-white tw-border tw-border-gray-300 tw-rounded-md hover:tw-bg-gray-50 tw-transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
