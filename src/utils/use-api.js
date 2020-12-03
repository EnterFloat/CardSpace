import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

export const apiCall = (options) => {
  const { url, token, ...fetchOptions } = options;
  return new Promise((resolve, reject) => {
    try {
      fetch(url, {
        ...fetchOptions,
        headers: {
          ...fetchOptions.headers,
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          console.log(res);
          resolve({ data: res, error: null, loading: false });
        })
        .catch((err) => {
          return reject({
            err,
            loading: false,
          });
        });
    } catch (err) {
      return reject({
        err,
        loading: false,
      });
    }
  });
};
