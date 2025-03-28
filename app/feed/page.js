import Posts from '@/components/posts';
import { getPosts } from '@/lib/posts';

// export const metadata = {
//   title: 'All Posts',
//   description: 'All posts by all users',
// }

export async function generateMetadata(data) {
  const posts = await getPosts();
  const numberOfPost = posts.length;
  return {
    title: `All ${numberOfPost} posts by all users`,
    description: `All ${numberOfPost} posts by all users`,
  }
}

export default async function FeedPage() {
  const posts = await getPosts();
  return (
    <>
      <h1>All posts by all users</h1>
      <Posts posts={posts} />
    </>
  );
}
