export const routes = {
  root: "/",
  noMatch: "*",
  referrals: {
    client: "/referrals/client-referrals",
    agent: "/referrals/broker-referrals",
  },
};

export type ReferralType = "client" | "broker" | undefined;
