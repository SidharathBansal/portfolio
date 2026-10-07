import { ImageResponse } from "next/og";
import { profile } from "@/data/profile";

export const alt = `${profile.name}, ${profile.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const [first, last] = profile.name.split(" ");
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#07090c",
          backgroundImage: "radial-gradient(rgba(255,255,255,0.07) 1.5px, transparent 1.5px)",
          backgroundSize: "28px 28px",
          color: "#f3f5f8",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 26, color: "#7c8696", fontFamily: "monospace" }}>
          <span style={{ color: "#3fb950" }}>~</span>
          <span style={{ marginLeft: 12 }}>% whoami</span>
          <span style={{ marginLeft: 16, color: "#b2bbc9" }}>{profile.handle}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 132, fontWeight: 700, letterSpacing: -6, lineHeight: 0.95 }}>{first}</div>
          <div style={{ display: "flex", fontSize: 132, fontWeight: 700, letterSpacing: -6, lineHeight: 0.95 }}>
            {last}
            <span style={{ color: "#8ab4ff" }}>.</span>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 30 }}>
          <span style={{ color: "#b2bbc9" }}>{profile.tagline}</span>
          <span style={{ display: "flex", alignItems: "center", fontSize: 24, color: "#7c8696", fontFamily: "monospace" }}>
            <span style={{ width: 14, height: 14, borderRadius: 7, background: "#3fb950", marginRight: 14 }} />
            {profile.current.title} @ {profile.current.company}
          </span>
        </div>
      </div>
    ),
    size,
  );
}
