"use client"

import * as React from 'react'
import { PostWithUser } from '@/types'

interface PostView {
    data: PostWithUser | null
}

export function PostView({data}: PostView) {
  return (
    <div>{data?.text}</div>
  )
}
