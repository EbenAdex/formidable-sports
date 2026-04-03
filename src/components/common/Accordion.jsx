import { useState } from "react";

function Accordion({ items = [] }) {
  const [openId, setOpenId] = useState(null);

  const toggleItem = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="accordion">
      {items.map((item) => (
        <div className="accordion__item" key={item.id}>
          <button
            type="button"
            className="accordion__button"
            onClick={() => toggleItem(item.id)}
          >
            <span>{item.question}</span>
            <span>{openId === item.id ? "−" : "+"}</span>
          </button>

          {openId === item.id && (
            <div className="accordion__content">
              <p>{item.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default Accordion;