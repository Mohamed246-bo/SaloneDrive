# SaloneDrive 🚗

A modern transportation system for Sierra Leone featuring ride fare calculation, route management, and safety features for Keke, Taxi, and Poda Poda users.

## 🌐 Live Demo

**[View Live Website](https://Mohamed246-bo.github.io/SaloneDrive/)**

## ✨ Features

- 🚦 **Fare Calculator** - Calculate transport costs between Freetown locations
- 🗺️ **Interactive Map** - Google Maps integration showing Freetown
- 📱 **Mobile Responsive** - Works perfectly on all devices
- 🌙 **Dark Mode** - Theme toggle for comfortable viewing
- 🛡️ **Safety Guide** - Road safety tips and emergency contacts
- 🔐 **Authentication** - User registration and login with Firebase
- 🚗 **Ride Booking** - Book rides with drivers
- ⭐ **Ratings & Reviews** - Rate drivers and rides
- 📊 **Analytics** - Track trips and spending

## 🏗️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Database**: Firebase Firestore / PostgreSQL
- **Maps**: Google Maps API
- **Styling**: Modern CSS with Dark Mode support
- **Icons**: Font Awesome 6.5.1

## 📁 Project Structure

```
SaloneDrive/
├── index.html              # Main page
├── Safetyguide.html        # Safety guide page
├── index.css               # Styles (light/dark mode)
├── index.js                # Frontend logic
├── database.js             # Firebase integration
├── database-schema.sql     # SQL database schema
├── .env.example            # Environment variables template
└── .github/
    └── workflows/
        └── deploy.yml      # GitHub Actions deployment
```

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/Mohamed246-bo/SaloneDrive.git
cd SaloneDrive
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your Firebase credentials
```

### 3. Get Firebase Credentials
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create new project: "SaloneDrive"
3. Enable Firestore Database
4. Copy credentials to `.env`

### 4. Add Google Maps API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Enable Maps JavaScript API
3. Create API key
4. Add to HTML script tag

### 5. Open in Browser
```bash
# Start a local server
python -m http.server 8000
# Visit http://localhost:8000
```

## 📋 Pages

### Home Page (`index.html`)
- Fare calculator
- Popular routes display
- Trip summary in Uber-style cards
- Real-time fare updates

### Safety Guide (`Safetyguide.html`)
- 🚦 General road safety tips
- 🚖 Transport safety information
- 🚨 Emergency contacts
- 📍 Freetown-specific guidance

## 🗄️ Database Structure

### Firebase Collections
- **users** - User profiles and authentication
- **rides** - Ride bookings and history
- **drivers** - Driver information and ratings
- **safetyReports** - Safety incident reports

### SQL Tables (Alternative)
- users, drivers, rides, payments, reviews, locations
- See `database-schema.sql` for full schema

## 🔑 Key Functions

### Ride Management
```javascript
calculateFare()          // Calculate trip fare
bookRide()              // Create new ride
getUserRides()          // Fetch user's rides
updateRideStatus()      // Update ride status
```

### User Management
```javascript
registerUser()          // Create new account
loginUser()            // User authentication
getCurrentUser()       // Get logged-in user
```

### Safety
```javascript
reportSafetyIncident() // Report safety issue
getSafetyReports()     // Fetch incident reports
```

## 🎨 Dark Mode

Toggle dark mode with the theme button. Preference is saved to localStorage.

```javascript
toggleTheme()  // Toggle light/dark mode
loadTheme()    // Load saved theme preference
```

## 📱 Responsive Design

- ✅ Desktop (1024px+)
- ✅ Tablet (768px - 1023px)
- ✅ Mobile (< 768px)

## 🔒 Security

- HTML escaping for XSS protection
- Null checks for error handling
- Firebase authentication
- Input validation

## 📊 Deployment

### GitHub Pages (Free) ⭐
```bash
git push origin main
# Automatically deploys to: https://Mohamed246-bo.github.io/SaloneDrive/
```

### Vercel (Recommended)
1. Go to [Vercel](https://vercel.com)
2. Import GitHub repo
3. Deploy automatically

### Firebase Hosting
```bash
npm install -g firebase-tools
firebase init
firebase deploy
```

## 🧪 Testing Checklist

- [ ] Fare calculator works
- [ ] Dark mode toggles
- [ ] Map displays
- [ ] Mobile responsive
- [ ] Navigation links work
- [ ] Forms validate input
- [ ] Toast notifications display
- [ ] Firebase connection active

## 🐛 Common Issues

### Firebase Not Initializing
- Check `.env` file has correct credentials
- Ensure Firebase script is loaded
- Check browser console for errors

### Map Not Displaying
- Add Google Maps API key to HTML
- Check API is enabled in Google Cloud Console

### Database Connection Failed
- Verify Firebase project exists
- Check Firestore security rules
- Test authentication

## 📞 Emergency Contacts (Freetown)
- 🚨 Police: 999 / 019
- 🚑 Ambulance: 112
- 🔥 Fire Service: 019

## 📈 Performance

- ⚡ Lazy loading enabled
- 🎯 Optimized CSS
- 📦 Minimal dependencies
- 🔄 Caching with localStorage

## 🎯 Future Enhancements

- [ ] Real-time driver tracking
- [ ] Payment integration (mobile money)
- [ ] Push notifications
- [ ] Driver app
- [ ] Admin dashboard
- [ ] Analytics dashboard
- [ ] Multi-language support

## 📄 License

This project is open source and available under the MIT License.

## 👤 Author

**Mohamed246-bo** - [GitHub Profile](https://github.com/Mohamed246-bo)

## 🙏 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📍 About SaloneDrive

SaloneDrive is a transportation solution designed specifically for Sierra Leone's transport system. The name combines "Salone" (Sierra Leone's nickname) with "Drive".

---

**Made with ❤️ for Sierra Leone**