import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <h1 style={{ color: "#fff" }}>Not Found</h1>
      <Link to={"/"}>Home</Link>
    </div>
  );
}
