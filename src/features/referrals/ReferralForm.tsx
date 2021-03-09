import React from "react";
import { useForm } from "react-hook-form";
import Joi from "joi";
import { joiResolver } from "@hookform/resolvers/joi";
import { ReferralType } from "types";

type Prop = {
  referralType: ReferralType;
};

const schema = Joi.object({
  firstName: Joi.string().required().max(80).min(1),
  lastName: Joi.string().required().max(100).min(1),
  phoneNumber: Joi.string()
    .pattern(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im)
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

const ReferralForm = (props: Prop) => {
  //Get form controls
  const { register, handleSubmit, errors } = useForm({
    resolver: joiResolver(schema),
  });
  const onSubmit = (data) => console.log(data);
  console.log(errors);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <p>to {props.referralType}</p>
      <input
        type="text"
        placeholder="First name"
        name="firstName"
        ref={register}
      />
      <input
        type="text"
        placeholder="Last name"
        name="lastName"
        ref={register}
      />
      <input
        type="tel"
        placeholder="Phone number"
        name="phoneNumber"
        ref={register}
      />
      <input type="text" placeholder="Email" name="email" ref={register} />
      <input type="text" placeholder="Zip" name="zip" ref={register} />
      <fieldset style={{ float: "left" }}>
        <legend>Referral's Interest</legend>
        {"Health Insurance,Ancillary Products,Medicare,Short Term Medical"
          .split(",")
          .map((interest, index) => {
            return (
              <label key={interest}>
                <input
                  type="checkbox"
                  value={interest}
                  name={"referralInterest"}
                  ref={register}
                />
                {interest}
              </label>
            );
          })}
      </fieldset>
      <textarea name="notes" placeholder="Add Notes" ref={register} />

      <input type="submit" />
    </form>
  );
};

export default ReferralForm;
