import { Code2, Key, Database, PlayCircle } from "lucide-react";
import { BackButton } from "@/components/BackButton";

const Documentation = () => {
  return (
    <div className="min-h-screen bg-background">
      <BackButton />
      {/* Header */}
      <div className="border-b pt-16">
        <div className="container py-8 px-4">
          <h1 className="text-4xl font-bold mb-4">API Documentation</h1>
          <p className="text-lg text-muted-foreground">
            Complete guide to integrating with the Israeli Supermarket Data API
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container px-4 py-12">
        {/* Getting Started */}
        <section className="mb-16 animate-fade-up">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <Key className="w-6 h-6" />
            Getting Started
          </h2>
          <div className="glass-card rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">Base URL</h3>
            <p className="text-muted-foreground mb-4">
              All API requests should be made to the base URL:
            </p>
            <div className="bg-secondary/50 p-4 rounded-md font-mono text-sm">
              <code>https://api.supermarket-data.org/v0</code>
            </div>
          </div>
        </section>

        {/* Endpoints */}
        <section className="mb-16 animate-fade-up">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <Database className="w-6 h-6" />
            API Endpoints
          </h2>
          {endpoints.map((endpoint, index) => (
            <div
              key={endpoint.path}
              className="glass-card rounded-lg p-6 mb-6 last:mb-0"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">{endpoint.title}</h3>
                  <p className="text-muted-foreground">
                    {endpoint.description}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  GET
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
            Code Examples
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
            Quick Start Guide
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
    title: "List Chains",
    description: "Retrieve a list of available supermarket chains",
    path: "raw/list_chains",
  },
  {
    title: "List File Types",
    description: "Get a list of available file types",
    path: "raw/list_file_types",
  },
  {
    title: "List Files",
    description: "Get a list of files for a specific chain",
    path: "raw/list_files",
    parameters: {
      chain: "string (required) - Supermarket chain name",
      file_type: "string (optional) - Filter by file type",
    },
  },
  {
    title: "File Content",
    description: "Retrieve the content of a specific file",
    path: "raw/file_content",
    parameters: {
      chain: "string (required) - Supermarket chain name",
      file: "string (required) - File name to retrieve",
    },
  },
];

const codeExamples = [
  {
    language: "JavaScript/TypeScript",
    code: `// List all available chains
async function listChains() {
  const response = await fetch('https://api.supermarket-data.org/v0/list_chains/v0');
  return await response.json();
}

// Get files for a specific chain
async function listFiles(chain, fileType = null) {
  const params = new URLSearchParams({ chain });
  if (fileType) params.append('file_type', fileType);
  
  const response = await fetch(
    \`https://api.supermarket-data.org/v0/list_files/v0?\${params}\`
  );
  return await response.json();
}`,
  },
  {
    language: "Python",
    code: `import requests

# List all available chains
def list_chains():
    response = requests.get('https://api.supermarket-data.org/v0/list_chains/v0')
    return response.json()

# Get files for a specific chain
def list_files(chain, file_type=None):
    params = {'chain': chain}
    if file_type:
        params['file_type'] = file_type
        
    response = requests.get(
        'https://api.supermarket-data.org/v0/list_files/v0',
        params=params
    )
    return response.json()`,
  },
];

const quickStartSteps = [
  "Start by calling /list_chains/v0 to get available supermarket chains",
  "Use /list_file_types/v0 to see what types of files are available",
  "Get a list of files for your chosen chain using /list_files/v0",
  "Retrieve file contents using /file_content/v0 with the chain and file name",
  "Handle responses appropriately and implement error handling",
  "Consider caching responses when appropriate to improve performance",
];

export default Documentation;
