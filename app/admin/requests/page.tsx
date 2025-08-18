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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Download, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { userRequestService, UserRequest } from '@/lib/api-services';

export default function RequestsPage() {
  const [requests, setRequests] = useState<UserRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState<UserRequest | null>(
    null
  );

  const handleExport = async () => {
    try {

      const blob = await userRequestService.exportXlsx();
     const url = window.URL.createObjectURL(new Blob([blob]));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'user-requests.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

    } catch (error) {
      console.error('Export error:', error);
    } finally {
    }
  };

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await userRequestService.getAll({
          page,
          search: searchTerm,
        });
        setRequests(response.data.data);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    };

    fetchRequests();
  }, [page, searchTerm]);

  return (
    <div className='flex flex-1 flex-col gap-4 p-4'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Requests</h1>
          <p className='text-muted-foreground'>Manage your request portfolio</p>
        </div>
        <Button
          onClick={handleExport}
        >
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
            onChange={e => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className='pl-8'
          />
        </div>
      </div>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {requests.map(request => (
          <Card
            key={request._id}
            onClick={() => setSelectedRequest(request)}
            className='cursor-pointer hover:shadow-md transition-shadow'
          >
            <CardHeader>
              <CardTitle className='text-lg'>{request.companyName}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Email: {request.email}</CardDescription>
            </CardContent>
            <CardContent>
              <CardDescription>Request: {request.request}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      {requests.length === 0 && (
        <div className='text-center py-12'>
          <p className='text-muted-foreground'>
            No requests found matching your search.
          </p>
        </div>
      )}

      <div className='flex justify-center mt-6 space-x-2'>
        <Button
          variant='outline'
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </Button>
        <span className='px-2 py-1 text-sm'>
          Page {page} of {totalPages}
        </span>
        <Button
          variant='outline'
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </Button>
      </div>

      {/* Dialog (Modal) */}
      <Dialog
        open={!!selectedRequest}
        onOpenChange={() => setSelectedRequest(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Details</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className='space-y-2 text-sm'>
              <p>
                <strong>Name:</strong> {selectedRequest.name}
              </p>
              <p>
                <strong>Company:</strong> {selectedRequest.companyName}
              </p>
              <p>
                <strong>Email:</strong> {selectedRequest.email}
              </p>
              <p>
                <strong>Phone:</strong> {selectedRequest.phone}
              </p>
              <p>
                <strong>Location:</strong> {selectedRequest.location}
              </p>
              <p>
                <strong>Request:</strong> {selectedRequest.request}
              </p>
              <p>
                <strong>Safety Data Sheet:</strong>{' '}
                {selectedRequest.safetyDataSheet}
              </p>
              <p>
                <strong>Packing List:</strong> {selectedRequest.packingList}
              </p>
              {/* <p><strong>Industry:</strong> {selectedRequest.industry}</p> */}
              {/* <p><strong>Work Type:</strong> {selectedRequest.work}</p> */}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
