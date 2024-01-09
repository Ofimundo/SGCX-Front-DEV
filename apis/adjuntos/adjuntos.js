export async function subirDocumentos(archivo, token) {
  try {
    const formData = new FormData();
    formData.append("archivo", archivo);

    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/subir-adjuntos`;
    const params = {
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    };

    const response = await fetch(url, params);

    if (response.ok) {
      const result = await response.json();
      return result;
    } else {
      const result = await response.json();
      throw new Error(result.message);
    }
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function listarDocumentos(archivo, token) {
  try {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/listar-adjuntos/${archivo}`;
    const params = {
      method: "GET",
      headers: {
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await fetch(url, params);

    if (response.ok) {
      const result = await response.json();
      return result;
    } else {
      const result = await response.json();
      throw new Error(result.message);
    }
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function descargarDocumentos(nombre, token) {
  try {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/descargar-adjuntos/${nombre}`;
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
      window.open(link, "_blank");
      /*
      const a = document.createElement("a");
      a.href = link;
      a.download = nombre;
      a.click();
      */
    } else {
      const result = await response.json();
      throw new Error(result.message);
    }
  } catch (error) {
    throw new Error(error.message);
  }
}
