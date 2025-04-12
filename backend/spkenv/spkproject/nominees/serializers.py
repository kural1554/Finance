# nominees/serializers.py
from rest_framework import serializers
from .models import Nominee, Applicant # Import Applicant if needed for validation/representation

class NomineeSerializer(serializers.ModelSerializer):
    # Explicitly define fields to match frontend keys and map to model fields using 'source'

    # Map frontend 'nomineeName' to model 'nominee_name'
    nomineeName = serializers.CharField(source='nominee_name', max_length=100)

    # Map frontend 'nomineeEmail' to model 'nominee_email'
    nomineeEmail = serializers.EmailField(source='nominee_email', required=False, allow_null=True, allow_blank=True)

    # Map frontend 'nomineeAddress' to model 'nominee_address'
    # Use style hint for textarea if using Browsable API
    nomineeAddress = serializers.CharField(source='nominee_address', style={'base_template': 'textarea.html'})

    # Map frontend 'nomineePhone' to model 'nominee_phone'
    # Model's RegexValidator will be applied automatically
    nomineePhone = serializers.CharField(source='nominee_phone', max_length=15)

    # Map frontend 'nomineeRelationship' to model 'nominee_relationship'
    # Use ChoiceField for better validation and representation based on model choices
    nomineeRelationship = serializers.ChoiceField(source='nominee_relationship', choices=Nominee.RELATIONSHIP_CHOICES)

    # Map frontend 'nomineeidProofType' to model 'nominee_id_proof_type'
    nomineeidProofType = serializers.ChoiceField(source='nominee_id_proof_type', choices=Nominee.ID_PROOF_CHOICES)

    # Map frontend 'nomineeidProofNumber' to model 'nominee_id_proof_number'
    nomineeidProofNumber = serializers.CharField(source='nominee_id_proof_number', max_length=50)

    # Map frontend 'nomineeidProofFile' to model 'nominee_id_proof_file'
    nomineeidProofFile = serializers.FileField(source='nominee_id_proof_file', required=False,allow_null=True,use_url=True) # use_url=True is default and usually desired

    # Map frontend 'nomineeProfilePhoto' to model 'nominee_photo'
    nomineeProfilePhoto = serializers.ImageField(source='nominee_photo', required=False, allow_null=True, use_url=True)

    # Optional: If you need to display the applicant ID when reading nominees
    # applicant_id = serializers.PrimaryKeyRelatedField(read_only=True, source='applicant.id')

    class Meta:
        model = Nominee
        # List the fields using the names DEFINED ABOVE (matching frontend keys)
        fields = [
            'id', # Include 'id' - it's read-only by default for existing instances
            'nomineeName',
            'nomineeEmail',
            'nomineeAddress',
            'nomineePhone',
            'nomineeRelationship',
            'nomineeidProofType',
            'nomineeidProofNumber',
            'nomineeidProofFile',
            'nomineeProfilePhoto',
            # DO NOT list 'applicant' here - it will be set manually in ApplicantSerializer
            # 'applicant_id' # Add this only if you want to explicitly show it on read
        ]
        # Ensure 'id' is read-only (it usually is by default in ModelSerializer but explicit is fine)
        read_only_fields = ('id',)

    def create(self, validated_data):
        # The 'applicant' is NOT in validated_data here because we didn't include it
        # in the fields list above. It must be added externally.
        # The standard ModelSerializer create works fine otherwise.
        return super().create(validated_data)

    def update(self, instance, validated_data):
        # Standard ModelSerializer update works fine.
        return super().update(instance, validated_data)
