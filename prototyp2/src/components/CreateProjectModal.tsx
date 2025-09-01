import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useProjects } from "../utils/supabase/hooks";
import { showSuccessToast, showErrorToast } from "../utils/toast";
import { 
  Calendar, 
  Search, 
  Upload, 
  Image, 
  ChevronDown,
  Loader2
} from "lucide-react";
import svgPaths from "../imports/svg-gqh9xq5srf";

interface CreateProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProjectCreate: (projectData: any) => void;
}

export function CreateProjectModal({ open, onOpenChange, onProjectCreate }: CreateProjectModalProps) {
  const { createProject, loading: projectLoading } = useProjects();
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [clientName, setClientName] = useState("");
  const [budget, setBudget] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [projectStatus, setProjectStatus] = useState("Draft");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableClients = [
    { id: "abc-corp", name: "ABC Corporation" },
    { id: "xyz-mfg", name: "XYZ Manufacturing" },
    { id: "tech-sol", name: "Tech Solutions Ltd" },
    { id: "media-corp", name: "MediaCorp" },
    { id: "gr8-tech", name: "GR8 TECH" }
  ];

  const teamMembers = [
    {
      id: "jay",
      name: "Jay Hargudson",
      role: "Project Manager",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Jay Hargudson"
    },
    {
      id: "mohammad",
      name: "Mohammad Karim",
      role: "Project Manager", 
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Mohammad Karim"
    },
    {
      id: "john",
      name: "John Bushmill",
      role: "Project Manager",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=John Bushmill"
    },
    {
      id: "josh",
      name: "Josh Adam",
      role: "UI/UX Designer",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Josh Adam"
    },
    {
      id: "linda",
      name: "Linda Blair",
      role: "Mobile Developer",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Linda Blair"
    },
    {
      id: "jessica",
      name: "Jessica Patricia",
      role: "Front End Developer",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Jessica Patricia"
    },
    {
      id: "laura",
      name: "Laura Prichet",
      role: "Back End Developer",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Laura Prichet"
    },
    {
      id: "lisa",
      name: "Lisa Greg",
      role: "Tech Lead",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Lisa Greg"
    }
  ];

  const filteredMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMemberToggle = (memberId: string) => {
    setSelectedMembers(prev =>
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleSubmit = async () => {
    if (!projectName || !clientName) {
      showErrorToast("Proszę wypełnić wszystkie wymagane pola");
      return;
    }

    try {
      setIsSubmitting(true);
      
      const selectedTeam = teamMembers.filter(member => selectedMembers.includes(member.id));
      
      const projectData = {
        name: projectName,
        client: clientName,
        manager: selectedTeam.find(m => m.role.includes("Project Manager"))?.name || "Nie przypisano",
        budget: budget ? parseInt(budget) : 0,
        startDate: new Date().toISOString().split('T')[0],
        endDate: dueDate,
        description,
        status: projectStatus === "Draft" ? "Wycena" : projectStatus,
        priority: "Średni",
        team: selectedTeam.map(m => m.name),
        stage: projectStatus === "Draft" ? "Oferta" : "Projektowanie"
      };

      const newProject = await createProject(projectData);
      
      showSuccessToast(`Projekt "${projectName}" został utworzony pomyślnie!`);
      onProjectCreate(newProject);
      
      // Reset form
      setProjectName("");
      setDescription("");
      setDueDate("");
      setClientName("");
      setBudget("");
      setProjectStatus("Draft");
      setSelectedMembers([]);
      setSearchQuery("");
      
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to create project:", error);
      showErrorToast("Błąd podczas tworzenia projektu. Spróbuj ponownie.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden p-0 gap-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Add Project</DialogTitle>
          <DialogDescription>
            Create a new project with team members, budget, and basic information
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-start gap-4 p-6 pb-4">
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-[#171a26] tracking-[0.12px] font-plus-jakarta">Add Project</h2>
            </div>
            <div className="flex gap-2.5">
              <Button 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                className="px-4 py-3 rounded-[12px] border-[#d1d0d2] text-[#69686d] font-bold text-sm font-plus-jakarta"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={!projectName || !clientName || isSubmitting}
                className="px-4 py-3 rounded-[12px] project-modal-gradient-btn text-white font-bold text-sm font-plus-jakarta"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-6 pt-0">
              {/* Left Column */}
              <div className="lg:col-span-3 space-y-4">
                {/* General Information */}
                <div className="bg-white rounded-[20px] border border-[#e8e8e9] p-6">
                  <h3 className="text-lg font-semibold text-[#171a26] mb-5 tracking-[0.09px] font-plus-jakarta">
                    General Information
                  </h3>
                  
                  <div className="space-y-4">
                    {/* Project Name */}
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium text-[#4b4a4d] font-plus-jakarta">Project Name</Label>
                      <div className="bg-white border border-[#e8e8e9] rounded-[12px] p-3">
                        <Input
                          placeholder="Type project name"
                          value={projectName}
                          onChange={(e) => setProjectName(e.target.value)}
                          className="border-0 p-0 text-sm text-[#69686d] placeholder:text-[#69686d] focus-visible:ring-0 font-plus-jakarta"
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium text-[#4b4a4d]">Description</Label>
                      <div className="bg-white border border-[#e8e8e9] rounded-[12px] p-3">
                        <Textarea
                          placeholder="Type description..."
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="border-0 p-0 text-sm text-[#69686d] placeholder:text-[#69686d] focus-visible:ring-0 resize-none min-h-[140px]"
                        />
                      </div>
                    </div>

                    {/* Due Date and Client */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-sm font-medium text-[#4b4a4d]">Due Date</Label>
                        <div className="bg-white border border-[#e8e8e9] rounded-[12px]">
                          <div className="flex items-center gap-1.5 p-3">
                            <Calendar className="w-5 h-5 text-[#69686d]" />
                            <Input
                              type="date"
                              placeholder="Select Dates"
                              value={dueDate}
                              onChange={(e) => setDueDate(e.target.value)}
                              className="border-0 p-0 text-sm text-[#69686d] placeholder:text-[#69686d] focus-visible:ring-0"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-sm font-medium text-[#4b4a4d]">Client</Label>
                        <div className="bg-white border border-[#e8e8e9] rounded-[12px]">
                          <Select value={clientName} onValueChange={setClientName}>
                            <SelectTrigger className="border-0 p-3 text-sm text-[#69686d] focus:ring-0">
                              <SelectValue placeholder="Select client..." />
                              <ChevronDown className="w-5 h-5 text-[#69686d]" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableClients.map((client) => (
                                <SelectItem key={client.id} value={client.name}>
                                  {client.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Budget */}
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium text-[#4b4a4d]">Budget</Label>
                      <div className="bg-white border border-[#e8e8e9] rounded-[12px]">
                        <div className="flex items-center p-3">
                          <div className="flex items-center gap-1 overflow-clip">
                            <span className="text-sm text-[#69686d]">USD</span>
                            <ChevronDown className="w-5 h-5 text-[#69686d]" />
                          </div>
                          <div className="h-5 w-px bg-[#f0f0f0] mx-2" />
                          <Input
                            placeholder="Type budget..."
                            value={budget}
                            onChange={(e) => setBudget(e.target.value)}
                            className="border-0 p-0 text-sm text-[#69686d] placeholder:text-[#69686d] focus-visible:ring-0 flex-1"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Resources */}
                <div className="bg-white rounded-[20px] border border-[#e8e8e9] p-6">
                  <h3 className="text-lg font-semibold text-[#171a26] mb-5 tracking-[0.09px] font-plus-jakarta">
                    Resources
                  </h3>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-[#4b4a4d]">Files</Label>
                    <Button className="project-modal-gradient-btn text-white font-bold text-sm px-4 py-3 rounded-[12px] font-plus-jakarta">
                      Add File
                    </Button>
                  </div>
                </div>

                {/* Team Members */}
                <div className="bg-white rounded-[20px] border border-[#e8e8e9] p-6 max-w-[756px]">
                  <h3 className="text-lg font-semibold text-[#171a26] mb-5 tracking-[0.09px] font-plus-jakarta">
                    Team Members
                  </h3>
                  
                  <div className="bg-[#f8f8fa] border border-[#e8e8e9] rounded-[16px] p-4">
                    {/* Search */}
                    <div className="bg-white border border-[#e8e8e9] rounded-[12px] p-3 mb-4">
                      <div className="flex items-center gap-1.5">
                        <Search className="w-5 h-5 text-[#69686d]" />
                        <Input
                          placeholder="Search members..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="border-0 p-0 text-sm text-[#69686d] placeholder:text-[#69686d] focus-visible:ring-0"
                        />
                      </div>
                    </div>

                    {/* Members List */}
                    <div className="space-y-4 max-h-[320px] overflow-y-auto relative project-modal-scroll">
                      {filteredMembers.map((member) => (
                        <div key={member.id} className="flex items-center gap-4">
                          <div className="flex items-center gap-2 flex-1">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={member.avatar} />
                              <AvatarFallback className="bg-[#e8e8e9]">
                                {member.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="text-sm font-semibold text-[#171a26]">{member.name}</div>
                              <div className="text-xs text-[#69686d]">{member.role}</div>
                            </div>
                          </div>
                          <Checkbox
                            checked={selectedMembers.includes(member.id)}
                            onCheckedChange={() => handleMemberToggle(member.id)}
                            className="w-5 h-5 rounded-[6px] border-[1.75px] border-[#bababc]"
                          />
                        </div>
                      ))}
                      
                      {/* Scrollbar Track */}
                      <div className="absolute right-[-16px] top-0 bottom-0 w-1 bg-[#f0f0f0]">
                        <div className="w-1 h-[54px] project-modal-blue-gradient" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* Image */}
                <div className="bg-white rounded-[20px] border border-[#e8e8e9] p-6">
                  <h3 className="text-lg font-semibold text-[#171a26] mb-5 tracking-[0.09px] font-plus-jakarta">
                    Image
                  </h3>
                  
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-[#69686d]">Image</Label>
                    <div className="bg-white border border-[#e8e8e9] rounded-[12px] p-5">
                      <div className="flex flex-col items-center gap-4">
                        <div className="bg-[#e6f0ff] p-2 rounded-full">
                          <Image className="w-5 h-5 text-[#6c6cff]" />
                        </div>
                        <p className="text-sm text-[#69686d] text-center">
                          Drag and drop image here, or click add image
                        </p>
                        <Button className="project-modal-gradient-btn text-white font-bold text-sm px-4 py-3 rounded-[12px] font-plus-jakarta">
                          Add Image
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="bg-white rounded-[20px] border border-[#e8e8e9] p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <h3 className="text-lg font-semibold text-[#171a26] tracking-[0.09px] flex-1 font-plus-jakarta">
                      Status
                    </h3>
                    <div className="bg-[#f0f0f0] border border-[#d1d0d2] rounded-full px-3 py-1.5">
                      <span className="text-sm font-semibold text-[#87868a]">Draft</span>
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-[#4b4a4d]">Project Status</Label>
                    <div className="bg-white border border-[#e8e8e9] rounded-[12px]">
                      <Select value={projectStatus} onValueChange={setProjectStatus}>
                        <SelectTrigger className="border-0 p-3 text-sm text-[#171a26] focus:ring-0">
                          <SelectValue />
                          <ChevronDown className="w-5 h-5 text-[#69686d]" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Draft">Draft</SelectItem>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="On Hold">On Hold</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}