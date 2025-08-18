import { apiClient } from './axios';
import { toast } from '@/hooks/use-toast';

// Types
export interface Product {
  id: string;
  title: string;
  image: string;
  description: string;
  content: string;
  range: string[];
  position: number;
}

export enum IndustryEnum {
  ALL = 'all',
  CHEMICALS = 'chemicals',
  PHARMACEUTICALS = 'pharmaceuticals & healthcare',
  OIL_GAS = 'oil & gas',
  ELECTRONICS = 'electronics & semiconductors',
  DEFENSE = 'defense & military',
  ENERGY = 'energy & renewables',
  CONSUMER_GOODS = 'consumer goods',
  OTHERS = 'others',
}

export enum WorkEnum {
  ALL = 'all',
  PACKAGING = 'packaging',
  DECANTING = 'decanting',
  TRANSPORT = 'transport',
  WAREHOUSING = 'warehousing',
  TRAINING = 'training',
}

export interface Project {
  _id?: string;
  title: string;
  image: string;
  content: string;
  description: string;
  industry: IndustryEnum;
  work: WorkEnum;
}

export interface UserRequest {
  _id?: string;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  location: string;
  request: string;
  safetyDataSheet: string;
  packingList: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Blog {
  _id?: string;
  title: string;
  link: string
  tag: string;
  // description: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    data: T[];
    total: number;
    page: number;
    totalPages: number;
  };
}

// Product API Services
export const productService = {
  // Get all products
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<PaginatedResponse<Product>> => {
    try {
      const response = await apiClient.get('/products', { params });
      toast({
        title: 'Success',
        description: 'Products loaded successfully',
      });
      return response;
    } catch (error) {
      // Error already handled by interceptor
      throw error;
    }
  },

  // Get single product
  getById: async (id: string): Promise<ApiResponse<Product>> => {
    try {
      const response = await apiClient.get(`/products/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Create product
  create: async (
    productData: Omit<Product, 'id'>
  ): Promise<ApiResponse<Product>> => {
    try {
      const response = await apiClient.post('/products', productData);
      toast({
        title: 'Success',
        description: 'Product created successfully',
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update product
  update: async (
    id: string,
    productData: Partial<Product>
  ): Promise<ApiResponse<Product>> => {
    try {
      const response = await apiClient.put(`/products/${id}`, productData);
      toast({
        title: 'Success',
        description: 'Product updated successfully',
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Delete product
  delete: async (id: string): Promise<ApiResponse<null>> => {
    try {
      const response = await apiClient.delete(`/products/${id}`);
      toast({
        title: 'Success',
        description: 'Product deleted successfully',
      });
      return response;
    } catch (error) {
      throw error;
    }
  },
};

// Project API Services
export const projectService = {
  // Get all projects
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    industry?: string;
  }): Promise<PaginatedResponse<Project>> => {
    try {
      const response = await apiClient.get('/projects', { params });
      toast({
        title: 'Success',
        description: 'Projects loaded successfully',
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get single project
  getById: async (id: string): Promise<ApiResponse<Project>> => {
    try {
      const response = await apiClient.get(`/projects/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Create project
  create: async (
    projectData: Omit<Project, 'id'>
  ): Promise<ApiResponse<Project>> => {
    try {
      const response = await apiClient.post('/projects', projectData);
      toast({
        title: 'Success',
        description: 'Project created successfully',
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update project
  update: async (
    id: string,
    projectData: Partial<Project>
  ): Promise<ApiResponse<Project>> => {
    try {
      const response = await apiClient.put(`/projects/${id}`, projectData);
      toast({
        title: 'Success',
        description: 'Project updated successfully',
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Delete project
  delete: async (id: string): Promise<ApiResponse<null>> => {
    try {
      const response = await apiClient.delete(`/projects/${id}`);
      toast({
        title: 'Success',
        description: 'Project deleted successfully',
      });
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export const userRequestService = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    industry?: string;
  }): Promise<PaginatedResponse<UserRequest>> => {
    try {
      const response = await apiClient.get('/user-requests', { params });
      toast({
        title: 'Success',
        description: 'User requests loaded successfully',
      });
      return response;
    } catch (error) {
      throw error;
    }
  },
  exportXlsx: async (): Promise<Blob> => {
    try {
      const response = await apiClient.get('/user-requests/export',{
        responseType: 'blob',
      });
      return  response;
    } catch (error) {
      throw error;
    }
  },
};

// Blog API Services
export const blogService = {
  // Get all blogs
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    tag?: string;
  }): Promise<PaginatedResponse<Blog>> => {
    try {
      const response = await apiClient.get('/blogs', { params });
      toast({
        title: 'Success',
        description: 'Blogs loaded successfully',
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get single blog
  getById: async (id: string): Promise<ApiResponse<Blog>> => {
    try {
      const response = await apiClient.get(`/blogs/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Create blog
  create: async (
    blogData: Omit<Blog, '_id' | 'createdAt' | 'updatedAt'>
  ): Promise<ApiResponse<Blog>> => {
    try {
      const response = await apiClient.post('/blogs', blogData);
      toast({
        title: 'Success',
        description: 'Blog created successfully',
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update blog
  update: async (
    id: string,
    blogData: Partial<Blog>
  ): Promise<ApiResponse<Blog>> => {
    try {
      const response = await apiClient.put(`/blogs/${id}`, blogData);
      toast({
        title: 'Success',
        description: 'Blog updated successfully',
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Delete blog
  delete: async (id: string): Promise<ApiResponse<null>> => {
    try {
      const response = await apiClient.delete(`/blogs/${id}`);
      toast({
        title: 'Success',
        description: 'Blog deleted successfully',
      });
      return response;
    } catch (error) {
      throw error;
    }
  },
};

// Upload Service
export const uploadService = {
  // Upload single file
  uploadFile: async (
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<
    ApiResponse<{ filename: string; originalname: string; path: string }>
  > => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiClient.upload('/upload', formData, onProgress);
      toast({
        title: 'Success',
        description: 'File uploaded successfully',
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Upload multiple files
  uploadFiles: async (
    files: File[],
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<{ urls: string[]; fileNames: string[] }>> => {
    try {
      const formData = new FormData();
      files.forEach((file, index) => {
        formData.append(`files[${index}]`, file);
      });

      const response = await apiClient.upload(
        '/upload/multiple',
        formData,
        onProgress
      );
      toast({
        title: 'Success',
        description: `${files.length} files uploaded successfully`,
      });
      return response;
    } catch (error) {
      throw error;
    }
  },
};

// Auth Service
export const authService = {
  // Login
  login: async (
    email: string,
    password: string
  ): Promise<ApiResponse<{ user: any; accessToken: string }>> => {
    try {
      const response = await apiClient.post('/auth/local/login', {
        email,
        password,
      });
      toast({
        title: 'Welcome!',
        description: 'Login successful',
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Logout
  logout: async (): Promise<ApiResponse<null>> => {
    try {
      const response = await apiClient.post('/auth/logout');
      toast({
        title: 'Goodbye!',
        description: 'Logged out successfully',
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Refresh token
  refreshToken: async (): Promise<ApiResponse<{ token: string }>> => {
    try {
      const response = await apiClient.post('/auth/refresh');
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export const getImageUrl = (image: string): string => {
  return image.startsWith('http')
    ? image
    : `${process.env.NEXT_PUBLIC_API_URL}/${image}`;
};
