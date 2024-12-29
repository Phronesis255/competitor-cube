import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Grid, Search, ArrowUpDown, Target, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type SortOption = "alpha" | "volume" | "competition";

interface Topic {
  id: string;
  title: string;
  search_volume: number;
  competition_level: number;
  keywords: { keyword: string }[];
}

const Topics = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("alpha");

  const { data: topics, isLoading } = useQuery({
    queryKey: ["topics"],
    queryFn: async () => {
      console.log("Fetching topics...");
      const { data: topicsData, error: topicsError } = await supabase
        .from("topics")
        .select(`
          id,
          title,
          search_volume,
          competition_level,
          topic_keywords (
            keyword
          )
        `);

      if (topicsError) {
        console.error("Error fetching topics:", topicsError);
        throw topicsError;
      }

      // Map the data to match our Topic interface
      const mappedTopics: Topic[] = topicsData?.map(topic => ({
        id: topic.id,
        title: topic.title,
        search_volume: topic.search_volume,
        competition_level: topic.competition_level,
        keywords: topic.topic_keywords
      })) || [];

      console.log("Topics fetched:", mappedTopics);
      return mappedTopics;
    },
  });

  const sortedTopics = topics?.slice().sort((a, b) => {
    switch (sortBy) {
      case "alpha":
        return a.title.localeCompare(b.title);
      case "volume":
        return b.search_volume - a.search_volume;
      case "competition":
        return a.competition_level - b.competition_level;
      default:
        return 0;
    }
  });

  const filteredTopics = sortedTopics?.filter((topic) =>
    topic.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Content Topics</h1>
        
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search topics..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={sortBy === "alpha" ? "secondary" : "outline"}
              size="sm"
              onClick={() => setSortBy("alpha")}
              className="whitespace-nowrap"
            >
              <ArrowUpDown className="h-4 w-4 mr-1" />
              A-Z
            </Button>
            <Button
              variant={sortBy === "volume" ? "secondary" : "outline"}
              size="sm"
              onClick={() => setSortBy("volume")}
              className="whitespace-nowrap"
            >
              <TrendingUp className="h-4 w-4 mr-1" />
              Volume
            </Button>
            <Button
              variant={sortBy === "competition" ? "secondary" : "outline"}
              size="sm"
              onClick={() => setSortBy("competition")}
              className="whitespace-nowrap"
            >
              <Target className="h-4 w-4 mr-1" />
              Competition
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-8">Loading topics...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTopics?.map((topic) => (
              <Card key={topic.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl">{topic.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 mb-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {topic.search_volume}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <Target className="h-3 w-3 mr-1" />
                      {topic.competition_level}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {topic.keywords?.map((kw, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                      >
                        {kw.keyword}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Topics;