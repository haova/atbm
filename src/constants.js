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
  token: {
    unit: "token",
    value: 1,
  },
  stake: {
    unit: "stake",
    value: 1,
  },
  "ibc/B5CB286F69D48B2C4F6F8D8CF59011C40590DCF8A91617A5FBA9FF0A7B21307F": {
    unit: "token",
    value: 1,
  },
  "ibc/C053D637CCA2A2BA030E2C5EE1B28A16F71CCB0E45E8BE52766DC1B241B77878": {
    unit: "stake",
    value: 1,
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
