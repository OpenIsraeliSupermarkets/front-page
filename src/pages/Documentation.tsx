
import { Code2, Key, Database, PlayCircle } from "lucide-react";

const Documentation = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
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
          <div className="glass-card rounded-lg p-6 mb-6">
            <h3 className="text-lg font-medium mb-4">Authentication</h3>
            <p className="text-muted-foreground mb-4">
              All API requests require an API key to be included in the header:
            </p>
            <div className="bg-secondary/50 p-4 rounded-md font-mono text-sm overflow-x-auto">
              <pre>
                {`Authorization: Bearer YOUR_API_KEY`}
              </pre>
            </div>
          </div>
          <div className="glass-card rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">Base URL</h3>
            <p className="text-muted-foreground mb-4">
              All API requests should be made to:
            </p>
            <div className="bg-secondary/50 p-4 rounded-md font-mono text-sm">
              <code>https://api.supermarket-data.org/v1</code>
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
                  <p className="text-muted-foreground">{endpoint.description}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  endpoint.method === 'GET' ? 'bg-green-100 text-green-800' : 
                  endpoint.method === 'POST' ? 'bg-blue-100 text-blue-800' : 
                  'bg-gray-100 text-gray-800'
                }`}>
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
              {endpoint.response && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Example Response</h4>
                  <div className="bg-secondary/50 p-3 rounded-md font-mono text-sm">
                    <pre>{JSON.stringify(endpoint.response, null, 2)}</pre>
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
    title: "List Products",
    description: "Retrieve a list of products with optional filtering",
    method: "GET",
    path: "/products",
    parameters: {
      chain: "string (optional) - Filter by supermarket chain",
      category: "string (optional) - Filter by product category",
      limit: "number (optional) - Number of results per page",
      page: "number (optional) - Page number for pagination",
    },
    response: {
      products: [
        {
          id: "123",
          name: "Product Name",
          price: 9.99,
          chain: "SuperCo",
          category: "Dairy",
          last_updated: "2024-03-15T10:30:00Z"
        }
      ],
      total: 100,
      page: 1,
      limit: 10
    }
  },
  {
    title: "Price History",
    description: "Get historical price data for a specific product",
    method: "GET",
    path: "/products/:id/history",
    parameters: {
      start_date: "string (optional) - Start date for history (YYYY-MM-DD)",
      end_date: "string (optional) - End date for history (YYYY-MM-DD)",
    },
    response: {
      product_id: "123",
      prices: [
        {
          date: "2024-03-15",
          price: 9.99,
          chain: "SuperCo"
        }
      ]
    }
  },
  {
    title: "Compare Prices",
    description: "Compare prices across different supermarket chains",
    method: "POST",
    path: "/compare",
    parameters: {
      product_ids: "array - List of product IDs to compare",
      chains: "array (optional) - List of chains to include in comparison"
    },
    response: {
      comparisons: [
        {
          product_id: "123",
          name: "Product Name",
          prices: [
            {
              chain: "SuperCo",
              price: 9.99
            },
            {
              chain: "MegaMart",
              price: 10.49
            }
          ]
        }
      ]
    }
  }
];

const codeExamples = [
  {
    language: "JavaScript/TypeScript",
    code: `const API_KEY = 'your_api_key';

async function fetchProducts() {
  const response = await fetch('https://api.supermarket-data.org/v1/products', {
    headers: {
      'Authorization': \`Bearer \${API_KEY}\`,
      'Content-Type': 'application/json'
    }
  });
  
  const data = await response.json();
  return data;
}`
  },
  {
    language: "Python",
    code: `import requests

API_KEY = 'your_api_key'

def fetch_products():
    headers = {
        'Authorization': f'Bearer {API_KEY}',
        'Content-Type': 'application/json'
    }
    
    response = requests.get(
        'https://api.supermarket-data.org/v1/products',
        headers=headers
    )
    
    return response.json()`
  }
];

const quickStartSteps = [
  "Sign up for an API key through our developer portal",
  "Include your API key in the Authorization header of all requests",
  "Start with the /products endpoint to retrieve basic product data",
  "Use the filtering parameters to narrow down results",
  "Implement pagination to handle large datasets efficiently",
  "Use the comparison endpoint to analyze prices across different chains",
  "Monitor your API usage through our developer dashboard"
];

export default Documentation;
