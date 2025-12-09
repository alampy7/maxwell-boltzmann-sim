import { useState, useEffect } from "react";
import MaxwellChart from "./MaxwellChart";
import './App.css';

//Se define el URL desde donde React hará peticiones al back
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
//Si falla el primero, intenta conectar localmente

function App() {
  //Se inicializan los datos por default
  const [T, setT] = useState(1.0);
  const [N, setN] = useState(5000);
  const [gas, setGas] = useState('Ar');
  const [bins, setBins] = useState(40);

  //Se recolectan los datos y se definen los estados y errores iniciales
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  //Se hace la petici+on a la API
  const fetchSimulation = async (Tvalue, Nvalue, gasValue, binsValue) => {
    setStatus("loading");
    setError(null);
    try {
      const params = new URLSearchParams({
        T: String(Tvalue),
        N: String(Nvalue),
        gas: gasValue,
        bins: String(binsValue),
      });

      //Se hace la petición al server donde está el back
      const url = API_BASE_URL.toString() + '/simulate?' + params.toString();
      console.log("Llamando a:", url); //Para verificar en la consola

      //Se crea la conexión. Si falla, se manda mensaje de error
      const res = await fetch(url);
      console.log('Mostrando el res',res);
      if (!res.ok) {
        throw new Error('Error HTTP ${res.status}');
      }

      //Se conecta con el JSON serializado por la API
      const json = await res.json();
      if (json.error) {
        throw new Error(json.error);
      }

      setData(json);
      setStatus('success');
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  };

  // Primera simulación al cargar
  useEffect(() => {
    fetchSimulation(T, N, gas, bins);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchSimulation(T, N, gas, bins);
  };

  //Todo lo que sigue es meramente React construyendo el front de la app
  return (
    <div
      style={{
        fontFamily: "system-ui, sans-serif",
        margin: "0 auto",
        padding: "1.5rem",
        textAlign: "center",
      }}
    >
      <h1>Simulador Maxwell–Boltzmann</h1>
      <p style={{ color: "#ccc", marginBottom: "1rem" }}>
        Elige los parámetros y consulta la simulación del backend en Python.
      </p>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "grid",
          gap: "0.75rem",
          marginBottom: "1.5rem",
        }}
      >
        <label>
          Temperatura T
          <input
            type="number"
            step="0.1"
            value={T}
            onChange={(e) => setT(Number(e.target.value))}
            style={{ width: "100%", padding: "0.4rem" }}
          />
        </label>

        <label>
          Número de partículas N
          <input
            type="number"
            value={N}
            onChange={(e) => setN(Number(e.target.value))}
            style={{ width: "100%", padding: "0.4rem" }}
          />
        </label>

        <label>
          Gas
          <select
           value={gas}
           onChange={(e) => setGas(e.target.value)}
           style={{ width: '100%', padding: '0.4rem' }}
          >
          <option value='He'>Helio (He)</option>
          <option value='Ne'>Neón (Ne)</option>
          <option value='Ar'>Argón (Ar)</option>
          <option value='Xe'>Xenón (Xe)</option>
          <option value='N2'>Nitrógeno (N2)</option>
          <option value='O2'>Oxígeno (O2)</option>
          </select>
        </label>

        <label>
          Número de bins
          <input
            type="number"
            value={bins}
            onChange={(e) => setBins(Number(e.target.value))}
            style={{ width: "100%", padding: "0.4rem" }}
          />
        </label>

        <button
          type="submit"
          style={{
            padding: "0.5rem 1rem",
            cursor: "pointer",
            marginTop: "0.5rem",
          }}
        >
          Simular
        </button>
      </form>

      {status === "loading" && <p>Calculando...</p>}
      {status === "error" && (
        <p style={{ color: "red" }}>Ocurrió un error: {error}</p>
      )}

      {status === "success" && data && (
        <div>
          <h2>Resultado</h2>
          <p>
            Gas = <strong>{gas}</strong>, T = <strong>{T}</strong>, N = <strong>{N}</strong>, bins ={" "}
            <strong>{bins}</strong>
          </p>

          <MaxwellChart data={data} />
        </div>
      )}
    </div>
  );
}

export default App;