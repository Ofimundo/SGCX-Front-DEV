//VALIDAR INPUTS PARA INGRESAR SOLO NUMEROS
export function soloNumeros(event) {
  if (!/[0-9.]/.test(event.key)) {
    event.preventDefault();
  }
}

//FORMATEAR NUMEROS A PESOS
export function formatearPesos(setValue) {
  const formatter = new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
  });

  return (e) => {
    const rawValue = e.target.value;
    const parsedValue = parseFloat(rawValue.replace(/\D/g, ""));
    if (isNaN(parsedValue)) {
      setValue("");
      return;
    }
    const formattedValue = formatter.format(parsedValue);
    setValue(formattedValue);
  };
}

//FORMATEAR NUMEROS A DOLAR
export function formatearDolar(setValue) {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  return (e) => {
    const rawValue = e.target.value;
    const parsedValue = parseFloat(rawValue.replace(/\D/g, ""));
    if (isNaN(parsedValue)) {
      setValue("");
      return;
    }
    const formattedValue = formatter.format(parsedValue);
    setValue(formattedValue);
  };
}

/*
export default function CurrencyConverter() {
  const rawValue = e.target.value;
    const formattedValue = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(rawValue);
    setDollarValue(formattedValue);
*/

//EVITAR PEGAR EN LOS INPUTS
export function noPegar(event) {
  event.preventDefault();
}
