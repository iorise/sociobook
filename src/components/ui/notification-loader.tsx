import { Skeleton } from "@/components/ui/skeleton";

export function NotificationLoader() {
  const skeletonCount = 9;
  const skeletonElements = Array.from({ length: skeletonCount }).map(
    (_, index) => <Skeleton key={index} className="w-full h-4" />
  );

  return (
    <div className="w-full flex flex-col gap-16 py-5">{skeletonElements}</div>
  );
}
