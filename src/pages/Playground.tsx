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
    <div className="p-4">
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {loading && <div className="text-gray-600 mb-4">{t("loading")}</div>}

      <div className="mb-4">
        <h2 className="text-xl mb-2">{t("selectChain")}</h2>
        <select
          value={selectedChain || ""}
          onChange={(e) => setSelectedChain(e.target.value)}
          className="border p-2 rounded"
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
        <div className="mb-4">
          <h2 className="text-xl mb-2">{t("selectFile")}</h2>
          <select
            value={selectedFile}
            onChange={(e) => setSelectedFile(e.target.value)}
            className="border p-2 rounded"
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
        <div>
          <h2 className="text-xl mb-2">{t("fileContent")}</h2>
          <input
            type="text"
            placeholder={t("filterTable")}
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="border p-2 rounded mb-4 w-full"
          />
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border">
              <thead>
                <tr>
                  {fileContent.rows[0] &&
                    Object.keys(fileContent.rows[0].row_content).map(
                      (header) => (
                        <th
                          key={header}
                          onClick={() => requestSort(header)}
                          className="border p-2 bg-gray-100 cursor-pointer hover:bg-gray-200"
                        >
                          {header}
                          {sortConfig.key === header && (
                            <span className="ml-2">
                              {sortConfig.direction === "ascending" ? "↑" : "↓"}
                            </span>
                          )}
                        </th>
                      )
                    )}
                </tr>
              </thead>
              <tbody>
                {sortedAndFilteredData.map((row) => (
                  <tr key={row.row_index}>
                    {Object.values(row.row_content).map((cell, cellIndex) => (
                      <td key={cellIndex} className="border p-2">
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
  );
};

export default Playground;
