import Link from "next/link";
import { type Metadata } from "next";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { Shell } from "@/components/shell";
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SignUpForm } from "@/components/forms/signup-form";
import { OAuthSignIn } from "@/components/auth/oauth-signin";
import { AuthFooter } from "@/components/layouts/auth-footer";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Sign up for ${siteConfig.title}`,
  description: `Sign up for your ${siteConfig.title} account`,
};

export default async function SignUpPage() {
  const user = await currentUser();
  if (user) redirect("/");

  return (
    <>
      <Shell className="flex flex-col w-full min-h-screen items-center gap-6">
      <h1 className="text-4xl text-facebook-primary font-bold">{siteConfig.title}</h1>
        <Card className="sm:w-[26rem] w-auto">
          <CardHeader className="space-y-1">
            <CardTitle className="text-center text-xl">
              Create a new account
            </CardTitle>
            <CardDescription className="text-center text-sm">
              It's quick and easy.
            </CardDescription>
          </CardHeader>
          <div className="flex -mt-3 mb-3">
            <Separator />
          </div>
          <CardContent className="grid gap-4">
            <OAuthSignIn />
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs lowercase">
                <span className="bg-card px-4 text-muted-foreground">or</span>
              </div>
            </div>
            <SignUpForm />
          </CardContent>
          <CardFooter>
            <div className="w-full flex justify-center">
              <Link aria-label="Sign up" href="/login">
                <Button
                  variant="outline"
                  className="text-normal font-normal text-facebook-primary hover:text-facebook-primary bg-card"
                >
                  Already have an account?
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
