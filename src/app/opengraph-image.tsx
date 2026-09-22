import { ImageResponse } from "next/og";

export const alt =
  "OPALIB — conhecimento para construir, preservar e compartilhar";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "center",
        background:
          "linear-gradient(135deg, #17142f 0%, #4f3b78 52%, #c77791 100%)",
        color: "#fffaf3",
        display: "flex",
        height: "100%",
        justifyContent: "center",
        padding: "80px",
        width: "100%",
      }}
    >
      <div
        style={{ display: "flex", flexDirection: "column", maxWidth: "960px" }}
      >
        <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: "0.18em" }}>
          OPALIB
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 600,
            lineHeight: 1.08,
            marginTop: 34,
          }}
        >
          Conhecimento para construir, preservar e compartilhar.
        </div>
      </div>
    </div>,
    size,
  );
}
