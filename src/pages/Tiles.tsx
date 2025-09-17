import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Filter, Plus } from "lucide-react";
import KanbanBoard from "../components/Tiles/KanbanBoard";
import { useTilesStore } from "../stores/tilesStore";
import { Tile } from "../types/tiles.types";
import { Button } from "../new-ui/atoms/Button/Button";
import { Input } from "../new-ui/atoms/Input/Input";
import { Modal } from "../new-ui/atoms/Modal/Modal";
import { Form, FormItem, FormLabel } from "../new-ui/atoms/Form/Form";
import { Select } from "../new-ui/molecules/Select/Select";
import { showToast } from "../lib/notifications";

const Tiles: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTile, setEditingTile] = useState<Tile | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "todo",
    priority: "medium",
    assignee_id: "",
    due_date: "",
    estimated_hours: 0,
  });

  const {
    tiles,
    tilesLoading,
    tilesError,
    fetchTiles,
    addTile,
    updateTile,
    deleteTile,
    moveTile,
  } = useTilesStore();

  useEffect(() => {
    fetchTiles();
  }, [fetchTiles]);

  const handleAddTile = () => {
    setEditingTile(null);
    setFormData({
      name: "",
      description: "",
      status: "todo",
      priority: "medium",
      assignee_id: "",
      due_date: "",
      estimated_hours: 0,
    });
    setIsModalOpen(true);
  };

  const handleEditTile = (tile: Tile) => {
    setEditingTile(tile);
    setFormData({
      name: tile.name,
      description: tile.description || "",
      status: tile.status,
      priority: tile.priority || "medium",
      assignee_id: tile.assignee_id || "",
      due_date: tile.due_date || "",
      estimated_hours: tile.estimated_hours || 0,
    });
    setIsModalOpen(true);
  };

  const handleDeleteTile = async (tileId: string) => {
    try {
      await deleteTile(tileId);
      showToast("Tile deleted successfully", "success");
    } catch (error) {
      showToast("Failed to delete tile", "error");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      showToast("Please enter tile name", "error");
      return;
    }

    try {
      const tileData = {
        ...formData,
        project: "current-project", // TODO: Get from context
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      if (editingTile) {
        await updateTile(editingTile.id, tileData);
        showToast("Tile updated successfully", "success");
      } else {
        await addTile(tileData);
        showToast("Tile added successfully", "success");
      }
      
      setIsModalOpen(false);
      setEditingTile(null);
    } catch (error) {
      showToast("Failed to save tile", "error");
    }
  };

  const handleMoveTile = async (tileId: string, newStatus: string) => {
    try {
      await moveTile(tileId, newStatus as any);
      showToast("Tile moved successfully", "success");
    } catch (error) {
      showToast("Failed to move tile", "error");
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "red";
      case "medium":
        return "orange";
      case "low":
        return "green";
      default:
        return "default";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "todo":
        return "default";
      case "in_progress":
        return "blue";
      case "review":
        return "orange";
      case "done":
        return "green";
      default:
        return "default";
    }
  };

  const handleBackToDashboard = () => {
    navigate("/");
  };

  const filteredTiles = tiles.filter((tile) =>
    tile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tile.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tile.assignee?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (tilesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading tiles...</p>
        </div>
      </div>
    );
  }

  if (tilesError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600">Error loading tiles: {tilesError}</p>
          <Button onClick={() => fetchTiles()} className="mt-2">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            icon={<ArrowLeft />}
            onClick={handleBackToDashboard}
            className="flex items-center gap-2"
          >
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold">Project Tiles</h1>
        </div>
        <Button variant="primary" icon={<Plus />} onClick={handleAddTile}>
          Add Tile
        </Button>
      </div>

      <div className="mb-4 flex space-x-4">
        <Input.Search
          placeholder="Search tiles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 300 }}
        />
        <Button icon={<Filter />}>Filter</Button>
      </div>

      <KanbanBoard
        onEditTile={handleEditTile}
        onDeleteTile={handleDeleteTile}
        onMoveTile={handleMoveTile}
      />

      <Modal
        title={editingTile ? "Edit Tile" : "Add Tile"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSubmit}
        width={600}
      >
        <Form onSubmit={handleSubmit}>
          <FormItem>
            <FormLabel>Name *</FormLabel>
            <Input 
              placeholder="e.g., Design Review" 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </FormItem>

          <FormItem>
            <FormLabel>Description</FormLabel>
            <Input 
              placeholder="Tile description" 
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              multiline
              rows={3}
            />
          </FormItem>

          <FormItem>
            <FormLabel>Status *</FormLabel>
            <Select 
              value={formData.status}
              onChange={(value) => setFormData({ ...formData, status: value })}
            >
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="review">Review</option>
              <option value="done">Done</option>
            </Select>
          </FormItem>

          <FormItem>
            <FormLabel>Priority *</FormLabel>
            <Select 
              value={formData.priority}
              onChange={(value) => setFormData({ ...formData, priority: value })}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </Select>
          </FormItem>

          <FormItem>
            <FormLabel>Assignee ID</FormLabel>
            <Input 
              placeholder="e.g., user-123" 
              value={formData.assignee_id}
              onChange={(e) => setFormData({ ...formData, assignee_id: e.target.value })}
            />
          </FormItem>

          <FormItem>
            <FormLabel>Due Date</FormLabel>
            <Input 
              type="date" 
              value={formData.due_date}
              onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
            />
          </FormItem>

          <FormItem>
            <FormLabel>Estimated Hours</FormLabel>
            <Input 
              type="number"
              min="0"
              value={formData.estimated_hours}
              onChange={(e) => setFormData({ ...formData, estimated_hours: Number(e.target.value) })}
            />
          </FormItem>
        </Form>
      </Modal>
    </div>
  );
};

export default Tiles;