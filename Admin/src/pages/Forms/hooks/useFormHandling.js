import { useState, useCallback } from "react";
import { validateForm ,setErrors} from "../utils/validation"; // ✅ Import properly

const useFormHandling = (initialState) => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState(1);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  // ✅ Use `useCallback` to memoize `validateForm` and prevent unnecessary re-renders
  const validateCurrentForm = useCallback(() => {
    return validateForm(activeTab, formDaata, setErrors);
  }, [activeTab, formData, setErrors]);

  return {
    formData,
    errors,
    activeTab,
    handleInputChange,
    handleTabChange,
    validateForm: validateCurrentForm, // ✅ Use memoized function
    setActiveTab,
    setFormData,
    setErrors,
  };
};

export default useFormHandling;
