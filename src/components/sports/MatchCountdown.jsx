function MatchCountdown({ match }) {
  if (match.status !== "Upcoming" || match.postponed) {
    return null;
  }

  const kickoffDateTime = new Date(`${match.date} ${match.kickoffTime}`);
  const now = new Date();
  const diff = kickoffDateTime - now;

  if (Number.isNaN(kickoffDateTime.getTime()) || diff <= 0) {
    return <p className="match-countdown">Kickoff time reached.</p>;
  }

  const totalMinutes = Math.floor(diff / 1000 / 60);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  return (
    <p className="match-countdown">
      Kickoff in: {days > 0 ? `${days}d ` : ""}
      {hours}h {minutes}m
    </p>
  );
}

export default MatchCountdown;