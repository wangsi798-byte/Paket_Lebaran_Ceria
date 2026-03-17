#!/bin/bash
cd /root/.openclaw/workspace/sipale/backend
npm install
node -r dotenv/config scripts/seedData.js