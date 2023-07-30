import { Image } from "next/dist/client/image-component";
import Link from "next/link";
import { type Metadata } from "next";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { OAuthSignIn } from "@/components/auth/oauth-signin";
import { Shell } from "@/components/shell";
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { LoginForm } from "@/components/forms/login-form";
import { Button } from "@/components/ui/button";
import { AuthFooter } from "@/components/layouts/auth-footer";

export const metadata: Metadata = {
  title: "Log in to Facebook",
  description: "Log in to your Facebook account",
};

export default async function LoginPage() {
  const user = await currentUser();
  if (user) redirect("/");

  return (
    <>
      <Shell className="flex flex-col w-full min-h-screen items-center  gap-6">
        <Image src="/rectangle.png" alt="image" width={180} height={100} />
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-center font-normal">
              Log in to Facebook
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <OAuthSignIn />
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-4 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <LoginForm />
            <div className="flex justify-center text-xs text-facebook-primary hover:underline font-medium tracking-tight">
              <Link href="">Forgotten account?</Link>
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs lowercase">
                <span className="bg-card px-6 text-muted-foreground">Or</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="w-full flex justify-center">
              <Link aria-label="Sign up" href="/signup">
                <Button className="text-base  bg-facebook-secondary">
                  Create new account
                  <span className="sr-only">Create new account</span>
                </Button>
              </Link>
            </div>
          </CardFooter>
        </Card>
      </Shell>
      <AuthFooter />
    </>
  );
}
