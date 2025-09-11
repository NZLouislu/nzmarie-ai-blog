export default function InitializeChineseData() {
  const handleInitialize = async () => {
    try {
      const response = await fetch("/api/admin/init-chinese-posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ language: "zh" }),
      });

      const result = await response.json();

      if (response.ok) {
        alert(
          `Successfully initialized Chinese blog data!\n\nProcessed: ${
            result.results.length
          } posts\nCreated: ${
            result.results.filter(
              (r: { status: string }) => r.status === "created"
            ).length
          }\nAlready existed: ${
            result.results.filter(
              (r: { status: string }) => r.status === "exists"
            ).length
          }`
        );
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      alert(`Failed to initialize: ${error}`);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h3 className="text-lg font-medium mb-4">Initialize Chinese Blog Data</h3>
      <p className="text-sm text-gray-600 mb-4">
        This will create statistics data for all Chinese blog posts in the
        database. It&apos;s safe to run multiple times - existing data
        won&apos;t be overwritten.
      </p>
      <button
        onClick={handleInitialize}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Initialize Chinese Data
      </button>
    </div>
  );
}
