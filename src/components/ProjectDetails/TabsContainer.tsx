import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bed,
  Database,
  DollarSign,
  File,
  FileText,
  Grid3X3,
  Info,
  Lightbulb,
  Truck,
} from "lucide-react";
import React, { useState } from "react";

// Import tab components
import AccommodationTab from "./tabs/AccommodationTab";
import ConceptTab from "./tabs/ConceptTab";
import DocumentsTab from "./tabs/DocumentsTab";
import FilesTab from "./tabs/FilesTab";
import GeneralTab from "./tabs/GeneralTab";
import ItemsTab from "./tabs/ItemsTab";
import LogisticsTab from "./tabs/LogisticsTab";
import MaterialsTab from "./tabs/MaterialsTab";
import PricingTab from "./tabs/PricingTab";

interface TabsContainerProps {
  projectId?: string;
  className?: string;
}

const TabsContainer: React.FC<TabsContainerProps> = ({
  projectId,
  className,
}) => {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className={`project-tabs-container ${className || ""}`}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-9">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Info className="w-4 h-4" />
            Ogólne
          </TabsTrigger>
          <TabsTrigger value="files" className="flex items-center gap-2">
            <File className="w-4 h-4" />
            Pliki
          </TabsTrigger>
          <TabsTrigger value="concept" className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            Koncepcja
          </TabsTrigger>
          <TabsTrigger value="pricing" className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Wycena
          </TabsTrigger>
          <TabsTrigger value="items" className="flex items-center gap-2">
            <Grid3X3 className="w-4 h-4" />
            Elementy
          </TabsTrigger>
          <TabsTrigger value="materials" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            Materiały
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Dokumenty
          </TabsTrigger>
          <TabsTrigger value="logistics" className="flex items-center gap-2">
            <Truck className="w-4 h-4" />
            Logistyka
          </TabsTrigger>
          <TabsTrigger
            value="accommodation"
            className="flex items-center gap-2"
          >
            <Bed className="w-4 h-4" />
            Zakwaterowanie
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6">
          <GeneralTab projectId={projectId} />
        </TabsContent>
        <TabsContent value="files" className="mt-6">
          <FilesTab projectId={projectId} />
        </TabsContent>
        <TabsContent value="concept" className="mt-6">
          <ConceptTab projectId={projectId} />
        </TabsContent>
        <TabsContent value="pricing" className="mt-6">
          <PricingTab projectId={projectId} />
        </TabsContent>
        <TabsContent value="items" className="mt-6">
          <ItemsTab projectId={projectId} />
        </TabsContent>
        <TabsContent value="materials" className="mt-6">
          <MaterialsTab projectId={projectId} />
        </TabsContent>
        <TabsContent value="documents" className="mt-6">
          <DocumentsTab projectId={projectId} />
        </TabsContent>
        <TabsContent value="logistics" className="mt-6">
          <LogisticsTab projectId={projectId} />
        </TabsContent>
        <TabsContent value="accommodation" className="mt-6">
          <AccommodationTab projectId={projectId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TabsContainer;
