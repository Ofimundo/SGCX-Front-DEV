export function obtenerIdsPerfil(data, codigo) {
  if (!Array.isArray(codigo)) {
    codigo = [codigo];
  }
  const idsEncontradas = data.some((item) =>
    codigo.includes(parseInt(item.prfl))
  );

  return idsEncontradas;
}

export function obtenerPermisos(data, codigo) {
  const funcionEncontrada = data.find(
    (funcion) => funcion.func === codigo.toString()
  );
  const estadoFuncion = funcionEncontrada ? !funcionEncontrada.est : true;
  return estadoFuncion;
}
