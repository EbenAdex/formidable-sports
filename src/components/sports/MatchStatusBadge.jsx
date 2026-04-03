function MatchStatusBadge({ match }) {
  let label = match.status;

  if (match.postponed) {
    label = "Postponed";
  }

  return (
    <span className={`match-badge match-badge--${label.toLowerCase().replace(/\s+/g, "-")}`}>
      {label}
    </span>
  );
}

export default MatchStatusBadge;