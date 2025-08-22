'use client';

import type React from 'react';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { X, Upload } from 'lucide-react';
import {
  getImageUrl,
  IndustryEnum,
  uploadService,
  WorkEnum,
} from '@/lib/api-services';
import { CodeEditor } from '@/components/code-editor';

interface Project {
  _id?: string;
  title: string;
  image: string;
  description: string;
  content: string;
  industry: IndustryEnum;
  work: WorkEnum;
}

interface ProjectFormProps {
  project?: Project | null;
  onSubmit: (project: Omit<Project, 'id'>) => void;
  onCancel: () => void;
}

export function ProjectForm({ project, onSubmit, onCancel }: ProjectFormProps) {
  const [formData, setFormData] = useState({
    title: project?.title || '',
    image: project?.image || '',
    description: project?.description || '',
    content: project?.content || '',
    industry: project?.industry || IndustryEnum.ALL,
    work: project?.work || WorkEnum.ALL,
  });
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const response = await uploadService.uploadFile(file);
      const imageUrl = response.data.path;
      setFormData(prev => ({ ...prev, image: imageUrl }));
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50'>
      <Card className='w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle>
                {project ? 'Edit Project' : 'Add New Project'}
              </CardTitle>
              <CardDescription>
                {project
                  ? 'Update project information'
                  : 'Create a new project entry'}
              </CardDescription>
            </div>
            <Button variant='ghost' size='sm' onClick={onCancel}>
              <X className='h-4 w-4' />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className='space-y-2'>
              <Label htmlFor='title'>Project Title</Label>
              <Input
                id='title'
                value={formData.title}
                onChange={e =>
                  setFormData(prev => ({ ...prev, title: e.target.value }))
                }
                placeholder='Enter project title'
                required
              />
            </div>

            <div className='space-y-2'>
              <Label>Project Image</Label>
              <div className='flex items-center space-x-4'>
                {formData.image && (
                  <img
                    src={getImageUrl(formData.image) || '/placeholder.svg'}
                    alt='Project preview'
                    className='w-20 h-20 rounded-md object-cover'
                  />
                )}
                <div className='flex-1'>
                  <Input
                    type='file'
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept='image/*'
                    className='hidden'
                  />
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                  >
                    <Upload className='mr-2 h-4 w-4' />
                    {isUploading ? 'Uploading...' : 'Upload Image'}
                  </Button>
                </div>
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='description'>Description</Label>
              <Textarea
                id='description'
                value={formData.description}
                onChange={e =>
                  setFormData(prev => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder='Enter project description'
                rows={4}
                required
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='description'>Content</Label>
              {/* <CodeEditor
                value={formData.content}
                onChange={value =>
                  setFormData(prev => ({ ...prev, content: value }))
                }
                placeholder='Start writing your blog content... You can use Markdown formatting!'
              /> */}

              <CodeEditor
                value={formData.content}
                onChange={value =>
                  setFormData(prev => ({ ...prev, content: value }))
                }
                onImageUpload={async file => {
                  // Your upload logic here
                  const response = await uploadService.uploadFile(file);
                  return response.data.path; // Return the image URL
                }}
                placeholder='Start writing your content...'
              />
              <p className='text-xs text-muted-foreground'>
                Supports Markdown formatting: **bold**, *italic*, `code`, #
                headings, &gt; quotes, - lists, and more.
              </p>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='industry'>Industry</Label>
              <Select
                value={formData.industry}
                onValueChange={(value: string) =>
                  setFormData(prev => ({
                    ...prev,
                    industry: value as IndustryEnum,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select industry' />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(IndustryEnum).map(([key, value]) => (
                    <SelectItem key={value} value={value}>
                      {value.charAt(0).toUpperCase() + value.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='work'>Work</Label>
              <Select
                value={formData.work}
                onValueChange={(value: string) =>
                  setFormData(prev => ({ ...prev, work: value as WorkEnum }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select work' />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(WorkEnum).map(([key, value]) => (
                    <SelectItem key={value} value={value}>
                      {value.charAt(0).toUpperCase() + value.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className='flex justify-end space-x-2'>
              <Button type='button' variant='outline' onClick={onCancel}>
                Cancel
              </Button>
              <Button type='submit'>
                {project ? 'Update Project' : 'Create Project'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
