import Cookies from "js-cookie";
let token = Cookies.get("token"); 

export const Auth = {};
export const header = {
  "Content-Type": "application/json",
  token: token,
};
