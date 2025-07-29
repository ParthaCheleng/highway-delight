import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Button
} from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  User,
  LogOut,
  StickyNote,
  Calendar
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface DashboardProps {
  onSignOut: () => void;
}

interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
}

export function Dashboard({ onSignOut }: DashboardProps) {
  const { toast } = useToast();

  const [user, setUser] = useState<Profile>({
    id: "",
    full_name: "Loading...",
    email: "",
    phone: ""
  });

  const [notes, setNotes] = useState<Note[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newNote, setNewNote] = useState({ title: "", content: "" });

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error: authError
      } = await supabase.auth.getUser();

      if (authError || !user) {
        toast({
          title: "Authentication Error",
          description: "Could not fetch user data.",
          variant: "destructive"
        });
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError || !profile) {
        toast({
          title: "Profile Error",
          description: "Could not load user profile.",
          variant: "destructive"
        });
        return;
      }

      setUser(profile);
    };

    fetchUser();
  }, []);

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const handleCreateNote = () => {
    if (!newNote.title.trim() || !newNote.content.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in both title and content",
        variant: "destructive"
      });
      return;
    }

    const note: Note = {
      id: Date.now().toString(),
      title: newNote.title,
      content: newNote.content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setNotes((prev) => [note, ...prev]);
    setNewNote({ title: "", content: "" });
    setIsCreating(false);

    toast({
      title: "Note Created",
      description: "Your note has been created successfully"
    });
  };

  const handleUpdateNote = () => {
    if (!editingNote || !editingNote.title.trim() || !editingNote.content.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in both title and content",
        variant: "destructive"
      });
      return;
    }

    setNotes((prev) =>
      prev.map((note) =>
        note.id === editingNote.id
          ? { ...editingNote, updatedAt: new Date().toISOString() }
          : note
      )
    );

    setEditingNote(null);
    toast({
      title: "Note Updated",
      description: "Your note has been updated successfully"
    });
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== noteId));
    toast({
      title: "Note Deleted",
      description: "Your note has been deleted successfully"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-primary/5">
      {/* Header */}
      <header className="bg-card/95 backdrop-blur-sm border-b border-border/50 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <StickyNote className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-semibold">NotesApp</h1>
            </div>

            <div className="flex items-center space-x-4">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{user.full_name}</span>
              <Button onClick={onSignOut} variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <Card className="auth-card mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5 text-primary" />
              <span>Welcome, {user.full_name.split(" ")[0]}!</span>
            </CardTitle>
            <CardDescription>Manage your notes and stay organized</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Email:</span>
                <span className="ml-2 font-medium">{user.email}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Phone:</span>
                <span className="ml-2 font-medium">{user.phone || "N/A"}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        {/* ...existing notes UI logic here (as in your original code)... */}
        {/* You can paste your note creation/editing logic here unchanged */}
      </div>
    </div>
  );
}
