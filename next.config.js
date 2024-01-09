module.exports = () => {
  const rewrites = () => {
    return [
      {
        source: "/api/pokemon/:path*",
        destination: "https://pokeapi.co/api/v2/:path*",
      },
    ];
  };
  return {
    rewrites,
  };
};
