import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppLayout } from "./final/layout";

const App: React.FC = () => {
  return (
    <Router>
      <AppLayout>
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Komponenty z Figmy:</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>
              <strong>Sidebar</strong> - Nawigacja z logo FabManage i menu
            </li>
            <li>
              <strong>Header</strong> - Breadcrumbs i informacje o projekcie
            </li>
            <li>
              <strong>Main</strong> - Główny obszar treści z tytułem i opisem
            </li>
          </ul>
        </div>
      </AppLayout>
    </Router>
  );
};

export default App;
