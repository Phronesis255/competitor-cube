import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

const Dashboard = () => {
  const navigate = useNavigate();
  
  const { data: businesses, isLoading } = useQuery({
    queryKey: ["businesses"],
    queryFn: async () => {
      console.log("Fetching businesses...");
      const { data: businessData, error } = await supabase
        .from("business_submissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching businesses:", error);
        throw error;
      }

      console.log("Businesses fetched:", businessData);
      return businessData;
    },
  });

  // Redirect to form if user has no projects
  useEffect(() => {
    if (!isLoading && businesses && businesses.length === 0) {
      navigate("/new");
    }
  }, [isLoading, businesses, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Don't render anything while redirecting
  if (businesses?.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-primary">Your Projects</h1>
        <Button onClick={() => navigate("/new")} className="gap-2">
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {businesses?.map((business) => (
          <Card
            key={business.id}
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate(`/results`, { state: { formData: business } })}
          >
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span className="truncate">{business.business_name}</span>
                <ArrowRight className="h-5 w-5 text-gray-400" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  <span className="font-medium">Website:</span>{" "}
                  {business.website}
                </p>
                <p>
                  <span className="font-medium">Industry:</span>{" "}
                  {business.industry}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;