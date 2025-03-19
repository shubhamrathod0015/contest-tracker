# TLE Tracker

## 🎥 Live Demo

Watch the full demo here: [TLE Tracker Demo](https://drive.google.com/drive/folders/1qGJR0v0uTknivP9c0NLtYwocIjtw6eI1?usp=drive_link)

---

## 🚀 Overview

TLE Tracker is a **MERN stack**-based platform designed to track competitive programming contests from **CodeChef, CodeForces, and LeetCode**. It includes features such as:

✅ **Bookmarking contests** (with authentication)\
✅ **JWT-based authentication**\
✅ **Admin panel for video uploads**\
✅ **Dark mode support**\
✅ **Fully responsive design**\
✅ **Loader animation for smooth UX**\
✅ **Automated contest fetching via cron jobs**\
✅ **YouTube integration for contest solution videos**

---

## 🛠 Tech Stack

### **Frontend:**

- React.js (with Vite for fast builds)
- Tailwind CSS for styling
- React Router for navigation
- React Hot Toast for notifications
- React Icons for UI enhancements

### **Backend:**

- Express.js (Node.js framework)
- MongoDB (via Mongoose for database operations)
- JWT for authentication
- Google APIs integration
- Node-cron for scheduled tasks

---

## 📌 API Endpoints (Server Routes)

### **Contest APIs**

| **Method** | **Endpoint**               | **Description**                         |
|-----------|--------------------------|-----------------------------------------|
| GET       | `/api/contests`           | Fetch all upcoming contests            |
| GET       | `/api/contests/:id`       | Fetch contest details by ID            |
| GET       | `/api/contests/all`  | Fetch CodeChef contests via API        |
| GET       | `/api/contests/all`| Fetch CodeForces contests via API      |
| GET       | `/api/contests/all`  | Fetch LeetCode contests via GraphQL API |

### **User & Authentication APIs**

| **Method** | **Endpoint**           | **Description**                        |
|-----------|------------------------|----------------------------------------|
| POST      | `/api/auth/register`    | Register a new user                   |
| POST      | `/api/auth/login`       | Login user and return JWT             |

### **Bookmark APIs**

| **Method** | **Endpoint**           | **Description**                        |
|-----------|------------------------|----------------------------------------|
| POST      | `/api/bookmarks`        | Add contest to bookmarks (Auth)       |
| GET       | `/api/bookmarks`        | Fetch user bookmarks (Auth)           |
| DELETE    | `/api/bookmarks/:id`    | Remove contest from bookmarks (Auth)  |

### **Solution APIs**

| **Method** | **Endpoint**           | **Description**                        |
|-----------|------------------------|----------------------------------------|
| POST      | `/api/solutions`        | Add a contest solution (Admin)        |
| GET       | `/api/solutions`        | Fetch contest solutions               |

### **Contest Fetching APIs**

| **Platform**    | **API Endpoint** |
|----------------|----------------|
| **CodeChef**   | [`https://www.codechef.com/api/list/contests/all?sort_by=START&sorting_order=asc&offset=0&mode=all`](https://www.codechef.com/api/list/contests/all?sort_by=START&sorting_order=asc&offset=0&mode=all) |
| **CodeForces** | [`https://codeforces.com/api/contest.list`](https://codeforces.com/api/contest.list) |
| **LeetCode**   | Uses GraphQL at [`https://leetcode.com/graphql`](https://leetcode.com/graphql) |

### **Cron Jobs**

- **Automated contest fetching** runs every few hours to update contest lists from CodeChef, CodeForces, and LeetCode.
- **YouTube video sync** automatically fetches the latest contest solution videos.

---

## ⚙ Installation & Setup

### **Backend**

1. Clone the repository and navigate to the backend folder:
   ```bash
   git clone https://github.com/amreshkyadav998/contest-tracker.git/server
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

---.

