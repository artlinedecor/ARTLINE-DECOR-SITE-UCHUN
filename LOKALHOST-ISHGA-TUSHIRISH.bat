@echo off
chcp 65001 >nul
title Artline Decor - Lokal Server
cd /d "E:\IT loihalar\ArTLINEDECOER"

echo ============================================
echo   ARTLINE DECOR - lokal server
echo ============================================
echo.
echo  Server ishga tushyapti... (1-2 daqiqa)
echo  Tayyor bo'lgach brauzer avtomatik ochiladi:
echo  http://localhost:3000
echo.
echo  Yopish uchun: bu oynani yoping yoki Ctrl+C
echo ============================================
echo.

REM node_modules yo'q bo'lsa - o'rnatamiz
if not exist "node_modules" (
  echo  Paketlar o'rnatilyapti, biroz kuting...
  call npm install
)

REM 15 soniyadan keyin brauzerni ochish (parallel)
start "" cmd /c "timeout /t 15 >nul & start http://localhost:3000"

REM Dev serverni ishga tushirish
call npm run dev

pause
