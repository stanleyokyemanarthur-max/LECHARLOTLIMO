import React from "react";

function PageHero({ eyebrow, title, description, action }) {
  return (
    <header className="lc-page-hero">
      <div className="lc-page-hero__content">
        <p className="lc-kicker">{eyebrow}</p>
        <h1 className="lc-page-hero__title">{title}</h1>
        {description && <p className="lc-page-hero__description">{description}</p>}
        {action}
      </div>
    </header>
  );
}

export default PageHero;
