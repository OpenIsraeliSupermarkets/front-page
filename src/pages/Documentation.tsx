import { Code2, Key, Database, PlayCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";
import { BackButton } from "@/components/BackButton";

const Documentation = () => {
  const { t } = useTranslation();
  const { direction } = useLanguage();

  return (
    <div className="min-h-screen bg-background" dir={direction}>
      <BackButton />
      {/* Header */}
      <div className="border-b pt-16">
        <div className="container py-8 px-4">
          <h1 className="text-4xl font-bold mb-4">{t("apiDocumentation")}</h1>
          <p className="text-lg text-muted-foreground">
            {t("apiDocDescription")}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container px-4 py-12">
        {/* Getting Started */}
        <section className="mb-16 animate-fade-up">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <Key className="w-6 h-6" />
            {t("gettingStarted")}
          </h2>
          <div className="glass-card rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">{t("baseUrl")}</h3>
            <p className="text-muted-foreground mb-4">{t("baseUrlDesc")}</p>
            <div className="bg-secondary/50 p-4 rounded-md font-mono text-sm mb-6">
              <code>https://open-israeli-supermarket.co.il/api</code>
            </div>

            <h3 className="text-lg font-medium mb-4">{t("authentication")}</h3>
            <p className="text-muted-foreground mb-4">
              {t("authDesc")}{" "}
              <a href="/signup" className="text-primary hover:underline">
                {t("signUpHere")}
              </a>
              . {t("noCardRequired")}
            </p>
            <p className="text-muted-foreground mb-4">{t("addToken")}</p>
            <div className="bg-secondary/50 p-4 rounded-md font-mono text-sm">
              <code>Authorization: Bearer YOUR_API_TOKEN</code>
            </div>
          </div>
        </section>

        {/* Endpoints */}
        <section className="mb-16 animate-fade-up">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <Database className="w-6 h-6" />
            {t("apiEndpoints")}
          </h2>
          {endpoints.map((endpoint, index) => (
            <div
              key={endpoint.titleKey}
              className="glass-card rounded-lg p-6 mb-6 last:mb-0"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">
                    {t(endpoint.titleKey)}
                  </h3>
                  <p className="text-muted-foreground">
                    {t(endpoint.descriptionKey)}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  {endpoint.method}
                </span>
              </div>
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">Endpoint</h4>
                <div className="bg-secondary/50 p-3 rounded-md font-mono text-sm">
                  <code>{endpoint.path}</code>
                </div>
              </div>
              {endpoint.parameters && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Parameters</h4>
                  <div className="bg-secondary/50 p-3 rounded-md font-mono text-sm">
                    <pre>{JSON.stringify(endpoint.parameters, null, 2)}</pre>
                  </div>
                </div>
              )}
            </div>
          ))}
        </section>

        {/* Code Examples */}
        <section className="mb-16 animate-fade-up">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <Code2 className="w-6 h-6" />
            {t("codeExamples")}
          </h2>
          {codeExamples.map((example, index) => (
            <div
              key={example.language}
              className="glass-card rounded-lg p-6 mb-6 last:mb-0"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <h3 className="text-lg font-medium mb-4">{example.language}</h3>
              <div className="bg-secondary/50 p-4 rounded-md font-mono text-sm overflow-x-auto">
                <pre>{example.code}</pre>
              </div>
            </div>
          ))}
        </section>

        {/* Quick Start Guide */}
        <section className="animate-fade-up">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <PlayCircle className="w-6 h-6" />
            {t("quickStartGuide")}
          </h2>
          <div className="glass-card rounded-lg p-6">
            <ol className="space-y-4 list-decimal list-inside text-muted-foreground">
              {quickStartSteps.map((step, index) => (
                <li
                  key={index}
                  className="pl-2"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </section>
      </div>
    </div>
  );
};

const endpoints = [
  {
    titleKey: "listChains",
    descriptionKey: "listChainsDesc",
    path: "/list_chains",
    method: "GET",
    security: "Bearer Token",
    response: {
      "200": {
        type: "object",
        properties: {
          list_of_chains: "string[]",
        },
      },
    },
  },
  {
    titleKey: "listFileTypes",
    descriptionKey: "listFileTypesDesc",
    path: "/list_file_types",
    method: "GET",
    security: "Bearer Token",
    response: {
      "200": {
        type: "object",
        properties: {
          list_of_file_types: "string[]",
        },
      },
    },
  },
  {
    titleKey: "listScrapedFiles",
    descriptionKey: "listScrapedFilesDesc",
    path: "/list_scraped_files",
    method: "GET",
    security: "Bearer Token",
    parameters: {
      chain: "string (required) - Supermarket chain name",
      file_type: "string (optional) - Filter by file type",
    },
    response: {
      "200": {
        type: "object",
        properties: {
          processed_files: "ScrapedFile[]",
        },
      },
    },
  },
  {
    titleKey: "fileContent",
    descriptionKey: "fileContentDesc",
    path: "/raw/file_content",
    method: "GET",
    security: "Bearer Token",
    parameters: {
      chain: "string (required) - Supermarket chain name",
      file: "string (required) - File name to retrieve",
    },
    response: {
      "200": {
        type: "object",
        properties: {
          rows: "RawFileContent[]",
        },
      },
    },
  },
];

const codeExamples = [
  {
    language: "JavaScript/TypeScript",
    code: `// API configuration
const API_BASE_URL = 'https://api.supermarket-data.org';
const API_TOKEN = 'YOUR_API_TOKEN';

const headers = {
  'Authorization': \`Bearer \${API_TOKEN}\`,
  'Content-Type': 'application/json'
};

// List all available chains
async function listChains() {
  const response = await fetch(\`\${API_BASE_URL}/list_chains\`, { headers });
  return await response.json();
}

// Get files for a specific chain
async function listFiles(chain, fileType = null) {
  const params = new URLSearchParams({ chain });
  if (fileType) params.append('file_type', fileType);
  
  const response = await fetch(
    \`\${API_BASE_URL}/list_scraped_files?\${params}\`,
    { headers }
  );
  return await response.json();
}`,
  },
  {
    language: "Python",
    code: `import requests

# API configuration
API_BASE_URL = 'https://api.supermarket-data.org'
API_TOKEN = 'YOUR_API_TOKEN'

headers = {
    'Authorization': f'Bearer {API_TOKEN}',
    'Content-Type': 'application/json'
}

# List all available chains
def list_chains():
    response = requests.get(
        f'{API_BASE_URL}/list_chains',
        headers=headers
    )
    return response.json()

# Get files for a specific chain
def list_files(chain, file_type=None):
    params = {'chain': chain}
    if file_type:
        params['file_type'] = file_type
        
    response = requests.get(
        f'{API_BASE_URL}/list_scraped_files',
        headers=headers,
        params=params
    )
    return response.json()`,
  },
];

const quickStartSteps = [
  "Get your API token from the system",
  "Start by calling /list_chains to get available supermarket chains",
  "Use /list_file_types to see what types of files are available",
  "Get a list of files for your chosen chain using /list_scraped_files",
  "Retrieve file contents using /raw/file_content with the chain and file name",
  "Handle responses appropriately and implement error handling",
  "Consider caching responses when appropriate to improve performance",
];

export default Documentation;
