import { features } from "@/lib/config";
import {
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Card as NewCard,
} from "@/new-ui";
import { Card as AntCard } from "antd";
import * as React from "react";

export interface BridgeCardProps {
  children: React.ReactNode;
  title?: React.ReactNode;
  extra?: React.ReactNode;
  loading?: boolean;
  hoverable?: boolean;
  bordered?: boolean;
  size?: "default" | "small";
  className?: string;
  style?: React.CSSProperties;
  bodyStyle?: React.CSSProperties;
  headStyle?: React.CSSProperties;
  actions?: React.ReactNode[];
  cover?: React.ReactNode;
  type?: "inner";
}

export function Card(props: BridgeCardProps): React.ReactElement {
  const { children, title, extra, actions, ...restProps } = props;

  if (features.newUI) {
    return (
      <NewCard {...restProps}>
        {(title || extra) && (
          <CardHeader>
            {title && <CardTitle>{title}</CardTitle>}
            {extra && <div className="tw-ml-auto">{extra}</div>}
          </CardHeader>
        )}
        <CardContent>{children}</CardContent>
        {actions && actions.length > 0 && (
          <CardFooter>
            <div className="tw-flex tw-gap-2">
              {actions.map((action, index) => (
                <div key={index}>{action}</div>
              ))}
            </div>
          </CardFooter>
        )}
      </NewCard>
    );
  }

  return (
    <AntCard {...restProps} actions={actions}>
      {children}
    </AntCard>
  );
}
