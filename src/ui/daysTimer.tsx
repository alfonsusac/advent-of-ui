"use client"

import { useEffect, useState } from "react";
import { useTimer } from "react-timer-hook";

export function DaysTimer(props: {
  days: number;
}) {
  // Only show if expiry is GMT+7 at 12PM
  const expiryDate = new Date(
    Date.UTC(new Date().getFullYear(), 11, props.days , 5, 0)
  );

  const { days, hours, minutes, seconds } = useTimer({
    expiryTimestamp: expiryDate,
  });

  if (days > 1) return null

  return (
    <div className="font-mono absolute bottom-2">
      {days}:{hours}:{minutes}:{seconds}
    </div>
  );
}