"use client"

import React from 'react'

import { NotificationWithUser } from '@/types'
import { Icons } from '@/components/icons'

export function NotificationItems({notification}: {notification: NotificationWithUser}) {
  return (
    <div className="flex items-center gap-2">
    <Icons.thumbFill className="w-6 h-6" />
    <p className="text-lg line-clamp-3 break-words text-foreground/80">
      {notification.text.toLowerCase()}
    </p>
  </div>
  )
}
