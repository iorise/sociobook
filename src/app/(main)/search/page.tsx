import PeopleList from "@/components/list/people-list";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function ServerSearchPage({}) {
  const user = await currentUser();

  if (!user) {
    redirect("/signin");
  }
  return (
    <div className="flex w-full justify-center items-center py-6">
      <PeopleList apiUrl="/api/search/people" queryKey="search:people" />
    </div>
  );
}
