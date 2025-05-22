from rest_framework import permissions
from django.contrib.auth.models import Group # Import Group if not already

def _is_in_group(user, group_name):
    """
    Helper function to check if an authenticated user belongs to a specific group.
    """
    if user and user.is_authenticated:
        # Check if the group exists first to avoid errors if it's misspelled or not created
        try:
            group = Group.objects.get(name=group_name)
            return user.groups.filter(name=group.name).exists()
        except Group.DoesNotExist:
            return False # Group itself doesn't exist
    return False

class IsSuperUser(permissions.BasePermission):
    """
    Allows access only to superusers.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_superuser)

class IsAdminUser(permissions.BasePermission):
    """
    Allows access only to superusers or users in the 'Admin' group.
    This is the highest level of regular user permission.
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return request.user.is_superuser or _is_in_group(request.user, 'Admin')

class IsManagerUser(permissions.BasePermission):
    """
    Allows access only to users in the 'Manager' group, OR Admins (who can do anything a Manager can).
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        # Admin users inherently have Manager permissions
        if IsAdminUser().has_permission(request, view):
            return True
        return _is_in_group(request.user, 'Manager')

class IsStaffUser(permissions.BasePermission):
    """
    Allows access only to users in the 'Staff' group, OR Managers, OR Admins.
    This defines a hierarchy where higher roles can perform actions of lower roles.
    Adjust if your hierarchy is different (e.g., Managers CANNOT do Staff tasks).
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        # Managers (and thus Admins) can do what Staff can
        if IsManagerUser().has_permission(request, view): # This also covers Admins
            return True
        return _is_in_group(request.user, 'Staff')

# --- Action-Specific Permissions ---
# These can be combined in ViewSet's get_permissions for clarity

class CanCreateManager(IsAdminUser):
    """ Alias for IsAdminUser, for semantic clarity that only Admins can create Managers. """
    pass

class CanCreateStaff(IsManagerUser):
    """ Alias for IsManagerUser, as Managers (and by extension Admins) can create Staff. """
    pass

class CanCreateUpdateApplicant(IsStaffUser):
    """
    Allows Staff (and by extension Managers, Admins) to create/update Applicants.
    If only Staff and Admin (but not Manager) should do this:
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated: return False
        return IsAdminUser().has_permission(request, view) or _is_in_group(request.user, 'Staff')
    """
    pass

class CanViewApplicantListAndDetails(IsStaffUser): # Or IsStaffUser if Staff can also view
    """
    Allows Managers (and Admins) to view applicant lists and details.
    Adjust if Staff should also have view access.
    """
    pass

class CanApproveRejectLoan(IsManagerUser): # Or just IsManagerUser if Admins delegate this
    """
    Allows Managers (and Admins) to approve/reject loans.
    """
    pass

class CanDeleteRestoreApplicant(IsAdminUser):
    """
    Only Admins can soft-delete or restore applicants.
    """
    pass