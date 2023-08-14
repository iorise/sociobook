"use client"

import * as React from 'react'
import { PostWithUser } from './post-feeds'

interface PostView {
    data: PostWithUser | null
}

export function PostView({data}: PostView) {
  return (
    <div>{data?.text}</div>
  )
}
