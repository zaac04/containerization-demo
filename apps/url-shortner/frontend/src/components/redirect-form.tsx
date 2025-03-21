import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { FaExternalLinkAlt } from "react-icons/fa";

export default function RedirectForm() {
  const [inputValue, setInputValue] = useState("");
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!inputValue) return;
    
    setLoading(true);
    setRedirectUrl(null);

    try {
      const response = await fetch("http://localhost:3000/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: inputValue }),
      });
      
      const data = await response.json();
      if (data.url) setRedirectUrl(data.url);
    } catch (error) {
      console.error("Error shortening URL:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-96 m-5 p-2 text-center">
        <CardTitle>URL Shortener</CardTitle>
        <CardContent className="flex flex-col items-center gap-2">
          <Input
            className="text-center"
            placeholder="Enter URL to shorten..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <Button onClick={handleSubmit} disabled={loading || !inputValue}>
            {loading ? "Submitting..." : "Submit"}
          </Button>
          {redirectUrl && <ShortenedLink url={redirectUrl} />}
        </CardContent>
      </Card>
    </div>
  );
}

function ShortenedLink({ url }: { url: string }) {
  return (
    <div className="mt-2 text-blue-600 underline">
      <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center">
        {url} <FaExternalLinkAlt className="ml-1" />
      </a>
    </div>
  );
}
