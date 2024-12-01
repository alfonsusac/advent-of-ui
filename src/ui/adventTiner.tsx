"use client"

import { useTimer } from "react-timer-hook";

export function AdventTimer() {

  const {
    days,
    hours,
    minutes,
    seconds,
  } = useTimer({
    expiryTimestamp: new Date('Dec 25, 2024 00:00:00'),

    // TODO - Confetti
    onExpire: () => console.warn('onExpire called'),
  })

  return (
    <div className="flex flex-row gap-2 items-end tracking-tight">
      <div className="text-3xl font-bold">{days}</div>
      <div className="-translate-x-2 -translate-y-0.5 font-black text-gray-600 opacity-40">
        D
      </div>
      <div className="text-3xl font-bold">{hours}</div>
      <div className="-translate-x-2 -translate-y-0.5 font-black text-gray-600 opacity-40">
        H
      </div>
      <div className="text-3xl font-bold">{minutes}</div>
      <div className="-translate-x-2 -translate-y-0.5 font-black text-gray-600 opacity-40">
        M
      </div>
      <div className="text-3xl font-bold">{seconds}</div>
      <div className="-translate-x-2 -translate-y-0.5 font-black text-gray-600 opacity-40">
        S
      </div>
    </div>
  );
}