import { useState } from "react";
import { useProjects } from "../../utils/supabase/hooks";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Textarea } from "../ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { 
  ArrowLeft, 
  Search, 
  Plus, 
  Star, 
  Share, 
  Edit, 
  Users, 
  Calendar, 
  File, 
  MoreHorizontal,
  Phone,
  Mail,
  Reply,
  Paperclip
} from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import svgPaths from "../../imports/svg-9lkymufk9g";

interface PojjedynczyProjektCompleteProps {
  onBack: () => void;
}

// Sample project data - in real app this would come from props or API
const projectData = {
  id: "proj-101",
  name: "Projekt 101",
  client: "GR8 TECH",
  status: "W Trakcie",
  manager: "Liam Santoso",
  startDate: "12 styczeń 2024",
  budget: 28000,
  maxBudget: 50000,
  currency: "PLN",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque nisl dui, fringilla ac venenatis ut, varius at arcu. Duis non mollis nisl. Phasellus a facilisis ligula, sit amet ultrices arcu. Vestibulum sit amet erat nibh.",
  team: [
    { id: 1, name: "Laura Prichet", role: "Back End Developer", avatar: "LP", isOnline: false },
    { id: 2, name: "Josh Adam", role: "UI/UX Designer", avatar: "JA", isOnline: false },
    { id: 3, name: "Linda Blair", role: "Mobile Developer", avatar: "LB", isOnline: false },
    { id: 4, name: "Sin Tae", role: "Front End Developer", avatar: "ST", isOnline: false },
    { id: 5, name: "Jay Hargudson", role: "Manager", avatar: "JH", isOnline: true },
  ],
  transactions: [
    { id: 1, name: "Jira Subscription", type: "Expenses", amount: -500, icon: "💳" },
    { id: 2, name: "Zoom Subscription", type: "Expenses", amount: -500, icon: "🎧" },
    { id: 3, name: "Zatrudnienie Nowego Designera", type: "Expenses", amount: -8000, icon: "👥" },
    { id: 4, name: "Cloud Server", type: "Expenses", amount: -19500, icon: "💾" },
    { id: 5, name: "Zaliczka", type: "Expenses", amount: -40000, icon: "📋" },
  ],
  attachments: [
    { id: 1, name: "Notatki ze Spotkania.doc", size: "300 KB", type: "doc" },
    { id: 2, name: "Wymagania.pdf", size: "300 KB", type: "pdf" },
    { id: 3, name: "Inspiracje Designu.zip", size: "300 KB", type: "zip" },
    { id: 4, name: "Przepływy Użytkownika.eps", size: "300 KB", type: "eps" },
  ]
};

const activities = [
  {
    id: 1,
    user: "Doni Tan",
    action: "Nowe Zadanie Dodane",
    description: "created new task",
    time: "03/02/23, 14:00",
    avatar: "DT"
  },
  {
    id: 2,
    user: "Josh Adam",
    action: "Status Zadania Zmieniony", 
    description: "move Moodboard task to Done",
    time: "02/02/23, 10:00",
    avatar: "JA",
    statusChange: { from: "W Trakcie", to: "Zakończone" }
  },
  {
    id: 3,
    user: "Lisa Whitaker",
    action: "Odpowiedź na Komentarz",
    description: 'commented "Oke Veronica thank you ~~" in Wireframe Task',
    time: "28/01/23, 09:15",
    avatar: "LW"
  },
  {
    id: 4,
    user: "Jay Hargudson",
    action: "Nowy Plik Przesłany",
    description: "upload new attachment",
    time: "27/01/23, 14:48",
    avatar: "JH",
    images: ["📋", "🎨", "📊"]
  }
];

const comments = [
  {
    id: 1,
    user: "Doni Tan",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque nisl dui, fringilla ac venenatis ut, varius at arcu.",
    time: "20 Gru 2022, 08:00",
    avatar: "DT",
    replies: []
  },
  {
    id: 2,
    user: "Lisa Greg",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque nisl dui, fringilla ac venenatis ut, varius at arcu.",
    time: "20 Gru 2022, 08:00",
    avatar: "LG",
    replies: [
      {
        id: 21,
        user: "Jay Hargudson",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        time: "20 Gru 2022, 08:00",
        avatar: "JH"
      }
    ]
  },
  {
    id: 3,
    user: "Laura Prichet",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque nisl dui, fringilla ac venenatis ut, varius at arcu.",
    time: "20 Gru 2022, 08:00",
    avatar: "LP",
    replies: []
  }
];

export function PojjedynczyProjektComplete({ onBack }: PojjedynczyProjektCompleteProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [newComment, setNewComment] = useState("");

  const handlePostComment = () => {
    if (newComment.trim()) {
      console.log("Posting comment:", newComment);
      setNewComment("");
    }
  };

  return (
    <div className="min-h-screen bg-background font-plus-jakarta">
      {/* Page Header */}
      <div className="bg-white border-b border-[#e6e7e8]/25">
        <div className="flex items-center justify-between px-8 py-3.5">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-1 py-0.5">
              <div className="w-5 h-5 text-[#69686d]">
                <svg fill="none" viewBox="0 0 20 20">
                  <path d={svgPaths.p2c027880} fill="currentColor" opacity="0.5" />
                  <g>
                    <path d={svgPaths.p27ce5a80} fill="currentColor" />
                    <path d={svgPaths.p2fbf8d00} fill="currentColor" />
                    <path d={svgPaths.p3652d800} fill="currentColor" />
                  </g>
                </svg>
              </div>
              <span className="text-sm text-[#69686d] font-medium">Dashboard</span>
            </div>
            <span className="text-sm text-[#69686d] font-medium">/</span>
            <div className="px-1 py-0.5">
              <span className="text-sm text-[#69686d] font-medium">...</span>
            </div>
            <span className="text-sm text-[#69686d] font-medium">/</span>
            <div className="px-1 py-0.5">
              <span className="text-sm text-[#171a26] font-medium">Projekt 101</span>
            </div>
          </div>

          {/* Search and Actions */}
          <div className="flex items-center gap-2.5">
            <div className="bg-white border border-[#e8e8e9] rounded-[12px] px-3 py-2.5 w-[260px]">
              <div className="flex items-center gap-1.5">
                <Search className="w-5 h-5 text-[#69686d]" />
                <Input 
                  placeholder="Szukaj..." 
                  className="border-0 p-0 text-sm placeholder:text-[#69686d] focus-visible:ring-0"
                />
                <span className="text-sm text-[#69686d]">⌘+F</span>
              </div>
            </div>
            <Button className="project-modal-gradient-btn text-white p-[10px] rounded-[12px]">
              <Plus className="w-5 h-5" />
            </Button>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" className="p-[10px] rounded-[12px]">
              <Star className="w-5 h-5 text-[#69686d]" />
            </Button>
            <Button variant="outline" className="border-[#e8e8e9] rounded-[12px] px-[10px] py-2 gap-2">
              <Share className="w-5 h-5 text-[#69686d]" />
              <span className="text-sm font-semibold text-[#69686d]">Udostępnij</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative">
        <div className="h-44 project-detail-gradient-bg rounded-[16px] mx-2 mt-2" />
        <div className="px-8 pb-2 pt-[140px] relative">
          <div className="flex flex-col gap-6">
            {/* Project Avatar and Info */}
            <div className="flex items-end justify-between w-full">
              <div className="flex flex-col gap-4">
                <div className="bg-white border border-[#e8e8e9] rounded-full size-[88px] flex items-center justify-center">
                  <span className="text-2xl">G</span>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex-1">
                    <h1 className="text-2xl font-semibold text-[#171a26] font-plus-jakarta mb-4">
                      {projectData.name}
                    </h1>
                    <div className="flex items-center gap-4">
                      <Badge className="bg-[#fff1e9] border-[#fdd4ba] text-[#fa7522] px-3 py-1.5 rounded-full">
                        {projectData.status}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-5 h-5 text-[#69686d]" />
                        <span className="text-sm text-[#69686d]">{projectData.startDate}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-5 h-5 bg-[#e8e8e9] rounded-full flex items-center justify-center">
                          <span className="text-xs">L</span>
                        </div>
                        <span className="text-sm text-[#69686d]">{projectData.manager}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Team and Actions */}
              <div className="flex items-center gap-4">
                <div className="flex items-center pr-3">
                  {projectData.team.slice(0, 3).map((member, index) => (
                    <div 
                      key={member.id}
                      className="w-11 h-11 bg-[#f0f0f0] rounded-full border-2 border-white -mr-3 flex items-center justify-center"
                    >
                      <span className="text-sm font-medium">{member.avatar}</span>
                    </div>
                  ))}
                  <div className="w-11 h-11 bg-[#f0f0f0] rounded-full border-2 border-white flex items-center justify-center">
                    <span className="text-sm font-semibold text-[#171a26]">+4</span>
                  </div>
                </div>
                <Button variant="outline" className="border-[#d1d0d2] text-[#69686d] px-3.5 py-3 rounded-[12px] gap-1.5">
                  <Users className="w-5 h-5" />
                  <span className="font-bold text-sm">Zaproś</span>
                </Button>
                <div className="w-0 h-11 border-l border-[#f0f0f0]" />
                <Button variant="outline" className="border-[#d1d0d2] p-3 rounded-[12px]">
                  <Plus className="w-5 h-5 text-[#69686d]" />
                </Button>
                <Button className="project-modal-gradient-btn text-white px-3.5 py-3 rounded-[12px] gap-1.5">
                  <Edit className="w-5 h-5" />
                  <span className="font-bold text-sm">Edytuj</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Page Tabs */}
      <div className="bg-white border-b border-[#e6e7e8]">
        <div className="px-8 pt-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-transparent border-b-0 gap-4 h-auto p-0">
              <TabsTrigger 
                value="overview" 
                className="bg-transparent border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary rounded-none pb-3.5 px-1 font-plus-jakarta font-bold"
              >
                Przegląd
              </TabsTrigger>
              <TabsTrigger 
                value="kafelki" 
                className="bg-transparent border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary rounded-none pb-3.5 px-1 font-plus-jakarta font-semibold text-[#69686d]"
              >
                Kafelki / Produkcja
              </TabsTrigger>
              <TabsTrigger 
                value="pliki" 
                className="bg-transparent border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary rounded-none pb-3.5 px-1 font-plus-jakarta font-semibold text-[#69686d]"
              >
                Pliki
              </TabsTrigger>
              <TabsTrigger 
                value="wycena" 
                className="bg-transparent border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary rounded-none pb-3.5 px-1 font-plus-jakarta font-semibold text-[#69686d]"
              >
                Wycena i Finanse
              </TabsTrigger>
              <TabsTrigger 
                value="zespol" 
                className="bg-transparent border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary rounded-none pb-3.5 px-1 font-plus-jakarta font-semibold text-[#69686d]"
              >
                Zespół
              </TabsTrigger>
              <TabsTrigger 
                value="logistyka" 
                className="bg-transparent border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary rounded-none pb-3.5 px-1 font-plus-jakarta font-semibold text-[#69686d]"
              >
                Logistyka
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="overview">
            <div className="flex gap-4">
              {/* Left Column */}
              <div className="flex-1 space-y-4">
                {/* About Project */}
                <div className="bg-white border border-[#e8e8e9] rounded-[20px] p-6">
                  <h3 className="text-lg font-semibold text-[#171a26] mb-3 font-plus-jakarta">
                    O Projekcie
                  </h3>
                  <p className="text-sm text-[#69686d] leading-5">
                    {projectData.description}
                  </p>
                </div>

            {/* Attachment */}
            <div className="bg-white border border-[#e8e8e9] rounded-[20px] p-6">
              <h3 className="text-lg font-semibold text-[#171a26] mb-3 font-plus-jakarta">
                Załączniki
              </h3>
              <div className="flex gap-3">
                <div className="bg-white border border-[#e8e8e9] rounded-[12px] p-2 flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#3b82f6] rounded flex items-center justify-center">
                    <File className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-[#171a26]">O Projekcie.doc</span>
                  <Button variant="ghost" size="sm" className="p-2">
                    <MoreHorizontal className="w-4 h-4 text-[#69686d]" />
                  </Button>
                </div>
                <div className="bg-white border border-[#e8e8e9] rounded-[12px] p-2 flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#f21e1e] rounded flex items-center justify-center">
                    <File className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-[#171a26]">Wymagania.pdf</span>
                  <Button variant="ghost" size="sm" className="p-2">
                    <MoreHorizontal className="w-4 h-4 text-[#69686d]" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Activity */}
            <div className="bg-white border border-[#e8e8e9] rounded-[20px] p-6">
              <h3 className="text-lg font-semibold text-[#171a26] mb-[18px] font-plus-jakarta">
                Aktywność
              </h3>
              <div className="space-y-4 max-h-[424px] overflow-y-auto scrollbar-hide">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex gap-2">
                    <div className="flex flex-col items-center">
                      <div className="w-9 h-9 bg-[#f0f0f0] rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium">{activity.avatar}</span>
                      </div>
                      <div className="w-px h-16 bg-[#e8e8e9] mt-1" />
                    </div>
                    <div className="flex-1 pb-5">
                      <div className="flex items-center justify-between mb-2.5">
                        <h4 className="font-semibold text-[#171a26] text-base">
                          {activity.action}
                        </h4>
                        <Button variant="ghost" size="sm" className="p-2">
                          <MoreHorizontal className="w-4 h-4 text-[#69686d]" />
                        </Button>
                      </div>
                      <p className="text-sm text-[#4b4a4d] mb-2.5">
                        <span className="font-semibold text-[#0167ff]">{activity.user}</span> {activity.description}
                      </p>
                      {activity.statusChange && (
                        <div className="flex items-center gap-2 mb-2.5">
                          <Badge className="bg-[#fff1e9] border-[#fdd4ba] text-[#fa7522] px-2.5 py-1 rounded-full">
                            {activity.statusChange.from}
                          </Badge>
                          <span className="text-[#69686d]">→</span>
                          <Badge className="bg-[#e7f7ed] border-[#b5e7c7] text-[#0fa144] px-2.5 py-1 rounded-full">
                            {activity.statusChange.to}
                          </Badge>
                        </div>
                      )}
                      {activity.images && (
                        <div className="flex gap-2 mb-2.5">
                          {activity.images.map((img, idx) => (
                            <div key={idx} className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                              <span className="text-2xl">{img}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      <p className="text-xs text-[#87868a]">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Comments */}
            <div className="bg-white border border-[#e8e8e9] rounded-[20px] p-6">
              <h3 className="text-lg font-semibold text-[#171a26] mb-[18px] font-plus-jakarta">
                Komentarz
              </h3>
              
              <div className="space-y-4 max-h-[400px] overflow-y-auto scrollbar-hide mb-4">
                {comments.map((comment) => (
                  <div key={comment.id}>
                    <div className="flex gap-3 pb-5 border-b border-[#f0f0f0]">
                      <div className="w-10 h-10 bg-[#f0f0f0] rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium">{comment.avatar}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-[#171a26] text-sm">{comment.user}</span>
                          <span className="text-xs text-[#87868a]">{comment.time}</span>
                        </div>
                        <p className="text-sm text-[#69686d] mb-2">{comment.content}</p>
                        <Button variant="ghost" className="text-primary p-0 h-auto gap-1 font-bold text-sm">
                          <Reply className="w-5 h-5" />
                          Odpowiedz
                        </Button>
                      </div>
                    </div>
                    
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="ml-8 pt-4">
                        <div className="flex gap-3 pb-4">
                          <div className="w-10 h-10 bg-[#f0f0f0] rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium">{reply.avatar}</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-semibold text-[#171a26] text-sm">{reply.user}</span>
                              <span className="text-xs text-[#87868a]">{reply.time}</span>
                            </div>
                            <p className="text-sm text-[#69686d] mb-2">{reply.content}</p>
                            <Button variant="ghost" className="text-primary p-0 h-auto gap-1 font-bold text-sm">
                              <Reply className="w-5 h-5" />
                              Odpowiedz
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Add Comment */}
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-[#4b4a4d]">Komentarz</Label>
                  <div className="bg-white border border-[#e8e8e9] rounded-[12px] p-4">
                    <Textarea
                      placeholder="Tekst zastępczy..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="border-0 p-0 text-sm placeholder:text-[#69686d] focus-visible:ring-0 resize-none min-h-[80px]"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" className="border-[#d1d0d2] p-3 rounded-[12px]">
                    <Paperclip className="w-5 h-5 text-[#69686d]" />
                  </Button>
                  <Button 
                    onClick={handlePostComment}
                    className="project-modal-gradient-btn text-white px-4 py-3 rounded-[12px] font-bold text-sm"
                  >
                    Opublikuj Komentarz
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="w-[360px] space-y-4">
            {/* Budget */}
            <div className="bg-white border border-[#e8e8e9] rounded-[20px] p-6">
              <div className="flex items-center justify-between mb-[18px]">
                <h3 className="text-lg font-semibold text-[#171a26] font-plus-jakarta">
                  Budżet
                </h3>
                <Button variant="ghost" className="text-primary p-0 h-auto gap-1 font-bold text-sm">
                  <Plus className="w-5 h-5" />
                  Dodaj Transakcję
                </Button>
              </div>
              
              <div className="space-y-2 mb-[18px]">
                <div className="flex items-end justify-between">
                  <span className="text-base font-semibold text-[#fa7522]">
                    {projectData.currency} {projectData.budget.toLocaleString()}
                  </span>
                  <span className="text-base font-medium text-[#87868a]">
                    {projectData.currency} {projectData.maxBudget.toLocaleString()}
                  </span>
                </div>
                <Progress 
                  value={(projectData.budget / projectData.maxBudget) * 100} 
                  className="h-2 bg-[#f0f0f0]"
                />
              </div>

              <div className="border-t border-[#f0f0f0] pt-6">
                <h4 className="text-lg font-semibold text-[#171a26] mb-[18px]">
                  Transakcje
                </h4>
                <div className="space-y-5 max-h-[244px] overflow-y-auto scrollbar-hide">
                  {projectData.transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-opacity-20 rounded-full flex items-center justify-center">
                        <span className="text-lg">{transaction.icon}</span>
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-[#171a26] text-sm overflow-hidden text-ellipsis">
                          {transaction.name}
                        </div>
                        <div className="text-xs text-[#69686d]">{transaction.type}</div>
                      </div>
                      <div className="font-semibold text-[#171a26] text-sm">
                        {transaction.amount.toLocaleString()} {projectData.currency}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Team Members */}
            <div className="bg-white border border-[#e8e8e9] rounded-[20px] p-6 h-[350px]">
              <div className="flex items-center justify-between mb-[18px]">
                <h4 className="text-base font-semibold text-[#171a26]">
                  Zespół ({projectData.team.length})
                </h4>
                <Button variant="ghost" className="text-primary p-0 h-auto gap-1 font-bold text-sm">
                  <Plus className="w-5 h-5" />
                  Dodaj Nowy
                </Button>
              </div>

              <div className="space-y-5 overflow-y-auto scrollbar-hide">
                {projectData.team.map((member) => (
                  <div key={member.id} className="flex items-center gap-2">
                    <div className="relative">
                      <div className="w-10 h-10 bg-[#f0f0f0] rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium">{member.avatar}</span>
                      </div>
                      {member.isOnline && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#11b14b] border-2 border-white rounded-full" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-[#171a26] text-sm">{member.name}</div>
                      <div className="text-xs text-[#69686d]">{member.role}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="p-0 w-[18px] h-[18px]">
                        <Phone className="w-[18px] h-[18px] text-[#69686d]" />
                      </Button>
                      <Button variant="ghost" size="sm" className="p-0 w-[18px] h-[18px]">
                        <Mail className="w-[18px] h-[18px] text-[#69686d]" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Attachments */}
            <div className="bg-white border border-[#e8e8e9] rounded-[20px] p-6 h-[456px]">
              <h4 className="text-base font-semibold text-[#171a26] mb-[18px]">
                Załączniki
              </h4>
              
              <div className="space-y-5 overflow-y-auto scrollbar-hide">
                {projectData.attachments.map((file) => (
                  <div key={file.id} className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded flex items-center justify-center ${
                      file.type === 'doc' ? 'bg-[#3b82f6]' :
                      file.type === 'pdf' ? 'bg-[#f21e1e]' :
                      file.type === 'zip' ? 'bg-[#f59e0b]' :
                      'bg-[#0d894f]'
                    }`}>
                      <File className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-[#171a26] text-sm">{file.name}</div>
                      <div className="text-xs font-medium text-[#87868a]">{file.size}</div>
                    </div>
                    <Button variant="ghost" size="sm" className="p-2">
                      <MoreHorizontal className="w-4 h-4 text-[#69686d]" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <Button 
        onClick={onBack}
        variant="outline"
        className="fixed top-4 left-4 z-50 gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Powrót
      </Button>
    </div>
  );
}