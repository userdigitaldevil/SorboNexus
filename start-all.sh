#!/bin/bash

# Start backend
echo "Starting backend..."
cd backend
npm install
npm run dev &
BACKEND_PID=$!

# Start frontend
echo "Starting frontend..."
cd ..
npm install
npm run dev &
FRONTEND_PID=$!

# Trap Ctrl+C and kill both
trap "kill $BACKEND_PID $FRONTEND_PID" SIGINT

# Wait for both to exit
wait $BACKEND_PID $FRONTEND_PID 