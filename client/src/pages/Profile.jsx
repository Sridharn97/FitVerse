import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
const Profile = () => {
    const { user, updateProfile } = useAuth();
    const { toast } = useToast();
    const [name, setName] = useState(user?.name || "");
    const [age, setAge] = useState(user?.age?.toString() || "");
    const [height, setHeight] = useState(user?.height?.toString() || "");
    const [weight, setWeight] = useState(user?.weight?.toString() || "");
    const handleSave = () => {
        updateProfile({
            name,
            age: age ? +age : undefined,
            height: height ? +height : undefined,
            weight: weight ? +weight : undefined,
        });
        toast({ title: "Profile updated", description: "Your profile has been saved" });
    };
    return (<div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-foreground md:text-3xl">Profile</h1>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                {user?.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{user?.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input value={name} onChange={e => setName(e.target.value)}/>
          </div>
          <div className="grid grid-cols-3 gap-4">
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
          <Button onClick={handleSave} className="w-full">Save Profile</Button>
        </CardContent>
      </Card>
    </div>);
};
export default Profile;
