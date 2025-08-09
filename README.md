# HashLinks

AI-powered payment link generation platform built on the Hedera blockchain network. Create one click payment links with beautiful custom interfaces.

## Features

### Core Functionality
- **AI-Powered Link Generation**: Create payment links using natural language prompts powered by AI
- **Custom Payment Interfaces**: Generate beautiful, payment pages with custom modern design as ber your need powered by AI
- **One-Click Payments**: Execute transactions and pay with a single click
- **Reusable Templates**: Create and manage multiple payment links for different purposes

###  Wallet Integration
- **Hashconnect Support**: Seamless integration with Hedera wallet ecosystem
- **WalletConnect Protocol**: Secure wallet connection using industry standards

## Architecture

### Frontend (Next.js 14)
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Client-side routing** with App Router
- **Real-time wallet state management**

### Backend Services
- **API Routes** for payment link management
- **Supabase** for data persistence
- **OpenAI** for AI-generated content
- **Hedera SDK** for blockchain interactions

### Blockchain Integration
- **Hedera** for fast, low-cost transactions
- **Hashconnect** for wallet connectivity

## 🔧 Hedera Usage

### Transaction Types
- **HBAR Transfers**: Native cryptocurrency transfers
- **Memo Support**: Optional transaction memos 
- **Atomic Transactions**: Guaranteed transaction integrity


### Transaction Flow
1. **Template Generation**: Create unsigned transaction with recipient and amount
2. **Wallet Signing**: User signs transaction with connected wallet
3. **Network Submission**: Signed transaction submitted to Hedera network

## Setup Instructions

### Prerequisites
- **Node.js 18+**
- **npm or yarn**
- **Supabase account**
- **OpenAI API key**
- **WalletConnect Project ID**

### 1. Clone Repository
```bash
git clone https://github.com/priyanshur66/hashlinks
cd hashlinks
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env.local` file with the following variables:

```env
# Hedera Network Configuration
HEDERA_NETWORK=testnet
NEXT_PUBLIC_HEDERA_NETWORK=testnet

# Database Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# AI Integration
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4o

# Wallet Integration
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
```



### 4. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 5. Production Build
```bash
npm run build

```

## Usage Guide

### Creating Payment Links
1. **Connect Wallet**: Use HashConnect to connect your Hedera wallet
2. **Navigate to Save**: Go to `/save` page
3. **Enter Recipient**: Provide Hedera account ID (e.g., 0.0.1234)
4. **Describe Payment**: Use natural language to describe the payment purpose
5. **Generate with AI**: Let AI create the payment template and interface
6. **Customize**: Edit generated title, amount, memo, and description
7. **Save Link**: Store the payment link for future use

### Executing Payments
1. **Browse Links**: Visit `/pay` to see all available payment links
2. **Select Link**: Click on any payment link to open it
3. **Review Details**: Verify recipient, amount, and memo
4. **Connect Wallet**: Ensure your wallet is connected
5. **Execute Payment**: Click "Pay" to submit the transaction
6. **Confirm**: Sign the transaction in your wallet



### AI Generation
- `POST /api/generate-link` - Generate AI-powered payment template

### Payments
- `POST /api/payments` - Record payment transaction

### Transactions
- `POST /api/tx/transfer` - Generate unsigned transfer transaction
