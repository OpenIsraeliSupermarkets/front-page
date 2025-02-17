
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase"
import { useNavigate } from "react-router-dom"

const APITokens = () => {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [tokenName, setTokenName] = useState("")
  const [generatedToken, setGeneratedToken] = useState<string | null>(null)

  // Check authentication status
  supabase.auth.onAuthStateChange((event, session) => {
    if (!session) {
      navigate('/')
    }
  })

  const handleCreateToken = async () => {
    if (!tokenName.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a name for your token",
      })
      return
    }

    // For now, we'll generate a simple UUID as the token
    // In a production environment, you'd want to use a more secure method
    const token = crypto.randomUUID()
    setGeneratedToken(token)
    
    toast({
      title: "Token Created",
      description: "Your API token has been generated successfully.",
    })
  }

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">API Tokens</h1>
      
      <div className="space-y-6">
        <div className="p-6 border rounded-lg bg-card">
          <h2 className="text-xl font-semibold mb-4">Create New Token</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="tokenName" className="block text-sm font-medium mb-2">
                Token Name
              </label>
              <Input
                id="tokenName"
                placeholder="Enter a name for your token"
                value={tokenName}
                onChange={(e) => setTokenName(e.target.value)}
              />
            </div>
            <Button onClick={handleCreateToken}>
              Generate Token
            </Button>
          </div>
        </div>

        {generatedToken && (
          <div className="p-6 border rounded-lg bg-card">
            <h2 className="text-xl font-semibold mb-4">Your New Token</h2>
            <div className="bg-muted p-4 rounded-md break-all font-mono text-sm">
              {generatedToken}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Make sure to copy this token now. You won't be able to see it again!
            </p>
          </div>
        )}
      </div>

      <Button 
        variant="outline" 
        className="mt-8"
        onClick={() => navigate('/')}
      >
        Back to Home
      </Button>
    </div>
  )
}

export default APITokens
