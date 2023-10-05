import { AuthFooter } from "@/components/layouts/auth-footer";
import { siteConfig } from "@/config/site";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex flex-col">
      <div className="grid lg:grid-cols-2 lg:container px-0 md:px-10 items-center justify-center">
        <div className="hidden  lg:flex w-full h-screen items-center justify-center">
          <div className="flex flex-col">
            <h1 className="text-facebook-primary text-7xl font-bold">
              {siteConfig.title}
            </h1>
            <p className="text-2xl pb-52">
              {siteConfig.title} helps you connect and share with people in your
              life.
            </p>
          </div>
        </div>
        <main>{children}</main>
      </div>
      <AuthFooter />
    </div>
  );
}
