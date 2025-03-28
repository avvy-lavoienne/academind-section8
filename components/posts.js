"use client";

import { useOptimistic } from 'react';
import { formatDate } from '@/lib/format';
import LikeButton from './like-icon';
import DeleteButton from './delete-button'; // Impor komponen DeleteButton
import { togglePostLikeStatus, deletePost } from '@/actions/posts'; // Impor deletePost
import Image from 'next/image';

function imageLoader (config) {
  const urlStart = config.src.split('upload/')[0];
  const urlEnd = config.src.split('upload/')[1];
  const transformation = `w_200,q_${config.quality || 75}`;
  return `${urlStart}upload/${transformation}/${urlEnd}`
}

function Post({ post, onLike, onDelete }) {
  return (
    <article className="post">
      <div className="post-image">
        <Image 
        loader={imageLoader} 
        src={post.image} 
        width={200}
        height={120}
        alt={post.title} 
        quality={50}
        />
      </div>
      <div className="post-content">
        <header>
          <div>
            <h2>{post.title}</h2>
            <p>
              Shared by {post.userFirstName} on{' '}
              <time dateTime={post.createdAt}>
                {formatDate(post.createdAt)}
              </time>
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <form
              action={onLike.bind(null, post.id)}
              className={post.isLiked ? 'liked' : ''}
            >
              <LikeButton />
            </form>
            <form action={onDelete.bind(null, post.id)}>
              <DeleteButton />
            </form>
          </div>
        </header>
        <p>{post.content}</p>
      </div>
    </article>
  );
}

export default function Posts({ posts }) {
  const [optimisticPosts, updateOptimisticPosts] = useOptimistic(posts, (prevPosts, { action, postId }) => {
    if (action === 'like') {
      const updatedPostIndex = prevPosts.findIndex(post => post.id === postId);
      if (updatedPostIndex === -1) return prevPosts;

      const updatedPost = { ...prevPosts[updatedPostIndex] };
      updatedPost.likes = updatedPost.likes + (updatedPost.isLiked ? -1 : 1);
      updatedPost.isLiked = !updatedPost.isLiked;
      const newPosts = [...prevPosts];
      newPosts[updatedPostIndex] = updatedPost;
      return newPosts;
    } else if (action === 'delete') {
      return prevPosts.filter(post => post.id !== postId); // Hapus post dari daftar
    }
    return prevPosts;
  });

  if (!optimisticPosts || optimisticPosts.length === 0) {
    return <p>There are no posts yet. Maybe start sharing some?</p>;
  }

  async function handleLike(postId) {
    updateOptimisticPosts({ action: 'like', postId });
    await togglePostLikeStatus(postId);
  }

  async function handleDelete(postId) {
    updateOptimisticPosts({ action: 'delete', postId });
    const result = await deletePost(postId);
    if (!result.success) {
      console.error(result.error);
      // Optional: rollback optimis jika gagal
    }
  }

  return (
    <ul className="posts">
      {optimisticPosts.map((post) => (
        <li key={post.id}>
          <Post post={post} onLike={handleLike} onDelete={handleDelete} />
        </li>
      ))}
    </ul>
  );
}