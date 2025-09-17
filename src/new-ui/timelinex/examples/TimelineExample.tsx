// TimelineX Example Usage
import React, { useState } from 'react';
import { Timeline } from '../components/Timeline';
import { TimelineItem, TimelineGroup, TimelineMode } from '../types';

export const TimelineExample: React.FC = () => {
  const [mode, setMode] = useState<TimelineMode>('horizontal');
  const [items, setItems] = useState<TimelineItem[]>([
    {
      id: '1',
      title: 'Project Planning',
      start: new Date('2024-01-01'),
      end: new Date('2024-01-15'),
      description: 'Initial project planning and requirements gathering',
      progress: 100,
      color: '#3B82F6',
      tags: ['planning', 'important'],
    },
    {
      id: '2',
      title: 'UI/UX Design',
      start: new Date('2024-01-16'),
      end: new Date('2024-02-15'),
      description: 'User interface and experience design',
      progress: 80,
      color: '#10B981',
      tags: ['design', 'ui'],
    },
    {
      id: '3',
      title: 'Frontend Development',
      start: new Date('2024-02-01'),
      end: new Date('2024-03-15'),
      description: 'React frontend development',
      progress: 60,
      color: '#F59E0B',
      tags: ['development', 'frontend'],
    },
    {
      id: '4',
      title: 'Backend Development',
      start: new Date('2024-02-15'),
      end: new Date('2024-03-30'),
      description: 'Node.js backend development',
      progress: 40,
      color: '#EF4444',
      tags: ['development', 'backend'],
    },
    {
      id: '5',
      title: 'Testing & QA',
      start: new Date('2024-03-15'),
      end: new Date('2024-04-15'),
      description: 'Quality assurance and testing',
      progress: 20,
      color: '#8B5CF6',
      tags: ['testing', 'qa'],
    },
    {
      id: '6',
      title: 'Deployment',
      start: new Date('2024-04-15'),
      end: new Date('2024-04-30'),
      description: 'Production deployment and launch',
      progress: 0,
      color: '#06B6D4',
      tags: ['deployment', 'launch'],
    },
  ]);

  const [groups, setGroups] = useState<TimelineGroup[]>([
    {
      id: 'planning',
      title: 'Planning Phase',
      items: items.slice(0, 2),
      color: '#3B82F6',
      collapsed: false,
    },
    {
      id: 'development',
      title: 'Development Phase',
      items: items.slice(2, 4),
      color: '#10B981',
      collapsed: false,
    },
    {
      id: 'delivery',
      title: 'Delivery Phase',
      items: items.slice(4),
      color: '#8B5CF6',
      collapsed: false,
    },
  ]);

  const handleItemClick = (item: TimelineItem) => {
    console.log('Item clicked:', item);
  };

  const handleItemDoubleClick = (item: TimelineItem) => {
    console.log('Item double clicked:', item);
    // In a real app, this might open an edit dialog
  };

  const handleItemHover = (item: TimelineItem | null) => {
    console.log('Item hovered:', item);
  };

  const handleItemCreate = (item: Omit<TimelineItem, 'id'>) => {
    const newItem: TimelineItem = {
      ...item,
      id: `item-${Date.now()}`,
    };
    setItems(prev => [...prev, newItem]);
  };

  const handleItemUpdate = (item: TimelineItem) => {
    setItems(prev => prev.map(i => i.id === item.id ? item : i));
  };

  const handleItemDelete = (itemId: string) => {
    setItems(prev => prev.filter(i => i.id !== itemId));
  };

  const handleGroupToggle = (group: TimelineGroup, collapsed: boolean) => {
    setGroups(prev => prev.map(g => 
      g.id === group.id ? { ...g, collapsed } : g
    ));
  };

  const handleSelectionChange = (selectedItems: string[], selectedGroups: string[]) => {
    console.log('Selection changed:', selectedItems, selectedGroups);
  };

  const handleViewportChange = (viewport: any) => {
    console.log('Viewport changed:', viewport);
  };

  const handleZoom = (zoom: number, center?: { x: number; y: number }) => {
    console.log('Zoomed:', zoom, center);
  };

  const handlePan = (pan: { x: number; y: number }) => {
    console.log('Panned:', pan);
  };

  const handleExport = (format: string, data: any) => {
    console.log('Exporting to:', format, data);
    // In a real app, this would trigger the actual export
  };

  const handleImport = (data: any) => {
    console.log('Importing data:', data);
    // In a real app, this would update the timeline with imported data
  };

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          TimelineX Example
        </h1>
        
        {/* Controls */}
        <div className="mb-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Timeline Mode
            </label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as TimelineMode)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="horizontal">Horizontal</option>
              <option value="vertical">Vertical</option>
              <option value="alternating">Alternating</option>
              <option value="spiral">Spiral</option>
              <option value="masonry">Masonry</option>
              <option value="gantt">Gantt</option>
            </select>
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={() => handleExport('json', { items, groups })}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Export JSON
            </button>
            <button
              onClick={() => handleExport('csv', { items, groups })}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Export CSV
            </button>
            <button
              onClick={() => handleExport('pdf', { items, groups })}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Export PDF
            </button>
          </div>
        </div>

        {/* Timeline */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <Timeline
            items={items}
            groups={groups}
            mode={mode}
            width="100%"
            height="500px"
            selectable={true}
            editable={true}
            draggable={true}
            resizable={true}
            onItemClick={handleItemClick}
            onItemDoubleClick={handleItemDoubleClick}
            onItemHover={handleItemHover}
            onItemCreate={handleItemCreate}
            onItemUpdate={handleItemUpdate}
            onItemDelete={handleItemDelete}
            onGroupToggle={handleGroupToggle}
            onSelectionChange={handleSelectionChange}
            onViewportChange={handleViewportChange}
            onZoom={handleZoom}
            onPan={handlePan}
            onExport={handleExport}
            onImport={handleImport}
          />
        </div>

        {/* Info */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Timeline Information
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <span className="font-medium">Items:</span> {items.length}
            </div>
            <div>
              <span className="font-medium">Groups:</span> {groups.length}
            </div>
            <div>
              <span className="font-medium">Mode:</span> {mode}
            </div>
            <div>
              <span className="font-medium">Interactive:</span> Yes
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineExample;
