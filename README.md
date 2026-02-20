# Personal Health Tracker

A React Native mobile application for logging daily health metrics, tracking symptoms, viewing historical health records, and receiving alerts for abnormal readings.

## 📋 Table of Contents

- [Setup Instructions](#setup-instructions)
- [Architecture](#architecture)
- [Design Decisions](#design-decisions)
- [Features](#features)
- [Assumptions](#assumptions)
- [Known Limitations](#known-limitations)

---

## 🚀 Setup Instructions

### Prerequisites

- Node.js (v18+)
- npm or yarn
- Expo CLI (`npx expo`)
- iOS Simulator / Android Emulator / Expo Go app

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd native-assesment

# Install dependencies
npm install

# Start the development server
npx expo start
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

### Mock Login Credentials

```
Email:    user@example.com
Password: password123
```

---

## 🏗 Architecture

### Folder Structure

```
src/
├── api/                    # API layer (mock REST endpoints)
│   ├── authApi.ts          # Authentication API (mock)
│   └── healthApi.ts        # Health entries CRUD API (mock)
│
├── components/             # Reusable UI components
│   ├── common/             # Generic components
│   │   ├── Button.tsx      # Button with variants & loading state
│   │   └── Input.tsx       # Text input with label & error
│   └── health/             # Domain-specific components
│       ├── HealthEntryCard.tsx  # History list item
│       ├── MetricCard.tsx      # Vital sign display card
│       └── SymptomSelector.tsx # Multi-select symptom chips
│
├── navigation/             # Navigation configuration
│   └── RootNavigator.tsx   # Auth/App stack switching
│
├── screens/                # Screen components (thin, orchestration only)
│   ├── LoginScreen.tsx
│   ├── DashboardScreen.tsx
│   ├── AddHealthEntryScreen.tsx
│   ├── HealthHistoryScreen.tsx
│   └── HealthEntryDetailScreen.tsx
│
├── services/               # Business logic (decoupled from UI)
│   ├── alertService.ts     # Abnormal value detection
│   ├── storageService.ts   # Local persistence abstraction
│   └── validationService.ts # Form validation rules
│
├── store/                  # Redux Toolkit state management
│   ├── index.ts            # Store configuration & typed hooks
│   └── slices/
│       ├── authSlice.ts    # Authentication state
│       └── healthSlice.ts  # Health entries state
│
├── types/                  # TypeScript type definitions
│   └── health.ts           # All application types
│
└── utils/                  # Shared utilities
    ├── constants.ts        # App-wide constants
    └── theme.ts            # Design tokens & styles
```

### Data Flow

```
User Action → Screen → Dispatch (Redux Thunk) → API Layer → Storage Service
                                                      ↓
                       Screen ← Selector ← Redux Store ← Reducer
```

### Key Architecture Principles

1. **Separation of Concerns**: Business logic (validation, alerts) lives in `/services` as pure functions — completely independent of React and UI components.

2. **API Abstraction**: The `/api` layer simulates REST endpoints with async/await and network delays. Swapping to a real backend requires only changing the API implementations.

3. **Thin Screens**: Screen components are orchestrators — they dispatch actions, select state, and compose components. No business logic resides in screens.

4. **Reusable Components**: Common UI elements (`Button`, `Input`, `MetricCard`) are parameterized and reusable across different screens.

---

## 💡 Design Decisions

### State Management: Redux Toolkit

**Why Redux Toolkit over Context API or Zustand:**

- **Scalability**: Redux provides a predictable, centralized state container. As the application grows (e.g., adding user profiles, medication tracking), Redux scales cleanly with its slice-based architecture.
- **Async Handling**: `createAsyncThunk` provides structured async flow with pending/fulfilled/rejected states — essential for API calls and loading/error state management.
- **DevTools**: Redux DevTools enable state inspection and time-travel debugging, critical for healthcare applications where data accuracy matters.
- **Selectors**: Memoized selectors (`selectTodayLatestEntry`, `selectSortedEntries`) prevent unnecessary re-renders by computing derived state efficiently.
- **Industry Standard**: Redux is widely adopted in enterprise healthcare applications, making the codebase familiar to most React Native developers.

### Storage Strategy

- **SecureStore** (`expo-secure-store`): Used for authentication tokens and user data. Leverages iOS Keychain / Android Keystore for encryption — appropriate for sensitive data in a health application.
- **AsyncStorage**: Used for health entries. While health data is sensitive, AsyncStorage is used here for the mock implementation. In production, this would be replaced with encrypted storage or a backend database.

### Mock API Design

The mock API layer simulates REST endpoints with:
- Async/await patterns matching real API usage
- Artificial network delays (800ms) for realistic loading states
- Clean interface that can be swapped with real endpoints

### UI Theme

Minimal black & white design with:
- Clear typographic hierarchy
- Red accents exclusively for health alerts and abnormal values
- Card-based layout for metric display
- Consistent spacing and border radius tokens

---

## ✨ Features

### Authentication
- Email/password login with form validation
- Error handling for invalid credentials
- Loading state with activity indicator
- Session persistence via SecureStore

### Dashboard
- Personalized greeting with user name
- Today's vital signs summary with MetricCards
- Empty state when no readings exist
- Pull-to-refresh for data updates
- Quick action buttons (Add Entry, View History)

### Add Health Entry
- Complete vital signs form (Heart Rate, BP, SpO2, Temperature)
- Multi-select symptom chips
- Optional notes field
- Real-time field-level validation with user-friendly error messages
- Health alert detection on save (Alert popup for abnormal values)

### Health History
- Chronologically sorted entry list (newest first)
- Visual indicators for abnormal values (red text, warning badges)
- Tap-to-view entry details
- Pull-to-refresh

### Health Alerts
- Automatic detection: HR > 120 bpm, SpO2 < 90%, Temp > 39°C
- Native Alert popup on entry save
- Visual warning badges on history cards
- Alert banner on entry detail screen

---

## 📌 Assumptions

1. **Mock Authentication**: Login is simulated with hardcoded credentials. In production, this would integrate with a secure auth provider (e.g., OAuth 2.0, Auth0).

2. **Predefined Symptom List**: Symptoms are limited to a curated list of 8 common symptoms. A production app would support custom symptoms and potentially ICD-10 coding.

3. **Single User**: The app assumes a single user per device. Multi-user support would require user switching and data isolation.

4. **Date Handling**: "Today's metrics" uses the device's local date. Timezone handling is simplified for the mock implementation.

5. **Data Persistence**: Health entries persist locally using AsyncStorage. No cloud sync or backup is implemented.

6. **Blood Pressure Ranges**: Systolic (60–250 mmHg) and Diastolic (40–150 mmHg) ranges are used as reasonable physiological bounds, with cross-validation that systolic > diastolic.

7. **FHIR Reference**: The data model is loosely inspired by FHIR Observation resources but is simplified for this assessment scope.

---

## ⚠️ Known Limitations

1. **No Backend Integration**: All data is stored locally. A production health app would require HIPAA-compliant backend infrastructure.

2. **No Biometric Authentication**: The app uses email/password only. Biometric auth (Face ID, fingerprint) would be recommended for a health application.

3. **No Data Export**: Users cannot export their health data (PDF, CSV). This would be important for sharing with healthcare providers.

4. **No Charts/Graphs**: Historical trends are displayed as a list only. Visual charts (line graphs, trend indicators) would enhance the user experience.

5. **No Offline-First Architecture**: While data persists locally, there's no sync queue for when connectivity is restored.

6. **No Edit/Delete**: Health entries cannot be modified or removed after creation.

7. **No Push Notifications**: Alerts are only triggered during data entry, not as scheduled reminders.

8. **Limited Testing**: The current test suite covers the minimum required tests (component, validation, business logic). A production app would require integration tests, E2E tests, and higher code coverage.

---

## 🧪 Testing

The application includes three categories of tests:

| Test Type | File | What It Tests |
|-----------|------|---------------|
| **Validation Utility** | `__tests__/services/validationService.test.ts` | All health metric validation rules, edge cases, cross-field validation |
| **Business Logic** | `__tests__/services/alertService.test.ts` | Alert detection for abnormal values, individual metric checks, utility functions |
| **Component** | `__tests__/screens/DashboardScreen.test.tsx` | User name rendering, empty state, action buttons, metric display |

---

## 📦 Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React Native | 0.81 | Mobile framework |
| Expo | SDK 54 | Development platform |
| TypeScript | 5.9 | Type safety |
| Redux Toolkit | 2.x | State management |
| React Navigation | 7.x | Navigation |
| AsyncStorage | 2.x | Local data persistence |
| Expo SecureStore | 15.x | Secure credential storage |
| Jest | 30.x | Testing framework |
| React Testing Library | 13.x | Component testing |
