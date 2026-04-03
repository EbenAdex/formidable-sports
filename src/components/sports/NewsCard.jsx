function NewsCard({ item }) {
  return (
    <article className="news-card">
      <img src={item.image} alt={item.title} className="news-card__img" />

      <div className="news-card__body">
        <p className="news-card__meta">{item.category}</p>
        <h3>{item.title}</h3>
        <p>{item.excerpt}</p>
      </div>
    </article>
  );
}

export default NewsCard;