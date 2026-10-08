import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MasterMarinerPro",
    short_name: "MasterMarinerPro",
    description: "Marine Studies Quiz App",
    start_url: "/topics",
    display: "standalone",
    background_color: "#091f3b",
    theme_color: "#091f3b",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  }
}
