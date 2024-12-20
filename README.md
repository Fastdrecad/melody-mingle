# Melody Mingle 🎵

A modern web-based music streaming platform built with Next.js 14, React, TypeScript and Supabase.

## Features ✨

- 🎵 Real-time music streaming
- 👤 User authentication & profile management
- 🎚️ Custom audio player with full playback controls
- 🎧 Liked songs playlist functionality with persistent storage
- 🎨 Modern and responsive UI
- 🔍 Search functionality
- 📱 Mobile-friendly design

## Unique Features 🌟

- 🎤 Music Upload & Playlist Creation: Users can upload their own music and create custom playlists directly from their device.
- 💖 Liked Songs: Users can like tracks from other users, and these songs will automatically be added to their "Liked Songs" playlist.

## Tech Stack 🛠️

- [Next.js 14](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Supabase](https://supabase.com/) - Backend and authentication
- [TailwindCSS](https://tailwindcss.com/) - Styling
- [React](https://reactjs.org/) - UI Components
- [Shadcn](https://ui.shadcn.com/) - UI Components
- [Zustand](https://zustand.docs.pmnd.rs/) - State Management

## 💡 Technical Highlights:

- Implemented custom hooks for global state management
- Built a robust authentication system with Supabase
- Created reusable components following DRY principles
- Used TypeScript for type safety and better developer experience
- Implemented real-time data synchronization
- Optimized image loading with Next.js Image component
- Added proper error handling and loading states

## Getting Started 🚀

1. Clone the repository:

```bash
git clone https://github.com/Fastdrecad/melody-mingle.git
cd melody-mingle
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory with:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
