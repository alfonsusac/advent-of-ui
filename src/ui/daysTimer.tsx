"use client"

import { useTimer } from "react-timer-hook";

export function DaysTimer(props: {
  days: number;
}) {
  const tomorrowsDate = new Date().getDate() + 1;
  if (props.days !== tomorrowsDate) {
    return null;
  }

  // Only show if expiry is GMT+7 at 12PM
  const expiryDate = new Date();
  expiryDate.setHours(12, 0, 0, 0);
  expiryDate.setDate(props.days);

  const { days, hours, minutes, seconds } = useTimer({
    expiryTimestamp: expiryDate,
  });

  // render DD:hh:mm:ss

  return (
    <div className="font-mono">
      {days}:{hours}:{minutes}:{seconds}
    </div>
  );
}