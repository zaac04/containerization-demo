import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { FaExternalLinkAlt } from "react-icons/fa";

export default function RedirectForm() {
  const [inputValue, setInputValue] = useState("");
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const [generatedLinks, setGeneratedLinks] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchGeneratedLinks();
  }, []);

  const fetchGeneratedLinks = async () => {
    try {
      const response = await fetch("http://localhost:3000/links");
      const data = await response.json();
      if (data.urls) setGeneratedLinks(data.urls);
    } catch (error) {
      console.error("Error fetching generated links:", error);
    }
  };

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
      if (data.url) {
        setRedirectUrl(data.url);
        fetchGeneratedLinks();
      }
    } catch (error) {
      console.error("Error shortening URL:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(generatedLinks.length / itemsPerPage) || 1 ;
  const currentLinks = generatedLinks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex w-3/5 justify-between p-10 shadow-lg rounded-lg min-h-[400px]">
        <Card className="w-1/2 p-2 m-1 text-center flex flex-col justify-center items-center min-h-[350px]">
          <CardTitle>URL Shortener</CardTitle>
          <CardContent className="flex flex-col items-center gap-2">
            <Input
              className="text-center"
              placeholder="Enter URL to shorten..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <Button className="mt-2" onClick={handleSubmit} disabled={loading || !inputValue}>
              {loading ? "Submitting..." : "Submit"}
            </Button>
            {redirectUrl && <ShortenedLink url={redirectUrl} />}
          </CardContent>
        </Card>
        <Card className="w-1/2 p-2 m-1 text-left flex flex-col justify-center items-center min-h-[350px]">
          <CardTitle>Generated Links</CardTitle>
          <CardContent className="flex flex-col items-center">
            {generatedLinks.length === 0 ? (
              <p className="text-gray-500 text-center">No links generated yet.</p>
            ) : (
              <ul className="list-disc list-inside text-center">
                {currentLinks.map((link, index) => (
                  <li key={index} className="text-blue-600 underline flex">
                    <a href={link} target="_blank" rel="noopener noreferrer" className="flex items-center">
                      {link} <FaExternalLinkAlt className="ml-1" />
                    </a>
                  </li>
                ))}
              </ul>
            )}
            <div className="flex justify-end mt-4 w-full">
              <Button className="m-1" onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))} disabled={currentPage === 1}>
                Previous
              </Button>
              <span className="m-1" >Page {currentPage} of {totalPages}</span>
              <Button className="m-1" onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages }>
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ShortenedLink({ url }: { url: string }) {
  return (
    <div className="mt-2 text-blue-600 underline text-center">
      <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
        {url} <FaExternalLinkAlt className="ml-1" />
      </a>
    </div>
  );
}
