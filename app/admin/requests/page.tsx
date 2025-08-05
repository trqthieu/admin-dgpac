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
import { Plus, Edit, Trash2, Search, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  getImageUrl,
  IndustryEnum,
  UserRequest,
  userRequestService,
  WorkEnum,
} from '@/lib/api-services';

interface Request {
  _id?: string;
  title: string;
  image: string;
  description: string;
  industry: IndustryEnum;
  work: WorkEnum;
}

export default function RequestsPage() {
  const [requests, setRequests] = useState<UserRequest[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState<Request | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await userRequestService.getAll();
        console.log('🚀 ~ fetchRequests ~ response:', response);
        setRequests(response.data.data);
      } catch (error) {
        console.error('Error fetching Requests:', error);
      }
    };
    fetchRequests();
  }, []);

 

  // const handleDeleteRequest = async (id?: string) => {
  //   if (!id) return;
  //   await requestService.delete(id);
  //   setRequests(requests.filter(p => p._id !== id));
  // };

  const filteredRequests = requests.filter(request =>
    request.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    <div className='flex flex-1 flex-col gap-4 p-4'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Requests</h1>
          <p className='text-muted-foreground'>Manage your request portfolio</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Download className='mr-2 h-4 w-4' />
          Export Request
        </Button>
      </div>

      <div className='flex items-center space-x-2'>
        <div className='relative flex-1 max-w-sm'>
          <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Search requests...'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className='pl-8'
          />
        </div>
      </div>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {filteredRequests.map(request => (
          <Card key={request._id}>
            <CardHeader>
              <div className='flex items-start justify-between'>
                <div className='flex items-center space-x-3'>
                 
                  <div>
                    <CardTitle className='text-lg'>{request.name}</CardTitle>
                  </div>
                </div>
                {/* <div className='flex space-x-1'>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => {
                      setEditingRequest(request);
                      setIsFormOpen(true);
                    }}
                  >
                    <Edit className='h-4 w-4' />
                  </Button>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => handleDeleteRequest(request._id)}
                  >
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </div> */}
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>{request.companyName}</CardDescription>
            </CardContent>
            <CardContent>
              <CardDescription>{request.email}</CardDescription>
            </CardContent>
            <CardContent>
              <CardDescription>{request.phone}</CardDescription>
            </CardContent>
            <CardContent>
              <CardDescription>{request.location}</CardDescription>
            </CardContent>
            <CardContent>
              <CardDescription>{request.request}</CardDescription>
            </CardContent>
            <CardContent>
              <CardDescription>{request.safetyDataSheet}</CardDescription>
            </CardContent>
            <CardContent>
              <CardDescription>{request.packingList}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* {isFormOpen && (
        <RequestForm
          request={editingRequest}
          onSubmit={editingRequest ? handleEditRequest : handleAddRequest}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingRequest(null);
          }}
        />
      )} */}
    </div>
  );
}
