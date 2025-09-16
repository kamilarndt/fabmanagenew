import { usePerformanceMonitor } from "@/lib/performance-monitor";
import { Button } from "@/new-ui";
import * as React from "react";

export interface FeedbackFormProps {
  page: string;
  onClose: () => void;
  userId?: string;
}

export function FeedbackForm({
  page,
  onClose,
  userId = "anonymous",
}: FeedbackFormProps): React.ReactElement {
  const [rating, setRating] = React.useState<number>(0);
  const [comments, setComments] = React.useState<string>("");
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  const { collectFeedback } = usePerformanceMonitor();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    setIsSubmitting(true);

    try {
      collectFeedback({
        userId,
        page,
        rating,
        comments: comments.trim() || undefined,
      });

      // Show success message
      alert("Thank you for your feedback!");
      onClose();
    } catch (error) {
      console.error("Failed to submit feedback:", error);
      alert("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-50 tw-flex tw-items-center tw-justify-center tw-z-50">
      <div className="tw-bg-white tw-rounded-lg tw-p-6 tw-w-full tw-max-w-md tw-mx-4">
        <h2 className="tw-text-xl tw-font-semibold tw-mb-4">
          How was your experience?
        </h2>

        <form onSubmit={handleSubmit} className="tw-space-y-4">
          {/* Rating */}
          <div>
            <label className="tw-block tw-text-sm tw-font-medium tw-mb-2">
              Rate your experience (1-5 stars)
            </label>
            <div className="tw-flex tw-gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`tw-text-2xl tw-transition-colors ${
                    star <= rating ? "tw-text-yellow-400" : "tw-text-gray-300"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          {/* Comments */}
          <div>
            <label className="tw-block tw-text-sm tw-font-medium tw-mb-2">
              Additional comments (optional)
            </label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="tw-w-full tw-p-2 tw-border tw-rounded-md tw-resize-none"
              rows={3}
              placeholder="Tell us what you think..."
            />
          </div>

          {/* Actions */}
          <div className="tw-flex tw-gap-2 tw-justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={rating === 0 || isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
