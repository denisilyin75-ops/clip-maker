const API_BASE = "http://localhost:8000";

export async function uploadAudio(
  file: File
): Promise<{
  filename: string;
  originalName: string;
  duration: number;
  waveformData: number[];
}> {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch(`${API_BASE}/api/upload/audio`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || "Upload failed");
  }

  return res.json();
}
