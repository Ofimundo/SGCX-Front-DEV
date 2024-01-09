export function generarOpcionesDropdown(array, objeto1, objeto2) {
  return array.map((obj) => ({
    key: obj[objeto1],
    text: obj[objeto2 ? objeto2 : objeto1],
    value: obj[objeto1],
  }));
}

export function calcularMinutos(fecha) {
  var fechaActual = new Date();
  var fechaTicket = new Date(fecha?.replace("GMT", ""));
  var minutos = (fechaActual - fechaTicket) / 60000;

  if (minutos <= 45) {
    return "green";
  } else if (minutos <= 60) {
    return "yellow";
  } else {
    return "red";
  }
}

export function convertirMinutosAHorasYMinutos(minutos) {
  if (minutos >= 60) {
    const horas = Math.floor(minutos / 60);
    const minutosRestantes = minutos % 60;
    return `${horas}h ${minutosRestantes}min`;
  } else {
    return `${minutos}min`;
  }
}

export function generarURL(pathanme, parametros, array) {
  delete parametros.tickets;
  const nuevoArray = { ...parametros, ...array };

  const baseUrl = [];
  for (const key in nuevoArray) {
    if (nuevoArray.hasOwnProperty(key)) {
      baseUrl.push(`${key}=${nuevoArray[key]}`);
    }
  }

  if (pathanme.includes("?")) {
    return pathanme + "&" + baseUrl.join("&");
  } else {
    return pathanme + "?" + baseUrl.join("&");
  }
}

export function obtenerColorEstado(estado) {
  switch (Number(estado)) {
    case 1:
      return "red";
    case 3:
      return "blue";
    case 4:
      return "orange";
    case 5:
      return "purple";
    case 6:
      return "teal";
    case 7:
      return "green";
    case 8:
      return "brown";
    default:
      return "grey";
  }
}
