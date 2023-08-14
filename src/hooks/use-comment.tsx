import useSWR from 'swr';

import fetcher from '@/lib/fetcher';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

const useComment = (postId: string) => {
  const { data, error, isLoading, mutate } = useSWR(postId ? `/api/comment?postId=${postId}` : null, fetcher);

  return {
    data,
    error,
    isLoading,
    mutate
  }
};

export default useComment;