export async function obtenerUsuarios(token) {
  try {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/usuarios`;
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

export async function obtenerPerfilUsuario(data, token) {
  try {
    const formData = new FormData();
    formData.append("usuario", data);

    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/obtener-perfil-usuario`;
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

export async function obtenerFuncionPerfil(data, token) {
  try {
    const formData = new FormData();
    formData.append("perfil", data);

    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/obtener-funcion-perfil`;
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

export async function actualizarPerfilUsuario(data, token) {
  try {
    const formData = new FormData();
    formData.append("usuario", data.usuario);
    formData.append("tipo", data.tipo);
    formData.append("idPerfil", data.perfiles);

    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/actualizar-perfil-usuario`;
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

export async function actualizarFuncionPerfil(data, token) {
  try {
    const formData = new FormData();
    formData.append("idPerfil", data.perfil);
    formData.append("tipo", data.tipo);
    formData.append("idFuncion", data.funciones);

    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/actualizar-funcion-perfil`;
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

export async function crearNuevoUsuario(data, token) {
  try {
    const formData = new FormData();
    formData.append("usuarioCodigo", data.usuarioCodigo);
    formData.append("usuarioNombre", data.usuarioNombre);
    formData.append("usuarioApellido", data.usuarioApellido);

    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/crear-usuario`;
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
