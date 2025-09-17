import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Calendar, User, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface ItemsTabProps {
  projectId?: string;
}

interface KanbanItem {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee: string;
  dueDate: string;
  tags: string[];
}

const ItemsTab: React.FC<ItemsTabProps> = ({ projectId }) => {
  const [items, setItems] = useState<KanbanItem[]>([
    {
      id: '1',
      title: 'Panel główny',
      description: 'Konstrukcja nośna scenografii',
      status: 'in_progress',
      priority: 'high',
      assignee: 'Paweł Nowak',
      dueDate: '2025-01-15',
      tags: ['konstrukcja', 'główny']
    },
    {
      id: '2',
      title: 'Elementy dekoracyjne',
      description: 'Dekoracje i elementy wizualne',
      status: 'todo',
      priority: 'medium',
      assignee: 'Anna Kowalska',
      dueDate: '2025-01-20',
      tags: ['dekoracja', 'wizualne']
    },
    {
      id: '3',
      title: 'System oświetlenia',
      description: 'Instalacja i konfiguracja oświetlenia',
      status: 'review',
      priority: 'high',
      assignee: 'Marek Wójcik',
      dueDate: '2025-01-18',
      tags: ['oświetlenie', 'instalacja']
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<KanbanItem | null>(null);

  const form = useForm<KanbanItem>({
    defaultValues: {
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      assignee: '',
      dueDate: '',
      tags: []
    }
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done': return 'bg-green-100 text-green-800';
      case 'review': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'todo': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'todo': return 'Do zrobienia';
      case 'in_progress': return 'W trakcie';
      case 'review': return 'Do sprawdzenia';
      case 'done': return 'Gotowe';
      default: return 'Nieznany';
    }
  };

  const handleAddItem = () => {
    setEditingItem(null);
    form.reset();
    setIsModalOpen(true);
  };

  const handleEditItem = (item: KanbanItem) => {
    setEditingItem(item);
    form.reset(item);
    setIsModalOpen(true);
  };

  const handleSaveItem = (data: KanbanItem) => {
    if (editingItem) {
      setItems(items.map(item => item.id === editingItem.id ? { ...data, id: editingItem.id } : item));
      toast.success('Element zaktualizowany');
    } else {
      const newItem = { ...data, id: Date.now().toString() };
      setItems([...items, newItem]);
      toast.success('Element dodany');
    }
    setIsModalOpen(false);
    form.reset();
  };

  const handleDeleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
    toast.success('Element usunięty');
  };

  const moveItem = (itemId: string, newStatus: KanbanItem['status']) => {
    setItems(items.map(item => 
      item.id === itemId ? { ...item, status: newStatus } : item
    ));
  };

  const columns = [
    { key: 'todo', title: 'Do zrobienia', items: items.filter(item => item.status === 'todo') },
    { key: 'in_progress', title: 'W trakcie', items: items.filter(item => item.status === 'in_progress') },
    { key: 'review', title: 'Do sprawdzenia', items: items.filter(item => item.status === 'review') },
    { key: 'done', title: 'Gotowe', items: items.filter(item => item.status === 'done') }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Elementy projektu</h1>
          <p className="text-muted-foreground">Zarządzaj elementami projektu za pomocą tablicy Kanban</p>
        </div>
        <Button onClick={handleAddItem}>
          <Plus className="w-4 h-4 mr-2" />
          Dodaj element
        </Button>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map(column => (
          <div key={column.key} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">{column.title}</h3>
              <Badge variant="outline">{column.items.length}</Badge>
            </div>
            
            <div className="space-y-3">
              {column.items.map(item => (
                <Card 
                  key={item.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleEditItem(item)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-sm">{item.title}</CardTitle>
                      <Badge variant={getPriorityColor(item.priority)}>
                        {item.priority}
                      </Badge>
                    </div>
                    <CardDescription className="text-xs">
                      {item.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <User className="w-3 h-3 mr-1" />
                        {item.assignee}
                      </div>
                      
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(item.dueDate).toLocaleDateString()}
                      </div>
                      
                      {item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {item.tags.map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>
                {editingItem ? 'Edytuj element' : 'Dodaj nowy element'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(handleSaveItem)} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Tytuł</label>
                  <input
                    {...form.register('title', { required: true })}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Nazwa elementu"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Opis</label>
                  <textarea
                    {...form.register('description')}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                    rows={3}
                    placeholder="Opis elementu"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Status</label>
                    <select
                      {...form.register('status')}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="todo">Do zrobienia</option>
                      <option value="in_progress">W trakcie</option>
                      <option value="review">Do sprawdzenia</option>
                      <option value="done">Gotowe</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Priorytet</label>
                    <select
                      {...form.register('priority')}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="low">Niski</option>
                      <option value="medium">Średni</option>
                      <option value="high">Wysoki</option>
                      <option value="urgent">Pilny</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Przypisany do</label>
                  <input
                    {...form.register('assignee')}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Imię i nazwisko"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Termin</label>
                  <input
                    {...form.register('dueDate')}
                    type="date"
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Anuluj
                  </Button>
                  <Button type="submit">
                    {editingItem ? 'Zapisz' : 'Dodaj'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ItemsTab;
