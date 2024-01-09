import NextAuth from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";
import { obtenerPerfil, obtenerPermisos } from "../../../apis";

export const authOptions = {
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
      tenantId: process.env.AZURE_AD_TENANT_ID,
    }),
    // ...add more providers here
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        //token.id_token = account.id_token;
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.id_token = token.accessToken;

      const profile = await obtenerPerfil(token.accessToken);
      session.profile = profile;

      const permissions = await obtenerPermisos(token.accessToken);
      session.permissions = permissions;

      return session;
    },
  },
  // Agrega la configuración de sesión JWT aquí
  session: {
    jwt: true,
  },
};
export default NextAuth(authOptions);
