import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { Pagination, ReferralFormSchema, ReferralType } from "types";
import { useQuery } from "@apollo/client";
import { client } from "apollo/client";
import * as queries from "apollo/queries";
import { v4 as uuidv4 } from "uuid";

type Prop = {
  referralType: ReferralType;
  clientPagination: Pagination;
  brokerPagination: Pagination;
};

const ReferralForm = (props: Prop) => {
  //Get referral helpers
  const { referralType, clientPagination, brokerPagination } = props;

  //Get form controls
  const { register, handleSubmit, errors } = useForm({
    resolver: joiResolver(ReferralFormSchema),
  });

  //get form pre-population data by referralType using apollo hooks
  const { loading: loadingList, error: errorList, data: dataList } = useQuery(
    referralType === "client"
      ? queries.GET_CLIENT_LIST(clientPagination.page, clientPagination.limit)
      : queries.GET_BROKER_LIST(brokerPagination.page, brokerPagination.limit)
  );

  const { loading, error, data: prePopulationTemplate } = useQuery(
    referralType === "client"
      ? queries.GET_CLIENT(dataList?.users.data[0].id)
      : queries.GET_BROKER(dataList?.users.data[0].id)
  );

  const { user: referral } = prePopulationTemplate || {};

  //Implement on submit
  const onSubmit = (data) => {
    //If live, simply run mutations, but since client side, modify local cache
    //using these verbose steps

    //Generate new user Id
    const newId = uuidv4();

    //Use pre-polulation object as a user template
    const userTemplate = prePopulationTemplate;

    //create new user using template
    client.writeQuery(
      referralType === "client"
        ? {
            query: queries.GET_CLIENT(newId),
            data: { ...userTemplate, user: { ...userTemplate.user, ...data } },
          }
        : {
            query: queries.GET_BROKER(newId),
            data: { ...userTemplate, user: { ...userTemplate.user, ...data } },
          }
    );

    //Get current list of users
    const userList = client.readQuery(
      referralType === "client"
        ? {
            query: queries.GET_CLIENT_LIST(
              clientPagination.page,
              clientPagination.limit
            ),
          }
        : {
            query: queries.GET_BROKER_LIST(
              brokerPagination.page,
              brokerPagination.limit
            ),
          }
    );

    //update current list of users
    client.writeQuery(
      referralType === "client"
        ? {
            query: queries.GET_CLIENT_LIST(
              clientPagination.page,
              clientPagination.limit
            ),
            data: {
              users: {
                ...userList.users,
                data: [
                  ...userList.users.data,
                  {
                    __typename: "User",
                    id: newId,
                  },
                ],
              },
            },
          }
        : {
            query: queries.GET_BROKER_LIST(
              brokerPagination.page,
              brokerPagination.limit
            ),
            data: {
              users: {
                ...userList.users,
                data: [
                  ...userList.users.data,
                  {
                    __typename: "User",
                    id: newId,
                  },
                ],
              },
            },
          }
    );
  };

  return (
    <>
      {loading && <h2>Loading...</h2>}
      {referral && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <p>to {props.referralType}</p>
          <input
            type="text"
            placeholder="First Name"
            name="firstName"
            defaultValue={referral?.firstName}
            ref={register}
          />
          <input
            type="text"
            placeholder="Last name"
            name="lastName"
            defaultValue={referral?.lastName}
            ref={register}
          />
          <input
            type="tel"
            placeholder="Phone number"
            name="phoneNumber"
            defaultValue={referral?.phone}
            ref={register}
          />
          <input
            type="text"
            placeholder="Email"
            name="email"
            defaultValue={referral?.email}
            ref={register}
          />
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
                      defaultChecked={true}
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
      )}
    </>
  );
};

export default ReferralForm;
