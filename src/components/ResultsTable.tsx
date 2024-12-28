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
import { ArrowLeft } from "lucide-react";
import { BusinessData } from "./BusinessForm";

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
  const { formData } = location.state as { formData: BusinessData };

  // Mock data generation
  const competitorData: CompetitorData[] = formData.competitors
    .filter((comp) => comp.length > 0)
    .map((website) => ({
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

  return (
    <div className="container mx-auto py-8 animate-fade-in">
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Form
        </Button>
        <h1 className="text-3xl font-bold text-primary">Competitor Analysis</h1>
        <p className="text-gray-600 mt-2">
          Analysis results for {formData.businessName}
        </p>
      </div>

      <div className="rounded-lg border shadow-sm">
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
    </div>
  );
};

export default ResultsTable;