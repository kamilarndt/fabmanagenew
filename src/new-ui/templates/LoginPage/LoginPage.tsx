import { Button } from "@/new-ui/atoms/Button/Button";
import { Input } from "@/new-ui/atoms/Input/Input";
import { Separator } from "@/new-ui/atoms/Separator/Separator";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/new-ui/molecules/Card/Card";
import { FormField } from "@/new-ui/molecules/FormField/FormField";
import { cn } from "@/new-ui/utils/cn";
import * as React from "react";

export interface LoginPageProps {
  onLogin?: (email: string, password: string) => void;
  onForgotPassword?: () => void;
  onSignUp?: () => void;
  className?: string;
  loading?: boolean;
  error?: string;
}

export function LoginPage({
  onLogin,
  onForgotPassword,
  onSignUp,
  className,
  loading = false,
  error,
}: LoginPageProps): React.ReactElement {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin?.(email, password);
  };

  return (
    <div
      className={cn(
        "tw-min-h-screen tw-flex tw-items-center tw-justify-center tw-bg-muted/50",
        className
      )}
    >
      <div className="tw-w-full tw-max-w-md tw-space-y-6">
        {/* Logo/Header */}
        <div className="tw-text-center">
          <div className="tw-mx-auto tw-h-12 tw-w-12 tw-rounded-lg tw-bg-primary tw-flex tw-items-center tw-justify-center">
            <span className="tw-text-primary-foreground tw-font-bold tw-text-xl">
              F
            </span>
          </div>
          <h1 className="tw-mt-4 tw-text-2xl tw-font-bold tw-tracking-tight">
            Welcome to FabManage
          </h1>
          <p className="tw-mt-2 tw-text-sm tw-text-muted-foreground">
            Sign in to your account to continue
          </p>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="tw-space-y-4">
              {error && (
                <div className="tw-rounded-md tw-bg-destructive/15 tw-p-3">
                  <p className="tw-text-sm tw-text-destructive">{error}</p>
                </div>
              )}

              <FormField label="Email" required>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </FormField>

              <FormField label="Password" required>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </FormField>

              <div className="tw-flex tw-items-center tw-justify-between">
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  onClick={onForgotPassword}
                  className="tw-p-0 tw-h-auto"
                >
                  Forgot password?
                </Button>
              </div>

              <Button
                type="submit"
                className="tw-w-full"
                loading={loading}
                disabled={loading}
              >
                Sign In
              </Button>
            </form>

            <div className="tw-mt-6">
              <div className="tw-relative">
                <div className="tw-absolute tw-inset-0 tw-flex tw-items-center">
                  <Separator className="tw-w-full" />
                </div>
                <div className="tw-relative tw-flex tw-justify-center tw-text-xs tw-uppercase">
                  <span className="tw-bg-background tw-px-2 tw-text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="tw-mt-6 tw-grid tw-grid-cols-2 tw-gap-3">
                <Button variant="outline" className="tw-w-full">
                  <svg className="tw-mr-2 tw-h-4 tw-w-4" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Google
                </Button>
                <Button variant="outline" className="tw-w-full">
                  <svg
                    className="tw-mr-2 tw-h-4 tw-w-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sign Up Link */}
        <div className="tw-text-center">
          <p className="tw-text-sm tw-text-muted-foreground">
            Don't have an account?{" "}
            <Button
              variant="link"
              size="sm"
              onClick={onSignUp}
              className="tw-p-0 tw-h-auto tw-font-normal"
            >
              Sign up
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}
