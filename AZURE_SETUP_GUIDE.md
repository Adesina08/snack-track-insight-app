# Azure Setup Guide for SnackTrack

This guide will help you set up Microsoft Entra External ID authentication, Azure Functions backend, and deploy your app to Azure Static Web Apps.

## Part 1: Microsoft Entra External ID Setup

### 1. Create Microsoft Entra External ID Tenant

1. Go to [Azure Portal](https://portal.azure.com)
2. Create a new resource → Search "Microsoft Entra External ID"
3. Create a new external tenant:
   - Organization name: `SnackTrack`
   - Initial domain: `snacktrack` (will be `snacktrack.ciamlogin.com`)
   - Country: Select your country

### 2. Configure User Flows

1. In your External ID tenant, go to **User flows**
2. Create a **Sign up and sign in** user flow:
   - Name: `signupsignin`
   - Identity providers: Check "Email with password"
   - User attributes: First Name, Last Name, Email Address
   - Application claims: Display Name, Email Addresses, Given Name, Surname, User's Object ID

### 3. Register Your Application

1. Go to **App registrations** → **New registration**
2. Fill in:
   - Name: `SnackTrack Web App`
   - Supported account types: "Accounts in this organizational directory only"
   - Redirect URI: `Single-page application (SPA)` - `http://localhost:8080` (for development)
3. After creation, note down the **Application (client) ID** and **Directory (tenant) ID**
4. Go to **Authentication** → Add redirect URIs for production: `https://your-app-name.azurestaticapps.net`

### 4. Environment Variables for Development

Create these environment variables in your development environment:

```bash
VITE_ENTRA_EXTERNAL_CLIENT_ID=your-client-id-here
VITE_ENTRA_EXTERNAL_TENANT_NAME=snacktrack
VITE_ENTRA_EXTERNAL_TENANT_ID=your-tenant-id-here
VITE_API_BASE_URL=https://your-function-app.azurewebsites.net/api
```

## Part 2: Azure Functions Backend Setup

### 1. Create Function App

1. Azure Portal → Create resource → Function App
2. Configuration:
   - Function App name: `snacktrack-api`
   - Runtime: Node.js
   - Version: 18 LTS
   - Region: Choose closest to your users
   - Hosting plan: Consumption (Serverless)

### 2. Required Azure Services

Create these additional services:

#### Azure Database for PostgreSQL
1. Create flexible server
2. Note connection details for environment variables

#### Azure Blob Storage
1. Create storage account
2. Create container for media files
3. Generate SAS tokens for access

#### Azure Cognitive Services
1. Create Speech Services resource
2. Create Computer Vision resource

### 3. Environment Variables for Function App

In your Function App → Configuration → Application settings:

```bash
# Database
AZURE_POSTGRESQL_HOST=your-db-server.postgres.database.azure.com
AZURE_POSTGRESQL_DATABASE=snacktrack
AZURE_POSTGRESQL_USERNAME=your-username
AZURE_POSTGRESQL_PASSWORD=your-password

# Storage
AZURE_STORAGE_ACCOUNT_NAME=your-storage-account
AZURE_STORAGE_ACCOUNT_KEY=your-storage-key
AZURE_STORAGE_CONTAINER_NAME=media

# Cognitive Services
AZURE_SPEECH_KEY=your-speech-key
AZURE_SPEECH_REGION=your-region
AZURE_COMPUTER_VISION_KEY=your-vision-key
AZURE_COMPUTER_VISION_ENDPOINT=your-vision-endpoint

# Microsoft Entra External ID
ENTRA_EXTERNAL_TENANT_ID=your-tenant-id
ENTRA_EXTERNAL_CLIENT_ID=your-client-id
```

### 4. Deploy Function Code

You can deploy your Azure Functions using:
- Visual Studio Code with Azure Functions extension
- Azure CLI
- GitHub Actions (recommended for CI/CD)

## Part 3: Azure Static Web Apps Deployment

### 1. Connect to GitHub

1. Push your code to a GitHub repository
2. Azure Portal → Create resource → Static Web App
3. Configuration:
   - Source: GitHub
   - Repository: Select your repo
   - Branch: main
   - Build preset: React
   - App location: `/`
   - Output location: `dist`

### 2. Configure Environment Variables in Azure Portal

1. Go to your Static Web App → Configuration
2. Add these application settings:

```bash
VITE_ENTRA_EXTERNAL_CLIENT_ID=your-client-id
VITE_ENTRA_EXTERNAL_TENANT_NAME=snacktrack
VITE_ENTRA_EXTERNAL_TENANT_ID=your-tenant-id
VITE_API_BASE_URL=https://your-function-app.azurewebsites.net/api
```

### 3. Update Redirect URIs

1. Go back to Microsoft Entra External ID → App registrations
2. Add your production URL to redirect URIs:
   - `https://your-app-name.azurestaticapps.net`

## Part 4: Database Setup

Run this SQL script in your Azure PostgreSQL database:

```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    points INTEGER DEFAULT 0
);

-- Consumption logs table
CREATE TABLE consumption_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    product VARCHAR(255) NOT NULL,
    brand VARCHAR(255),
    category VARCHAR(100) NOT NULL,
    spend DECIMAL(10,2),
    companions TEXT,
    location VARCHAR(255),
    notes TEXT,
    media_url VARCHAR(500),
    media_type VARCHAR(20) CHECK (media_type IN ('photo', 'audio', 'video')),
    capture_method VARCHAR(20) CHECK (capture_method IN ('manual', 'ai')),
    ai_analysis JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    points INTEGER DEFAULT 0
);

-- Rewards table
CREATE TABLE rewards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    points_required INTEGER NOT NULL,
    category VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample rewards
INSERT INTO rewards (name, description, points_required, category) VALUES
('$5 Coffee Voucher', 'Enjoy a free coffee at participating cafes', 100, 'food'),
('$10 Restaurant Credit', 'Dining credit for popular restaurants', 200, 'food'),
('$25 Grocery Card', 'Gift card for grocery shopping', 500, 'food'),
('Premium Features', 'Unlock advanced analytics and insights', 300, 'premium');

-- Indexes for performance
CREATE INDEX idx_consumption_logs_user_id ON consumption_logs(user_id);
CREATE INDEX idx_consumption_logs_created_at ON consumption_logs(created_at);
CREATE INDEX idx_users_email ON users(email);
```

## Part 5: Testing Your Setup

1. **Local Development**: Test with `npm run dev`
2. **Authentication**: Verify Microsoft Entra External ID login works
3. **API Calls**: Test backend functions with authenticated requests
4. **Database**: Verify data is being stored correctly
5. **File Uploads**: Test media upload to Azure Blob Storage

## Security Notes

- Never commit API keys or secrets to your repository
- Use Azure Key Vault for production secrets
- Configure CORS properly in your Function App
- Enable HTTPS only for all Azure services
- Regularly rotate API keys and tokens

## Monitoring and Logs

- Use Azure Application Insights for monitoring
- Enable logging in your Function App
- Monitor Microsoft Entra External ID sign-in logs
- Set up alerts for failed authentications or API errors