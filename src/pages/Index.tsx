import BusinessForm from "@/components/BusinessForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-12">
        <h1 className="text-4xl font-bold text-center text-primary mb-2">
          Content Planning Assistant
        </h1>
        <p className="text-center text-gray-600 mb-12">
          Analyze your competitors and plan your content strategy
        </p>
        <BusinessForm />
      </div>
    </div>
  );
};

export default Index;