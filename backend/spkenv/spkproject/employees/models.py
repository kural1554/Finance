from django.db import models
import uuid

class EmployeeDetails(models.Model):
    EMPLOYEE_TYPE = [
        (1, 'ADMIN'),
        (2, 'MANAGER'),
        (3, 'APPLICANT'),
    ]
    TITLE_CHOICES = [
        (1, 'Mr.'),
        (2, 'Mrs.'),
        (3, 'Ms.'),
        (4, 'Dr.'),
    ]
    GENDER_CHOICES = [
        (1, 'Male'),
        (2, 'Female'),
    ]

    employeeID = models.CharField(max_length=12, unique=True, editable=False)
    title = models.SmallIntegerField(choices=TITLE_CHOICES,blank=True,default=1)
    emp_type = models.SmallIntegerField(choices=EMPLOYEE_TYPE, default=1,blank=True)
    empfirst_name = models.CharField(max_length=50)
    empfather_name = models.CharField(max_length=50)
    gender = models.SmallIntegerField(choices=GENDER_CHOICES,blank=True,default=1)
    address = models.TextField(null=True, blank=True)
    email = models.EmailField(max_length=50, unique=True)
    phone = models.CharField(max_length=15)
    date_of_birth = models.DateField(null=True)
    employee_photo = models.ImageField(upload_to="uploads/images/employee/", null=True, blank=True)

    def save(self, *args, **kwargs):
        """ Generate a unique employee ID """
        if not self.employeeID:
            while True:
                new_id = f"EMP{uuid.uuid4().hex[:6].upper()}"
                if not EmployeeDetails.objects.filter(employeeID=new_id).exists():
                    self.employeeID = new_id
                    break
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.empfirst_name} ({self.get_emp_type_display()}) - {self.employeeID}"
