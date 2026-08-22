# MediConnect 🏥

> **“Find the Right Medicine. Right Place. Right Time.”**  
> *Last-Mile Medicine Discovery and Confirmation Platform connecting patients with neighbourhood pharmacies.*

---

## 💡 The Problem & Core Innovation

### The Problem
During illness or emergency, medicines often exist locally, but people don't know **which** nearby pharmacy has them. This forces patients or caregivers to visit 3–5 pharmacies physically, wasting critical time, fuel, money, and health.

### The Innovation: Request & Confirm
Small neighbourhood pharmacies rarely use complex ERP inventory software. MediConnect solves this:
1. **1-Tap Availability Updates:** Pharmacists update status (*Available / Low Stock / Out of Stock*) in **under 3 seconds**.
2. **Request & Confirm:** If information is aging or uncertain, the customer taps **“Request Availability”**. The pharmacist receives an instant alert and taps **[✓ Available]** or **[✕ Not Available]**.
3. **Reserve for Pickup:** The customer receives a **Pickup Code** (`MC-XXXX`) with a 3-hour hold guarantee and visits the exact store with confidence.

---

## 🛠️ Technology Stack (MERN)

- **Frontend:** React 18, React Router v6, Lucide Icons, Pure Vanilla CSS Design System (clean, accessible healthcare tech theme).
- **Backend:** Node.js, Express.js REST API.
- **Database:** MongoDB & Mongoose *(with auto-fallback in-memory data store for instant zero-config hackathon execution)*.
- **Authentication:** JWT (JSON Web Tokens) with Bcrypt password hashing and role-based access control.

---

## 🚀 Quick Start (Local Run)

### 1. Clone Repository
```bash
git clone https://github.com/SIDDHESHKEW/Medi-connect.git
cd Medi-connect
```

### 2. Start Backend Server
```bash
cd server
npm install
npm start
```
*The server will start at `http://localhost:5000` with pre-populated demo seed data.*

### 3. Start Frontend Client
```bash
cd ../client
npm install
npm run dev
```
*Open `http://localhost:5173` in your browser.*

---

## 🧪 1-Click Hackathon Demo Credentials

For judging and evaluation, the login page features instant **1-Click Demo Buttons**:

| Role | Email | Password | What You Can Test |
| :--- | :--- | :--- | :--- |
| **Customer** | `customer@mediconnect.com` | `password123` | Search, send availability inquiries, reserve medicine, pickup tracking, community feedback |
| **Pharmacist** | `pharmacist@mediconnect.com` | `password123` | 1-tap inventory status updater, live request approval queue, confirm in-store collection |
| **Admin** | `admin@mediconnect.com` | `adminpassword` | Verify pharmacies, manage global medicine catalogue, user management, audit reports |

---

## 🎬 2-Minute Demo Workflow (Judging Guide)

1. **Step 1 (Customer):** Log in as **Customer** &rarr; Search **"Paracetamol 650"**.
2. **Step 2 (Discover):** View nearby pharmacies (e.g. *ABC Medical Store*, *HealthPlus*), live distance, freshness indicators (*"Updated 8 mins ago"*), and confidence ratings.
3. **Step 3 (Request Availability):** Click **[Request Availability]** for an uncertain pharmacy.
4. **Step 4 (Pharmacist Response):** Log out &rarr; 1-click log in as **Pharmacist** &rarr; Go to **Requests** &rarr; Click **[✓ Available]**.
5. **Step 5 (Reserve):** Switch back to Customer &rarr; See confirmed status &rarr; Click **[Reserve Medicine]** &rarr; A unique pickup code (e.g. `MC-8421`) is generated!
6. **Step 6 (Collect):** Pharmacist views the reservation in **Pickups** &rarr; Clicks **[Confirm Collection]**.
7. **Step 7 (Community Feedback):** Customer submits verification (*"Was it available? [Yes]"*) to boost pharmacy trust score.

---

## ⚙️ MongoDB Atlas & JWT Configuration Guide

The application runs instantly out of the box with the built-in demo engine. When you are ready to connect your production MongoDB Atlas database:

### 1. Create MongoDB Atlas Database
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up / log in.
2. Create a free **M0 Sandbox Cluster**.
3. Under **Database Access**, create a database user (e.g., `mediconnect_admin`) with a password.
4. Under **Network Access**, add IP address `0.0.0.0/0` (allow from anywhere).
5. Under **Clusters**, click **Connect** &rarr; **Connect your application** &rarr; copy the connection string:
   ```text
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/mediconnect?retryWrites=true&w=majority
   ```

### 2. Generate a Secure JWT Secret
Run in your terminal:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Update `server/.env`
Open `server/.env` and paste your credentials:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/mediconnect?retryWrites=true&w=majority
JWT_SECRET=your_generated_secure_jwt_secret_here
CLIENT_URL=http://localhost:5173
```

### 4. Seed Production MongoDB Data
```bash
cd server
npm run seed
```
*All realistic pharmacies, medicines, stock levels, and user accounts will be populated into your MongoDB cluster.*

---

## 📡 REST API Structure

| Endpoint | Method | Role | Description |
| :--- | :--- | :--- | :--- |
| `/api/auth/register` | `POST` | Public | Register Customer or Pharmacy Owner |
| `/api/auth/login` | `POST` | Public | JWT login with role metadata |
| `/api/auth/me` | `GET` | Private | Get authenticated profile |
| `/api/medicines/search` | `GET` | Public | Geospatial/distance search with freshness scoring |
| `/api/medicines` | `GET/POST` | Public/Admin | Medicine catalogue management |
| `/api/pharmacies/nearby` | `GET` | Public | Nearby pharmacies list sorted by km |
| `/api/pharmacies/:id` | `GET/PUT` | Public/Pharmacist | Pharmacy profile & full stock catalogue |
| `/api/inventory/:id/status` | `PUT` | Pharmacist | Instant 1-tap availability updater (`available`, `low`, `out`) |
| `/api/requests` | `POST/GET` | Customer/Pharmacist | Send availability inquiry & fetch queues |
| `/api/requests/:id/respond` | `PUT` | Pharmacist | 1-click respond (`available` / `not_available`) |
| `/api/reservations` | `POST/GET` | Customer/Pharmacist | Create & view pickup hold reservations |
| `/api/reservations/:id` | `PUT` | Private | Mark collected or cancel |
| `/api/reports` | `POST/GET` | Customer/Admin | Community verification feedback |
| `/api/admin/stats` | `GET` | Admin | System metrics & overview statistics |

---

## 🏆 Hackathon Objective

> **“Don’t make people visit multiple pharmacies to find one medicine.”**
