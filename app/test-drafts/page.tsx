import { getAllPosts } from "@/lib/posts";

export default function TestDraftsPage() {
  const englishPosts = getAllPosts("en");
  const chinesePosts = getAllPosts("zh");

  const englishDrafts = englishPosts.filter((post) => post.status === "draft");
  const englishPublished = englishPosts.filter(
    (post) => post.status === "published"
  );

  const chineseDrafts = chinesePosts.filter((post) => post.status === "draft");
  const chinesePublished = chinesePosts.filter(
    (post) => post.status === "published"
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Drafts Test Page
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            English Posts
          </h2>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              Drafts ({englishDrafts.length})
            </h3>
            {englishDrafts.length > 0 ? (
              <ul className="space-y-2">
                {englishDrafts.map((post) => (
                  <li
                    key={post.id}
                    className="bg-yellow-50 border border-yellow-200 rounded p-3"
                  >
                    <span className="font-medium">{post.title}</span>
                    <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Draft
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No English drafts found</p>
            )}
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              Published ({englishPublished.length})
            </h3>
            {englishPublished.length > 0 ? (
              <ul className="space-y-2">
                {englishPublished.map((post) => (
                  <li
                    key={post.id}
                    className="bg-green-50 border border-green-200 rounded p-3"
                  >
                    <span className="font-medium">{post.title}</span>
                    <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Published
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">
                No English published posts found
              </p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Chinese Posts
          </h2>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              Drafts ({chineseDrafts.length})
            </h3>
            {chineseDrafts.length > 0 ? (
              <ul className="space-y-2">
                {chineseDrafts.map((post) => (
                  <li
                    key={post.id}
                    className="bg-yellow-50 border border-yellow-200 rounded p-3"
                  >
                    <span className="font-medium">{post.title}</span>
                    <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Draft
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No Chinese drafts found</p>
            )}
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              Published ({chinesePublished.length})
            </h3>
            {chinesePublished.length > 0 ? (
              <ul className="space-y-2">
                {chinesePublished.map((post) => (
                  <li
                    key={post.id}
                    className="bg-green-50 border border-green-200 rounded p-3"
                  >
                    <span className="font-medium">{post.title}</span>
                    <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Published
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">
                No Chinese published posts found
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
