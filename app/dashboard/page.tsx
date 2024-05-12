import { auth } from "@clerk/nextjs/server";
import React from "react";

export default function Dashboard() {
  const { userId } = auth();
  return <div>{userId}</div>;
}
