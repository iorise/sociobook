"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useSignUp } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import type { z } from "zod";
import axios from "axios";

import { catchClerkError } from "@/lib/utils";
import { registerUserSchema } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/icons";
import { PasswordInput } from "@/components/password-input";
import Link from "next/link";

type Inputs = z.infer<typeof registerUserSchema>;

export function SignUpForm() {
  const router = useRouter();
  const { isLoaded, signUp } = useSignUp();
  const [isLoading, setIsLoading] = React.useState(false);

  // react-hook-form
  const form = useForm<Inputs>({
    resolver: zodResolver(registerUserSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: Inputs) {
    if (!isLoaded) return;

    try {
      setIsLoading(true);
      await signUp.create({
        firstName: data.firstName,
        lastName: data.lastName,
        emailAddress: data.email,
        password: data.password,
      });

      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      router.push("/signup/verify-email");
      toast.success("Check your email");
    } catch (error) {
      catchClerkError(error);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <Form {...form}>
      <form
        className="grid gap-4"
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
      >
        <div className="flex gap-2">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="First name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Surname" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Email address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <PasswordInput placeholder="New password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid gap-2">
          <p className="text-[0.6rem] font-light line-clamp-2">
            People who use our service may have uploaded your contact
            information to Facebook.{" "}
            <span>
              <Link
                href="https://www.facebook.com/help/637205020878504"
                target="_blank"
                className="hover:underline text-facebook-primary"
              >
                Learn more.
              </Link>
            </span>
          </p>
          <p className="text-[0.6rem] font-light line-clamp-2">
            By clicking Sign Up, you agree to our{" "}
            <span>
              <Link
                href="https://www.facebook.com/help/637205020878504"
                target="_blank"
                className="hover:underline text-facebook-primary"
              >
                Terms
              </Link>
            </span>
            ,{" "}
            <span>
              <Link
                href="https://www.facebook.com/privacy/policy/?entry_point=data_policy_redirect&entry=0"
                target="_blank"
                className="hover:underline text-facebook-primary"
              >
                Privacy Policy
              </Link>
            </span>{" "}
            and{" "}
            <span>
              <Link
                href="https://www.facebook.com/privacy/policies/cookies/?entry_point=cookie_policy_redirect&entry=0"
                target="_blank"
                className="hover:underline text-facebook-primary"
              >
                Cookies Policy
              </Link>
            </span>
            . You may receive SMS notifications from us and can opt out at any
            time.
          </p>
        </div>
        <Button disabled={isLoading} className="bg-facebook-primary text-lg">
          {isLoading && (
            <Icons.spinner
              className="mr-2 h-4 w-4 animate-spin"
              aria-hidden="true"
            />
          )}
          Sign up
          <span className="sr-only">Sign up</span>
        </Button>
      </form>
    </Form>
  );
}
