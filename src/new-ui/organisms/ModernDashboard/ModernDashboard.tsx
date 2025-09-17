import { Icon } from "@/new-ui/atoms/Icon/Icon";
import React from "react";

interface DashboardMetric {
  id: string;
  title: string;
  value: string | number;
  change: number;
  changeType: "positive" | "negative" | "neutral";
  icon: string;
  trend?: "up" | "down" | "stable";
}

interface ModernDashboardProps {
  className?: string;
}

const ModernDashboard: React.FC<ModernDashboardProps> = ({ className }) => {
  const metrics: DashboardMetric[] = [
    {
      id: "active-projects",
      title: "Aktywne Projekty",
      value: 24,
      change: 12,
      changeType: "positive",
      icon: "folder",
      trend: "up",
    },
    {
      id: "completed-tasks",
      title: "Ukończone Zadania",
      value: 156,
      change: 8,
      changeType: "positive",
      icon: "check-circle",
      trend: "up",
    },
    {
      id: "pending-orders",
      title: "Oczekujące Zamówienia",
      value: 7,
      change: -2,
      changeType: "negative",
      icon: "clock",
      trend: "down",
    },
    {
      id: "revenue",
      title: "Przychód (PLN)",
      value: "2.4M",
      change: 15,
      changeType: "positive",
      icon: "currency-dollar",
      trend: "up",
    },
  ];

  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case "positive":
        return "text-green-500";
      case "negative":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case "up":
        return "arrow-trending-up";
      case "down":
        return "arrow-trending-down";
      default:
        return "minus";
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1">
            Przegląd systemu zarządzania produkcją
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="glass-button px-4 py-2 flex items-center space-x-2">
            <Icon name="plus" className="w-4 h-4" />
            <span>Nowy Projekt</span>
          </button>
          <button className="neu-button px-4 py-2 flex items-center space-x-2">
            <Icon name="cog" className="w-4 h-4" />
            <span>Ustawienia</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <div key={metric.id} className="glass-card p-6 hover-lift">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
                <Icon name={metric.icon} className="w-6 h-6 text-white" />
              </div>
              <div
                className={`flex items-center space-x-1 ${getChangeColor(
                  metric.changeType
                )}`}
              >
                <Icon name={getTrendIcon(metric.trend)} className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {Math.abs(metric.change)}%
                </span>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">
                {metric.title}
              </h3>
              <p className="text-2xl font-bold text-white">{metric.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Production Chart */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">
              Produkcja Miesięczna
            </h3>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
              <span className="text-sm text-gray-400">2024</span>
            </div>
          </div>
          <div className="h-64 flex items-end justify-between space-x-2">
            {[65, 78, 82, 75, 88, 92, 85, 90, 95, 88, 92, 98].map(
              (height, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-t from-indigo-500 to-purple-600 rounded-t-lg flex-1 animate-pulse"
                  style={{ height: `${height}%` }}
                ></div>
              )
            )}
          </div>
        </div>

        {/* Status Overview */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-6">
            Status Projektów
          </h3>
          <div className="space-y-4">
            {[
              { status: "Planowanie", count: 8, color: "bg-indigo-500" },
              { status: "Projektowanie", count: 12, color: "bg-purple-500" },
              { status: "Produkcja", count: 15, color: "bg-cyan-500" },
              { status: "Kontrola", count: 6, color: "bg-amber-500" },
              { status: "Gotowe", count: 9, color: "bg-green-500" },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                  <span className="text-gray-300">{item.status}</span>
                </div>
                <span className="text-white font-semibold">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-white mb-6">
          Ostatnia Aktywność
        </h3>
        <div className="space-y-4">
          {[
            {
              action: 'Projekt "Fabryka 2024" został ukończony',
              time: "2 godziny temu",
              icon: "check-circle",
            },
            {
              action: "Nowe zamówienie od klienta ABC",
              time: "4 godziny temu",
              icon: "shopping-cart",
            },
            {
              action: "Aktualizacja statusu produkcji",
              time: "6 godzin temu",
              icon: "cog",
            },
            {
              action: "Dodano nowy materiał do magazynu",
              time: "8 godzin temu",
              icon: "package",
            },
          ].map((activity, index) => (
            <div
              key={index}
              className="flex items-center space-x-4 p-3 rounded-lg hover:bg-white/5 transition-colors"
            >
              <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
                <Icon name={activity.icon} className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-white">{activity.action}</p>
                <p className="text-sm text-gray-400">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModernDashboard;
