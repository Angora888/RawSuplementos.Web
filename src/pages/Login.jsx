import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const iniciarSesion = async (e) => {
    e.preventDefault();
    setError("");
    setCargando(true);

    try {
      const response = await api.post("/Auth/login", { email, password });
      const { token, usuario } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("usuario", JSON.stringify(usuario));

      navigate(usuario?.rol === "SuperAdmin" ? "/superadmin" : "/dashboard", { replace: true });
    } catch (error) {
      console.error(error);
      setError(error.response?.data || "No fue posible iniciar sesión.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">SaaS</div>
        <h1>Administración</h1>
        <p>Ingresa para administrar tu negocio.</p>

        <form onSubmit={iniciarSesion}>
          <div className="form-group">
            <label>Correo</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="correo@negocio.com" required />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
          </div>

          {error && <div className="login-error">{error}</div>}

          <button type="submit" disabled={cargando}>
            {cargando ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
