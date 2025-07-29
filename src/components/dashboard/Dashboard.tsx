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
  created_at: string;
  updated_at: string;
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
  const fetchUserAndNotes = async () => {
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

    // Fetch notes
    const { data: notesData, error: notesError } = await supabase
      .from("notes")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (notesError) {
      toast({
        title: "Notes Error",
        description: "Could not load your notes.",
        variant: "destructive"
      });
    } else {
      setNotes(notesData || []);
    }
  };

  fetchUserAndNotes();
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

      const handleCreateNote = async () => {
      if (!newNote.title.trim() || !newNote.content.trim()) {
        toast({
          title: "Validation Error",
          description: "Please fill in both title and content",
          variant: "destructive"
        });
        return;
      }

      const { data, error } = await supabase.from("notes").insert({
        user_id: user.id,
        title: newNote.title,
        content: newNote.content
      }).select().single();

      if (error) {
        toast({
          title: "Creation Failed",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      setNotes((prev) => [data, ...prev]);
      setNewNote({ title: "", content: "" });
      setIsCreating(false);

      toast({
        title: "Note Created",
        description: "Your note has been created successfully"
      });
    };


        const handleUpdateNote = async () => {
        if (!editingNote) return;

        const { data, error } = await supabase
          .from("notes")
          .update({
            title: editingNote.title,
            content: editingNote.content
          })
          .eq("id", editingNote.id)
          .select()
          .single();

        if (error) {
          toast({
            title: "Update Failed",
            description: error.message,
            variant: "destructive"
          });
          return;
        }

        setNotes((prev) =>
          prev.map((note) => (note.id === data.id ? data : note))
        );

        setEditingNote(null);
        toast({
          title: "Note Updated",
          description: "Your note has been updated successfully"
        });
      };


    const handleDeleteNote = async (noteId: string) => {
      const { error } = await supabase.from("notes").delete().eq("id", noteId);

      if (error) {
        toast({
          title: "Delete Failed",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

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
        <Card className="auth-card mb-8 bg-card border border-border/30 shadow-md hover:shadow-lg rounded-xl transition-shadow">
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
        {/* Notes Control Section */}
          <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ">
            <Input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:max-w-sm"
            />
            <Button onClick={() => setIsCreating(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Note
            </Button>
          </div>

          {/* Create Note */}
          {isCreating && (
            <Card className="mb-6 p-4">
              <Input
                placeholder="Note Title"
                value={newNote.title}
                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                className="mb-2"
              />
              <Textarea
                placeholder="Note Content"
                value={newNote.content}
                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                className="mb-4"
              />
              <div className="flex gap-2">
                <Button onClick={handleCreateNote}>Create</Button>
                <Button variant="secondary" onClick={() => setIsCreating(false)}>
                  Cancel
                </Button>
              </div>
            </Card>
          )}

          {/* Notes List */}
          <div className="grid gap-4">
            {filteredNotes.map((note) => (
              <Card key={note.id} className="p-4 bg-card border border-border/30 shadow-md hover:shadow-lg rounded-xl transition-shadow">
                {editingNote?.id === note.id ? (
                  <>
                    <Input
                      value={editingNote.title}
                      onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
                      className="mb-2"
                    />
                    <Textarea
                      value={editingNote.content}
                      onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
                      className="mb-4"
                    />
                    <div className="flex gap-2">
                      <Button onClick={handleUpdateNote}>Save</Button>
                      <Button variant="secondary" onClick={() => setEditingNote(null)}>Cancel</Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <StickyNote className="w-4 h-4 text-primary" />
                        <h3 className="text-lg font-semibold">{note.title}</h3>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <Badge variant="outline">{formatDate(note.created_at)}</Badge>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 text-muted-foreground mb-3">
                      <Edit3 className="w-4 h-4 mt-1 text-muted-foreground" />
                      <p className="text-sm leading-relaxed">{note.content}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => setEditingNote(note)}>
                        <Edit3 className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteNote(note.id)}>
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </>
                )}
              </Card>

            ))}
          </div>

        
      </div>
    </div>
  );
}
