import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import { designTokens } from "./design-tokens";

interface MainProps {
  children?: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
}

export const Main: React.FC<MainProps> = ({
  children,
  className = "",
  title = "Page Name",
  description = "Page description",
}) => {
  const theme = designTokens.getTheme();
  const backgroundColor = designTokens.resolveToken(
    designTokens.colors.background.muted,
    theme
  );
  const borderRadius = designTokens.radius.md;
  const paddingX = designTokens.padding["3xl"];
  const paddingY = designTokens.padding.lg;
  const gap = designTokens.spacing.xs;

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle className="text-3xl font-semibold">{title}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default function MainLayout() {
  const theme = designTokens.getTheme();
  const backgroundColor = designTokens.resolveToken(
    designTokens.colors.background.muted,
    theme
  );
  const borderRadius = designTokens.radius.md;

  return (
    <div
      className="size-full"
      style={{
        backgroundColor: backgroundColor as string,
        borderRadius: `${borderRadius}px`,
      }}
      data-name="Main"
      data-node-id="30:4487"
    >
      <Main />
    </div>
  );
}
