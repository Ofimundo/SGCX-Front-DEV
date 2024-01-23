import React, { useState } from "react";
import { Search } from "semantic-ui-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { listarTicketFiltrado } from "../../apis";

export function BuscadorTicket() {
  const router = useRouter();
  const { data: session } = useSession();
  const [tickets, setTickets] = useState([]);

  const buscarPorTicket = async (value) => {
    if (value.length >= 3) {
      const filtro = await listarTicketFiltrado(value, session.id_token);
      setTickets(filtro);
    }
  };

  return (
    <>
      <Search
        aligned="right"
        minCharacters={3}
        placeholder="Buscar ticket o asunto"
        noResultsMessage={"No hay datos"}
        onResultSelect={(e, { result }) =>
          router.push(`/mesa-ayuda/tickets/detalle/${result.content}`)
        }
        onSearchChange={(e, { value }) => buscarPorTicket(value)}
        results={tickets}
      />
    </>
  );
}
