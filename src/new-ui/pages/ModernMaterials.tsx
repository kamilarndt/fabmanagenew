import {
  ArrowDownIcon,
  ArrowUpIcon,
  CubeIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import React, { useState } from "react";
import { ModernBadge } from "../atoms/Badge/ModernBadge";
import { ModernButton } from "../atoms/Button/ModernButton";
import {
  ModernCard,
  ModernCardContent,
  ModernCardHeader,
} from "../atoms/Card/ModernCard";

const ModernMaterials: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const materials = [
    {
      id: 1,
      name: "Steel Beams I-200",
      category: "Structural",
      sku: "STL-I200-001",
      quantity: 45,
      minQuantity: 20,
      maxQuantity: 100,
      unit: "pieces",
      price: 125.5,
      supplier: "MetalWorks Inc.",
      status: "normal",
      lastRestocked: "2024-01-15",
      location: "Warehouse A-12",
    },
    {
      id: 2,
      name: "Concrete Mix C25",
      category: "Concrete",
      sku: "CON-C25-001",
      quantity: 8,
      minQuantity: 15,
      maxQuantity: 50,
      unit: "cubic meters",
      price: 85.0,
      supplier: "Concrete Solutions",
      status: "low",
      lastRestocked: "2024-01-10",
      location: "Warehouse B-05",
    },
    {
      id: 3,
      name: "Reinforcement Bars 12mm",
      category: "Reinforcement",
      sku: "REB-12MM-001",
      quantity: 120,
      minQuantity: 50,
      maxQuantity: 200,
      unit: "meters",
      price: 2.85,
      supplier: "SteelCorp",
      status: "normal",
      lastRestocked: "2024-01-20",
      location: "Warehouse A-08",
    },
    {
      id: 4,
      name: "Insulation Foam 50mm",
      category: "Insulation",
      sku: "INS-F50-001",
      quantity: 0,
      minQuantity: 10,
      maxQuantity: 50,
      unit: "square meters",
      price: 12.75,
      supplier: "InsulTech",
      status: "critical",
      lastRestocked: "2023-12-15",
      location: "Warehouse C-03",
    },
    {
      id: 5,
      name: "Electrical Cable 2.5mm²",
      category: "Electrical",
      sku: "ELC-2.5-001",
      quantity: 250,
      minQuantity: 100,
      maxQuantity: 500,
      unit: "meters",
      price: 3.25,
      supplier: "ElectroSupply",
      status: "excess",
      lastRestocked: "2024-01-18",
      location: "Warehouse D-15",
    },
    {
      id: 6,
      name: "PVC Pipes 110mm",
      category: "Plumbing",
      sku: "PVC-110-001",
      quantity: 35,
      minQuantity: 20,
      maxQuantity: 80,
      unit: "meters",
      price: 18.9,
      supplier: "PipeWorks",
      status: "normal",
      lastRestocked: "2024-01-12",
      location: "Warehouse B-12",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "normal":
        return <ModernBadge variant="success">Normal</ModernBadge>;
      case "low":
        return <ModernBadge variant="warning">Low Stock</ModernBadge>;
      case "critical":
        return <ModernBadge variant="error">Critical</ModernBadge>;
      case "excess":
        return <ModernBadge variant="info">Excess</ModernBadge>;
      default:
        return <ModernBadge variant="outline">{status}</ModernBadge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "critical":
        return <ExclamationTriangleIcon className="h-5 w-5 text-error-600" />;
      case "low":
        return <ArrowDownIcon className="h-5 w-5 text-warning-600" />;
      case "excess":
        return <ArrowUpIcon className="h-5 w-5 text-info-600" />;
      default:
        return <CubeIcon className="h-5 w-5 text-success-600" />;
    }
  };

  const filteredMaterials = materials.filter((material) => {
    const matchesSearch =
      material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || material.category === filterCategory;
    const matchesStatus =
      filterStatus === "all" || material.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = ["all", ...new Set(materials.map((m) => m.category))];
  const statuses = ["all", "normal", "low", "critical", "excess"];

  const totalValue = materials.reduce(
    (sum, material) => sum + material.quantity * material.price,
    0
  );
  const criticalItems = materials.filter((m) => m.status === "critical").length;
  const lowStockItems = materials.filter((m) => m.status === "low").length;

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-primary">Materials</h1>
            <p className="text-lg text-secondary mt-2">
              Manage your construction materials inventory
            </p>
          </div>
          <ModernButton size="lg" leftIcon={<PlusIcon className="h-5 w-5" />}>
            Add Material
          </ModernButton>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ModernCard>
            <ModernCardContent padding="lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-secondary">
                    Total Items
                  </p>
                  <p className="text-3xl font-bold text-primary mt-2">
                    {materials.length}
                  </p>
                </div>
                <div className="p-3 bg-primary-50 rounded-xl">
                  <CubeIcon className="h-6 w-6 text-primary-600" />
                </div>
              </div>
            </ModernCardContent>
          </ModernCard>

          <ModernCard>
            <ModernCardContent padding="lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-secondary">
                    Inventory Value
                  </p>
                  <p className="text-3xl font-bold text-primary mt-2">
                    ${totalValue.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-success-50 rounded-xl">
                  <div className="h-6 w-6 bg-success-600 rounded-full"></div>
                </div>
              </div>
            </ModernCardContent>
          </ModernCard>

          <ModernCard>
            <ModernCardContent padding="lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-secondary">
                    Critical Items
                  </p>
                  <p className="text-3xl font-bold text-primary mt-2">
                    {criticalItems}
                  </p>
                </div>
                <div className="p-3 bg-error-50 rounded-xl">
                  <ExclamationTriangleIcon className="h-6 w-6 text-error-600" />
                </div>
              </div>
            </ModernCardContent>
          </ModernCard>

          <ModernCard>
            <ModernCardContent padding="lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-secondary">
                    Low Stock
                  </p>
                  <p className="text-3xl font-bold text-primary mt-2">
                    {lowStockItems}
                  </p>
                </div>
                <div className="p-3 bg-warning-50 rounded-xl">
                  <ArrowDownIcon className="h-6 w-6 text-warning-600" />
                </div>
              </div>
            </ModernCardContent>
          </ModernCard>
        </div>

        {/* Filters */}
        <ModernCard>
          <ModernCardContent padding="lg">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary" />
                  <input
                    type="text"
                    placeholder="Search materials, SKU, or supplier..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-card text-primary placeholder-secondary focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-4 py-2 border border-border rounded-lg bg-card text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </option>
                  ))}
                </select>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-border rounded-lg bg-card text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status === "all"
                        ? "All Status"
                        : status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </ModernCardContent>
        </ModernCard>

        {/* Materials Table */}
        <ModernCard>
          <ModernCardHeader
            title="Materials Inventory"
            description="Complete list of all materials in your inventory"
          />
          <ModernCardContent padding="none">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-tertiary">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-tertiary uppercase tracking-wider">
                      Material
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-tertiary uppercase tracking-wider">
                      SKU
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-tertiary uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-tertiary uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-tertiary uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-tertiary uppercase tracking-wider">
                      Supplier
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-tertiary uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-light">
                  {filteredMaterials.map((material) => (
                    <tr
                      key={material.id}
                      className="hover:bg-tertiary transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-lg bg-tertiary flex items-center justify-center">
                              {getStatusIcon(material.status)}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-primary">
                              {material.name}
                            </div>
                            <div className="text-sm text-secondary">
                              {material.category}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                        {material.sku}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-primary">
                          {material.quantity} {material.unit}
                        </div>
                        <div className="text-xs text-secondary">
                          Min: {material.minQuantity} | Max:{" "}
                          {material.maxQuantity}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(material.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-primary">
                        ${material.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                        {material.supplier}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <ModernButton variant="outline" size="sm">
                            Edit
                          </ModernButton>
                          <ModernButton variant="outline" size="sm">
                            Restock
                          </ModernButton>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ModernCardContent>
        </ModernCard>

        {filteredMaterials.length === 0 && (
          <ModernCard>
            <ModernCardContent padding="lg" className="text-center">
              <div className="py-12">
                <div className="mx-auto h-12 w-12 bg-tertiary rounded-full flex items-center justify-center mb-4">
                  <CubeIcon className="h-6 w-6 text-tertiary" />
                </div>
                <h3 className="text-lg font-medium text-primary mb-2">
                  No materials found
                </h3>
                <p className="text-secondary mb-4">
                  {searchTerm ||
                  filterCategory !== "all" ||
                  filterStatus !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "Get started by adding your first material"}
                </p>
                <ModernButton leftIcon={<PlusIcon className="h-4 w-4" />}>
                  Add Material
                </ModernButton>
              </div>
            </ModernCardContent>
          </ModernCard>
        )}
      </div>
    </div>
  );
};

export default ModernMaterials;
