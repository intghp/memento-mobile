# Memento Mobile

> A minimalist and intelligent ecosystem in your pocket for habit tracking, task management, and daily notes. Designed for those seeking consistency without the visual clutter of complex apps, with a strong focus on privacy.

![Status](https://img.shields.io/badge/Status-In%20Development-yellow)
![Stack](https://img.shields.io/badge/Stack-React%20Native%20%7C%20Expo%20%7C%20SQLite-black)
![Privacy](https://img.shields.io/badge/Privacy-100%25%20Offline-success)

## ✨ Ideas

* **100% Offline and Private:** Your data never leaves your phone. There are no servers, cloud services, or hidden trackers.
* **Fair Habits:** The system does not punish you for unexpected events. Consistency is measured realistically.
* **Micro and Macro:** Focus on what matters today (Micro) and visualize your long-term consistency with the annual heatmap (Macro).
* **No Clutter:** An optimized local database that stores only what is essential, keeping the app lightweight and fast.

## 🚀 Main Features

### 🎯 Habits (Habit Tracker)

* **Flexible Goals:** Track qualitative habits (e.g., "Read") or quantitative ones (e.g., "2.5 Liters").
* **Time-of-Day Organization:** Organize your habits into Morning, Afternoon, or Evening to keep your routine clean.
* **Macro View (Dashboard):** An interactive heatmap displaying your progress over time.

### ✅ Daily Tasks (Task Manager)

* A straightforward interface for managing your day.
* Smart cleanup of completed tasks with a single click.

### 📝 Daily Notes (Journal)

* An integrated journal for recording your thoughts and reflecting on how your day went.
* Optimized automatic saving.

### ⚙️ Full Control

* **Backup and Restore:** Export all your data to a JSON file.
* **Multilingual:** Native support for Portuguese and English (i18n).
* **Native Dark Mode:** An interface designed for comfortable use at night.

## 🛠️ Technologies

The entire ecosystem was built with modern tools to ensure smoothness and reliability:

* **React Native & Expo:** A robust framework for cross-platform mobile development.
* **Zustand:** Lightweight and optimistic global state management.
* **Expo SQLite:** A fast local database running directly on the device.
* **React i18next:** Dynamic internationalization and translation engine.
* **Lucide Icons:** Clean and consistent iconography.

## 📦 How to Run Locally

Unlike the PC version, Memento Mobile does not require a backend running in parallel. All you need is Node.js installed and the **Expo Go** app on your phone.

**1. Clone the repository and navigate to the folder**

```bash
git clone https://github.com/seu-usuario/memento-mobile.git
cd memento-mobile
```

**2. Install the dependencies**

```bash
npm install
```

**3. Start the Expo server**

```bash
npx expo start
```

**4. Test it on your phone**

* Download the **Expo Go** app (available on the App Store or Google Play).
* Open your phone's camera and scan the **QR Code** that appeared in your terminal.
* The app will be compiled and opened instantly on your screen!
