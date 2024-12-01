"use client";

import { useEffect, useState } from "react";

export function Mount(props: {
  children: React.ReactNode;
}) {



  return <>{props.children}</>;
}
