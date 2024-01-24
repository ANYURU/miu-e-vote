function getRemainingTime(targetDate) {
  const now = new Date().getTime();
  const targetTime = new Date(targetDate).getTime();
  const timeRemaining = targetTime - now;

  const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

  const formattedCountDown = { days, hours, minutes, seconds };
  return formattedCountDown;
}

export { getRemainingTime };
