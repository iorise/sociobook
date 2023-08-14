import { auth, redirectToSignIn } from "@clerk/nextjs";

import { PostView } from "@/components/post-view";
import prismadb from "@/lib/prismadb";

export default async function PostPage({
  params,
}: {
  params: { postId: string };
}) {
  const { userId } = auth();

  if (!userId) {
    return redirectToSignIn();
  }

  const post = await prismadb.post.findUnique({
    where: {
      id: params.postId,
    },
    include: {
      user: true,
      comments: true,
    },
  });
  return (
    <>
      <PostView data={post} />
    </>
  );
}
