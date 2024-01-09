export async function descargarReportes(tipo, filtro, token) {
  try {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/reportes/${tipo}/${filtro}`;
    const params = {
      method: "GET",
      headers: {
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await fetch(url, params);

    if (response.ok) {
      const blob = await response.blob();
      const link = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = link;

      const nombre = response.headers
        .get("Content-Disposition")
        .split("filename=")[1];
      a.download = nombre;
      a.click();
    } else {
      const result = await response.json();
      throw new Error(result.message);
    }
  } catch (error) {
    throw new Error(error.message);
  }
}
