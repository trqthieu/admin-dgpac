'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ProjectForm } from '@/components/project-form';
import { Badge } from '@/components/ui/badge';
import { getImageUrl, IndustryEnum, projectService, WorkEnum } from '@/lib/api-services';

interface Project {
  _id?: string;
  title: string;
  image: string;
  description: string;
  content: string;
  industry: IndustryEnum;
  work: WorkEnum;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await projectService.getAll({ page, search: searchTerm });
        setProjects(response.data.data);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error('Error fetching Projects:', error);
      }
    };
    fetchProjects();
  }, [page, searchTerm]);

  const handleAddProject = async (projectData: Omit<Project, '_id'>) => {
    const newProject: Project = { ...projectData };
    const result = await projectService.create(newProject);
    setProjects([result.data, ...projects]);
    setIsFormOpen(false);
  };

  const handleEditProject = async (projectData: Omit<Project, '_id'>) => {
    if (editingProject?._id) {
      await projectService.update(editingProject._id, projectData);
      setProjects(
        projects.map((p) =>
          p._id === editingProject._id
            ? { ...projectData, _id: editingProject._id }
            : p
        )
      );
      setEditingProject(null);
      setIsFormOpen(false);
    }
  };

  const handleDeleteProject = async (id?: string) => {
    if (!id) return;
    await projectService.delete(id);
    setProjects(projects.filter((p) => p._id !== id));
  };

  const getIndustryColor = (industry: string) => {
    switch (industry) {
      case 'chemicals':
        return 'bg-blue-100 text-blue-800';
      case 'oil':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">Manage your project portfolio</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Project
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project._id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={getImageUrl(project.image) || '/placeholder.svg'}
                    alt={project.title}
                    className="w-12 h-12 rounded-md object-cover"
                  />
                  <div>
                    <CardTitle className="text-lg">{project.title}</CardTitle>
                    <Badge className={getIndustryColor(project.industry)}>
                      {project.industry}
                    </Badge>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingProject(project);
                      setIsFormOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteProject(project._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>{project.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center mt-6 space-x-2">
        <Button
          variant="outline"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </Button>
        <span className="px-2 py-1 text-sm">
          Page {page} of {totalPages}
        </span>
        <Button
          variant="outline"
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </Button>
      </div>

      {isFormOpen && (
        <ProjectForm
          project={editingProject}
          onSubmit={editingProject ? handleEditProject : handleAddProject}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingProject(null);
          }}
        />
      )}
    </div>
  );
}
