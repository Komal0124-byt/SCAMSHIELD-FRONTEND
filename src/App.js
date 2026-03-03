mport React, { useState } from "react";

function App() {
  const BASE_URL = "https://scamshield-v88k.onrender.com";

  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const [calls, setCalls] = useState([]);
  const [callNumber, setCallNumber] = useState("");
  const [callType, setCallType] = useState("scam");
  const [callNotes, setCallNotes] = useState("");

  // Scan message
  const checkScam = async () => {
    const response = await fetch(`${BASE_URL}/check`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: text }),
    });

    const data = await response.json();
    setResult(data.result);
  };

  // Fetch message history
  const getHistory = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/history`);
      const data = await res.json();
      setHistory(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Add new scam call
  const addCall = async () => {
    if (!callNumber) return alert("Enter number");
    try {
      await fetch(`${BASE_URL}/calls/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          number: callNumber,
          type: callType,
          notes: callNotes,
        }),
      });
      setCallNumber("");
      setCallNotes("");
      fetchCalls();
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch calls history
  const fetchCalls = async () => {
    try {
      const res = await fetch(`${BASE_URL}/calls/history`);
      const data = await res.json();
      setCalls(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-96 text-center">
        <h1 className="text-2xl font-bold mb-4">ScamShield AI 🛡️</h1>

        <textarea
          className="w-full p-3 border rounded-lg mb-4"
          rows="4"
          placeholder="Paste suspicious message here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button
          onClick={checkScam}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg m-2"
        >
          Check Scam
        </button>

        <button
          onClick={getHistory}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg m-2"
        >
          Show History
        </button>

        <p className="mt-4 font-semibold">{result}</p>

        <div className="mt-4 text-left max-h-40 overflow-y-auto border-t pt-2">
          {loading ? (
            <div className="flex justify-center items-center py-4">
              <div className="w-6 h-6 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
            </div>
          ) : (
            history.map((item, index) => (
              <div key={index} className="border-b py-2 text-sm">
                <p><strong>Message:</strong> {item.message}</p>
                <p
                  className={
                    item.result.includes("Scam")
                      ? "text-red-600 font-semibold"
                      : "text-green-600 font-semibold"
                  }
                >
                  {item.result}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(item.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>

        <div className="mt-6 text-left p-4 border rounded-lg">
          <h2 className="font-bold mb-2">Scam Call Demo</h2>

          <input
            type="text"
            placeholder="Number"
            value={callNumber}
            onChange={(e) => setCallNumber(e.target.value)}
            className="border p-1 rounded mb-2 w-full"
          />

          <select
            value={callType}
            onChange={(e) => setCallType(e.target.value)}
            className="border p-1 rounded mb-2 w-full"
          >
            <option value="scam">Scam</option>
            <option value="safe">Safe</option>
          </select>

          <input
            type="text"
            placeholder="Notes"
            value={callNotes}
            onChange={(e) => setCallNotes(e.target.value)}
            className="border p-1 rounded mb-2 w-full"
          />

          <button
            onClick={addCall}
            className="bg-red-600 text-white px-2 py-1 rounded w-full"
          >
            Add Call
          </button>

          <div className="mt-4 max-h-40 overflow-y-auto border-t pt-2">
            {calls.map((c, i) => (
              <div key={i} className="border-b py-1 text-sm">
                <p><strong>Number:</strong> {c.number}</p>
                <p><strong>Type:</strong> {c.type}</p>
                <p><strong>Notes:</strong> {c.notes}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;i