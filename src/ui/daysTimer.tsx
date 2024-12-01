"use client"

import { useEffect, useState } from "react";
import { useTimer } from "react-timer-hook";

export function DaysTimer(props: {
  days: number;
}) {
  // const [mounted, setMounted] = useState(false);
  // useEffect(() => {
  //   setMounted(true);
  // });

  // Only show if expiry is GMT+7 at 12PM
  const expiryDate = new Date();
  expiryDate.setHours(12, 0, 0, 0);
  expiryDate.setDate(props.days);

  const { days, hours, minutes, seconds } = useTimer({
    expiryTimestamp: expiryDate,
  });

  // if (!mounted) return null;


  return (
    <div className="font-mono absolute bottom-2">
      {days}:{hours}:{minutes}:{seconds}
    </div>
  );
}