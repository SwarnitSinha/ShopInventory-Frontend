import { useState } from "react";
import { Layout } from "../components/layout/layout";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { useAuth } from "../hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Mail, Phone, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "../hooks/use-toast";

export default function Profile() {

const { toast } = useToast();
  const { user } = useAuth();
  const [phone, setPhone] = useState("");
  
  // Fetch shop profile data if needed - assuming user already has basic info
  const { data: shopData } = useQuery({
    queryKey: ["/api/auth/profile"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/auth/profile");
      return response.json();
    },
  });

  const sendVerificationEmail = async () => {
    try {
      await apiRequest("POST", "/api/auth/verify-email");
      toast({title:"Verification email sent. Please check your inbox."});
    } catch (error) {
      toast({title:"Failed to send verification email"});
    }
  };

  const updatePhone = async () => {
    if (!phone) {
      toast({title:"Please enter a phone number"});
      return;
    }
    
    try {
      await apiRequest("PUT", "/api/auth/update-phone", { phone });
      toast({title:"Phone number updated successfully"});
    } catch (error) {
      toast({title:"Failed to update phone number"});
    }
  };

  // Use shopData if available, otherwise fall back to user data from auth context
  const profileData = shopData || user;

  return (
    <Layout>
      <div className="flex h-screen">
        <main className="flex-1 overflow-auto bg-background">
          <div className="h-14 border-b flex items-center justify-center relative">
            <h1 className="text-lg font-medium absolute left-1/2 -translate-x-1/2 md:relative md:left-auto md:translate-x-0">
              Shop Profile
            </h1>
          </div>
          
          <div className="p-6">
            {/* Shop Details */}
            <Card className="transition-all duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-medium">
                  Shop Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Building className="h-5 w-5 text-primary" />
                    <span className="font-semibold">Shop Name:</span>
                    <span>{profileData?.shopName || "N/A"}</span>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-2 sm:space-y-0">
                  <div className="flex items-center space-x-2">
  <Mail className="h-5 w-5 text-primary" />
  Email: {profileData?.email || "N/A"}
  </div>
  <Button 
    variant="outline" 
    size="sm" 
    onClick={sendVerificationEmail}
  >
    Verify Email
  </Button>
</div>
                  
                  <div className="flex items-center space-x-2">
                    <Phone className="h-5 w-5 text-primary" />
                    <span className="font-semibold">Phone:</span>
                    <span>{profileData?.phone || "Not Added"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Add Phone Number */}
            <Card className="mt-6 transition-all duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-medium">
                  Add/Update Phone Number
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Label htmlFor="phone" className="sr-only">Phone Number</Label>
                    <Input
                      id="phone"
                      placeholder="Enter phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <Button onClick={updatePhone}>
                    Save Phone Number
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </Layout>
  );
}