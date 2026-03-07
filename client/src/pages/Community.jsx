import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useFitness } from "@/contexts/FitnessContext";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, Heart, MessageCircle, Trash2, Send, Search } from "lucide-react";
import { endOfMonth, formatDistanceToNow, isWithinInterval, startOfMonth, subMonths } from "date-fns";
const CATEGORIES = ["General", "Workout Tips", "Nutrition", "Motivation", "Progress", "Questions"];

const Community = () => {
  const { user } = useAuth();
  const { posts, addPost, likePost, addComment, deletePost } = useFitness();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("General");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [dateFilter, setDateFilter] = useState("this-month");
  const [commentTexts, setCommentTexts] = useState({});
  const [expandedComments, setExpandedComments] = useState({});
  const handleCreate = () => {
    if (!title || !content || !user)
      return;
    addPost({ userId: user.id, title, content, category });
    setTitle("");
    setContent("");
    setOpen(false);
  };
  const handleComment = (postId) => {
    if (!commentTexts[postId]?.trim() || !user)
      return;
    addComment(postId, { content: commentTexts[postId] });
    setCommentTexts(prev => ({ ...prev, [postId]: "" }));
  };
  const now = new Date();
  const filterMonth = dateFilter === "this-month" ? now : subMonths(now, 1);
  const rangeStart = startOfMonth(filterMonth);
  const rangeEnd = endOfMonth(filterMonth);
  const filtered = posts
    .filter(p => isWithinInterval(new Date(p.date), { start: rangeStart, end: rangeEnd }))
    .filter(p => filterCategory === "all" || p.category === filterCategory)
    .filter(p => !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.content.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return (<div className="space-y-6">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">Community</h1>
        <p className="text-muted-foreground mt-1">Connect with fellow fitness enthusiasts</p>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button><Plus className="mr-2 h-4 w-4" /> New Post</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader><DialogTitle>Create Post</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input placeholder="What's on your mind?" value={title} onChange={e => setTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea placeholder="Share your thoughts..." value={content} onChange={e => setContent(e.target.value)} rows={4} />
            </div>
            <Button onClick={handleCreate} className="w-full" disabled={!title || !content}>Post</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>

    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search posts..." className="pl-9" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
      </div>
      <Select value={filterCategory} onValueChange={setFilterCategory}>
        <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="Category" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
        </SelectContent>
      </Select>
      <Select value={dateFilter} onValueChange={setDateFilter}>
        <SelectTrigger className="w-full sm:w-[150px]"><SelectValue placeholder="Date filter" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="this-month">This month</SelectItem>
          <SelectItem value="last-month">Last month</SelectItem>
        </SelectContent>
      </Select>
    </div>

    {filtered.length === 0 ? (<Card>
      <CardContent className="flex flex-col items-center py-12">
        <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No posts yet. Start the conversation!</p>
      </CardContent>
    </Card>) : (<div className="space-y-4">
      {filtered.map(post => (<Card key={post.id}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {post.userName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {post.userName}
                </p>
                <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(post.date), { addSuffix: true })}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{post.category}</Badge>
              {user?.id === post.userId && (<Button variant="ghost" size="icon" onClick={() => deletePost(post.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>)}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <h3 className="text-lg font-semibold text-foreground">{post.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{post.content}</p>
          <div className="flex items-center gap-4 pt-2">
            <Button variant="ghost" size="sm" onClick={() => user && likePost(post.id, user.id)} className={post.likes.includes(user?.id || "") ? "text-destructive" : ""}>
              <Heart className={`mr-1 h-4 w-4 ${post.likes.includes(user?.id || "") ? "fill-current" : ""}`} />
              {post.likes.length}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setExpandedComments(prev => ({ ...prev, [post.id]: !prev[post.id] }))}>
              <MessageCircle className="mr-1 h-4 w-4" />
              {post.comments.length}
            </Button>
          </div>

          {expandedComments[post.id] && (<div className="space-y-3 border-t border-border pt-3">
            {post.comments.map(c => (<div key={c.id} className="flex gap-3">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="text-xs bg-secondary text-secondary-foreground">{c.userName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">
                    {c.userName}
                  </span>
                  <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(c.date), { addSuffix: true })}</span>
                </div>
                <p className="text-sm text-muted-foreground">{c.content}</p>
              </div>
            </div>))}
            <div className="flex gap-2">
              <Input placeholder="Write a comment..." value={commentTexts[post.id] || ""} onChange={e => setCommentTexts(prev => ({ ...prev, [post.id]: e.target.value }))} onKeyDown={e => e.key === "Enter" && handleComment(post.id)} />
              <Button size="icon" onClick={() => handleComment(post.id)}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>)}
        </CardContent>
      </Card>))}
    </div>)}
  </div>);
};
export default Community;
