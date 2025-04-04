import { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@/contexts/UserContext";
import { AuthDialog } from "@/components/AuthDialog";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

interface FileContent {
  rows: Array<{
    row_index: number;
    row_content: Record<string, string>;
  }>;
}

interface File {
  file_name: string;
}

const Playground = () => {
  const { t } = useTranslation();
  const { direction } = useLanguage();
  const { user } = useUser();
  const { toast } = useToast();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chains, setChains] = useState<string[]>([]);
  const [selectedChain, setSelectedChain] = useState<string | null>(null);
  const [files, setFiles] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState("");
  const [fileContent, setFileContent] = useState<FileContent | null>(null);
  const [apiToken, setApiToken] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState({
    key: "",
    direction: "ascending",
  });

  const headers = useMemo(
    () => ({
      "Content-Type": "application/json",
    }),
    []
  );

  const sortedAndFilteredData = useMemo(() => {
    if (!fileContent?.rows) return [];

    const filteredData = fileContent.rows;

    if (sortConfig.key) {
      filteredData.sort((a, b) => {
        if (a.row_content[sortConfig.key] < b.row_content[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a.row_content[sortConfig.key] > b.row_content[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return filteredData;
  }, [fileContent, sortConfig]);

  const requestSort = (key: string) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "ascending"
          ? "descending"
          : "ascending",
    }));
  };

  useEffect(() => {
    const setupApiToken = async () => {
      if (!user) return;

      try {
        // Check if playground token exists
        const { data: tokens, error: fetchError } = await supabase
          .from("api_tokens")
          .select("*")
          .eq("name", "Playground")
          .eq("user_id", user.id)
          .eq("is_active", true)
          .single();

        if (fetchError && fetchError.code !== "PGRST116") {
          // PGRST116 is "no rows returned"
          throw fetchError;
        }

        if (tokens) {
          setApiToken(tokens.token);
          return;
        }

        // Create new playground token using edge function
        const { data, error } = await supabase.functions.invoke(
          "create-token",
          {
            body: { name: "Playground" },
          }
        );

        if (error) throw error;

        setApiToken(data.token);
        toast({
          title: t("tokenCreated"),
          description: t("tokenCreatedDesc"),
        });
      } catch (err) {
        console.error("Error setting up API token:", err);
        toast({
          variant: "destructive",
          title: t("errorTitle"),
          description: t("errorCreateToken"),
        });
      }
    };

    setupApiToken();
  }, [user, toast, t]);

  useEffect(() => {
    const fetchChains = async () => {
      if (!apiToken) return;

      try {
        setLoading(true);
        setError(null);
        const { data, error } = await supabase.functions.invoke("list-chains", {
          body: { token: apiToken },
        });

        if (error) throw error;

        if (!Array.isArray(data.list_of_chains)) {
          throw new Error("Invalid data format received");
        }
        setChains(data.list_of_chains || []);
      } catch (err) {
        console.error("Error fetching chains:", err);
        setError(t("errorLoadingChains"));
        setChains([]);
      } finally {
        setLoading(false);
      }
    };

    fetchChains();
  }, [t, apiToken]);

  useEffect(() => {
    const fetchFiles = async () => {
      if (!selectedChain) return;

      try {
        setLoading(true);
        setError(null);
        const { data, error } = await supabase.functions.invoke("list-files", {
          body: { token: apiToken, chain: selectedChain },
        });

        if (error) throw error;

        if (!Array.isArray(data.processed_files)) {
          throw new Error("Invalid data format received");
        }
        setFiles(
          data.processed_files.map(
            (file: { file_name: string }) => file.file_name
          ) || []
        );
        setSelectedFile("");
        setFileContent(null);
      } catch (err) {
        console.error("Error fetching files:", err);
        setError(t("errorLoadingFiles"));
        setFiles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [selectedChain, t, apiToken]);

  useEffect(() => {
    const fetchFileContent = async () => {
      if (!selectedChain || !selectedFile) return;

      try {
        setLoading(true);
        setError(null);
        const { data, error } = await supabase.functions.invoke(
          "get-file-content",
          {
            body: {
              token: apiToken,
              chain: selectedChain,
              file: selectedFile,
            },
          }
        );

        if (error) throw error;

        if (!data.rows || !Array.isArray(data.rows)) {
          throw new Error("Invalid data format received");
        }
        setFileContent(data);
      } catch (err) {
        console.error("Error fetching file content:", err);
        setError(t("errorLoadingFileContent"));
        setFileContent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchFileContent();
  }, [selectedFile, selectedChain, t, apiToken]);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100" dir={direction}>
      <AuthDialog
        isOpen={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
      />
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="relative flex-1 flex flex-col">
          {!user && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-[1] flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {t("authRequired")}
                </h2>
                <p className="text-gray-600 mb-6">{t("authRequiredDesc")}</p>
                <button
                  onClick={() => setShowAuthDialog(true)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  {t("loginRegister")}
                </button>
              </div>
            </div>
          )}
          {/* Header */}
          <div className="bg-white border-b border-gray-200">
            <div className="px-10 py-7">
              {/* Title next to burger - adjusted alignment */}
              <div className="flex items-center mb-8">
                <div className="w-8 flex items-center">
                  {" "}
                  {/* Added flex and items-center */}
                  {/* Burger icon is rendered by the sidebar component */}
                </div>
                <h1 className="text-2xl font-bold text-gray-900 leading-none">
                  {" "}
                  {/* Added leading-none */}
                  {t("playground")}
                </h1>
              </div>

              {/* Selection Controls */}
              <div className="flex gap-4">
                <div className="w-64">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("selectChain")}
                  </label>
                  <div className="relative">
                    <select
                      value={selectedChain || ""}
                      onChange={(e) => setSelectedChain(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none"
                    >
                      <option value="">{t("chooseChain")}</option>
                      {chains.map((chain) => (
                        <option key={chain} value={chain}>
                          {chain}
                        </option>
                      ))}
                    </select>
                    <div
                      className={`pointer-events-none absolute inset-y-0 ${
                        direction === "rtl" ? "left-0" : "right-0"
                      } flex items-center px-2 text-gray-700`}
                    >
                      <svg
                        className="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {selectedChain && (
                  <div className="w-64">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("selectFile")}
                    </label>
                    <div className="relative">
                      <select
                        value={selectedFile}
                        onChange={(e) => setSelectedFile(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none"
                      >
                        <option value="">{t("chooseFile")}</option>
                        {files.map((file) => (
                          <option key={file} value={file}>
                            {file}
                          </option>
                        ))}
                      </select>
                      <div
                        className={`pointer-events-none absolute inset-y-0 ${
                          direction === "rtl" ? "left-0" : "right-0"
                        } flex items-center px-2 text-gray-700`}
                      >
                        <svg
                          className="fill-current h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                        >
                          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Loading Indicator */}
              {loading && (
                <div className="flex items-center text-blue-600 shrink-0 mt-4">
                  <svg
                    className="animate-spin h-5 w-5 mr-2"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  {t("loading")}
                </div>
              )}

              {/* File View Title */}
              <h2 className="text-lg font-semibold text-gray-900 truncate max-w-2xl mt-8">
                {selectedFile || t("selectFileToView")}
              </h2>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-6">
              <div className="p-4 bg-red-50 border-l-4 border-red-400 text-red-700">
                <p className="font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Table Content */}
          <div className="flex-1 overflow-hidden">
            {fileContent && (
              <div className="h-full overflow-auto">
                <div className="inline-block min-w-full align-middle">
                  <table
                    className={`min-w-full divide-y divide-gray-200 ${
                      direction === "rtl" ? "text-right" : "text-left"
                    }`}
                  >
                    <thead className="bg-gray-50">
                      <tr>
                        {fileContent.rows[0] &&
                          Object.keys(fileContent.rows[0].row_content).map(
                            (header) => (
                              <th
                                key={header}
                                onClick={() => requestSort(header)}
                                className={`group sticky top-0 bg-gray-50 px-6 py-3 ${
                                  direction === "rtl"
                                    ? "text-right"
                                    : "text-left"
                                } text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors`}
                              >
                                <div
                                  className={`flex items-center space-x-1 ${
                                    direction === "rtl"
                                      ? "flex-row-reverse space-x-reverse"
                                      : ""
                                  }`}
                                >
                                  <span className="truncate">{header}</span>
                                  <span
                                    className={`transition-opacity shrink-0 ${
                                      sortConfig.key === header
                                        ? "opacity-100"
                                        : "opacity-0 group-hover:opacity-50"
                                    }`}
                                  >
                                    {sortConfig.key === header
                                      ? sortConfig.direction === "ascending"
                                        ? "↑"
                                        : "↓"
                                      : "↕"}
                                  </span>
                                </div>
                              </th>
                            )
                          )}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {sortedAndFilteredData.map((row, rowIndex) => (
                        <tr
                          key={row.row_index}
                          className="hover:bg-blue-50 transition-colors"
                        >
                          {Object.values(row.row_content).map(
                            (cell, cellIndex) => (
                              <td
                                key={cellIndex}
                                className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${
                                  direction === "rtl"
                                    ? "text-right"
                                    : "text-left"
                                }`}
                              >
                                {String(cell)}
                              </td>
                            )
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Playground;
