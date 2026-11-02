import React from "react";

export const CraftSteps: React.FC = () => {
  return (
    <section className="sec frame craft" id="craft" aria-labelledby="craftT">
      <div className="grid">
        <div className="ph rv in">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/whites.jpg" alt="A batsman in whites playing a drive" loading="lazy" />
        </div>
        <div className="tx">
          <h2 id="craftT" className="rv in">
            Made by hand
          </h2>
          <p className="rv in" style={{ color: "var(--muted)", maxWidth: "44ch" }}>
            Every Kricks bat goes from a split cleft of willow to a knocked-in bat in five steps,
            each done by hand.
          </p>
          <ol>
            <li className="rv in">
              <span className="n">01</span>
              <span>
                <b>Cleft</b>
                <span>Willow is split along the grain, never sawn across it.</span>
              </span>
            </li>
            <li className="rv in">
              <span className="n">02</span>
              <span>
                <b>Air-dried</b>
                <span>Clefts dry slowly until the moisture is right for pressing.</span>
              </span>
            </li>
            <li className="rv in">
              <span className="n">03</span>
              <span>
                <b>Pressed</b>
                <span>Rollers compress the face so it holds together under the ball.</span>
              </span>
            </li>
            <li className="rv in">
              <span className="n">04</span>
              <span>
                <b>Shaped</b>
                <span>Spine, edges and toe are shaped with draw-knife and spokeshave.</span>
              </span>
            </li>
            <li className="rv in">
              <span className="n">05</span>
              <span>
                <b>Knocked in</b>
                <span>Oiled and knocked in with a mallet, ready for the nets.</span>
              </span>
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
};

