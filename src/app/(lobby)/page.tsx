import React from 'react'
import { UserButton } from '@clerk/nextjs/app-beta'

export default function LobbyPage() {
  return (
    <div><UserButton afterSignOutUrl='/login'/></div>
  )
}
