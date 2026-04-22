import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useFitness } from "@/contexts/FitnessContext";
import { apiRequest } from "@/lib/api";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Plus, Heart, MessageCircle, Trash2, Send, Search, ImagePlus, X, Share2, MoreHorizontal } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const CATEGORIES = ["General", "Workout Tips", "Nutrition", "Motivation", "Progress", "Questions"];

const Community = () => {
  const { user } = useAuth();
  const { posts, addPost, likePost, addComment, deletePost } = useFitness();
  const { toast } = useToast();
  const location = useLocation();
  
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("General");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  
  const [commentTexts, setCommentTexts] = useState({});
  const [expandedComments, setExpandedComments] = useState({});
  
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isPosting, setIsPosting] = useState(false);
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    const postHash = location.hash;
    if (!postHash || !postHash.startsWith("#post-")) {
      return;
    }

    let attempts = 0;
    const maxAttempts = 10;
    const timer = window.setInterval(() => {
      const target = document.getElementById(postHash.slice(1));
      attempts += 1;

      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        target.classList.add("ring-2", "ring-primary/40", "rounded-md");
        window.setTimeout(() => {
          target.classList.remove("ring-2", "ring-primary/40", "rounded-md");
        }, 1800);
        window.clearInterval(timer);
        return;
      }

      if (attempts >= maxAttempts) {
        window.clearInterval(timer);
      }
    }, 250);

    return () => {
      window.clearInterval(timer);
    };
  }, [location.hash, posts]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length + imageFiles.length > 4) {
      toast({
        title: "Limit exceeded",
        description: "You can upload up to 4 images max.",
        variant: "destructive",
      });
      return;
    }
    
    setImageFiles(prev => [...prev, ...files]);
    
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (indexToRemove) => {
    setImageFiles(prev => prev.filter((_, idx) => idx !== indexToRemove));
    setImagePreviews(prev => {
      URL.revokeObjectURL(prev[indexToRemove]);
      return prev.filter((_, idx) => idx !== indexToRemove);
    });
  };

  const handleCreate = async () => {
    if (!title || !content || !user) return;

    try {
      setIsPosting(true);
      let imageUrls = [];

      if (imageFiles.length > 0) {
        let uploadRes;

        try {
          const singleFormData = new FormData();
          imageFiles.forEach(file => singleFormData.append("image", file));

          uploadRes = await apiRequest("/community/upload-image", {
            method: "POST",
            body: singleFormData,
          });
        } catch (_singleEndpointError) {
          const multiFormData = new FormData();
          imageFiles.forEach(file => multiFormData.append("images", file));

          uploadRes = await apiRequest("/community/upload-images", {
            method: "POST",
            body: multiFormData,
          });
        }

        imageUrls = uploadRes.data?.urls || [];
      }

      await addPost({ userId: user.id, title, content, category, imageUrls });
      
      // Reset form
      setTitle("");
      setContent("");
      setImageFiles([]);
      setImagePreviews([]);
      setOpen(false);
      
      toast({
        title: "Success",
        description: "Your post has been published!",
      });
    } catch (error) {
      toast({
        title: "Post failed",
        description: error?.message || "Could not create post. Try again.",
        variant: "destructive",
      });
    } finally {
      setIsPosting(false);
    }
  };

  const handleComment = (postId) => {
    if (!commentTexts[postId]?.trim() || !user) return;
    addComment(postId, { content: commentTexts[postId] });
    setCommentTexts(prev => ({ ...prev, [postId]: "" }));
  };

  const handleShare = (post) => {
    const postUrl = `${window.location.origin}/community#post-${post.id}`;
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: `Check out this post: ${post.title} on FitVerse`,
        url: postUrl
      }).catch((err) => console.error("Error sharing:", err));
    } else {
      navigator.clipboard.writeText(postUrl);
      toast({
        title: "Link copied!",
        description: "Post link copied to clipboard.",
      });
    }
  };

  const filtered = posts
    .filter(p => filterCategory === "all" || p.category === filterCategory)
    .filter(p => !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.content.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-8">
      {/* Header Section */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between bg-card/50 p-6 rounded-2xl border border-border/40 backdrop-blur-sm shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-50 pointer-events-none" />
        
        <div className="relative z-10">
         
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
            Fitverse <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">Community</span>
          </h1>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="rounded-full shadow-lg shadow-primary/25 group relative z-10">
              <Plus className="mr-2 h-5 w-5 transition-transform group-hover:rotate-90" /> 
              Create Post
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px] rounded-2xl p-0 overflow-hidden border-border/50">
            <div className="px-6 py-4 bg-muted/40 border-b border-border/50 flex justify-between items-center">
              <DialogTitle className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Create a new post</DialogTitle>
            </div>
            
            <div className="p-6 space-y-5">
              <div className="flex gap-4 items-start">
                <Avatar className="h-10 w-10 border border-border">
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-4">
                  <Input 
                    placeholder="An interesting title" 
                    value={title} 
                    onChange={e => setTitle(e.target.value)} 
                    className="border-none bg-accent/30 text-lg font-medium focus-visible:ring-1"
                  />
                  
                  <Textarea 
                    placeholder="What are your fitness thoughts today? Share your journey..." 
                    value={content} 
                    onChange={e => setContent(e.target.value)} 
                    className="min-h-[120px] resize-none border-none bg-accent/30 focus-visible:ring-1" 
                  />
                </div>
              </div>
              
              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2">
                  {imagePreviews.map((preview, idx) => (
                    <div key={idx} className="relative group overflow-hidden rounded-lg aspect-square border border-border/50">
                      <img src={preview} alt="preview" className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button size="icon" variant="destructive" onClick={() => removeImage(idx)} className="h-8 w-8 rounded-full scale-75 group-hover:scale-100 transition-transform">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex items-center justify-between pt-4 border-t border-border/50">
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full hover:bg-primary/10 hover:text-primary transition-colors text-muted-foreground"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={imageFiles.length >= 4}
                  >
                    <ImagePlus className="h-5 w-5" />
                  </Button>
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="w-[140px] border-none bg-muted/40 h-9 rounded-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(c => <SelectItem key={c} value={c} className="rounded-md">{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                
                <Button onClick={handleCreate} disabled={!title || !content || isPosting} className="rounded-full px-6">
                  {isPosting ? "Posting..." : "Publish"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Controls Section */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Search discussions, topics, or authors..." 
            className="pl-11 rounded-xl bg-card border-border/50 focus-visible:ring-primary/30 py-6 placeholder:text-muted-foreground/70 shadow-sm" 
            value={searchQuery} 
            onChange={e => setSearchQuery(e.target.value)} 
          />
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-full sm:w-[200px] rounded-xl bg-card border-border/50 py-6 shadow-sm">
            <SelectValue placeholder="Category filter" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all">All Categories</SelectItem>
            {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Feed Section */}
      {filtered.length === 0 ? (
        <Card className="border-dashed border-2 border-border/60 bg-muted/20 rounded-2xl">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6 shadow-inner">
              <MessageCircle className="h-10 w-10 text-muted-foreground opacity-50" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No posts found</h3>
            <p className="text-muted-foreground max-w-sm">Be the first to start a conversation or try a different search term.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-8 max-w-[540px] mx-auto w-full pb-10">
          {filtered.map((post, i) => (
            <div key={post.id} id={`post-${post.id}`} className="flex flex-col border-b border-border/40 pb-6 mb-2">
              {/* Post Header */}
              <div className="flex items-center justify-between px-2 py-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8 border border-border/50 ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
                    <AvatarFallback className="bg-gradient-to-br from-primary/80 to-primary text-primary-foreground text-xs font-medium">
                      {post.userName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground tracking-tight leading-none">
                        {post.userName}
                      </span>
                      <span className="text-xs text-muted-foreground">• {formatDistanceToNow(new Date(post.date))}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {user?.id === post.userId && (
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => deletePost(post.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Edge-to-edge Media */}
              {post.imageUrls && post.imageUrls.length > 0 && (
                <div className="w-full bg-black/5 relative group/media flex justify-center border border-border/30 sm:rounded-md overflow-hidden">
                  {post.imageUrls.length === 1 ? (
                    <img src={post.imageUrls[0]} alt={post.title} className="w-full max-h-[585px] object-contain transition-transform duration-700" loading="lazy" />
                  ) : (
                    <Carousel className="w-full">
                      <CarouselContent>
                        {post.imageUrls.map((url, idx) => (
                          <CarouselItem key={idx}>
                            <div className="w-full max-h-[585px] flex items-center justify-center bg-transparent">
                              <img src={url} alt={`${post.title} - ${idx + 1}`} className="w-full max-h-[585px] object-contain" loading="lazy" />
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 opacity-0 group-hover/media:opacity-100 transition-opacity">
                        {post.imageUrls.map((_, dotIdx) => (
                          <div key={dotIdx} className="w-1.5 h-1.5 rounded-full bg-white/80 shadow-sm" />
                        ))}
                      </div>
                      <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full border-none bg-white/50 hover:bg-white/90 opacity-0 group-hover/media:opacity-100 transition-opacity text-black" />
                      <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full border-none bg-white/50 hover:bg-white/90 opacity-0 group-hover/media:opacity-100 transition-opacity text-black" />
                    </Carousel>
                  )}
                </div>
              )}

              {/* Action Bar */}
              <div className="flex items-center justify-between px-2 py-2 mt-1">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => user && likePost(post.id, user.id)} 
                    className={`transition-all ${post.likes.includes(user?.id || "") ? "text-rose-500 hover:text-rose-600" : "text-foreground hover:text-muted-foreground"}`}
                  >
                    <Heart className={`h-6 w-6 transition-transform ${post.likes.includes(user?.id || "") ? "fill-current" : ""}`} />
                  </button>
                  
                  <button 
                    onClick={() => setExpandedComments(prev => ({ ...prev, [post.id]: !prev[post.id] }))}
                    className="text-foreground hover:text-muted-foreground transition-colors"
                  >
                    <MessageCircle className="h-6 w-6" />
                  </button>

                  <button className="text-foreground hover:text-muted-foreground transition-colors" onClick={() => handleShare(post)}>
                    <Share2 className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Likes count */}
              <div className="px-2 pt-1 mb-1">
                <p className="text-sm font-semibold">{post.likes.length} likes</p>
              </div>

              {/* Caption */}
              <div className="px-2 space-y-1">
                <div>
                  <span className="text-sm font-semibold mr-2">{post.userName}</span>
                  <span className="text-sm font-medium">{post.title}</span>
                </div>
                {post.content && (
                  <p className="text-sm text-foreground/90 whitespace-pre-wrap">{post.content}</p>
                )}
                {post.category && (
                  <Badge variant="secondary" className="bg-secondary/20 text-secondary-foreground hover:bg-secondary/40 px-1.5 py-0 mt-1 rounded text-[10px] uppercase font-medium">#{post.category}</Badge>
                )}
              </div>

              {/* Comments Section */}
              <div className="px-2 mt-2">
                {post.comments.length > 0 && !expandedComments[post.id] && (
                  <button
                    onClick={() => setExpandedComments(prev => ({ ...prev, [post.id]: true }))}
                    className="mb-2 inline-flex items-center gap-2 rounded-full bg-muted/40 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    View all {post.comments.length} comments
                  </button>
                )}

                {expandedComments[post.id] && (
                  <div className="mb-3 mt-2 rounded-2xl border border-border/40 bg-card/60 p-3 shadow-sm backdrop-blur-sm">
                    <div className="mb-3 flex items-center justify-between border-b border-border/40 pb-2">
                      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                        Conversation
                      </p>
                      <button
                        onClick={() => setExpandedComments(prev => ({ ...prev, [post.id]: false }))}
                        className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                      >
                        Hide
                      </button>
                    </div>

                    <div className="max-h-[260px] space-y-2.5 overflow-y-auto pr-1 custom-scrollbar">
                      {post.comments.length === 0 ? (
                        <p className="rounded-xl border border-dashed border-border/50 bg-muted/20 px-3 py-5 text-center text-xs text-muted-foreground">
                          No comments yet. Start the conversation!
                        </p>
                      ) : (
                        post.comments.map(c => (
                          <div key={c.id} className="group/comment flex items-start gap-2.5">
                            <Avatar className="mt-0.5 h-7 w-7 border border-border/40">
                              <AvatarFallback className="bg-primary/10 text-[10px] font-semibold text-primary">
                                {c.userName?.charAt(0)?.toUpperCase() || "U"}
                              </AvatarFallback>
                            </Avatar>

                            <div className="flex-1 rounded-2xl rounded-tl-md bg-muted/45 px-3 py-2.5 transition-colors group-hover/comment:bg-muted/60">
                              <p className="text-xs font-semibold text-foreground/85">{c.userName}</p>
                              <p className="mt-0.5 text-sm leading-snug text-foreground/95">{c.content}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
                
                {/* Add Comment Input */}
                <div className="mt-2 flex items-center gap-2 rounded-full border border-border/50 bg-card px-2.5 py-1.5 shadow-sm">
                  <Avatar className="h-7 w-7 border border-border/50">
                    <AvatarFallback className="bg-primary/10 text-[10px] font-semibold text-primary">
                      {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>

                  <Input
                    placeholder="Share your thoughts..."
                    className="h-9 border-none bg-transparent px-0 text-sm shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/80"
                    value={commentTexts[post.id] || ""}
                    onChange={e => setCommentTexts(prev => ({ ...prev, [post.id]: e.target.value }))}
                    onKeyDown={e => e.key === "Enter" && handleComment(post.id)}
                  />

                  <Button
                    type="button"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    disabled={!commentTexts[post.id]?.trim()}
                    onClick={() => handleComment(post.id)}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default Community;
