import ModernLayout from "@/new-ui/layouts/ModernLayout";
import * as React from "react";
import { Outlet } from "react-router-dom";

export default function NewUILayout(): React.ReactElement {
  return (
    <ModernLayout>
      <Outlet />
    </ModernLayout>
  );
}
