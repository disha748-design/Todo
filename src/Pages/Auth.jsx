import { useState } from "react";
import { supabase } from "../supabaseClient";
import "./Auth.css";

export default function Auth({ onLogin }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    // Check if user exists
    const { data: existingUser, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      setErrorMsg(fetchError.message);
      setLoading(false);
      return;
    }

    if (existingUser) {
      // Login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) setErrorMsg(error.message);
      else onLogin(data.user);
    } else {
      // Sign up
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        setErrorMsg(signUpError.message);
        setLoading(false);
        return;
      }

      // Insert into users table
      await supabase.from("users").insert([{ id: signUpData.user.id, email, username }]);

      // Direct login
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) setErrorMsg(loginError.message);
      else onLogin(loginData.user);
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Welcome</h1>
        <p>Sign up or log in with your account</p>
        <form onSubmit={handleAuth}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Processing..." : "Continue"}
          </button>
        </form>
        {errorMsg && <p className="error">{errorMsg}</p>}
      </div>
    </div>
  );
}
