import {
  ArrowLeftOutlined,
  FilterOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, InputNumber, Modal, Select, message } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import KanbanBoard from "../components/Tiles/KanbanBoard";
import { useTilesStore } from "../stores/tilesStore";
import { Tile } from "../types/tiles.types";

const { Search } = Input;

const Tiles: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTile, setEditingTile] = useState<Tile | null>(null);
  const [form] = Form.useForm();

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

  const filteredTiles = tiles.filter(
    (tile) =>
      tile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tile.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tile.assignee?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddTile = () => {
    setEditingTile(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEditTile = (tile: Tile) => {
    setEditingTile(tile);
    form.setFieldsValue(tile);
    setIsModalOpen(true);
  };

  const handleDeleteTile = async (tileId: string) => {
    try {
      await deleteTile(tileId);
      message.success("Tile deleted successfully");
    } catch (error) {
      message.error("Failed to delete tile");
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingTile) {
        await updateTile(editingTile.id, values);
        message.success("Tile updated successfully");
      } else {
        await addTile(values);
        message.success("Tile added successfully");
      }
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      message.error("Failed to save tile");
    }
  };

  const handleMoveTile = async (tileId: string, newStatus: string) => {
    try {
      await moveTile(tileId, newStatus as any);
      message.success("Tile moved successfully");
    } catch (error) {
      message.error("Failed to move tile");
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

  const handleBackToDashboard = () => {
    navigate("/");
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={handleBackToDashboard}
            className="flex items-center gap-2"
          >
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold">Project Tiles</h1>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddTile}>
          Add Tile
        </Button>
      </div>

      <div className="mb-4 flex space-x-4">
        <Search
          placeholder="Search tiles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 300 }}
        />
        <Button icon={<FilterOutlined />}>Filter</Button>
      </div>

      <KanbanBoard
        onEditTile={handleEditTile}
        onDeleteTile={handleDeleteTile}
      />

      <Modal
        title={editingTile ? "Edit Tile" : "Add Tile"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please enter tile name" }]}
          >
            <Input placeholder="e.g., Design Review" />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} placeholder="Tile description" />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select status" }]}
          >
            <Select placeholder="Select status">
              <Select.Option value="todo">To Do</Select.Option>
              <Select.Option value="in_progress">In Progress</Select.Option>
              <Select.Option value="review">Review</Select.Option>
              <Select.Option value="done">Done</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="priority"
            label="Priority"
            rules={[{ required: true, message: "Please select priority" }]}
          >
            <Select placeholder="Select priority">
              <Select.Option value="low">Low</Select.Option>
              <Select.Option value="medium">Medium</Select.Option>
              <Select.Option value="high">High</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="assignee_id" label="Assignee ID">
            <Input placeholder="e.g., user-123" />
          </Form.Item>

          <Form.Item name="due_date" label="Due Date">
            <Input type="date" />
          </Form.Item>

          <Form.Item name="estimated_hours" label="Estimated Hours">
            <InputNumber
              min={0}
              step={0.5}
              style={{ width: "100%" }}
              placeholder="0"
            />
          </Form.Item>

          <Form.Item name="tags" label="Tags">
            <Select
              mode="tags"
              placeholder="Add tags"
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Tiles;
