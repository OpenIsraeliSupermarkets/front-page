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

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const headers = useMemo(
    () => ({
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_NEXT_PUBLIC_API_TOKEN}`,
    }),
    []
  );

  useEffect(() => {
    const fetchChains = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${API_BASE_URL}/list_chains`, {
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
  }, [t, API_BASE_URL, headers]);

  useEffect(() => {
    const fetchFiles = async () => {
      if (!selectedChain) return;

      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `${API_BASE_URL}/list_scraped_files?chain=${encodeURIComponent(
            selectedChain
          )}`,
          { headers }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (!Array.isArray(data.processed_files)) {
          throw new Error("Invalid data format received");
        }
        setFiles(data.processed_files || []);
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
  }, [selectedChain, t, API_BASE_URL, headers]);

  useEffect(() => {
    const fetchFileContent = async () => {
      if (!selectedChain || !selectedFile) return;

      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `${API_BASE_URL}/raw/file_content?chain=${encodeURIComponent(
            selectedChain
          )}&file=${encodeURIComponent(selectedFile)}`,
          { headers }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
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
  }, [selectedFile, selectedChain, t, API_BASE_URL, headers]);

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
          <div className="border p-4 rounded bg-gray-50">
            <pre>{JSON.stringify(fileContent, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default Playground;
