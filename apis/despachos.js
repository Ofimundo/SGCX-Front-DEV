export async function listarDespachos(fechaInicio, fechaFin, token) {
  try {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/despachos/${fechaInicio}/${fechaFin}`;
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

export async function seguimientoDespachos(
  courrier,
  numero,
  referencia,
  token
) {
  try {
    const opcional = courrier !== "FEDEX" ? referencia : null;

    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/despachos-seguimiento/${courrier}/${numero}/${opcional}`;
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
