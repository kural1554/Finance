from rest_framework.permissions import BasePermission

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_admin

class IsManager(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_manager

class IsApplicant(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_applicant

class IsManagerOrAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_manager or request.user.is_admin

class IsApplicantOrManagerOrAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_applicant or request.user.is_manager or request.user.is_admin