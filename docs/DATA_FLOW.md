# Data Flow & Lifecycle Specification

## 1. Active State Flow
```text
[Session Start] --> [Register Target Category]
                         │
                         ▼
           [Initialize 1-Second Tick Cadence]
                         │
                         ▼
           [Accumulate Active Milliseconds]
                         │
                         ▼
           {Active Time >= Warning Threshold?}
                  ├── Yes ──> [Emit Warning Notification]
                  └── No ───> [Continue Ticking]
                         │
                         ▼
           {Active Time >= Hard Quota?}
                  ├── Yes ──> [Trigger Lockout State & Write Audit Entry]
                  └── No ───> [Loop to Next Tick]
```

## 2. Persistence Model
1. In the Web UI: Key-value snapshots stored under `localStorage.limitless_sessions`.
2. In the Java Daemon: Append-only log entries formatted as timestamped event strings.
