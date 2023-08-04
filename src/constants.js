export const RPC = {
  cosmos: "https://rpc.cosmos.directory/cosmoshub",
  osmo: "https://rpc.osmosis.zone:443",
  chaina: "http://0.0.0.0:26657",
  chainb: "http://0.0.0.0:26658",
};

export const DENOM = {
  uatom: {
    unit: "ATOM",
    value: 0.000001,
  },
  "ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2": {
    unit: "ATOM",
    value: 0.000001,
  },
};

export const CHAIN = {
  cosmos: {
    name: "Cosmos Hub",
    prefix: "cosmos",
  },
  osmosis: {
    name: "Osmosis",
    prefix: "osmo",
  },
  chaina: {
    name: "Chain A",
    prefix: "chaina",
  },
  chainb: {
    name: "Chain B",
    prefix: "chainb",
  },
};
