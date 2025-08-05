"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Edit, Trash2, Search, Calendar, Tag } from "lucide-react"
import { Input } from "@/components/ui/input"
import { BlogForm } from "@/components/blog-form"
import { Badge } from "@/components/ui/badge"
import { blogService } from "@/lib/api-services"

interface Blog {
  _id?: string
  title: string
  tag: string
  description: string
  createdAt?: string
  updatedAt?: string
}


export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
        const fetchBlogs = async () => {
          try {
            const response = await blogService.getAll();
            setBlogs(response.data.data);
          } catch (error) {
            console.error('Error fetching blogs:', error);
          }
        };
        fetchBlogs();
      }, []);

  const handleAddBlog = async (blogData: Omit<Blog, "_id" | "createdAt" | "updatedAt">) => {
    const newBlog: Blog = {
      ...blogData,
    }
    await blogService.create(blogData);
    setBlogs([newBlog, ...blogs])
    setIsFormOpen(false)
  }

  const handleEditBlog = async (blogData: Omit<Blog, "_id" | "createdAt" | "updatedAt">) => {
    if (editingBlog?._id) {
      await blogService.update(editingBlog._id, blogData);
      setBlogs(
        blogs.map((b) =>
          b._id === editingBlog._id
            ? {
                ...blogData,
                _id: editingBlog._id,
                createdAt: editingBlog.createdAt,
                updatedAt: new Date().toISOString().split("T")[0],
              }
            : b,
        ),
      )
      setEditingBlog(null)
      setIsFormOpen(false)
    }
  }


  const handleDeleteBlog = async (id?: string) => {
    if (!id) return;
    await blogService.delete(id);
    setBlogs(blogs.filter((b) => b._id !== id))
  }

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.tag.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getTagColor = (tag: string) => {
    switch (tag.toLowerCase()) {
      case "chemicals":
        return "bg-blue-100 text-blue-800"
      case "oil":
        return "bg-orange-100 text-orange-800"
      case "technology":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const truncateDescription = (description: string, maxLength = 150) => {
    // Remove markdown formatting for preview
    const plainText = description
      .replace(/[#*`>]/g, "")
      .replace(/\n/g, " ")
      .trim()

    return plainText.length > maxLength ? plainText.substring(0, maxLength) + "..." : plainText
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blogs</h1>
          <p className="text-muted-foreground">Manage your blog content</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Blog
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search blogs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredBlogs.map((blog) => (
          <Card key={blog._id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{blog.title}</CardTitle>
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge className={getTagColor(blog.tag)}>
                      <Tag className="w-3 h-3 mr-1" />
                      {blog.tag}
                    </Badge>
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground space-x-4">
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      Created: {blog.createdAt}
                    </div>
                  </div>
                  {blog.updatedAt !== blog.createdAt && (
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      <Calendar className="w-3 h-3 mr-1" />
                      Updated: {blog.updatedAt}
                    </div>
                  )}
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingBlog(blog)
                      setIsFormOpen(true)
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteBlog(blog._id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            {/* <CardContent className="flex-1">
              <CardDescription className="text-sm">{truncateDescription(blog.description)}</CardDescription>
            </CardContent> */}
          </Card>
        ))}
      </div>

      {filteredBlogs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No blogs found matching your search.</p>
        </div>
      )}

      {isFormOpen && (
        <BlogForm
          blog={editingBlog}
          onSubmit={editingBlog ? handleEditBlog : handleAddBlog}
          onCancel={() => {
            setIsFormOpen(false)
            setEditingBlog(null)
          }}
        />
      )}
    </div>
  )
}
