
# TLE Tracker

## 🎥 Live Demo

Watch the full demo of ADMIN here: [TLE Tracker Demo](https://drive.google.com/file/d/1sgke5X_JJgzD4upKFMkl0vEUAXjEhtcA/view?usp=drive_link)

Watch the full demo of USER here: [TLE Tracker Demo](https://drive.google.com/file/d/17Oj6Tl7P3qKn0rUj6BpyaUEZbYPWKjP-/view?usp=drive_link)

---

## 🚀 Overview

TLE Tracker is a **MERN stack**-based platform designed to track competitive programming contests from **CodeChef, CodeForces, and LeetCode**. It includes features such as:

## **📜 Features**  
- ✅ User Authentication (Signup, Login, Google OAuth)  
- ✅ JWT Authentication (Access & Refresh Tokens)  
- ✅ Fetch Upcoming & Past Contests (From Codeforces, CodeChef*, and LeetCode* APIs)  
- ✅ Bookmark Contests (Logged-in users can save contests)  
- ✅ Filter by Platform (View contests from selected platforms)  
- ✅ Admin Access (Admins can add YouTube solution links for past contests)  
- ✅ Responsive UI (Optimized for Mobile & Tablet)  
- ✅ Light/Dark Mode Toggle  

---

## 🛠 Tech Stack

### **Frontend:**

- React.js ⚛️ (with React Context for state management)
- Material-UI 🎨 (for styling and responsiveness)

### **Backend:**

- Express.js (Node.js framework)
- MongoDB (via Mongoose for database operations)
- JWT for authentication
- Google APIs Integration
- CLIST API Integration

---

## 📌 API Endpoints (Server Routes)

### **Contest APIs**

| **Method** | **Endpoint**               | **Description**                         |
|------------|----------------------------|-----------------------------------------|
| GET        | `/api/contests/upcoming`          | Get upcoming contests                  |
| GET        | `/api/contests/upcoming?plateform`| Get upcoming contests filter by platform |
| GET        | `/api/contests/past`              | Get Past Contests                       |
| GET        | `/api/contests/past?plateform`    | Get past contests filter by platform    |

### **User & Authentication APIs**

| **Method** | **Endpoint**           | **Description**                        |
|------------|------------------------|----------------------------------------|
| POST       | `/api/auth/signup`     | Register a new user                    |
| POST       | `/api/auth/login`      | Login user and return JWT              |

### **Bookmark APIs**

| **Method** | **Endpoint**           | **Description**                        |
|------------|------------------------|----------------------------------------|
| POST       | `/api/bookmarks`       | Add contest to bookmarks (Auth)        |
| GET        | `/api/bookmarks`       | Fetch user bookmarks (Auth)            |
| DELETE     | `/api/bookmarks/:id`   | Remove contest from bookmarks (Auth)   |

### **Solution APIs**

| **Method** | **Endpoint**           | **Description**                        |
|------------|------------------------|----------------------------------------|
| POST       | `/api/solutions`       | Add a contest solution (Admin)         |
| GET        | `/api/solutions`       | Fetch contest solutions                |

### **Contest Fetching CLIST APIs**

- **Automated contest fetching** runs every few hours to update contest lists from CodeChef, CodeForces, and LeetCode.
- **YouTube video sync** automatically fetches the latest contest solution videos.

---

## ⚙ Installation & Setup

### **Backend**

1. Clone the repository and navigate to the backend folder:
   ```bash
   git clone https://github.com/shubhamrathod0015/contest-tracker.git/server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and add the required environment variables.
4. Start the backend server:
   ```bash
   npm start
   ```

### **Frontend**

1. Navigate to the frontend folder:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend:
   ```bash
   npm run dev
   ```

---

## 🔗 Future Improvements

- **User Profile Management** (Track user activity)
- **Push Notifications** (Upcoming contest alerts)
- **Leaderboard System** (Competitive tracking)
- **YouTube Video Sync** (Auto-fetch latest videos via YouTube API)

---

## 👥 Contributors

- **Shubham Rathod** (Frontend Developer, MERN Stack Developer)  

---

