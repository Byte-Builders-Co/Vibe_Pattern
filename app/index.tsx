import { Redirect } from "expo-router";

export default function Index() {
  return <Redirect href="/user/UserScreen" />;
  // return <Redirect href="/admin/AdminScreen" />;
}
