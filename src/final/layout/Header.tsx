import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ChevronDown, ChevronRight, Home } from "lucide-react";
import React from "react";
import { designTokens } from "./design-tokens";

// Icon assets
const img =
  "http://localhost:3845/assets/bf206ddc944838fe9ba1b57764d67d7cd9cb3baf.svg";
const img1 =
  "http://localhost:3845/assets/5421b304f7f7519b26f6e42d0583bcc51e082c12.svg";

interface BreadcrumbsProps {
  size?: "sm" | "md" | "lg";
  items?: "1" | "2" | "3" | "4" | "5";
}

function Breadcrumbs({ size = "sm", items = "1" }: BreadcrumbsProps) {
  if (size === "md" && items === "3") {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/projects"
              className="flex items-center gap-1"
            >
              <Home className="w-4 h-4" />
              Projekty
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="w-4 h-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/projects/current"
              className="flex items-center gap-1"
            >
              NazwaProjektu
              <ChevronDown className="w-4 h-4" />
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="w-4 h-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Szczeguły</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }
  return null;
}

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className = "" }) => {
  const theme = designTokens.getTheme();
  const paddingBottom = designTokens.padding.sm;
  const paddingLeft = designTokens.padding.xs;
  const paddingRight = designTokens.padding["3xl"];
  const paddingTop = designTokens.padding.lg;
  const gap = designTokens.spacing.sm;

  return (
    <div
      className={`bg-white box-border content-stretch flex flex-col items-start justify-end relative size-full ${className}`}
      style={{
        paddingBottom: `${paddingBottom}px`,
        paddingLeft: `${paddingLeft}px`,
        paddingRight: `${paddingRight}px`,
        paddingTop: `${paddingTop}px`,
        gap: `${gap}px`,
      }}
      data-name="Header"
      data-node-id="3:619"
    >
      <div
        className="content-stretch flex flex-col gap-[57px] items-start justify-end relative shrink-0 w-full"
        data-name="Util"
        data-node-id="I3:619;27:3830"
      >
        <div
          className="content-stretch flex h-[28px] items-center justify-between relative shrink-0 w-full"
          data-name="Header"
          data-node-id="I3:619;27:3831"
        >
          <div
            className="content-stretch flex gap-[12px] items-center justify-start relative shrink-0"
            data-name="Breadcrumbs"
            data-node-id="I3:619;27:3832"
          >
            <Breadcrumbs size="md" items="3" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default function HeaderLayout() {
  return (
    <div
      className="bg-white box-border content-stretch flex flex-col gap-[10px] items-start justify-end pb-[8px] pl-[12px] pr-[36px] pt-[24px] relative size-full"
      data-name="Header"
      data-node-id="30:4486"
    >
      <Header />
    </div>
  );
}
