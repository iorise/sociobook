export enum BatchType {
  POSTS = "POST_BATCH_SIZE",
  COMMENTS = "COMMENT_BATCH_SIZE",
  NOTIFICATIONS = "NOTIFICATIONS_BATCH_SIZE",
  FRIENDS = "FRIENDS_BATCH_SIZE",
}

export const batchSize = {
  [BatchType.POSTS]: 7,
  [BatchType.COMMENTS]: 3,
  [BatchType.NOTIFICATIONS]: 10,
  [BatchType.FRIENDS]: 3,
};
