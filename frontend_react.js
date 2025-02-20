import { useState, useEffect } from "react";

export default function MaterialCalculator() {
  const [materials, setMaterials] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [shape, setShape] = useState("válec");
  const [dimensions, setDimensions] = useState({ radius: "", height: "", width: "", depth: "" });
  const [result, setResult] = useState(null);
  const [newMaterial, setNewMaterial] = useState({ name: "", density: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/materials")
      .then((res) => res.json())
      .then((data) => setMaterials(Object.keys(data)));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/calculate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        material: selectedMaterial,
        shape,
        ...dimensions,
      }),
    });
    const data = await response.json();
    setResult(data.mass_kg ? \`\${data.mass_kg} kg\` : "Chyba ve výpočtu");
  };

  const handleAddMaterial = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/add_material", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newMaterial),
    });
    const data = await response.json();
    setMessage(data.message || data.error);
    if (data.message) {
      setMaterials([...materials, newMaterial.name]);
      setNewMaterial({ name: "", density: "" });
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto bg-white rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Výpočet hmotnosti materiálu</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <select value={selectedMaterial} onChange={(e) => setSelectedMaterial(e.target.value)} className="w-full p-2 border rounded">
          <option value="">Vyberte materiál</option>
          {materials.map((mat) => (
            <option key={mat} value={mat}>{mat}</option>
          ))}
        </select>

        <button className="w-full bg-blue-500 text-white p-2 rounded" type="submit">Spočítat</button>
      </form>
      {result && <p className="mt-4 text-lg font-semibold">Výsledek: {result}</p>}
    </div>
  );
}