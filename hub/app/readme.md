# Project Initializations
npx create-next-app@latest healthcare-hub --typescript --tailwind --app
cd healthcare-hub

# Dependencies
npm install @prisma/client @radix-ui/react-dialog @radix-ui/react-select @radix-ui/react-slider @radix-ui/react-switch @radix-ui/react-tabs class-variance-authority clsx date-fns lucide-react resend
npm install -D prisma @types/node

# Prisma
1. npx prisma init
### Update DATABASE_URL in .env
### Run migrations
2. npx prisma migrate dev --name init
# Seed database
3. npx prisma db seed

# Follow shadcn/ui installation guide
1. npx shadcn-ui@latest init
### Add required components
2. npx shadcn-ui@latest add button card dialog select etc.








# ENV Example
## Database
DATABASE_URL="postgresql://username:password@localhost:5432/healthcare_hub"

## Authentication
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

## Email (Resend)
RESEND_API_KEY="re_123456789"

## SMS (Twilio or similar)
TWILIO_ACCOUNT_SID="your_account_sid"
TWILIO_AUTH_TOKEN="your_auth_token"
TWILIO_PHONE_NUMBER="+1234567890"

## Other
APP_URL="http://localhost:3000"

## OpenAI (Optional - for smarter responses)
OPENAI_API_KEY=sk-your-openai-api-key-here

## Alternative AI Providers
ANTHROPIC_API_KEY=your-anthropic-api-key
COHERE_API_KEY=your-cohere-api-key

## Database (Already set up)
DATABASE_URL="postgresql://..."

## Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

## Uploadthing
UPLOADTHING_SECRET=sk_live_xxxxxxxxxx
UPLOADTHING_APP_ID=your_app_id

## Database
DATABASE_URL="postgresql://username:password@localhost:5432/healthcare_hub"

## Email (Resend)
RESEND_API_KEY=re_xxxxxxxxxx

## OpenAI (for chatbot)
OPENAI_API_KEY=sk-xxxxxxxxxx

# API Alternative

` import { Anthropic } from '@anthropic-ai/sdk';

    const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
    });
`

`
    import { CohereClient } from 'cohere-ai';

    const cohere = new CohereClient({
    token: process.env.COHERE_API_KEY,
    });
`

`
    async function queryLocalModel(message: string) {
    const response = await fetch(
        "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
        {
        headers: {
            Authorization: `Bearer ${process.env.HUGGINGFACE_TOKEN}`,
        },
        method: "POST",
        body: JSON.stringify({ inputs: message }),
        }
    );
    return response.json();
    }
`
`
    // DeepSeek (free tier available)
    async function queryDeepSeek(message: string) {
    const response = await fetch("https://api.deepseek.com/chat/completions", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        },
        body: JSON.stringify({
        model: "deepseek-chat",
        messages: [{ role: "user", content: message }],
        }),
    });
    return response.json();
    }
`

## Chatbot and more Dependencies. 
npm install openai @anthropic-ai/sdk cohere-ai @huggingface/inference
npm install @clerk/nextjs uploadthing @uploadthing/react @prisma/client date-fns react-hook-form zod @hookform/resolvers

