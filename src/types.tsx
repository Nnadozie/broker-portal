import Joi from "joi";

export const routes = {
  root: "/",
  noMatch: "*",
  referrals: {
    client: "/referrals/client-referrals",
    agent: "/referrals/broker-referrals",
  },
};

export type ReferralType = "client" | "broker" | undefined;

export const ReferralFormSchema = Joi.object({
  firstName: Joi.string().required().max(80).min(1),
  lastName: Joi.string().required().max(100).min(1),
  phoneNumber: Joi.string()
    .pattern(/^[0-9-()+ ]*$/i)
    .required(),
  email: Joi.string()
    .pattern(/^\S+@\S+$/i)
    .required(),
  zip: Joi.string()
    .pattern(/^\d{5}(?:[-\s]\d{4})?$/i)
    .required(),
  referralInterest: Joi.array().items(Joi.string()).min(1),
  notes: Joi.string().allow(null, ""),
});

export type Pagination = {
  page: number;
  limit: number;
};
