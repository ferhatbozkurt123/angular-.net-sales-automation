@echo off
echo Kale Stok Takip uygulamasi baslatiliyor...
start "" "SalesAutomationAPI.exe"
timeout /t 5 /nobreak
start "" "http://localhost:7294"
echo Uygulama baslatildi. Bu pencereyi kapatabilirsiniz.
pause