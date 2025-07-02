# 💹 Profit View  

**Profit View** is a real-time virtual trading platform that simulates market conditions using live data. Practice trading strategies, track performance, and learn market dynamics - all with virtual funds.  


# 🎥 Watch the Demo:

<p align="center">
  <a href="https://youtu.be/0KXy0Izqw7Y" target="_blank">
    <img src="https://img.youtube.com/vi/0KXy0Izqw7Y/0.jpg" alt="Watch Profit View Demo" width="600"/>
  </a>
</p>


## 🧰 Tech Stack  

### Frontend  
- **React** - Core framework  
- **Tailwind CSS** - Modern styling  
- **Zustand** - State management
- **RxJS** - Reactive Stream Handling 

### Backend  
- **Node.js + Express** - API server  
- **Server-Sent Events** - Real-time updates  
- **Redis** - Caching & Pub/Sub  
- **BullMQ** - Queue management  
- **Node Workers** - Background processing


## 🔑 Key Components

| Component                     | Description                                                                 |
|-------------------------------|-----------------------------------------------------------------------------|
| **Shoonya API**               | Connects to financial data provider                                         |
| **Backend Server**            | Central data processing hub                                                 |
| **Server-Sent Events (SSE)**  | Pushes real-time updates to frontend                                        |
| **Redis**                     | Data caching and Pub/Sub messaging                                          |
| **BullMQ**                    | Background job management                                                   |
| **Worker**                    | Processes async tasks (transactions, balances)                              |
| **Frontend**                  | React app with Zustand state and RxJS streams                               |



## 🔄 Architecture  

<br>

![image](https://github.com/user-attachments/assets/26552548-a3e3-4495-862e-fad17e99e05b)

</br>


## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/your-username/profit-view.git
cd profit-view
```

### 2. Install Node modules in backend and frontend 
```bash
cd profit-view/backend
npm i

cd profit-view/frontend
npm i 
```

### 3. Start Backend
```bash
cd profit-view/backend
npm start
```

### 4. Start Frontend

```bash
cd profit-view/frontend
npm run dev
```

### 5. Start Worker Processing 

``` bash
cd profit-view
node worker.js
```

### 6. Start Cron Job For Portfoio Performance

```bash
cd profit-view/backend/cron_job
node portfolio_performance.js
```


## 📡 Features

- ✅ **Real-time price tracking**
- 💰 **Virtual trading environment**
- ⚡ **Reactive frontend using RxJS**
- 📦 **Persistent job queue with Redis & BullMQ**
- 🏗️ **Modular and scalable backend architecture**

---

## 📌 Future Enhancements

- 🔐 **User authentication & portfolio management**
- 🔄 **WebSocket support** (upgrade from SSE)
- 📊 **Advanced charting & analytics**
- 🗓️ **Daily/weekly trading summaries**

