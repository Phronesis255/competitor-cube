import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface BusinessSubmission {
  id: string;
  business_name: string;
  website: string;
  industry: string;
  target_audience: string;
}

interface CompetitorData {
  website: string;
  authorityScore: number;
  relevantKeywords: number;
  monthlyTraffic: string;
  topKeywords: string[];
}

const ResultsTable = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { formData } = location.state as { formData: BusinessSubmission };

  // Fetch competitor entries for this submission
  const { data: competitors } = useQuery({
    queryKey: ["competitors", formData.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("competitor_entries")
        .select("website")
        .eq("submission_id", formData.id);

      if (error) throw error;
      return data || [];
    },
  });

  // Mock data generation based on fetched competitors
  const competitorData: CompetitorData[] = (competitors || []).map(({ website }) => ({
    website,
    authorityScore: Math.floor(Math.random() * 100),
    relevantKeywords: Math.floor(Math.random() * 10000),
    monthlyTraffic: `${Math.floor(Math.random() * 1000)}K`,
    topKeywords: [
      "marketing",
      "business",
      "strategy",
      "growth",
      "analytics",
    ].sort(() => Math.random() - 0.5).slice(0, 3),
  }));

  // Transform data for the stacked bar chart
  const chartData = competitorData.map((competitor) => ({
    name: new URL(competitor.website).hostname,
    "Authority Score": competitor.authorityScore,
    "Relevant Keywords": competitor.relevantKeywords / 100, // Scaled for visualization
  }));

  return (
    <div className="container mx-auto py-8 animate-fade-in">
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>
        <h1 className="text-3xl font-bold text-primary">Competitor Analysis</h1>
        <p className="text-gray-600 mt-2">
          Analysis results for {formData.business_name}
        </p>
      </div>

      {competitorData.length > 0 ? (
        <>
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Performance Overview</h2>
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <ChartContainer className="h-[300px]" config={{}}>
                <BarChart data={chartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Authority Score" stackId="a" fill="#4f46e5" />
                  <Bar dataKey="Relevant Keywords" stackId="a" fill="#818cf8" />
                </BarChart>
              </ChartContainer>
            </div>
          </div>

          <div className="rounded-lg border shadow-sm mb-8">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Website</TableHead>
                  <TableHead className="text-right">Authority Score</TableHead>
                  <TableHead className="text-right">Relevant Keywords</TableHead>
                  <TableHead className="text-right">Monthly Traffic</TableHead>
                  <TableHead>Top Keywords</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {competitorData.map((competitor, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {competitor.website}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end">
                        <div className="w-12 h-12 rounded-full border-4 border-secondary flex items-center justify-center">
                          {competitor.authorityScore}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {competitor.relevantKeywords.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {competitor.monthlyTraffic}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {competitor.topKeywords.map((keyword, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-accent/10 text-accent rounded-full text-sm"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600">No competitor data available.</p>
        </div>
      )}

      <div className="flex justify-end">
        <Button onClick={() => navigate("/topics")} className="gap-2">
          Explore Topics <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ResultsTable;