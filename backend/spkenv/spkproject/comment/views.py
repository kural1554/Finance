import requests
from rest_framework.response import Response
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import JSONParser, FormParser, MultiPartParser
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt  # Use only for testing; configure CSRF properly in production
@api_view(['GET', 'POST'])
@parser_classes([JSONParser, FormParser, MultiPartParser])  # Accept multiple formats
def combined_external_api(request):
    try:
        applicants_url = "http://127.0.0.1:8080/api/applicants/applicants/"
        banking_url = "http://127.0.0.1:8080/api/banking/bank-details/"
        
        if request.method == "POST":
            # Get data from request (supports both JSON & Form Data)
            data = request.data if request.content_type == 'application/json' else request.POST
            
            # Send POST request to all APIs
            applicants_response = requests.post(applicants_url, data=data)
            loans_response = requests.post(banking_url_url, data=data)

            return Response({
                "applicants": applicants_response.json() if applicants_response.status_code == 201 else "Failed",
                "banks": loans_response.json() if loans_response.status_code == 201 else "Failed",
            }, status=201)

        else:  # GET request
            applicants_response = requests.get(applicants_url)
            loans_response = requests.get(banking_url)

            applicants_data = applicants_response.json() if applicants_response.status_code == 200 else []
            banking_data = loans_response.json() if loans_response.status_code == 200 else []

            return Response({
                "applicants": applicants_data,
                "banks": banking_data
            })

    except requests.exceptions.RequestException as e:
        return Response({"error": str(e)}, status=500)
