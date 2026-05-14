import { useEffect, useState } from "react";
import "./App.css";

const API_BASE_URL = "http://127.0.0.1:8080/api/deals";

function App() {
  const [formData, setFormData] = useState({
    address: "",
    purchasePrice: "",
    arv: "",
    repairs: "",
    closingCosts: "",
    assignmentFee: "",
    notes: "",
    comp1: "",
    comp2: "",
    comp3: "",
  });

  const [rehab, setRehab] = useState({
    roof: false,
    hvac: false,
    kitchen: false,
    bathroom: false,
    flooring: false,
    paint: false,
    plumbing: false,
    electrical: false,
  });

  const rehabCosts = {
    roof: 12000,
    hvac: 8000,
    kitchen: 15000,
    bathroom: 8000,
    flooring: 7000,
    paint: 4000,
    plumbing: 6000,
    electrical: 6000,
  };

  const [result, setResult] = useState("");
  const [sellerMessage, setSellerMessage] = useState("");
  const [copyStatus, setCopyStatus] = useState("");
  const [dealMetrics, setDealMetrics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [savedDeals, setSavedDeals] = useState([]);
  const [compareIds, setCompareIds] = useState([]);

  useEffect(() => {
    loadSavedDeals();
  }, []);

  const loadSavedDeals = async () => {
    try {
      const response = await fetch(API_BASE_URL);
      const data = await response.json();
      setSavedDeals(data);
    } catch (error) {
      console.error("Could not load saved deals:", error);
    }
  };

  const formatCurrency = (value) =>
    Number(value || 0).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRehabChange = (e) => {
    setRehab({ ...rehab, [e.target.name]: e.target.checked });
  };

  const estimatedRepairCost = Object.keys(rehab)
    .filter((key) => rehab[key])
    .reduce((total, key) => total + rehabCosts[key], 0);

  const useRehabEstimate = () => {
    setFormData({
      ...formData,
      repairs: estimatedRepairCost.toString(),
    });
  };

  const calculateCompARV = () => {
    const comps = [
      parseFloat(formData.comp1),
      parseFloat(formData.comp2),
      parseFloat(formData.comp3),
    ].filter((num) => !isNaN(num) && num > 0);

    if (comps.length === 0) return "";

    return (
      comps.reduce((sum, num) => sum + num, 0) / comps.length
    ).toFixed(2);
  };

  const estimatedArv = calculateCompARV();

  const handleUseCompARV = () => {
    if (estimatedArv) {
      setFormData({
        ...formData,
        arv: estimatedArv,
      });
    }
  };

  const extractSellerMessage = (text) => {
    const marker = "SELLER FOLLOW-UP MESSAGE";
    const index = text.indexOf(marker);

    if (index === -1) return "";

    return text.substring(index + marker.length).trim();
  };

  const getGrade = (profit) => {
    if (profit >= 50000) return "A";
    if (profit >= 20000) return "B";
    if (profit >= 0) return "C";
    return "D";
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const finalArv = estimatedArv || formData.arv;

      const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: formData.address,
          purchasePrice: parseFloat(formData.purchasePrice),
          arv: parseFloat(finalArv),
          repairs: parseFloat(formData.repairs),
          closingCosts: parseFloat(formData.closingCosts),
          assignmentFee: parseFloat(formData.assignmentFee),
          notes:
            formData.notes +
            `\n\nComps Used:` +
            `\nComp 1: $${formData.comp1 || "N/A"}` +
            `\nComp 2: $${formData.comp2 || "N/A"}` +
            `\nComp 3: $${formData.comp3 || "N/A"}` +
            `\nEstimated ARV From Comps: $${finalArv}` +
            `\nEstimated Repairs From Rehab Tool: $${estimatedRepairCost}`,
        }),
      });

      const savedDeal = await response.json();

      const aiResponse = await fetch(`${API_BASE_URL}/${savedDeal.id}/analyze`, {
        method: "POST",
      });

      const analyzedDeal = await aiResponse.json();
      const aiText = analyzedDeal.aiSummary || "No AI response returned.";

      setResult(aiText);
      setSellerMessage(extractSellerMessage(aiText));
      setCopyStatus("");

      setDealMetrics({
        mao: analyzedDeal.mao,
        profit: analyzedDeal.estimatedProfit,
        roi: analyzedDeal.roi,
        grade: getGrade(analyzedDeal.estimatedProfit),
      });

      await loadSavedDeals();
    } catch (error) {
      setResult("Error connecting to backend. Make sure Spring Boot is running.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!sellerMessage) {
      setCopyStatus("No seller message found.");
      return;
    }

    await navigator.clipboard.writeText(sellerMessage);
    setCopyStatus("Seller message copied!");
  };

  const handleClearForm = () => {
    setFormData({
      address: "",
      purchasePrice: "",
      arv: "",
      repairs: "",
      closingCosts: "",
      assignmentFee: "",
      notes: "",
      comp1: "",
      comp2: "",
      comp3: "",
    });

    setRehab({
      roof: false,
      hvac: false,
      kitchen: false,
      bathroom: false,
      flooring: false,
      paint: false,
      plumbing: false,
      electrical: false,
    });

    setResult("");
    setSellerMessage("");
    setCopyStatus("");
    setDealMetrics(null);
  };

  const toggleCompare = (id) => {
    if (compareIds.includes(id)) {
      setCompareIds(compareIds.filter((dealId) => dealId !== id));
    } else if (compareIds.length < 3) {
      setCompareIds([...compareIds, id]);
    }
  };

  const comparedDeals = savedDeals.filter((deal) =>
    compareIds.includes(deal.id)
  );

  return (
    <div className="app-container">
      <header className="header">
        <h1>DealPilot</h1>
        <p>AI-Powered Real Estate Deal Analyzer</p>
      </header>

      <div className="dashboard">
        <div className="card">
          <h2>Property Details</h2>

          <input
            name="address"
            placeholder="Example: 280 Sun View Rd"
            value={formData.address}
            onChange={handleChange}
          />

          <input
            name="purchasePrice"
            placeholder="Purchase Price Example: 135000"
            value={formData.purchasePrice}
            onChange={handleChange}
          />

          <h2>Manual Comp Lookup</h2>

          <input
            name="comp1"
            placeholder="Comp 1 Sale Price Example: 250000"
            value={formData.comp1}
            onChange={handleChange}
          />

          <input
            name="comp2"
            placeholder="Comp 2 Sale Price Example: 260000"
            value={formData.comp2}
            onChange={handleChange}
          />

          <input
            name="comp3"
            placeholder="Comp 3 Sale Price Example: 270000"
            value={formData.comp3}
            onChange={handleChange}
          />

          {estimatedArv && (
            <div className="comp-box">
              Estimated ARV From Comps: {formatCurrency(estimatedArv)}
            </div>
          )}

          <button onClick={handleUseCompARV}>Use Comp ARV</button>

          <h2>Rehab Estimator</h2>

          {Object.keys(rehab).map((item) => (
            <div className="checkbox-item" key={item}>
              <label>
                <input
                  type="checkbox"
                  name={item}
                  checked={rehab[item]}
                  onChange={handleRehabChange}
                />
                {item.toUpperCase()} ({formatCurrency(rehabCosts[item])})
              </label>
            </div>
          ))}

          <div className="rehab-box">
            Estimated Repairs: {formatCurrency(estimatedRepairCost)}
          </div>

          <button onClick={useRehabEstimate}>Use Rehab Estimate</button>

          <h2>Deal Numbers</h2>

          <input
            name="arv"
            placeholder="ARV Example: 260000"
            value={formData.arv}
            onChange={handleChange}
          />

          <input
            name="repairs"
            placeholder="Repairs Example: 45000"
            value={formData.repairs}
            onChange={handleChange}
          />

          <input
            name="closingCosts"
            placeholder="Closing Costs Example: 5000"
            value={formData.closingCosts}
            onChange={handleChange}
          />

          <input
            name="assignmentFee"
            placeholder="Assignment Fee Example: 10000"
            value={formData.assignmentFee}
            onChange={handleChange}
          />

          <textarea
            name="notes"
            placeholder="Example: Motivated seller, needs quick close, vacant property."
            value={formData.notes}
            onChange={handleChange}
          />

          <div className="button-group">
            <button onClick={handleSubmit} disabled={loading}>
              {loading ? "Analyzing..." : "Analyze Deal"}
            </button>

            <button onClick={handleClearForm}>Clear Form</button>
          </div>
        </div>

        <div className="card">
          <h2>Deal Summary</h2>

          {dealMetrics ? (
            <div className="metrics">
              <p>
                <strong>MAO:</strong> {formatCurrency(dealMetrics.mao)}
              </p>
              <p>
                <strong>Profit:</strong> {formatCurrency(dealMetrics.profit)}
              </p>
              <p>
                <strong>ROI:</strong> {Number(dealMetrics.roi || 0).toFixed(2)}%
              </p>
              <p>
                <strong>Grade:</strong>{" "}
                <span className="grade">{dealMetrics.grade}</span>
              </p>
            </div>
          ) : (
            <p>Analyze a deal to see summary metrics.</p>
          )}

          <h2>AI Analysis</h2>

          <div className="result-box">
            {result || "Analyze a deal to see results."}
          </div>

          <button onClick={handleCopy}>Copy Seller Message</button>

          {copyStatus && <p>{copyStatus}</p>}

          <h2>Saved Deals</h2>

          <div className="saved-box">
            {savedDeals.length === 0 ? (
              <p>No saved deals yet.</p>
            ) : (
              savedDeals.map((deal) => (
                <div key={deal.id} className="saved-deal">
                  <strong>{deal.address}</strong>
                  <p>MAO: {formatCurrency(deal.mao)}</p>
                  <p>Profit: {formatCurrency(deal.estimatedProfit)}</p>

                  <button onClick={() => toggleCompare(deal.id)}>
                    {compareIds.includes(deal.id)
                      ? "Remove Compare"
                      : "Compare"}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="card comparison-card">
        <h2>Comparison</h2>

        {comparedDeals.length === 0 ? (
          <p>Select up to 3 saved deals to compare.</p>
        ) : (
          comparedDeals.map((deal) => (
            <div key={deal.id} className="compare-box">
              <h3>{deal.address}</h3>
              <p>Purchase Price: {formatCurrency(deal.purchasePrice)}</p>
              <p>ARV: {formatCurrency(deal.arv)}</p>
              <p>Repairs: {formatCurrency(deal.repairs)}</p>
              <p>MAO: {formatCurrency(deal.mao)}</p>
              <p>Profit: {formatCurrency(deal.estimatedProfit)}</p>
              <p>ROI: {Number(deal.roi || 0).toFixed(2)}%</p>
            </div>
          ))
        )}
      </div>

      <footer className="footer">
        <p>Built with React + Spring Boot + AI Real Estate Logic</p>
      </footer>
    </div>
  );
}

export default App;