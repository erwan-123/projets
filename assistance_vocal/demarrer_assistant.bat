@echo off

echo ==============================
echo   DEMARRAGE DE L'ASSISTANT
echo ==============================

cd /d "C:\Users\NGANSOP STEVE\Documents\projets\assistance_vocal"

echo.
echo Dossier du projet trouve.
echo.

call ".venv\Scripts\activate.bat"

echo Environnement Python active.
echo.

python main.py

echo.
echo ==============================
echo   LE PROGRAMME EST TERMINE
echo ==============================
pause