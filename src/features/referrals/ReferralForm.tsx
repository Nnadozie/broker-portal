import React from "react";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { Pagination, ReferralFormSchema, ReferralType } from "types";
import { useQuery } from "@apollo/client";
import { client } from "apollo/client";
import * as queries from "apollo/queries";
import { v4 as uuidv4 } from "uuid";
import styles from "./Referrals.module.css";

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
      {JSON.stringify(error) || JSON.stringify(errorList)}
      {referral && (
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <p className={styles.link}>Add {props.referralType} referral</p>

          <label
            className={styles.link}
            style={{ fontSize: "1.5rem", border: 0 }}
          >
            Referral's information
          </label>
          <input
            type="text"
            placeholder="First Name"
            name="firstName"
            defaultValue={referral?.firstName}
            ref={register}
          />
          {errors.firstName && errors.firstName.message}
          <input
            type="text"
            placeholder="Last name"
            name="lastName"
            defaultValue={referral?.lastName}
            ref={register}
          />
          {errors.lastName && errors.lastName.message}

          <input
            type="tel"
            placeholder="Phone number"
            name="phoneNumber"
            defaultValue={referral?.phone}
            ref={register}
          />
          {errors.phoneNumber && errors.phoneNumber.message}

          <input
            type="text"
            placeholder="Email"
            name="email"
            defaultValue={referral?.email}
            ref={register}
          />
          {errors.email && errors.email.message}

          <input type="text" placeholder="Zip" name="zip" ref={register} />
          {errors.zip && errors.zip.message}

          <label
            className={styles.link}
            style={{ fontSize: "1.5rem", border: 0 }}
          >
            Referral's interest
          </label>
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
          {errors.referralInterest && errors.referralInterest.message}

          <label
            className={styles.link}
            style={{ fontSize: "1.5rem", border: 0 }}
          >
            Notes
          </label>
          <textarea name="notes" placeholder="Add Notes" ref={register} />
          {errors.notes && errors.notes.message}

          <button
            type="submit"
            className={"btn"}
            style={{
              marginTop: "2rem",
              width: "100%",
              textAlign: "center",
              padding: "1rem 0",
              fontWeight: 700,
              fontSize: "1rem",
            }}
          >
            Add referral
          </button>
        </form>
      )}
    </>
  );
};

export default ReferralForm;
