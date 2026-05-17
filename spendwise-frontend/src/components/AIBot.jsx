import { useState } from "react";
import API from "../services/api";

function AIBot() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const fetchSuggestion = async () => {
    const res = await API.get("/expenses/ai/suggestion");
    setMessage(res.data);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => {
          setOpen(!open);
          fetchSuggestion();
        }}
        className="fixed bottom-20 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg"
      >
        🤖
      </button>

      {/* Chat Box */}
      {open && (
        <div className="fixed bottom-32 right-4 bg-white border p-3 w-64 shadow-lg rounded-lg">
          <p className="text-sm">{message || "Loading..."}</p>
        </div>
      )}
    </>
  );
}

export default AIBot;