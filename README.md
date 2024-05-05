# Melody Mingle

> A web app for visualizing personalized music data

Built with a bunch of things, but to name a few:

- [Create Next App](https://nextjs.org/)
- [Stripe](https://stripe.com/)
- [Supabase](https://supabase.com/)
- [Tailwind CSS](https://tailwindcss.com/)

# Setup

1. Clone the repository

```
$ git clone https://github.com/Fastdrecad/melody-mingle.git
```

2. Create an `.env.local` file in the root of the project. Update the values for the following contents in the `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

3. Install dependencies

```
$ npm install
```

4. Set up your Supabase and Stripe integrations

   - **Supabase**:

     - Create a new project in Supabase.
     - Set up your database schema as required for your project.
     - Locate your project's API keys and endpoint in the project settings and update the `.env.local` accordingly.

   - **Stripe**:
     - Register or log in to your Stripe account.
     - Generate API keys from the Stripe Dashboard and add them to the `.env.local`.
     - Set up webhook endpoints in your Stripe dashboard to work with your app (for handling real-time events).

5. **Run the application**

```
$ npm run dev
```

This command starts the development server on [http://localhost:3000](http://localhost:3000). Open this URL in your browser to view the application.

# Deploying to Vercel

1. Add New Project
2. Import Git Repository
3. Set Vercel environment variables
4. Update Supabase URL Configuration `https://<your-app-name>.vercel.app/`
5. Add Endpoint to Stripe and update Stripe Webhooks accordingly
