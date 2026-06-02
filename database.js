// ==========================
// DATABASE CONFIGURATION
// ==========================

// Firebase Configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "salonedrive.firebaseapp.com",
  projectId: "salonedrive-db",
  storageBucket: "salonedrive-db.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
try {
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  const auth = firebase.auth();
  console.log("✅ Firebase initialized successfully");
} catch (error) {
  console.error("❌ Firebase initialization error:", error);
}

// ==========================
// DATABASE STRUCTURE
// ==========================
/*
Collections:
1. users
   - uid (string)
   - name (string)
   - email (string)
   - phone (string)
   - createdAt (timestamp)

2. rides
   - rideId (string)
   - userId (string)
   - from (string)
   - to (string)
   - fare (number)
   - transportType (string)
   - status (string) - pending, confirmed, completed, cancelled
   - driverName (string)
   - timestamp (timestamp)

3. drivers
   - driverId (string)
   - name (string)
   - phone (string)
   - vehicle (string)
   - rating (number)
   - active (boolean)
   - createdAt (timestamp)

4. safetyReports
   - reportId (string)
   - userId (string)
   - incident (string)
   - location (string)
   - severity (string) - low, medium, high
   - timestamp (timestamp)
*/

// ==========================
// USER FUNCTIONS
// ==========================

// Register User
async function registerUser(email, password, name, phone) {
  try {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const uid = userCredential.user.uid;

    await db.collection("users").doc(uid).set({
      uid: uid,
      name: name,
      email: email,
      phone: phone,
      createdAt: new Date(),
      avatar: "",
      rating: 5
    });

    console.log("✅ User registered:", uid);
    return uid;
  } catch (error) {
    console.error("❌ Registration error:", error.message);
    throw error;
  }
}

// Login User
async function loginUser(email, password) {
  try {
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    console.log("✅ User logged in:", userCredential.user.uid);
    return userCredential.user;
  } catch (error) {
    console.error("❌ Login error:", error.message);
    throw error;
  }
}

// Get Current User
function getCurrentUser() {
  return auth.currentUser;
}

// Logout User
async function logoutUser() {
  try {
    await auth.signOut();
    console.log("✅ User logged out");
  } catch (error) {
    console.error("❌ Logout error:", error);
  }
}

// ==========================
// RIDE FUNCTIONS
// ==========================

// Create Ride
async function createRide(from, to, fare, transportType) {
  try {
    const user = getCurrentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const rideData = {
      rideId: db.collection("rides").doc().id,
      userId: user.uid,
      from: from,
      to: to,
      fare: fare,
      transportType: transportType,
      status: "pending",
      driverName: "",
      timestamp: new Date(),
      rating: 0
    };

    await db.collection("rides").doc(rideData.rideId).set(rideData);
    console.log("✅ Ride created:", rideData.rideId);
    return rideData;
  } catch (error) {
    console.error("❌ Ride creation error:", error.message);
    throw error;
  }
}

// Get User Rides
async function getUserRides() {
  try {
    const user = getCurrentUser();
    if (!user) throw new Error("User not authenticated");

    const snapshot = await db.collection("rides")
      .where("userId", "==", user.uid)
      .orderBy("timestamp", "desc")
      .get();

    const rides = [];
    snapshot.forEach(doc => {
      rides.push(doc.data());
    });

    console.log("✅ Rides retrieved:", rides.length);
    return rides;
  } catch (error) {
    console.error("❌ Error fetching rides:", error.message);
    return [];
  }
}

// Update Ride Status
async function updateRideStatus(rideId, status) {
  try {
    await db.collection("rides").doc(rideId).update({
      status: status,
      updatedAt: new Date()
    });
    console.log("✅ Ride status updated:", status);
  } catch (error) {
    console.error("❌ Update error:", error.message);
  }
}

// Cancel Ride
async function cancelRide(rideId) {
  try {
    await updateRideStatus(rideId, "cancelled");
    showToast("✅ Ride cancelled");
  } catch (error) {
    console.error("❌ Cancel error:", error.message);
  }
}

// ==========================
// DRIVER FUNCTIONS
// ==========================

// Register Driver
async function registerDriver(name, phone, vehicle) {
  try {
    const user = getCurrentUser();
    if (!user) throw new Error("User not authenticated");

    const driverId = user.uid;
    await db.collection("drivers").doc(driverId).set({
      driverId: driverId,
      name: name,
      phone: phone,
      vehicle: vehicle,
      rating: 5,
      active: true,
      createdAt: new Date(),
      totalRides: 0
    });

    console.log("✅ Driver registered:", driverId);
    return driverId;
  } catch (error) {
    console.error("❌ Driver registration error:", error.message);
    throw error;
  }
}

// Get Driver Profile
async function getDriverProfile(driverId) {
  try {
    const doc = await db.collection("drivers").doc(driverId).get();
    if (doc.exists) {
      console.log("✅ Driver profile retrieved");
      return doc.data();
    } else {
      throw new Error("Driver not found");
    }
  } catch (error) {
    console.error("❌ Error fetching driver profile:", error.message);
    return null;
  }
}

// ==========================
// SAFETY REPORT FUNCTIONS
// ==========================

// Report Safety Incident
async function reportSafetyIncident(incident, location, severity) {
  try {
    const user = getCurrentUser();
    if (!user) throw new Error("User not authenticated");

    const reportData = {
      reportId: db.collection("safetyReports").doc().id,
      userId: user.uid,
      incident: incident,
      location: location,
      severity: severity, // low, medium, high
      timestamp: new Date(),
      resolved: false
    };

    await db.collection("safetyReports").doc(reportData.reportId).set(reportData);
    console.log("✅ Safety report submitted:", reportData.reportId);
    return reportData;
  } catch (error) {
    console.error("❌ Report submission error:", error.message);
    throw error;
  }
}

// Get Safety Reports
async function getSafetyReports() {
  try {
    const snapshot = await db.collection("safetyReports")
      .orderBy("timestamp", "desc")
      .limit(20)
      .get();

    const reports = [];
    snapshot.forEach(doc => {
      reports.push(doc.data());
    });

    console.log("✅ Safety reports retrieved:", reports.length);
    return reports;
  } catch (error) {
    console.error("❌ Error fetching reports:", error.message);
    return [];
  }
}

// ==========================
// REAL-TIME LISTENERS
// ==========================

// Listen to User Rides
function listenToUserRides(callback) {
  const user = getCurrentUser();
  if (!user) return;

  db.collection("rides")
    .where("userId", "==", user.uid)
    .orderBy("timestamp", "desc")
    .onSnapshot((snapshot) => {
      const rides = [];
      snapshot.forEach(doc => {
        rides.push(doc.data());
      });
      callback(rides);
    });
}

// Listen to Active Rides
function listenToActiveRides(callback) {
  db.collection("rides")
    .where("status", "==", "pending")
    .onSnapshot((snapshot) => {
      const rides = [];
      snapshot.forEach(doc => {
        rides.push(doc.data());
      });
      callback(rides);
    });
}

// ==========================
// ANALYTICS FUNCTIONS
// ==========================

// Get User Statistics
async function getUserStats() {
  try {
    const user = getCurrentUser();
    if (!user) throw new Error("User not authenticated");

    const ridesSnapshot = await db.collection("rides")
      .where("userId", "==", user.uid)
      .get();

    const totalSpent = ridesSnapshot.docs.reduce((sum, doc) => sum + doc.data().fare, 0);
    const completedRides = ridesSnapshot.docs.filter(doc => doc.data().status === "completed").length;

    return {
      totalRides: ridesSnapshot.size,
      completedRides: completedRides,
      totalSpent: totalSpent,
      averageFare: totalSpent / (completedRides || 1)
    };
  } catch (error) {
    console.error("❌ Error fetching stats:", error.message);
    return null;
  }
}

// ==========================
// EXPORT FUNCTIONS
// ==========================
// These are available globally and can be called from HTML onclick handlers