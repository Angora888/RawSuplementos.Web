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
      const response = await api.post("/Auth/login", {
        email,
        password,
      });

      const { token, usuario } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem(
        "usuario",
        JSON.stringify(usuario)
      );

      navigate("/dashboard");
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data ||
          "No fue posible iniciar sesión."
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-logo">
          RAW
        </div>

        <h1>RAW Suplementos</h1>

        <p>
          Administración de ventas e inventario
        </p>

        <form onSubmit={iniciarSesion}>

          <div className="form-group">
            <label>Correo</label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="admin@rawsuplementos.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Contraseña</label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={cargando}
          >
            {cargando
              ? "Ingresando..."
              : "Ingresar"}
          </button>

        </form>

      </div>
    </div>
  );
}

export default Login;