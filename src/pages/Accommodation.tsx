import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Plus, Search, Building, Home, Calendar, Star } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useAccommodationStore } from '../stores/accommodationStore';
import { Hotel, Room, Booking, BookingSearch } from '../types/accommodation.types';

const Accommodation: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('hotels');
  const [searchParams, setSearchParams] = useState<BookingSearch>({
    city: '',
    check_in: '',
    check_out: '',
    guests: 1,
    rooms: 1,
  });

  const form = useForm({
    defaultValues: {
      name: '',
      city: '',
      address: '',
      description: '',
      rating: 0,
      price_per_night: 0,
      amenities: '',
      room_type: '',
      capacity: 1,
      check_in: '',
      check_out: '',
      guests: 1,
      rooms: 1
    }
  });
  
  const {
    hotels,
    rooms,
    bookings,
    searchResults,
    isLoading,
    error,
    fetchHotels,
    fetchRooms,
    fetchBookings,
    addHotel,
    addRoom,
    addBooking,
    updateHotel,
    updateRoom,
    updateBooking,
    deleteHotel,
    deleteRoom,
    deleteBooking,
    searchHotels,
    bookHotel,
    cancelBooking,
  } = useAccommodationStore();
  
  useEffect(() => {
    fetchHotels();
    fetchBookings();
  }, [fetchHotels, fetchBookings]);
  
  const handleAdd = () => {
    setEditingItem(null);
    form.resetFields();
    setIsModalOpen(true);
  };
  
  const handleEdit = (item: any) => {
    setEditingItem(item);
    form.setFieldsValue(item);
    setIsModalOpen(true);
  };
  
  const handleDelete = async (item: any, deleteFn: (id: string) => Promise<void>) => {
    try {
      await deleteFn(item.id);
      toast.success('Item deleted successfully');
    } catch (error) {
      toast.error('Failed to delete item');
    }
  };
  
  const handleSubmit = async (values: any) => {
    try {
      if (editingItem) {
        const updateFn = activeTab === 'hotels' ? updateHotel : 
                        activeTab === 'rooms' ? updateRoom : updateBooking;
        await updateFn(editingItem.id, values);
        toast.success('Item updated successfully');
      } else {
        const addFn = activeTab === 'hotels' ? addHotel : 
                     activeTab === 'rooms' ? addRoom : addBooking;
        await addFn(values);
        toast.success('Item added successfully');
      }
      setIsModalOpen(false);
      form.reset();
    } catch (error) {
      toast.error('Failed to save item');
    }
  };
  
  const handleSearch = async () => {
    if (!searchParams.city || !searchParams.check_in || !searchParams.check_out) {
      toast.warning('Please fill in all search parameters');
      return;
    }
    
    try {
      await searchHotels(searchParams);
      toast.success('Search completed');
    } catch (error) {
      toast.error('Search failed');
    }
  };
  
  const handleBook = async (hotel: Hotel, room: Room) => {
    try {
      const bookingData = {
        project_id: 'current-project', // TODO: Get from context
        hotel_id: hotel.id,
        room_id: room.id,
        guest_name: 'Guest Name', // TODO: Get from form
        guest_email: 'guest@example.com', // TODO: Get from form
        guest_phone: '+48 123 456 789', // TODO: Get from form
        check_in: searchParams.check_in,
        check_out: searchParams.check_out,
        nights: 1, // TODO: Calculate from dates
        total_price: room.price_per_night,
        currency: 'PLN',
        status: 'pending' as const,
      };
      
      await bookHotel(bookingData);
      toast.success('Booking created successfully');
    } catch (error) {
      toast.error('Failed to create booking');
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'orange';
      case 'confirmed':
        return 'green';
      case 'cancelled':
        return 'red';
      case 'completed':
        return 'blue';
      default:
        return 'default';
    }
  };
  
  const hotelColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: 'Location',
      key: 'location',
      width: 200,
      render: (_: any, record: Hotel) => `${record.city}, ${record.country}`,
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      width: 100,
      render: (rating: number) => (
        <Space>
          <StarOutlined style={{ color: '#faad14' }} />
          {rating}
        </Space>
      ),
    },
    {
      title: 'Price/Night',
      dataIndex: 'price_per_night',
      key: 'price_per_night',
      width: 120,
      render: (price: number, record: Hotel) => `${price} ${record.currency}`,
    },
    {
      title: 'Amenities',
      dataIndex: 'amenities',
      key: 'amenities',
      width: 200,
      render: (amenities: string[]) => (
        <Space wrap>
          {amenities.slice(0, 3).map((amenity, index) => (
            <Tag key={index}>{amenity}</Tag>
          ))}
          {amenities.length > 3 && <Tag>+{amenities.length - 3}</Tag>}
        </Space>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_: any, record: Hotel) => (
        <Space>
          <Button type="text" onClick={() => handleEdit(record)}>Edit</Button>
          <Button type="text" danger onClick={() => handleDelete(record, deleteHotel)}>Delete</Button>
        </Space>
      ),
    },
  ];
  
  const roomColumns = [
    {
      title: 'Hotel',
      dataIndex: 'hotel',
      key: 'hotel',
      width: 150,
      render: (hotel: Hotel) => hotel?.name || 'N/A',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 120,
    },
    {
      title: 'Capacity',
      dataIndex: 'capacity',
      key: 'capacity',
      width: 100,
      render: (capacity: number) => `${capacity} guests`,
    },
    {
      title: 'Price/Night',
      dataIndex: 'price_per_night',
      key: 'price_per_night',
      width: 120,
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: 'Status',
      dataIndex: 'is_available',
      key: 'is_available',
      width: 100,
      render: (available: boolean) => (
        <Tag color={available ? 'green' : 'red'}>
          {available ? 'Available' : 'Unavailable'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_: any, record: Room) => (
        <Space>
          <Button type="text" onClick={() => handleEdit(record)}>Edit</Button>
          <Button type="text" danger onClick={() => handleDelete(record, deleteRoom)}>Delete</Button>
        </Space>
      ),
    },
  ];
  
  const bookingColumns = [
    {
      title: 'Hotel',
      dataIndex: 'hotel',
      key: 'hotel',
      width: 150,
      render: (hotel: Hotel) => hotel?.name || 'N/A',
    },
    {
      title: 'Guest',
      dataIndex: 'guest_name',
      key: 'guest_name',
      width: 120,
    },
    {
      title: 'Check-in',
      dataIndex: 'check_in',
      key: 'check_in',
      width: 100,
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Check-out',
      dataIndex: 'check_out',
      key: 'check_out',
      width: 100,
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Nights',
      dataIndex: 'nights',
      key: 'nights',
      width: 80,
    },
    {
      title: 'Total Price',
      dataIndex: 'total_price',
      key: 'total_price',
      width: 120,
      render: (price: number, record: Booking) => `${price} ${record.currency}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => <Tag color={getStatusColor(status)}>{status}</Tag>,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_: any, record: Booking) => (
        <Space>
          <Button type="text" onClick={() => handleEdit(record)}>Edit</Button>
          {record.status === 'confirmed' && (
            <Button type="text" danger onClick={() => cancelBooking(record.id)}>Cancel</Button>
          )}
          <Button type="text" danger onClick={() => handleDelete(record, deleteBooking)}>Delete</Button>
        </Space>
      ),
    },
  ];
  
  const getCurrentData = () => {
    switch (activeTab) {
      case 'hotels':
        return hotels;
      case 'rooms':
        return rooms;
      case 'bookings':
        return bookings;
      case 'search':
        return searchResults;
      default:
        return [];
    }
  };
  
  const getCurrentColumns = () => {
    switch (activeTab) {
      case 'hotels':
        return hotelColumns;
      case 'rooms':
        return roomColumns;
      case 'bookings':
        return bookingColumns;
      case 'search':
        return hotelColumns;
      default:
        return [];
    }
  };
  
  const filteredData = getCurrentData().filter((item: any) =>
    Object.values(item).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading accommodation data...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600">Error loading accommodation data: {error}</p>
          <Button onClick={() => {
            fetchHotels();
            fetchBookings();
          }} className="mt-2">
            Try Again
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Accommodation Management</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          Add {activeTab === 'hotels' ? 'Hotel' : activeTab === 'rooms' ? 'Room' : 'Booking'}
        </Button>
      </div>
      
      <div className="mb-4">
        <Search
          placeholder={`Search ${activeTab}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 300 }}
        />
      </div>
      
      {/* Search Section */}
      {activeTab === 'search' && (
        <Card title="Search Hotels" className="mb-6">
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item label="City">
                <Input
                  value={searchParams.city}
                  onChange={(e) => setSearchParams({ ...searchParams, city: e.target.value })}
                  placeholder="Enter city"
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Check-in">
                <DatePicker
                  value={searchParams.check_in ? new Date(searchParams.check_in) : null}
                  onChange={(date) => setSearchParams({ ...searchParams, check_in: date?.toISOString().split('T')[0] || '' })}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Check-out">
                <DatePicker
                  value={searchParams.check_out ? new Date(searchParams.check_out) : null}
                  onChange={(date) => setSearchParams({ ...searchParams, check_out: date?.toISOString().split('T')[0] || '' })}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Guests">
                <InputNumber
                  min={1}
                  value={searchParams.guests}
                  onChange={(value) => setSearchParams({ ...searchParams, guests: value || 1 })}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Button type="primary" onClick={handleSearch} className="mt-4">
            Search Hotels
          </Button>
        </Card>
      )}
      
      {/* Tabs */}
      <div className="mb-4">
        <Space>
          <Button
            type={activeTab === 'hotels' ? 'primary' : 'default'}
            icon={<BuildOutlined />}
            onClick={() => setActiveTab('hotels')}
          >
            Hotels
          </Button>
          <Button
            type={activeTab === 'rooms' ? 'primary' : 'default'}
            icon={<HomeOutlined />}
            onClick={() => setActiveTab('rooms')}
          >
            Rooms
          </Button>
          <Button
            type={activeTab === 'bookings' ? 'primary' : 'default'}
            icon={<CalendarOutlined />}
            onClick={() => setActiveTab('bookings')}
          >
            Bookings
          </Button>
          <Button
            type={activeTab === 'search' ? 'primary' : 'default'}
            icon={<SearchOutlined />}
            onClick={() => setActiveTab('search')}
          >
            Search
          </Button>
        </Space>
      </div>
      
      <Table
        columns={getCurrentColumns()}
        dataSource={filteredData}
        rowKey="id"
        pagination={{ pageSize: 20 }}
        scroll={{ x: 1000 }}
      />
      
      <Modal
        title={`${editingItem ? 'Edit' : 'Add'} ${activeTab === 'hotels' ? 'Hotel' : activeTab === 'rooms' ? 'Room' : 'Booking'}`}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          {activeTab === 'hotels' && (
            <>
              <Form.Item name="name" label="Hotel Name" rules={[{ required: true }]}>
                <Input placeholder="e.g., Hotel Plaza" />
              </Form.Item>
              <Form.Item name="address" label="Address" rules={[{ required: true }]}>
                <Input placeholder="e.g., 123 Main Street" />
              </Form.Item>
              <Form.Item name="city" label="City" rules={[{ required: true }]}>
                <Input placeholder="e.g., Warsaw" />
              </Form.Item>
              <Form.Item name="country" label="Country" rules={[{ required: true }]}>
                <Input placeholder="e.g., Poland" />
              </Form.Item>
              <Form.Item name="rating" label="Rating" rules={[{ required: true }]}>
                <InputNumber min={1} max={5} step={0.1} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name="price_per_night" label="Price per Night" rules={[{ required: true }]}>
                <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name="currency" label="Currency" rules={[{ required: true }]}>
                <Select>
                  <Option value="PLN">PLN</Option>
                  <Option value="EUR">EUR</Option>
                  <Option value="USD">USD</Option>
                </Select>
              </Form.Item>
              <Form.Item name="amenities" label="Amenities">
                <Select mode="tags" placeholder="Add amenities">
                  <Option value="WiFi">WiFi</Option>
                  <Option value="Parking">Parking</Option>
                  <Option value="Restaurant">Restaurant</Option>
                  <Option value="Gym">Gym</Option>
                  <Option value="Pool">Pool</Option>
                </Select>
              </Form.Item>
            </>
          )}
          
          {activeTab === 'rooms' && (
            <>
              <Form.Item name="hotel_id" label="Hotel" rules={[{ required: true }]}>
                <Select>
                  {hotels.map(hotel => (
                    <Option key={hotel.id} value={hotel.id}>{hotel.name}</Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="type" label="Room Type" rules={[{ required: true }]}>
                <Input placeholder="e.g., Standard Double" />
              </Form.Item>
              <Form.Item name="capacity" label="Capacity" rules={[{ required: true }]}>
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name="price_per_night" label="Price per Night" rules={[{ required: true }]}>
                <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name="amenities" label="Amenities">
                <Select mode="tags" placeholder="Add amenities">
                  <Option value="TV">TV</Option>
                  <Option value="Minibar">Minibar</Option>
                  <Option value="Balcony">Balcony</Option>
                  <Option value="Sea View">Sea View</Option>
                </Select>
              </Form.Item>
              <Form.Item name="is_available" label="Available" valuePropName="checked">
                <input type="checkbox" />
              </Form.Item>
            </>
          )}
          
          {activeTab === 'bookings' && (
            <>
              <Form.Item name="project_id" label="Project ID" rules={[{ required: true }]}>
                <Input placeholder="e.g., PROJ-001" />
              </Form.Item>
              <Form.Item name="hotel_id" label="Hotel" rules={[{ required: true }]}>
                <Select>
                  {hotels.map(hotel => (
                    <Option key={hotel.id} value={hotel.id}>{hotel.name}</Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="room_id" label="Room" rules={[{ required: true }]}>
                <Select>
                  {rooms.map(room => (
                    <Option key={room.id} value={room.id}>{room.type}</Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="guest_name" label="Guest Name" rules={[{ required: true }]}>
                <Input placeholder="e.g., John Doe" />
              </Form.Item>
              <Form.Item name="guest_email" label="Guest Email" rules={[{ required: true }]}>
                <Input placeholder="e.g., john@example.com" />
              </Form.Item>
              <Form.Item name="guest_phone" label="Guest Phone" rules={[{ required: true }]}>
                <Input placeholder="e.g., +48 123 456 789" />
              </Form.Item>
              <Form.Item name="check_in" label="Check-in Date" rules={[{ required: true }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name="check_out" label="Check-out Date" rules={[{ required: true }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name="total_price" label="Total Price" rules={[{ required: true }]}>
                <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name="currency" label="Currency" rules={[{ required: true }]}>
                <Select>
                  <Option value="PLN">PLN</Option>
                  <Option value="EUR">EUR</Option>
                  <Option value="USD">USD</Option>
                </Select>
              </Form.Item>
              <Form.Item name="status" label="Status" rules={[{ required: true }]}>
                <Select>
                  <Option value="pending">Pending</Option>
                  <Option value="confirmed">Confirmed</Option>
                  <Option value="cancelled">Cancelled</Option>
                  <Option value="completed">Completed</Option>
                </Select>
              </Form.Item>
              <Form.Item name="notes" label="Notes">
                <Input.TextArea rows={3} placeholder="Additional notes" />
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default Accommodation;
