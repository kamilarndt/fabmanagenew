import { Calculator, DollarSign, Download, TrendingUp } from "lucide-react";
import React, { useEffect, useState } from "react";
import { usePricingStore } from "../stores/pricingStore";
import { PricingCalculation } from "../types/pricing.types";
import { Button } from "@/new-ui/atoms/Button/Button";
import { Card } from "@/new-ui/molecules/Card/Card";
import { Input } from "@/new-ui/atoms/Input/Input";
import { Progress } from "@/new-ui/atoms/Progress/Progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/new-ui/atoms/Select/Select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/new-ui/molecules/Table/Table";
import { Badge } from "@/new-ui/atoms/Badge/Badge";
import { toast } from "sonner";

const Pricing: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState<string>("all");

  const {
    calculations,
    isLoading,
    error,
    fetchCalculations,
    calculateProjectPricing,
    exportPricing,
  } = usePricingStore();

  useEffect(() => {
    fetchCalculations();
  }, [fetchCalculations]);

  const filteredCalculations = (calculations || []).filter(
    (calc) =>
      calc.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      calc.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCalculatePricing = async (projectId: string) => {
    try {
      await calculateProjectPricing(projectId);
      toast.success("Pricing calculated successfully");
    } catch (error) {
      toast.error("Failed to calculate pricing");
    }
  };

  const handleExportPricing = async (calculationId: string) => {
    try {
      await exportPricing(calculationId);
      toast.success("Pricing exported successfully");
    } catch (error) {
      toast.error("Failed to export pricing");
    }
  };

  const getTotalCost = (calc: PricingCalculation) => {
    return (
      calc.materials_cost +
      calc.labor_cost +
      calc.equipment_cost +
      calc.transport_cost +
      calc.accommodation_cost
    );
  };

  const getProfitMargin = (calc: PricingCalculation) => {
    const totalCost = getTotalCost(calc);
    return totalCost > 0
      ? ((calc.selling_price - totalCost) / calc.selling_price) * 100
      : 0;
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "approved":
        return "success";
      case "pending":
        return "warning";
      default:
        return "secondary";
    }
  };

  const getProfitMarginVariant = (margin: number) => {
    if (margin > 20) return "success";
    if (margin > 10) return "warning";
    return "destructive";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading pricing data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600">Error loading pricing data: {error}</p>
          <Button onClick={() => fetchCalculations()} className="mt-2">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const totalProjects = (calculations || []).length;
  const approvedProjects = (calculations || []).filter(
    (calc) => calc.status === "approved"
  ).length;
  const totalRevenue = (calculations || []).reduce(
    (sum, calc) => sum + calc.selling_price,
    0
  );
  const totalCosts = (calculations || []).reduce(
    (sum, calc) => sum + getTotalCost(calc),
    0
  );
  const averageProfitMargin =
    (calculations || []).length > 0
      ? (calculations || []).reduce((sum, calc) => sum + getProfitMargin(calc), 0) /
        (calculations || []).length
      : 0;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Pricing Management</h1>

        <div className="flex space-x-4 mb-4">
          <Input
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-80"
          />
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select project status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-6">
          <div className="flex items-center space-x-2">
            <Calculator className="h-4 w-4 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-gray-600">Total Projects</p>
              <p className="text-2xl font-bold">{totalProjects}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved Projects</p>
                <p className="text-2xl font-bold text-green-600">
                  {approvedProjects} / {totalProjects}
                </p>
              </div>
            </div>
            <Progress 
              value={totalProjects > 0 ? (approvedProjects / totalProjects) * 100 : 0}
              className="h-2"
            />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4 text-green-600" />
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-purple-600" />
            <div>
              <p className="text-sm font-medium text-gray-600">Average Profit Margin</p>
              <p className={`text-2xl font-bold ${
                averageProfitMargin > 20 ? "text-green-600" :
                averageProfitMargin > 10 ? "text-yellow-600" : "text-red-600"
              }`}>
                {averageProfitMargin.toFixed(1)}%
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Cost Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Cost Breakdown</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Materials:</span>
              <span className="font-medium">
                $
                {(calculations || [])
                  .reduce((sum, calc) => sum + calc.materials_cost, 0)
                  .toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Labor:</span>
              <span className="font-medium">
                $
                {(calculations || [])
                  .reduce((sum, calc) => sum + calc.labor_cost, 0)
                  .toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Equipment:</span>
              <span className="font-medium">
                $
                {(calculations || [])
                  .reduce((sum, calc) => sum + calc.equipment_cost, 0)
                  .toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Transport:</span>
              <span className="font-medium">
                $
                {(calculations || [])
                  .reduce((sum, calc) => sum + calc.transport_cost, 0)
                  .toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Accommodation:</span>
              <span className="font-medium">
                $
                {(calculations || [])
                  .reduce((sum, calc) => sum + calc.accommodation_cost, 0)
                  .toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between font-bold border-t pt-3">
              <span>Total Costs:</span>
              <span>${totalCosts.toFixed(2)}</span>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Profit Analysis</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Total Revenue:</span>
              <span className="font-medium">${totalRevenue.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Costs:</span>
              <span className="font-medium">${totalCosts.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold border-t pt-3">
              <span>Net Profit:</span>
              <span
                className={
                  totalRevenue - totalCosts > 0
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                ${(totalRevenue - totalCosts).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Profit Margin:</span>
              <span
                className={
                  totalRevenue > 0
                    ? ((totalRevenue - totalCosts) / totalRevenue) * 100 > 20
                      ? "text-green-600"
                      : "text-orange-600"
                    : "text-red-600"
                }
              >
                {totalRevenue > 0
                  ? (
                      ((totalRevenue - totalCosts) / totalRevenue) *
                      100
                    ).toFixed(1)
                  : 0}
                %
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Pricing Table */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Project Pricing</h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Materials</TableHead>
                <TableHead>Labor</TableHead>
                <TableHead>Equipment</TableHead>
                <TableHead>Transport</TableHead>
                <TableHead>Accommodation</TableHead>
                <TableHead>Total Cost</TableHead>
                <TableHead>Selling Price</TableHead>
                <TableHead>Profit Margin</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCalculations.map((calc) => (
                <TableRow key={calc.id}>
                  <TableCell className="font-medium">{calc.project_name}</TableCell>
                  <TableCell>{calc.description}</TableCell>
                  <TableCell>${calc.materials_cost.toFixed(2)}</TableCell>
                  <TableCell>${calc.labor_cost.toFixed(2)}</TableCell>
                  <TableCell>${calc.equipment_cost.toFixed(2)}</TableCell>
                  <TableCell>${calc.transport_cost.toFixed(2)}</TableCell>
                  <TableCell>${calc.accommodation_cost.toFixed(2)}</TableCell>
                  <TableCell>${getTotalCost(calc).toFixed(2)}</TableCell>
                  <TableCell>${calc.selling_price.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={getProfitMarginVariant(getProfitMargin(calc))}>
                      {getProfitMargin(calc).toFixed(1)}%
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(calc.status)}>
                      {calc.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCalculatePricing(calc.project_id)}
                      >
                        <Calculator className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleExportPricing(calc.id)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default Pricing;
