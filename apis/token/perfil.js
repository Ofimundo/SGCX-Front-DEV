export async function obtenerPerfil(token) {
  try {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/perfil`;
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
      throw new Error(result.error);
    }
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function obtenerPermisos(token) {
  try {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/permisos`;
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
      throw new Error(result.error);
    }
  } catch (error) {
    throw new Error(error.message);
  }
}
