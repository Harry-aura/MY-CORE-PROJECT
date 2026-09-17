# Architecture Specification: Limitless Engine

## 1. System Topology
The Limitless architecture separates real-time time tracking from quota policy enforcement.

### 1.1 Components
- **LimitlessConsole.java (Core Runtime)**: Standalone console application managing the scheduling thread, stdin listener, and threshold validation logic.
- **Web Client Portal (UI/UX)**: Single-page application implementing local storage caching, countdown timers, and progressive UI degradation when quotas near expiration.

## 2. Process Separation & Security
- The core Java process runs independently of the browser sandbox.
- Time accumulator threads are isolated from the input parser thread to prevent user prompts from freezing timer execution.
