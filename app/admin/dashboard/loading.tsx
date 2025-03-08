import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="h-8 w-48 mb-8" />

      <div className="grid gap-4 md:grid-cols-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-lg" />
        ))}
      </div>

      <Skeleton className="h-8 w-full max-w-md mb-8" />

      <Skeleton className="h-[500px] w-full rounded-lg" />
    </div>
  )
}

