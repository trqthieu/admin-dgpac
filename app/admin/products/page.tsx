"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Edit, Trash2, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ProductForm } from "@/components/product-form"
import { Badge } from "@/components/ui/badge"

interface Product {
  id: string
  title: string
  image: string
  description: string
  range: string[]
  position: number
}

const mockProducts: Product[] = [
  {
    id: "1",
    title: "Premium Chemical Solution",
    image: "/placeholder.svg?height=100&width=100",
    description: "High-quality chemical solution for industrial applications",
    range: ["Industrial", "Commercial"],
    position: 1,
  },
  {
    id: "2",
    title: "Advanced Oil Treatment",
    image: "/placeholder.svg?height=100&width=100",
    description: "Specialized oil treatment for enhanced performance",
    range: ["Automotive", "Industrial"],
    position: 2,
  },
]

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts)
  console.log("🚀 ~ ProductsPage ~ products:", products)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const handleAddProduct = (productData: Omit<Product, "id">) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
    }
    console.log("🚀 ~ handleAddProduct ~ newProduct:", newProduct)
    setProducts([...products, newProduct])
    setIsFormOpen(false)
  }

  const handleEditProduct = (productData: Omit<Product, "id">) => {
    if (editingProduct) {
      setProducts(products.map((p) => (p.id === editingProduct.id ? { ...productData, id: editingProduct.id } : p)))
      setEditingProduct(null)
      setIsFormOpen(false)
    }
  }

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id))
  }

  const filteredProducts = products.filter((product) => product.title.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">Manage your product catalog</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product) => (
          <Card key={product.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.title}
                    className="w-12 h-12 rounded-md object-cover"
                  />
                  <div>
                    <CardTitle className="text-lg">{product.title}</CardTitle>
                    <Badge variant="secondary">Position {product.position}</Badge>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingProduct(product)
                      setIsFormOpen(true)
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteProduct(product.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-3">{product.description}</CardDescription>
              <div className="flex flex-wrap gap-1">
                {product.range.map((range, index) => (
                  <Badge key={index} variant="outline">
                    {range}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {isFormOpen && (
        <ProductForm
          product={editingProduct}
          onSubmit={editingProduct ? handleEditProduct : handleAddProduct}
          onCancel={() => {
            setIsFormOpen(false)
            setEditingProduct(null)
          }}
        />
      )}
    </div>
  )
}
