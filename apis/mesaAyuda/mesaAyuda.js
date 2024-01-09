export async function obtenerCategoriasIncidentes(token) {
  try {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/categorias-incidentes`;
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

export async function obtenerClienteOSerie(categoria, filtro, token) {
  try {
    const formData = new FormData();
    formData.append("categoria", categoria);
    formData.append("filtro", filtro);

    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/obtener-cliente-serie`;
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

export async function obtenerAreasYResponsables(token) {
  try {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/obtener-areas-responsable`;
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

export async function obtenerTiposContactos(token) {
  try {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tipo-contacto`;
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

export async function generarTicket(datos, token) {
  try {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/generar-ticket`;
    const params = {
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(datos),
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

export async function listarTickets(filtros, token) {
  try {
    const filtroEstado = filtros?.estado || null;
    const filtroUsuario = filtros?.responsable || null;
    const filtroPeriodo = filtros?.periodo || null;

    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tickets/${filtroEstado}/${filtroUsuario}/${filtroPeriodo}`;
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

export async function listarDetalleTicket(ticket, token) {
  try {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tickets-detalle/${ticket}`;
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

export async function resumenTickets(periodo, token) {
  try {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/resumen-tickets/${periodo}`;
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

export async function actualizarTicket(datos, token) {
  try {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tickets/''/''/''`;
    const params = {
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(datos),
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

export async function actualizarSerieTicket(ticket, token) {
  try {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tickets/''/''/''`;
    const params = {
      method: "PUT",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(ticket),
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

export async function listarEstadoTicket(token) {
  try {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/estado-ticket`;
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

export async function agregarComentarioTicket(ticket, token) {
  try {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/comentario-ticket/${ticket}`;
    const params = {
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(ticket),
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

export async function listarHistorialTicket(ticket, ordenar, token) {
  try {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/historial-ticket/${ticket}/${ordenar}`;
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

export async function listarTipificacionProblema(token) {
  try {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tipificacion`;
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

export async function listarDatosContacto(codCliente, token) {
  try {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/contactos/${codCliente}`;
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

export async function listarTicketUsuarios(token) {
  try {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/ticket-usuario`;
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

export async function listarCorreosRespuesta(ticket, token) {
  try {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/ticket-correos/${ticket}`;
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

export async function resumenCardsTickets(token) {
  try {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/resumen-tarjetas`;
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

export async function listarTicketsRecientes(token) {
  try {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tickets-resumen`;
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

export async function listarTicketFiltrado(ticket, token) {
  try {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tickets-filtro/${ticket}`;
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

export async function obtenerSiguienteTicket(ticket, tipo, token) {
  try {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tickets-siguiente/${ticket}/${tipo}`;
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
