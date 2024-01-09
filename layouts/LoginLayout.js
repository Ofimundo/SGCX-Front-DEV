import React, { useState } from "react";
import { Layout } from "antd";
import { LogoutLayout } from "../layouts";
import { useSession } from "next-auth/react";
import { Cargando, Navbar, Sidebar } from "../components";

export function LoginLayout({ children }) {
  const { Header, Content, Footer, Sider } = Layout;
  const { data: session, status } = useSession();

  const [responsivo, setResponsivo] = useState(true);

  /*
  //AL RENDERIZAR LA PAGINA POR 1° SE EJECUTA ESTO
  useEffect(() => {
    if (!session) {
      router.push("/");
    }
  }, [session]); // eslint-disable-line react-hooks/exhaustive-deps
  */

  if (status === "loading") return <Cargando />;
  if (status !== "authenticated") return <LogoutLayout />;

  return (
    <Layout hasSider>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        width={220}
        style={{
          background: "#003366",
          height: "100vh",
          position: "fixed",
          zIndex: 4,
        }}
        onBreakpoint={(broken) => {
          setResponsivo(broken);
        }}
      >
        <Sidebar />
      </Sider>
      <Layout
        style={{
          minHeight: "100vh",
          marginLeft: responsivo ? 0 : 220,
        }}
      >
        <Header
          style={{
            padding: 0,
          }}
        >
          <Navbar />
        </Header>
        <Content
          style={{
            padding: "2em",
            background: "#ebeeef",
            //marginLeft: 220,
          }}
        >
          <div
            style={{
              minWidth: "100%",
            }}
          >
            {children}
          </div>
        </Content>
        <Footer
          style={{
            textAlign: "center",
            background: "white",
            padding: "1.25em 0",
          }}
        >
          Creado con ❤ por Ofimundo TI
        </Footer>
      </Layout>
    </Layout>
  );
}
