export default function InitializeBlogData() {
  const handleInitializeChinese = async () => {
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

  const handleInitializeEnglish = async () => {
    try {
      const response = await fetch("/api/admin/init-english-posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ language: "en" }),
      });

      const result = await response.json();

      if (response.ok) {
        alert(
          `Successfully initialized English blog data!\n\nProcessed: ${
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
      <h3 className="text-lg font-medium mb-4">Initialize Blog Data</h3>
      <p className="text-sm text-gray-600 mb-4">
        This will create statistics data for all blog posts in the database.
        It&apos;s safe to run multiple times - existing data won&apos;t be
        overwritten.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleInitializeChinese}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Initialize Chinese Data
        </button>
        <button
          onClick={handleInitializeEnglish}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
        >
          Initialize English Data
        </button>
      </div>
    </div>
  );
}
