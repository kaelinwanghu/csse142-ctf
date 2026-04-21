# CSSE142 CTF — Fibonacci Fanboy

A multi-stage web CTF challenge built around math themes and the Fibonacci sequence.

## Challenge Overview

### Stage 1 — SQL Injection
Players are presented with a math-themed login page. The login is vulnerable to a SQL UNION injection that must query a specific hidden table in the database to extract credentials and gain access. A simple `' OR 1=1 --` won't cut it — players need to enumerate the schema and craft a correct UNION-based payload.

### Stage 2 — HTTP Header
After a successful injection, players land on a Fibonacci-fanboy themed page. Somewhere in the page's HTML is a hint specifying a custom HTTP header that must be attached to a request against a particular route on the server (e.g. a search endpoint). The header name and/or value is hidden in the page.

### Stage 3 — Steganography
Sending the correct HTTP request returns an image file. The flag is hidden inside the image using steganography (similar to Kaelin's challenge). The starting byte is hinted at either by the image's filename or by text on the Fibonacci fanboy page. From that starting byte, subsequent flag bytes are extracted at Fibonacci-sequence offsets (byte 1, 1, 2, 3, 5, 8, 13, … from the start).

## Infrastructure Needed
- A server or VM to host the site
- A backend with a real SQL database (the injection must work against an actual query)
- The HTTP route that checks for the custom header and serves the image
- The image file with the flag embedded via steganography

## Current State
- `index.html` — placeholder Fibonacci fanboy themed page (login UI + dashboard)
- SQL injection login, backend server, HTTP header route, and stego image are not yet implemented
