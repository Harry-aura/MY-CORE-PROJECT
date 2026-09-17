# Technical Interview Defense Guide

### Q1: Why provide both a Java console application and a Web application for the same product?
> **Answer**: Web browsers execute inside a strict sandbox; a web page cannot terminate external operating system processes or enforce OS-level application killswitches. The Web UI provides a clean user dashboard, while the Java application provides an operating system runtime daemon capable of background session enforcement.

### Q2: How is timer drift handled when tracking long continuous durations?
> **Answer**: Rather than repeatedly accumulating variable thread sleep intervals (`Thread.sleep(1000)`), the engine checks against `System.currentTimeMillis()` relative to baseline session origin timestamps, eliminating drift accumulated over multi-hour runs.

### Q3: How could this architecture scale to enterprise workstation monitoring?
> **Answer**: By replacing local file log emission with a lightweight syslog/HTTPS emitter that forwards session duration heartbeats to a central PostgreSQL/Grafana reporting cluster.
