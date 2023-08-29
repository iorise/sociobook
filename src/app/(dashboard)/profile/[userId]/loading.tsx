import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="w-full flex flex-col relative container px-1 md:px-10 xl:px-36">
      <Skeleton className="w-full relative aspect-[3/1.3] md:aspect-[4/1.3] overflow-hidden bg-center rounded-md" />
      <div className="flex-col md:flex justify-center">
        <div className="w-full gap-4 flex flex-col md:flex md:flex-row relative -top-16 justify-center md:justify-start items-center">
          <Skeleton className="w-44 h-44 rounded-full ml-0 md:ml-10" />
          <div className="flex flex-col pt-0 md:pt-10 items-center md:items-start gap-2">
            <Skeleton className="w-32 h-5 rounded-full" />
            <Skeleton className="w-24 h-5 rounded-full" />
          </div>
        </div>
        <div className="w-full flex gap-2 justify-center md:justify-end">
          <Skeleton className="h-10 flex-1 md:flex-none w-28" />
          <Skeleton className="h-10 flex-1 md:flex-none w-28" />
        </div>
      </div>
    </div>
  );
}
