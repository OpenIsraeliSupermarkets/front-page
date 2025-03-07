import React, { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";

const Playground = () => {
  const { t } = useTranslation();
  const { direction } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chains, setChains] = useState([]);
  const [selectedChain, setSelectedChain] = useState(null);
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState("");
  const [fileContent, setFileContent] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: "",
    direction: "ascending",
  });

  const headers = useMemo(
    () => ({
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_NEXT_PUBLIC_API_TOKEN}`,
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
    const fetchChains = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/list_chains`, {
          headers,
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
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
  }, [t, headers]);

  useEffect(() => {
    const fetchFiles = async () => {
      if (!selectedChain) return;

      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `/api/list_scraped_files?chain=${encodeURIComponent(selectedChain)}`,
          { headers }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (!Array.isArray(data.processed_files)) {
          throw new Error("Invalid data format received");
        }
        setFiles(data.processed_files.map((file) => file.file_name) || []);
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
  }, [selectedChain, t, headers]);

  useEffect(() => {
    const fetchFileContent = async () => {
      if (!selectedChain || !selectedFile) return;

      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `/api/raw/file_content?chain=${encodeURIComponent(
            selectedChain
          )}&file=${encodeURIComponent(selectedFile)}`,
          { headers }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
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
  }, [selectedFile, selectedChain, t, headers]);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100" dir={direction}>
      {/* Sidebar */}
      <div
        className={`w-64 min-w-[16rem] bg-white border-${
          direction === "rtl" ? "l" : "r"
        } border-gray-200 flex flex-col`}
      >
        <div className="pt-16 px-4 border-b border-gray-200">
          <div className="flex justify-start items-center mb-4">
            <h1 className="text-xl font-bold text-blue-600">
              {t("playground")}
            </h1>
          </div>
        </div>

        <div className="p-4 flex-1 overflow-y-auto space-y-6">
          <div>
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
            <div>
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
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-6 py-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 truncate max-w-2xl">
              {selectedFile || t("selectFileToView")}
            </h2>
            {loading && (
              <div className="flex items-center text-blue-600 shrink-0">
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
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
                                direction === "rtl" ? "text-right" : "text-left"
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
                                direction === "rtl" ? "text-right" : "text-left"
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
  );
};

export default Playground;
