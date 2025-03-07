import React, { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";

const Playground = () => {
  const { t } = useTranslation();
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
  const [filterText, setFilterText] = useState("");

  const headers = useMemo(
    () => ({
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_NEXT_PUBLIC_API_TOKEN}`,
    }),
    []
  );

  const sortedAndFilteredData = useMemo(() => {
    if (!fileContent?.rows) return [];

    const filteredData = fileContent.rows.filter((row) =>
      Object.values(row.row_content).some((value) =>
        String(value).toLowerCase().includes(filterText.toLowerCase())
      )
    );

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
  }, [fileContent, sortConfig, filterText]);

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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {error}
          </div>
        )}

        {loading && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-600">
            {t("loading")}
          </div>
        )}

        <div className="mb-8 bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            {t("selectChain")}
          </h2>
          <select
            value={selectedChain || ""}
            onChange={(e) => setSelectedChain(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          >
            <option value="">{t("chooseChain")}</option>
            {chains.map((chain) => (
              <option key={chain} value={chain}>
                {chain}
              </option>
            ))}
          </select>
        </div>

        {selectedChain && (
          <div className="mb-8 bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              {t("selectFile")}
            </h2>
            <select
              value={selectedFile}
              onChange={(e) => setSelectedFile(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            >
              <option value="">{t("chooseFile")}</option>
              {files.map((file) => (
                <option key={file} value={file}>
                  {file}
                </option>
              ))}
            </select>
          </div>
        )}

        {fileContent && (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              {t("fileContent")}
            </h2>
            <input
              type="text"
              placeholder={t("filterTable")}
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="w-full px-4 py-2 mb-6 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {fileContent.rows[0] &&
                      Object.keys(fileContent.rows[0].row_content).map(
                        (header) => (
                          <th
                            key={header}
                            onClick={() => requestSort(header)}
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-center space-x-1">
                              <span>{header}</span>
                              {sortConfig.key === header && (
                                <span className="text-blue-500">
                                  {sortConfig.direction === "ascending"
                                    ? "↑"
                                    : "↓"}
                                </span>
                              )}
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
                      className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      {Object.values(row.row_content).map((cell, cellIndex) => (
                        <td
                          key={cellIndex}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                        >
                          {String(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Playground;
