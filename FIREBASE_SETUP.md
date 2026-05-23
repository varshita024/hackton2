# Firebase Configuration Setup

To ensure the profile page shows actual signed-in user data instead of static/demo data, you need to configure Firebase properly.

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable Authentication (Email/Password provider)
4. Create a Firestore Database

## Step 2: Get Firebase Configuration

1. Go to Project Settings → General → Your apps
2. Add a Web app
3. Copy the configuration values

## Step 3: Create .env.local File

Create a `.env.local` file in the root directory with the following:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## Step 4: Firestore Security Rules

Set up Firestore rules to allow authenticated users to read/write their own data:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Step 5: Restart Development Server

After creating the `.env.local` file, restart your dev server:

```bash
npm run dev
```

## Current Data Flow

1. **Signup**: User signs up → Firebase Auth creates user → Firestore saves user document
2. **Profile**: User visits profile → Firebase Auth checks authentication → Firestore fetches user data → Profile displays real data

## Missing Field Issue

The signup page currently saves: `uid, fullName, email, phone, createdAt, role`
The profile page expects: `uid, fullName, email, phone, gender, role, createdAt`

The `gender` field is missing from the signup process. You may need to add it to the signup form or update existing user documents manually.
