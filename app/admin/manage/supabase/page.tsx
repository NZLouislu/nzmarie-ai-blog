"use client";

import { useEffect } from "react";
import AuthCheck from "../auth-check";
import AdminNavbar from "../../../../components/AdminNavbar";
import { useSupabaseStore } from "../../../../lib/stores/supabaseStore";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Comment {
  id: string;
  post_id: string;
  name: string | null;
  email: string | null;
  comment: string;
  is_anonymous: boolean;
  created_at: string;
  language: string;
}

interface TableData {
  table: string;
  count?: number;
  data?: Record<string, unknown>[];
  structure?: Record<string, unknown>[];
}

export default function SupabaseDashboard() {
  const {
    tableData,
    selectedTable,
    isLoading,
    setSelectedTable,
    fetchTableData,
    fetchAllTableCounts,
  } = useSupabaseStore();

  const tables = ["comments", "post_stats", "daily_stats", "feature_toggles"];

  useEffect(() => {
    fetchAllTableCounts();
  }, [fetchAllTableCounts]);

  const handleTableSelect = (table: string) => {
    setSelectedTable(table);
    if (!tableData[table]?.data) {
      fetchTableData(table);
    }
  };

  return (
    <AuthCheck>
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar />
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                  Supabase Database Dashboard
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  View and analyze database tables
                </p>
              </div>
              <div className="px-6 py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {tables.map((table) => (
                    <Card
                      key={table}
                      className={`cursor-pointer transition-colors ${
                        selectedTable === table
                          ? "ring-2 ring-blue-500"
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => handleTableSelect(table)}
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg capitalize">
                          {table.replace("_", " ")}
                        </CardTitle>
                        <CardDescription>
                          Records: {tableData[table]?.count ?? "Loading..."}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </div>

                {selectedTable && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Table: {selectedTable}</CardTitle>
                      <CardDescription>
                        {tableData[selectedTable]?.count} records total
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {isLoading ? (
                        <div className="text-center py-4">Loading data...</div>
                      ) : tableData[selectedTable]?.data ? (
                        <div className="overflow-auto max-h-96">
                          <table className="w-full border-collapse border border-gray-300">
                            <thead>
                              <tr className="bg-gray-100">
                                {Object.keys(
                                  tableData[selectedTable].data[0] || {}
                                ).map((key) => (
                                  <th
                                    key={key}
                                    className="border border-gray-300 px-4 py-2 text-left"
                                  >
                                    {key}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {tableData[selectedTable].data.map(
                                (row, index) => (
                                  <tr key={index} className="hover:bg-gray-50">
                                    {Object.values(row).map(
                                      (value, cellIndex) => (
                                        <td
                                          key={cellIndex}
                                          className="border border-gray-300 px-4 py-2"
                                        >
                                          {typeof value === "object" &&
                                          value !== null
                                            ? JSON.stringify(value)
                                            : String(value || "")}
                                        </td>
                                      )
                                    )}
                                  </tr>
                                )
                              )}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          No data available
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {selectedTable === "comments" && tableData.comments?.data && (
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle>Comments Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold mb-2">
                            Comments by Post
                          </h4>
                          {Object.entries(
                            (
                              tableData.comments.data as unknown as Comment[]
                            ).reduce((acc, comment) => {
                              const postId = String(comment.post_id);
                              acc[postId] = (acc[postId] || 0) + 1;
                              return acc;
                            }, {} as Record<string, number>)
                          ).map(([postId, count]) => (
                            <div key={postId} className="text-sm mb-1">
                              <span className="font-mono text-xs">
                                {postId}
                              </span>
                              : {count} comments
                            </div>
                          ))}
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">
                            Recent Comments
                          </h4>
                          {(tableData.comments.data as unknown as Comment[])
                            .sort(
                              (a, b) =>
                                new Date(b.created_at).getTime() -
                                new Date(a.created_at).getTime()
                            )
                            .slice(0, 5)
                            .map((comment, index) => (
                              <div
                                key={index}
                                className="text-sm mb-2 p-2 bg-gray-50 rounded"
                              >
                                <div className="font-medium">
                                  {String(comment.name || "Anonymous")}
                                </div>
                                <div className="text-gray-600 truncate">
                                  {String(comment.comment)}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {new Date(
                                    comment.created_at
                                  ).toLocaleDateString()}
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthCheck>
  );
}
