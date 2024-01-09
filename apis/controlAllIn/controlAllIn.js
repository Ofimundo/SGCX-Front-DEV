export async function obtenerEquiposDesconectados(sistema, token) {
  try {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/equipos-desconectados/${sistema}`;
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

export async function obtenerDatosContacto(serie, token) {
  try {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/equipos-desconectados-contacto/${serie}`;
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

export async function enviarCorreoEquiposDesconectados(contactos, token) {
  try {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/equipos-desconectados/''`;
    const params = {
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(contactos),
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
