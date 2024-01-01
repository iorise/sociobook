import { ImagesCarousel } from "@/components/post/images--carousel";
import { Post } from "@/components/post/post-item";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { notFound, redirect } from "next/navigation";

interface PostProps {
  params: {
    postId: string;
  };
}

export default async function PostPage({ params }: PostProps) {
  const { userId } = auth();

  if (!userId) {
    redirect("/login");
  }

  if (!params.postId) {
    return notFound();
  }

  const post = await prismadb.post.findUnique({
    where: {
      id: params.postId,
    },
    include: {
      user: true,
      images: true,
      comments: true,
    },
  });

  if (!post) {
    return notFound();
  }

  return (
    <div className="grid grid-cols-2">
      <ImagesCarousel images={post?.images} />
      <Post data={post} currentUser={post.user} queryKey="posts" hiddenImage />
    </div>
  );
}
