import { cn } from "@/new-ui/utils/cn";
import * as React from "react";

export interface CommentProps {
  author?: React.ReactNode;
  avatar?: React.ReactNode;
  content: React.ReactNode;
  datetime?: React.ReactNode;
  actions?: React.ReactNode[];
  children?: React.ReactNode;
  className?: string;
}

export function Comment({
  author,
  avatar,
  content,
  datetime,
  actions,
  children,
  className,
}: CommentProps): React.ReactElement {
  return (
    <div className={cn("comment", className)}>
      <div className="flex space-x-3">
        {/* Avatar */}
        {avatar && (
          <div className="flex-shrink-0">
            {typeof avatar === "string" ? (
              <img
                src={avatar}
                alt="Avatar"
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                {avatar}
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Author and datetime */}
          {(author || datetime) && (
            <div className="flex items-center space-x-2 mb-1">
              {author && (
                <span
                  className="text-sm font-medium"
                  style={{ color: "var(--color-foreground-primary)" }}
                >
                  {author}
                </span>
              )}
              {datetime && (
                <span
                  className="text-xs"
                  style={{ color: "var(--color-foreground-secondary)" }}
                >
                  {datetime}
                </span>
              )}
            </div>
          )}

          {/* Content */}
          <div
            className="text-sm mb-2"
            style={{ color: "var(--color-foreground-primary)" }}
          >
            {content}
          </div>

          {/* Actions */}
          {actions && actions.length > 0 && (
            <div className="flex items-center space-x-4">
              {actions.map((action, index) => (
                <span
                  key={index}
                  className="text-xs cursor-pointer hover:underline"
                  style={{ color: "var(--color-foreground-secondary)" }}
                >
                  {action}
                </span>
              ))}
            </div>
          )}

          {/* Nested comments */}
          {children && (
            <div className="mt-4 ml-4 space-y-4">
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Comment Actions Component
export interface CommentActionsProps {
  children: React.ReactNode;
  className?: string;
}

export function CommentActions({
  children,
  className,
}: CommentActionsProps): React.ReactElement {
  return (
    <div className={cn("comment-actions flex items-center space-x-4", className)}>
      {children}
    </div>
  );
}

// Comment Content Component
export interface CommentContentProps {
  children: React.ReactNode;
  className?: string;
}

export function CommentContent({
  children,
  className,
}: CommentContentProps): React.ReactElement {
  return (
    <div
      className={cn("comment-content text-sm", className)}
      style={{ color: "var(--color-foreground-primary)" }}
    >
      {children}
    </div>
  );
}

// Comment Author Component
export interface CommentAuthorProps {
  children: React.ReactNode;
  className?: string;
}

export function CommentAuthor({
  children,
  className,
}: CommentAuthorProps): React.ReactElement {
  return (
    <span
      className={cn("comment-author text-sm font-medium", className)}
      style={{ color: "var(--color-foreground-primary)" }}
    >
      {children}
    </span>
  );
}

// Comment Avatar Component
export interface CommentAvatarProps {
  src?: string;
  alt?: string;
  children?: React.ReactNode;
  className?: string;
}

export function CommentAvatar({
  src,
  alt = "Avatar",
  children,
  className,
}: CommentAvatarProps): React.ReactElement {
  return (
    <div className={cn("comment-avatar flex-shrink-0", className)}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-8 h-8 rounded-full object-cover"
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
}

// Comment DateTime Component
export interface CommentDateTimeProps {
  children: React.ReactNode;
  className?: string;
}

export function CommentDateTime({
  children,
  className,
}: CommentDateTimeProps): React.ReactElement {
  return (
    <span
      className={cn("comment-datetime text-xs", className)}
      style={{ color: "var(--color-foreground-secondary)" }}
    >
      {children}
    </span>
  );
}

