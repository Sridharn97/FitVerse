import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useFitness } from "@/contexts/FitnessContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, UserRound } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const Profile = () => {
    const { user, updateProfile } = useAuth();
    const { posts, updatePost, deletePost } = useFitness();
    const { toast } = useToast();
    const [name, setName] = useState(user?.name || "");
    const [age, setAge] = useState(user?.age?.toString() || "");
    const [height, setHeight] = useState(user?.height?.toString() || "");
    const [weight, setWeight] = useState(user?.weight?.toString() || "");
    const [editingPost, setEditingPost] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [editContent, setEditContent] = useState("");
    const [savingPostId, setSavingPostId] = useState("");

    const myPosts = posts
      .filter((post) => post.userId === user?.id)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const profileMetrics = [
      { label: "Age", value: age || "-" },
      { label: "Height", value: height ? `${height} cm` : "-" },
      { label: "Weight", value: weight ? `${weight} kg` : "-" },
    ];

    const handleSave = async () => {
      try {
        await updateProfile({
          name,
          age: age ? +age : undefined,
          height: height ? +height : undefined,
          weight: weight ? +weight : undefined,
        });
        toast({ title: "Profile updated", description: "Your profile has been saved" });
      }
      catch (_error) {
        toast({ title: "Update failed", description: "Could not save profile", variant: "destructive" });
      }
    };

    const handleStartEdit = (post) => {
      setEditingPost(post);
      setEditTitle(post.title);
      setEditContent(post.content);
    };

    const handleUpdatePost = async () => {
      if (!editingPost || !editTitle.trim() || !editContent.trim())
        return;

      try {
        setSavingPostId(editingPost.id);
        await updatePost(editingPost.id, {
          title: editTitle.trim(),
          content: editContent.trim(),
          category: editingPost.category,
        });
        toast({ title: "Post updated", description: "Your post has been updated successfully" });
        setEditingPost(null);
      }
      catch (_error) {
        toast({ title: "Update failed", description: "Could not update post", variant: "destructive" });
      }
      finally {
        setSavingPostId("");
      }
    };

    const handleDeletePost = async (postId) => {
      if (!window.confirm("Are you sure you want to delete this post?"))
        return;

      try {
        setSavingPostId(postId);
        await deletePost(postId);
        toast({ title: "Post deleted", description: "Your post has been removed" });
      }
      catch (_error) {
        toast({ title: "Delete failed", description: "Could not delete post", variant: "destructive" });
      }
      finally {
        setSavingPostId("");
      }
    };

    return (<div className="mx-auto w-full max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your personal details and your community activity.</p>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                {user?.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <CardTitle className="truncate">{user?.name}</CardTitle>
              <p className="truncate text-sm text-muted-foreground">{user?.email}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="gap-1">
                  <UserRound className="h-3.5 w-3.5"/>
                  Member
                </Badge>
                <Badge variant="outline">{myPosts.length} posts</Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 lg:px-5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {profileMetrics.map((metric) => (<div key={metric.label} className="rounded-lg border border-border bg-muted/30 p-3">
                <p className="text-xs text-muted-foreground">{metric.label}</p>
                <p className="mt-1 text-sm font-semibold text-foreground">{metric.value}</p>
              </div>))}
          </div>

          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input value={name} onChange={e => setName(e.target.value)}/>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>Age</Label>
              <Input type="number" placeholder="25" value={age} onChange={e => setAge(e.target.value)}/>
            </div>
            <div className="space-y-2">
              <Label>Height (cm)</Label>
              <Input type="number" placeholder="175" value={height} onChange={e => setHeight(e.target.value)}/>
            </div>
            <div className="space-y-2">
              <Label>Weight (kg)</Label>
              <Input type="number" placeholder="75" value={weight} onChange={e => setWeight(e.target.value)}/>
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSave} className="w-full sm:w-auto">Save Profile</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-2">
            <CardTitle>My Posts</CardTitle>
            <Badge variant="outline">{myPosts.length}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">Edit or remove your community posts from here.</p>
        </CardHeader>
        <CardContent className="space-y-3 lg:px-5">
          {myPosts.length === 0 ? (<p className="text-sm text-muted-foreground">You have not created any posts yet.</p>) : (myPosts.map((post) => (<div key={post.id} className="rounded-lg border border-border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-foreground">{post.title}</h3>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <Badge variant="secondary" className="font-normal">{post.category}</Badge>
                      <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(post.date), { addSuffix: true })}</p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleStartEdit(post)} disabled={savingPostId === post.id}>
                      <Pencil className="h-4 w-4"/>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeletePost(post.id)} disabled={savingPostId === post.id}>
                      <Trash2 className="h-4 w-4 text-destructive"/>
                    </Button>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{post.content}</p>
              </div>)))}
        </CardContent>
      </Card>

      <Dialog open={Boolean(editingPost)} onOpenChange={(open) => !open && setEditingPost(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Post</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)}/>
            </div>
            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea rows={5} value={editContent} onChange={(e) => setEditContent(e.target.value)}/>
            </div>
            <Button onClick={handleUpdatePost} disabled={!editTitle.trim() || !editContent.trim() || Boolean(savingPostId)} className="w-full">
              Update Post
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>);
};
export default Profile;
