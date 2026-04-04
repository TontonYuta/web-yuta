@echo off
title Git Auto Push Script

echo ===============================
echo   GIT AUTO COMMIT ^& PUSH
echo ===============================
echo.

set /p msg=Nhap commit message:

echo.
echo Dang add file...
git add .

echo.
echo Xoa build-apk.bat khoi Github (nhung giu tren may)...
git rm --cached build-apk.bat 2>nul

echo.
echo Dang commit...
git commit -m "%msg%"

echo.
echo Dang push...
git push

echo.
echo ===============================
echo   HOAN THANH
echo ===============================
pause
