import { Button } from "@/new-ui";
import * as React from "react";
import { FeedbackForm } from "./FeedbackForm";

export interface FeedbackButtonProps {
  page: string;
  userId?: string;
  className?: string;
}

export function FeedbackButton({
  page,
  userId,
  className,
}: FeedbackButtonProps): React.ReactElement {
  const [showForm, setShowForm] = React.useState<boolean>(false);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowForm(true)}
        className={className}
      >
        💬 Feedback
      </Button>

      {showForm && (
        <FeedbackForm
          page={page}
          onClose={() => setShowForm(false)}
          userId={userId}
        />
      )}
    </>
  );
}
