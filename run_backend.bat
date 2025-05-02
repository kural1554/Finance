@echo off
cd backend
call spkenv\Scripts\activate
cd spkenv\spkproject
python manage.py runserver
pause