import axios, { type AxiosError, type AxiosResponse } from "axios"
import { toast } from "@/hooks/use-toast"

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config: any) => {
    // Get token from localStorage or your auth system
    const user = localStorage.getItem("admin_user")
    if (user) {
      const userData = JSON.parse(user)
      config.headers.Authorization = `Bearer ${userData.token || "demo-token"}`
    }

    // Add request timestamp for debugging
    config.metadata = { startTime: new Date() }

    return config
  },
  (error: any) => {
    toast({
      title: "Request Error",
      description: "Failed to send request",
      variant: "destructive",
    })
    return Promise.reject(error)
  },
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Calculate request duration
    const duration = new Date().getTime() - response.config.metadata?.startTime?.getTime()

    // Log successful requests in development
    if (process.env.NODE_ENV === "development") {
      console.log(
        `✅ ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status} (${duration}ms)`,
      )
    }

    return response
  },
  (error: AxiosError) => {
    const { response, request, message } = error

    // Log error in development
    if (process.env.NODE_ENV === "development") {
      console.error("❌ API Error:", error)
    }

    // Handle different error scenarios
    if (response) {
      // Server responded with error status
      const status = response.status
      const data = response.data as any

      switch (status) {
        case 400:
          toast({
            title: "Bad Request",
            description: data?.message || "Invalid request data",
            variant: "destructive",
          })
          break
        case 401:
          toast({
            title: "Unauthorized",
            description: "Please log in to continue",
            variant: "destructive",
          })
          // Redirect to login or clear auth
          localStorage.removeItem("admin_user")
          window.location.href = "/admin"
          break
        case 403:
          toast({
            title: "Forbidden",
            description: "You don't have permission to perform this action",
            variant: "destructive",
          })
          break
        case 404:
          toast({
            title: "Not Found",
            description: data?.message || "The requested resource was not found",
            variant: "destructive",
          })
          break
        case 422:
          toast({
            title: "Validation Error",
            description: data?.message || "Please check your input data",
            variant: "destructive",
          })
          break
        case 429:
          toast({
            title: "Too Many Requests",
            description: "Please slow down and try again later",
            variant: "destructive",
          })
          break
        case 500:
          toast({
            title: "Server Error",
            description: "Something went wrong on our end. Please try again later",
            variant: "destructive",
          })
          break
        default:
          toast({
            title: "Error",
            description: data?.message || `Request failed with status ${status}`,
            variant: "destructive",
          })
      }
    } else if (request) {
      // Network error or no response
      toast({
        title: "Network Error",
        description: "Unable to connect to the server. Please check your internet connection",
        variant: "destructive",
      })
    } else {
      // Something else happened
      toast({
        title: "Unexpected Error",
        description: message || "An unexpected error occurred",
        variant: "destructive",
      })
    }

    return Promise.reject(error)
  },
)

// Helper functions for common API operations
export const apiClient = {
  // GET request
  get: async <T = any>(url: string, config = {}) => {
    const response = await api.get<T>(url, config)
    return response.data
  },

  // POST request
  post: async <T = any>(url: string, data = {}, config = {}) => {
    const response = await api.post<T>(url, data, config)
    return response.data
  },

  // PUT request
  put: async <T = any>(url: string, data = {}, config = {}) => {
    const response = await api.put<T>(url, data, config)
    return response.data
  },

  // PATCH request
  patch: async <T = any>(url: string, data = {}, config = {}) => {
    const response = await api.patch<T>(url, data, config)
    return response.data
  },

  // DELETE request
  delete: async <T = any>(url: string, config = {}) => {
    const response = await api.delete<T>(url, config)
    return response.data
  },

  // Upload file
  upload: async <T = any>(url: string, formData: FormData, onUploadProgress?: (progress: number) => void) => {
    const response = await api.post<T>(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent: any) => {
        if (onUploadProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onUploadProgress(progress)
        }
      },
    })
    return response.data
  },
}

export default api
