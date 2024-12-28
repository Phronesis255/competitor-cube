import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface BusinessData {
  businessName: string;
  website: string;
  industry: string;
  targetAudience: string;
  competitors: string[];
}

const BusinessForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<BusinessData>({
    businessName: "",
    website: "",
    industry: "",
    targetAudience: "",
    competitors: ["", "", ""],
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCompetitorChange = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      competitors: prev.competitors.map((comp, i) => (i === index ? value : comp)),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting form data:", formData);
    
    try {
      // First, insert the business submission
      const { data: businessSubmission, error: businessError } = await supabase
        .from('business_submissions')
        .insert({
          business_name: formData.businessName,
          website: formData.website,
          industry: formData.industry,
          target_audience: formData.targetAudience
        })
        .select()
        .single();

      if (businessError) throw businessError;

      // Then, insert competitor entries
      const competitorPromises = formData.competitors
        .filter(website => website.length > 0)
        .map(website => 
          supabase
            .from('competitor_entries')
            .insert({
              submission_id: businessSubmission.id,
              website
            })
        );

      await Promise.all(competitorPromises);

      toast({
        title: "Analysis Complete",
        description: "Your data has been saved successfully!",
      });
      
      navigate("/results", { state: { formData } });
    } catch (error) {
      console.error('Error saving data:', error);
      toast({
        title: "Error",
        description: "Failed to save your data. Please try again.",
        variant: "destructive"
      });
    }
  };

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  return (
    <div className="max-w-2xl mx-auto p-6 animate-fade-in">
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`w-1/3 h-2 rounded-full mx-1 ${
                step <= currentStep ? "bg-secondary" : "bg-gray-200"
              }`}
            />
          ))}
        </div>
        <p className="text-center text-sm text-gray-600">
          Step {currentStep} of 3
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {currentStep === 1 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-primary mb-6">
              Business Information
            </h2>
            <div>
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                name="businessName"
                value={formData.businessName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                name="website"
                type="url"
                value={formData.website}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="industry">Industry</Label>
              <Input
                id="industry"
                name="industry"
                value={formData.industry}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-primary mb-6">
              Target Audience
            </h2>
            <div>
              <Label htmlFor="targetAudience">
                Describe your target audience
              </Label>
              <Textarea
                id="targetAudience"
                name="targetAudience"
                value={formData.targetAudience}
                onChange={handleInputChange}
                required
                className="h-32"
              />
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-primary mb-6">
              Competitor Analysis
            </h2>
            {formData.competitors.map((competitor, index) => (
              <div key={index}>
                <Label htmlFor={`competitor-${index}`}>
                  Competitor Website {index + 1}
                </Label>
                <Input
                  id={`competitor-${index}`}
                  type="url"
                  value={competitor}
                  onChange={(e) => handleCompetitorChange(index, e.target.value)}
                  placeholder="https://example.com"
                  required
                />
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-between pt-4">
          {currentStep > 1 && (
            <Button type="button" variant="outline" onClick={prevStep}>
              Previous
            </Button>
          )}
          {currentStep < 3 ? (
            <Button
              type="button"
              className="ml-auto"
              onClick={nextStep}
            >
              Next
            </Button>
          ) : (
            <Button type="submit" className="ml-auto bg-secondary hover:bg-secondary/90">
              Analyze Competitors
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default BusinessForm;