@echo off
cd backend
call spkenv\Scripts\activate
cd spkproject
python manage.py runserver
pause