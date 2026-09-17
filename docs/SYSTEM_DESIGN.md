# System Design & Concurrency Analysis

## 1. Concurrency Management
The Java runtime utilizes a dedicated background timer thread separate from the user interaction thread. Shared session state between threads is guarded to prevent race conditions during timer updates and simultaneous quota modifications.

## 2. Resource Constraints
- Zero external third-party libraries: No logging bloat or heavy dependency chains.
- Sub-20MB memory footprint allows the daemon to execute continuously in the background without degrading workstation gaming or compilation tasks.
