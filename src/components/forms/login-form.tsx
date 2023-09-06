"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useSignIn } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { catchClerkError } from "@/lib/utils";
import { loginUserSchema } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Icons } from "@/components/icons";
import { PasswordInput } from "@/components/inputs/password-input";

type Inputs = z.infer<typeof loginUserSchema>;

export function LoginForm() {
  const router = useRouter();
  const { isLoaded, signIn, setActive } = useSignIn();
  const [isLoading, setIsLoading] = React.useState(false);
  const [testLoading, setTestLoading] = React.useState(false);

  // react-hook-form
  const form = useForm<Inputs>({
    resolver: zodResolver(loginUserSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function testUser() {
    if (!isLoaded) return null;
    try {
      setTestLoading(true);
      const result = await signIn.create({
        identifier: "tu2873614@gmail.com",
        password: "tester06092023",
      });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push(`${window.location.origin}/`);
      } else {
        console.log(result);
      }
    } catch (err) {
      catchClerkError(err);
    } finally {
      setTestLoading(false);
    }
  }

  async function onSubmit(data: Inputs) {
    if (!isLoaded) return;
    try {
      setIsLoading(true);
      const result = await signIn.create({
        identifier: data.email,
        password: data.password,
      });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push(`${window.location.origin}/`);
      } else {
        console.log(result);
      }
    } catch (err) {
      catchClerkError(err);
      form.setValue("password", "");
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
                <PasswordInput placeholder="Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          disabled={isLoading || testLoading}
          className="bg-facebook-primary text-lg text-primary"
        >
          {isLoading && (
            <Icons.spinner
              className="mr-2 h-4 w-4 animate-spin"
              aria-hidden="true"
            />
          )}
          Log in
          <span className="sr-only">Log in</span>
        </Button>
        <Button
          type="button"
          disabled={isLoading || testLoading}
          className="text-lg"
          onClick={() => void testUser()}
        >
          {testLoading && (
            <Icons.spinner
              className="mr-2 h-4 w-4 animate-spin"
              aria-hidden="true"
            />
          )}
          Test user
          <span className="sr-only">Test user</span>
        </Button>
      </form>
    </Form>
  );
}
