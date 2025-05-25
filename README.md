# 📈 **Profit View** – Dummy Stock Trading App

**Profit View** is a simulated trading platform with virtual money, offering **real-time market data** and comprehensive **profit tracking**.

---

## 🚀 **Key Features**

- 🔐 **Shoonya API Integration**: Access live market data seamlessly.
- 💸 **Virtual Trading Engine**: Simulate buy and sell orders risk-free.
- 📊 **Live Price Updates via SSE**: Get instant market movements.
- 🧠 **Zustand + RxJS State Management**: Robust and reactive frontend architecture.
- 🗂️ **Profit & Trade History Tracking**: Monitor your virtual portfolio performance.
- ⚡ **Redis-Powered Real-time Notifications**: Stay informed with instant alerts.
- 🕛 **Auto-clearing Notifications at Midnight**: Keep your notification feed clean.

---

## 🛠️ **Tech Stack**

### **Frontend**

| Technology    | Purpose                                  |
|---------------|------------------------------------------|
| **React + Vite** | Core framework                           |
| **Chakra UI** | Component Library                        |
| **TailwindCSS** | Modern UI styling                        |
| **Zustand** | **Global State Management** |
| **RxJS** | **Reactive Data Flows** |
| **SSE** | **Real-time Updates** |

### **Backend**

| Technology    | Purpose                                      |
|---------------|----------------------------------------------|
| **Redis** | **Pub/Sub & Data Storage** |
| **Shoonya API** | **Market Data Feed** |
| **BullMQ** | **Background Job Processing** |
| **MongoDB** | User Data & Trade History                    |
| **Express.js** | **REST API & SSE Endpoints** |

---


## 🧪 Local Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/profit-view.git
cd profit-view
```

### 2. Start Redis & MongoDB
You can use Docker or local installations

```bash
docker-compose up -d redis mongo
```

### 3. Configure Environment
Create a .env file in the server/ directory:

```bash

SHOONYA_API_KEY=your_key
SHOONYA_USER_ID=your_id
SHOONYA_PASSWORD=your_pass
REDIS_URL=redis://localhost:6379
MONGODB_URI=mongodb://localhost:27017/profitview
```

### 4. Install & Run the App
Backend

```bash

cd backend
npm install
npm start
```

Backend

```bash

cd frontend
npm install
npm run dev
```

Worker 

```bash
node worker.js 
```

Cron Job 

```bash

cd backend/cron_jobs
node portfolioPerformance.js

```

The frontend runs on http://localhost:5173

The backend runs on http://localhost:3000


    
## 📌 Design Highlights

- **SSE over WebSockets**: Lightweight, unidirectional live updates from server
- **Redis Pub/Sub**: Decoupled data delivery for real-time speed  
- **BullMQ**: Background job processing for trading operations
- **RxJS + Zustand**: Reactive + predictable state on the frontend


## 🤝 Contributing
Pull requests are welcome! For major changes, open an issue first to discuss what you’d like to change.


## 🙌 Acknowledgements

- **Shoonya API** - For market data integration  
- **Redis** - Real-time pub/sub functionality  
- **RxJS** - Reactive programming support  
- **Zustand** - State management solution  

Built with 💙 for trading enthusiasts and developers alike.
