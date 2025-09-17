import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Check, Delete, Edit, Eye, Plus, User, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useConceptStore } from '../stores/conceptStore';
import { Concept } from '../types/concept.types';

const Concepts: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingConcept, setEditingConcept] = useState<Concept | null>(null);
  const [selectedConcept, setSelectedConcept] = useState<Concept | null>(null);

  const form = useForm({
    defaultValues: {
      title: '',
      description: '',
      category: '',
      priority: 'medium',
      estimated_cost: 0,
      estimated_duration: 1,
      tags: '',
      notes: ''
    }
  });
  
  const {
    concepts,
    approvals,
    comments,
    isLoading,
    error,
    fetchConcepts,
    addConcept,
    updateConcept,
    deleteConcept,
    submitConcept,
    approveConcept,
    rejectConcept,
    fetchApprovals,
    fetchComments,
    addComment,
    getApprovalProgress,
  } = useConceptStore();
  
  useEffect(() => {
    fetchConcepts();
  }, [fetchConcepts]);
  
  const filteredConcepts = concepts.filter(concept =>
    concept.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    concept.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    concept.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleAdd = () => {
    setEditingConcept(null);
    setIsModalOpen(true);
  };
  
  const handleEdit = (concept: Concept) => {
    setEditingConcept(concept);
    setIsModalOpen(true);
  };
  
  const handleDelete = async (concept: Concept) => {
    try {
      await deleteConcept(concept.id);
      toast.success('Concept deleted successfully');
    } catch (error) {
      toast.error('Failed to delete concept');
    }
  };
  
  const handleSubmit = async (values: any) => {
    try {
      if (editingConcept) {
        await updateConcept(editingConcept.id, values);
        toast.success('Concept updated successfully');
      } else {
        await addConcept(values);
        toast.success('Concept added successfully');
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error('Failed to save concept');
    }
  };
  
  const handleSubmitConcept = async (concept: Concept) => {
    try {
      await submitConcept(concept.id);
      toast.success('Concept submitted for approval');
    } catch (error) {
      toast.error('Failed to submit concept');
    }
  };
  
  const handleApprove = async (concept: Concept) => {
    try {
      await approveConcept(concept.id, 'current-user', 'Approved');
      toast.success('Concept approved');
    } catch (error) {
      toast.error('Failed to approve concept');
    }
  };
  
  const handleReject = async (concept: Concept) => {
    try {
      await rejectConcept(concept.id, 'current-user', 'Rejected');
      toast.success('Concept rejected');
    } catch (error) {
      toast.error('Failed to reject concept');
    }
  };
  
  const handleViewDetails = async (concept: Concept) => {
    setSelectedConcept(concept);
    await fetchApprovals(concept.id);
    await fetchComments(concept.id);
  };
  
  const handleAddComment = async (content: string) => {
    if (!selectedConcept) return;
    
    try {
      await addComment({
        concept_id: selectedConcept.id,
        author_id: 'current-user',
        author_name: 'Current User',
        content,
      });
      toast.success('Comment added');
    } catch (error) {
      toast.error('Failed to add comment');
    }
  };
  
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'draft':
        return 'secondary';
      case 'submitted':
        return 'default';
      case 'under_review':
        return 'secondary';
      case 'approved':
        return 'default';
      case 'rejected':
        return 'destructive';
      case 'archived':
        return 'outline';
      default:
        return 'secondary';
    }
  };
  
  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'outline';
      case 'medium':
        return 'default';
      case 'high':
        return 'secondary';
      case 'urgent':
        return 'destructive';
      default:
        return 'secondary';
    }
  };
  
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading concepts...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600">Error loading concepts: {error}</p>
          <Button onClick={() => fetchConcepts()} className="mt-2">
            Try Again
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Concept Management</h1>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Concept
        </Button>
      </div>
      
      <div className="mb-4">
        <Input
          placeholder="Search concepts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-80"
        />
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Estimated Cost</TableHead>
              <TableHead>Duration (days)</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredConcepts.map((concept) => (
              <TableRow key={concept.id}>
                <TableCell className="font-medium">{concept.title}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{concept.category}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={getPriorityVariant(concept.priority)}>
                    {concept.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(concept.status)}>
                    {concept.status}
                  </Badge>
                </TableCell>
                <TableCell>${concept.estimated_cost.toFixed(2)}</TableCell>
                <TableCell>{concept.estimated_duration}</TableCell>
                <TableCell>{new Date(concept.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDetails(concept)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(concept)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    {concept.status === 'draft' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSubmitConcept(concept)}
                      >
                        Submit
                      </Button>
                    )}
                    {concept.status === 'submitted' && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleApprove(concept)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleReject(concept)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(concept)}
                    >
                      <Delete className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingConcept ? 'Edit Concept' : 'Add Concept'}
            </DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., New Design Concept" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Describe the concept" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="design">Design</SelectItem>
                          <SelectItem value="engineering">Engineering</SelectItem>
                          <SelectItem value="logistics">Logistics</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="estimated_cost"
              render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estimated Cost</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        step="0.01" 
                        placeholder="0.00" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
            <FormField
              control={form.control}
              name="estimated_duration"
              render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estimated Duration (days)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1" 
                        placeholder="1" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <Input placeholder="Add tags (comma separated)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Input placeholder="Additional notes" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingConcept ? 'Update Concept' : 'Add Concept'}
              </Button>
            </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      <Dialog open={!!selectedConcept} onOpenChange={() => setSelectedConcept(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Concept Details</DialogTitle>
          </DialogHeader>
          
          {selectedConcept && (
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Concept Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p><strong>Title:</strong> {selectedConcept.title}</p>
                    <p><strong>Category:</strong> <Badge variant="secondary">{selectedConcept.category}</Badge></p>
                    <p><strong>Priority:</strong> <Badge variant={getPriorityVariant(selectedConcept.priority)}>{selectedConcept.priority}</Badge></p>
                    <p><strong>Status:</strong> <Badge variant={getStatusVariant(selectedConcept.status)}>{selectedConcept.status}</Badge></p>
                  </div>
                  <div className="space-y-2">
                    <p><strong>Estimated Cost:</strong> ${selectedConcept.estimated_cost.toFixed(2)}</p>
                    <p><strong>Duration:</strong> {selectedConcept.estimated_duration} days</p>
                    <p><strong>Created:</strong> {new Date(selectedConcept.created_at).toLocaleDateString()}</p>
                    <p><strong>Updated:</strong> {new Date(selectedConcept.updated_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p><strong>Description:</strong></p>
                  <p className="text-gray-700">{selectedConcept.description}</p>
                </div>
                {selectedConcept.tags && selectedConcept.tags.length > 0 && (
                  <div className="mt-4">
                    <p><strong>Tags:</strong></p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedConcept.tags.map((tag, index) => (
                        <Badge key={index} variant="outline">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
              
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Approval Progress</h3>
                <Progress 
                  value={getApprovalProgress(selectedConcept.id).percentage}
                  className="mb-4"
                />
                <div className="space-y-2">
                  {approvals.map((approval) => (
                    <div key={approval.id} className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        approval.status === 'approved' ? 'bg-green-500' : 
                        approval.status === 'rejected' ? 'bg-red-500' : 'bg-gray-300'
                      }`} />
                      <span className="text-sm">{approval.approver_name}</span>
                      <Badge variant={approval.status === 'approved' ? 'default' : approval.status === 'rejected' ? 'destructive' : 'secondary'}>
                        {approval.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>
              
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Comments</h3>
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="border-b pb-4 mb-4">
                      <div className="flex items-start space-x-3">
                        <Avatar>
                          <AvatarFallback>
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium">{comment.author_name}</span>
                            <span className="text-gray-500 text-sm">{new Date(comment.created_at).toLocaleString()}</span>
                          </div>
                          <div className="text-gray-700">{comment.content}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-start space-x-3">
                    <Avatar>
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <Input
                        placeholder="Add a comment..."
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                            handleAddComment(e.currentTarget.value);
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Concepts;
