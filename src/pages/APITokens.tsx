import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { BackButton } from "@/components/BackButton";
import { useUser } from "@/contexts/UserContext";

interface APIToken {
  id: string;
  name: string;
  created_at: string;
  last_used_at: string | null;
  is_active: boolean;
}

const APITokens = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useUser();
  const [tokenName, setTokenName] = useState("");
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);
  const [tokens, setTokens] = useState<APIToken[]>([]);

  // Load tokens only if user is authenticated
  useEffect(() => {
    const loadTokens = async () => {
      if (!user) return;

      const { data: tokens, error } = await supabase
        .from("api_tokens")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load tokens",
        });
        return;
      }

      setTokens(tokens);
    };

    loadTokens();
  }, [user, toast]);

  const handleCreateToken = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to create a token",
      });
      return;
    }

    if (!tokenName.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a token name",
      });
      return;
    }

    const token = crypto.randomUUID();

    const { error } = await supabase.from("api_tokens").insert({
      name: tokenName,
      token: token,
      user_id: user.id,
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create token",
      });
      return;
    }

    setGeneratedToken(token);
    setTokenName("");

    // Refresh tokens list
    const { data: updatedTokens } = await supabase
      .from("api_tokens")
      .select("*")
      .order("created_at", { ascending: false });

    if (updatedTokens) {
      setTokens(updatedTokens);
    }

    toast({
      title: "Token Created",
      description: "Token created successfully.",
    });
  };

  const handleDeactivateToken = async (tokenId: string) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to deactivate a token",
      });
      return;
    }

    const { error } = await supabase
      .from("api_tokens")
      .update({ is_active: false })
      .eq("id", tokenId);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to deactivate token",
      });
      return;
    }

    setTokens(
      tokens.map((token) =>
        token.id === tokenId ? { ...token, is_active: false } : token
      )
    );

    toast({
      title: "Token Deactivated",
      description: "Token has been deactivated.",
    });
  };

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <BackButton />
      <div className="pt-16">
        <h1 className="text-3xl font-bold mb-8">API Tokens</h1>

        {!user && (
          <div className="p-6 border rounded-lg bg-card mb-6">
            <h2 className="text-xl font-semibold mb-4">
              Authentication Required
            </h2>
            <p className="text-muted-foreground mb-4">
              You need to be logged in to create and manage tokens.
            </p>
            <Button onClick={() => navigate("/")}>Login</Button>
          </div>
        )}

        {user && (
          <div className="space-y-6">
            <div className="p-6 border rounded-lg bg-card">
              <h2 className="text-xl font-semibold mb-4">Create New Token</h2>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="tokenName"
                    className="block text-sm font-medium mb-2"
                  >
                    Token Name
                  </label>
                  <Input
                    id="tokenName"
                    placeholder="Enter token name"
                    value={tokenName}
                    onChange={(e) => setTokenName(e.target.value)}
                  />
                </div>
                <Button onClick={handleCreateToken}>Generate Token</Button>
              </div>
            </div>

            {generatedToken && (
              <div className="p-6 border rounded-lg bg-card">
                <h2 className="text-xl font-semibold mb-4">Your New Token</h2>
                <div className="bg-muted p-4 rounded-md break-all font-mono text-sm">
                  {generatedToken}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Make sure to copy this token now. You won't be able to see it
                  again!
                </p>
              </div>
            )}

            {tokens.length > 0 && (
              <div className="p-6 border rounded-lg bg-card">
                <h2 className="text-xl font-semibold mb-4">Your Tokens</h2>
                <div className="space-y-4">
                  {tokens.map((token) => (
                    <div
                      key={token.id}
                      className="p-4 border rounded-md flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium">{token.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Created:{" "}
                          {new Date(token.created_at).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Status:{" "}
                          {token.is_active ? (
                            <span className="text-green-600">Active</span>
                          ) : (
                            <span className="text-red-600">Inactive</span>
                          )}
                        </p>
                      </div>
                      {token.is_active && (
                        <Button
                          variant="destructive"
                          onClick={() => handleDeactivateToken(token.id)}
                        >
                          Deactivate
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <Button
          variant="outline"
          className="mt-8"
          onClick={() => navigate("/")}
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
};

export default APITokens;
