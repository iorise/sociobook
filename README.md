# Welcome to Facebook Clone

[Live Demo](https://sociobook.vercel.app/) 👈

## Preview

https://github.com/iorise/sociobook/assets/134770602/0c8eef1f-ba46-4381-9c45-edb282fd1ca1


## Features

### Users

- [x] Register / Log in / Log out
- [x] Search user
- [x] Display profile
- [x] Edit own profile

### Friendships 👤

- [x] Request friend
- [x] Accept friend
- [x] Reject friend
- [x] Remove friend

### Posts 📝




- [x] Create posts
- [x] Delete posts
- [x] View your personal feed
- [x] Like and unlike posts
- [x] Comment post

### Notifications 📬

- [x] Receive notifications for Likes
- [x] Receive notifications for Comments
- [x] Receive notifications for Friend Requests

### Additional Features 🌟

- [x] Beautiful UI using TailwindCSS and ShadcnUI
- [x] Light / Dark mode
- [x] Full responsivity

## Tech 🚀

- [Next.js](https://nextjs.org)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Prisma](https://www.prisma.io/)
- [MongoDB](https://www.mongodb.com/)
- [Tanstack Query](https://tanstack.com/query/latest)
- [Shadcn UI](https://ui.shadcn.com/)
- [React Hot Toast](https://react-hot-toast.com)

## Development 🛠️

1. Clone the repository

```bash
git clone https://github.com/iorise/facebook-clone.git
```

1. Install dependencies

```bash
npm i
```

1. Set up .env file

```js
DATABASE_URL=

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_SIGN_UP_URL=
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=
WEBHOOK_SECRET=
UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=
```

1. Set up prisma

```bash
npx prisma generate
npx prisma db push
```

1. Start the app

```bash
npm run dev
```

<p>
  Enjoy the journey of building your own social platform with Facebook Clone! 🌐👥🚀
</p>
