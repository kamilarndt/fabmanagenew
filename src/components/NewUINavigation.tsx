import { features } from "@/lib/config";
import { Button } from "@/new-ui";
import * as React from "react";

export function NewUINavigation(): React.ReactElement | null {
  if (!features.newUI) return null;

  return (
    <div className="tw-fixed tw-bottom-4 tw-right-4 tw-z-50">
      <div className="tw-bg-background tw-border tw-rounded-lg tw-shadow-lg tw-p-4 tw-space-y-2">
        <h3 className="tw-text-sm tw-font-medium tw-text-foreground">
          New UI Available
        </h3>
        <p className="tw-text-xs tw-text-muted-foreground">
          Try the new interface
        </p>
        <div className="tw-flex tw-gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              window.location.href = "/v2/dashboard";
            }}
          >
            Dashboard
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              window.location.href = "/v2/projects";
            }}
          >
            Projects
          </Button>
        </div>
      </div>
    </div>
  );
}
