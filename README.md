# QuickChat - Realtime Chat Web App

A modern, Firebase-powered realtime chat application with image sharing capabilities and a beautiful dark theme UI.

## Features

- **Realtime Messaging**: Messages appear instantly across all connected users
- **Image Sharing**: Upload and share images directly in the chat
- **User Profiles**: Custom profile pictures and names
- **System Messages**: Welcome messages when users join
- **Modern UI**: Dark theme with glassmorphism effects
- **Responsive Design**: Works perfectly on mobile and desktop
- **No Authentication Required**: Simple join process with just name and profile image

## File Structure

```
QuickChat/
├── index.html          # Home page - user join form
├── chat.html           # Chat room page
├── style.css           # Modern dark theme CSS
├── script.js           # Main JavaScript functionality
├── firebase-config.js  # Firebase configuration
└── README.md           # This file
```

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Backend**: Firebase Realtime Database
- **Storage**: Firebase Storage
- **UI**: Modern glassmorphism design with CSS gradients
- **Firebase SDK**: v9 (modular)

## Setup Instructions

### 1. Firebase Configuration

You'll need to set up a Firebase project:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing one
3. Enable **Realtime Database** and **Storage**
4. Update the `firebase-config.js` file with your Firebase configuration:

```javascript
const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-project.firebaseapp.com",
    databaseURL: "https://your-project-default-rtdb.firebaseio.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id"
};
```

### 2. Firebase Security Rules

#### Realtime Database Rules:
```json
{
  "rules": {
    "messages": {
      ".read": true,
      ".write": true
    }
  }
}
```

#### Storage Rules:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /images/{imageId} {
      allow read, write: if request.auth == null;
    }
  }
}
```

### 3. Local Development

Since this app uses ES6 modules, you'll need to serve it from a local server (not file:// protocol):

```bash
# Using Python (if installed)
python -m http.server 8000

# Using Node.js (if installed)
npx http-server

# Using PHP (if installed)
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

## Usage

### 1. Join the Chat
- Open `index.html` in your browser
- Enter your name (required)
- Optionally add a profile image URL
- Click "Join Chat"

### 2. Chat Features
- **Send Messages**: Type in the input field and press Enter or click Send
- **Upload Images**: Click the 📎 button to select and upload images
- **View Images**: Click on any image in the chat to view it in full size
- **Realtime Updates**: Messages appear instantly for all users

### 3. Message Format
Messages are stored in Firebase with this structure:
```javascript
{
  name: "User Name",
  profileImage: "Profile image URL",
  message: "Text message",      // For text messages
  imageURL: "Image URL",        // For image messages
  timestamp: 1234567890,
  isSystem: false               // true for system messages
}
```

## Customization

### Styling
- Modify `style.css` to change colors, fonts, or layout
- The app uses CSS custom properties for easy theme customization
- Glassmorphism effects can be adjusted by changing `backdrop-filter` values

### Features
- Add user authentication by integrating Firebase Auth
- Implement typing indicators
- Add emoji support
- Create private chat rooms
- Add message reactions

## Browser Support

- Chrome/Edge/Safari (latest versions)
- Firefox (latest versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Security Notes

- The current setup allows anonymous access for simplicity
- For production use, consider adding:
  - Firebase Authentication
  - Input validation and sanitization
  - Rate limiting
  - Content moderation

## Troubleshooting

### Common Issues:

1. **Messages not appearing**: Check Firebase configuration and database rules
2. **Images not uploading**: Verify Storage rules and file size limits
3. **Module import errors**: Ensure you're serving from a local server, not file://
4. **CORS errors**: Use a proper local server setup

### Debug Steps:

1. Check browser console for errors
2. Verify Firebase configuration in `firebase-config.js`
3. Check Network tab for failed requests
4. Ensure Firebase services are enabled in console

## License

This project is open source and available under the MIT License.

## Contributing

Feel free to submit issues and pull requests to improve QuickChat!

---

**QuickChat** - Simple, fast, and beautiful realtime chat! 🚀