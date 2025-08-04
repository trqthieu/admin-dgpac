"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Edit, Trash2, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ProjectForm } from "@/components/project-form"
import { Badge } from "@/components/ui/badge"

interface Project {
  id: string
  title: string
  image: string
  description: string
  industry: "all" | "chemicals" | "oil"
}

const mockProjects: Project[] = [
  {
    id: "1",
    title: "Chemical Processing Plant",
    image: "/placeholder.svg?height=100&width=100",
    description: "Large-scale chemical processing facility with advanced automation",
    industry: "chemicals",
  },
  {
    id: "2",
    title: "Oil Refinery Modernization",
    image: "/placeholder.svg?height=100&width=100",
    description: "Complete modernization of oil refinery infrastructure",
    industry: "oil",
  },
]

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(mockProjects)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const handleAddProject = (projectData: Omit<Project, "id">) => {
    const newProject: Project = {
      ...projectData,
      id: Date.now().toString(),
    }
    setProjects([...projects, newProject])
    setIsFormOpen(false)
  }

  const handleEditProject = (projectData: Omit<Project, "id">) => {
    if (editingProject) {
      setProjects(projects.map((p) => (p.id === editingProject.id ? { ...projectData, id: editingProject.id } : p)))
      setEditingProject(null)
      setIsFormOpen(false)
    }
  }

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter((p) => p.id !== id))
  }

  const filteredProjects = projects.filter((project) => project.title.toLowerCase().includes(searchTerm.toLowerCase()))

  const getIndustryColor = (industry: string) => {
    switch (industry) {
      case "chemicals":
        return "bg-blue-100 text-blue-800"
      case "oil":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

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
        {filteredProjects.map((project) => (
          <Card key={project.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    className="w-12 h-12 rounded-md object-cover"
                  />
                  <div>
                    <CardTitle className="text-lg">{project.title}</CardTitle>
                    <Badge className={getIndustryColor(project.industry)}>{project.industry}</Badge>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingProject(project)
                      setIsFormOpen(true)
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteProject(project.id)}>
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

      {isFormOpen && (
        <ProjectForm
          project={editingProject}
          onSubmit={editingProject ? handleEditProject : handleAddProject}
          onCancel={() => {
            setIsFormOpen(false)
            setEditingProject(null)
          }}
        />
      )}
    </div>
  )
}
