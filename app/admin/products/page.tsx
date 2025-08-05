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
import { ProductForm } from '@/components/product-form';
import { Badge } from '@/components/ui/badge';
import { getImageUrl, productService } from '@/lib/api-services';

interface Product {
  _id?: string;
  title: string;
  image: string;
  description: string;
  range: string[];
  position: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  console.log('🚀 ~ ProductsPage ~ products:', products);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productService.getAll();
        setProducts(response.data.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  const handleAddProduct = async (productData: Omit<Product, '_id'>) => {
    const newProduct: Product = {
      ...productData,
    };
    const result = await productService.create(newProduct);
    setProducts([newProduct, ...products]);
    setIsFormOpen(false);
  };

  const handleEditProduct = async (productData: Omit<Product, '_id'>) => {
    if (editingProduct?._id) {
      await productService.update(editingProduct._id, productData);
      setProducts(
        products.map((p) =>
          p._id === editingProduct._id
            ? { ...productData, _id: editingProduct._id }
            : p
        )
      );
      setEditingProduct(null);
      setIsFormOpen(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    await productService.delete(id);
    setProducts(products.filter((p) => p._id !== id));
  };

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                    src={getImageUrl(product.image) || '/placeholder.svg'}
                    alt={product.title}
                    className="w-12 h-12 rounded-md object-cover"
                  />
                  <div>
                    <CardTitle className="text-lg">{product.title}</CardTitle>
                    <Badge variant="secondary">
                      Position {product.position}
                    </Badge>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingProduct(product);
                      setIsFormOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteProduct(product._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-3">
                {product.description}
              </CardDescription>
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
            setIsFormOpen(false);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
}
