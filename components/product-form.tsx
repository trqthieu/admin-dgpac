"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Upload, Plus } from "lucide-react"
import { getImageUrl, uploadService } from "@/lib/api-services"
import { CodeEditor } from "@/components/code-editor"

interface Product {
  _id?: string
  title: string
  content: string
  image: string
  description: string
  range: string[]
  position: number
}

interface ProductFormProps {
  product?: Product | null
  onSubmit: (product: Omit<Product, "_id">) => void
  onCancel: () => void
}

export function ProductForm({ product, onSubmit, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState({
    title: product?.title || "",
    image: product?.image || "",
    description: product?.description || "",
    content: product?.content || "",
    range: product?.range || [],
    position: product?.position || 1,
  })
  const [newRange, setNewRange] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = async (file: File) => {
    setIsUploading(true)
    try {

      const response = await uploadService.uploadFile(file)
      const imageUrl = response.data.path;
      setFormData((prev) => ({ ...prev, image: imageUrl }))
    } catch (error) {
      console.error("Upload failed:", error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleImageUpload(file)
    }
  }

  const addRange = () => {
    if (newRange.trim() && !formData.range.includes(newRange.trim())) {
      setFormData((prev) => ({
        ...prev,
        range: [...prev.range, newRange.trim()],
      }))
      setNewRange("")
    }
  }

  const removeRange = (rangeToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      range: prev.range.filter((r) => r !== rangeToRemove),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{product ? "Edit Product" : "Add New Product"}</CardTitle>
              <CardDescription>{product ? "Update product information" : "Create a new product entry"}</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Product Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Enter product title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Product Image</Label>
              <div className="flex items-center space-x-4">
                {formData.image && (
                  <img
                    src={getImageUrl(formData.image) || "/placeholder.svg"}
                    alt="Product preview"
                    className="w-20 h-20 rounded-md object-cover"
                  />
                )}
                <div className="flex-1">
                  <Input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {isUploading ? "Uploading..." : "Upload Image"}
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Enter product description"
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Content</Label>
              <CodeEditor
                value={formData.content}
                onChange={(value) => setFormData((prev) => ({ ...prev, content: value }))}
                placeholder="Start writing your blog content... You can use Markdown formatting!"
              />
              <p className="text-xs text-muted-foreground">
                Supports Markdown formatting: **bold**, *italic*, `code`, # headings, &gt; quotes, - lists, and more.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Product Range</Label>
              <div className="flex space-x-2">
                <Input
                  value={newRange}
                  onChange={(e) => setNewRange(e.target.value)}
                  placeholder="Add range category"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addRange())}
                />
                <Button type="button" onClick={addRange} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.range.map((range, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {range}
                    <button type="button" onClick={() => removeRange(range)} className="ml-1 hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Select
                value={formData.position.toString()}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, position: Number.parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Position 1</SelectItem>
                  <SelectItem value="2">Position 2</SelectItem>
                  <SelectItem value="3">Position 3</SelectItem>
                  <SelectItem value="4">Position 4</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit">{product ? "Update Product" : "Create Product"}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
