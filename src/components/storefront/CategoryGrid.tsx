import React from "react";
import Link from "next/link";

export const CategoryGrid: React.FC = () => {
  return (
    <section className="sec frame" id="shop-cats" aria-labelledby="catT">
      <div className="head">
        <h2 id="catT" className="rv in">
          Shop by category
        </h2>
        <p className="rv in">
          From match-day English willow to the street tape-ball bat, and everything you carry to
          the crease.
        </p>
      </div>

      <div className="cats">
        <Link className="cat rv in" href="/leather-bats">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/ball.jpg" alt="" loading="lazy" />
          <div className="in">
            <div>
              <h3>Leather bats</h3>
              <p>English &amp; Kashmir willow</p>
            </div>
            <span className="go">→</span>
          </div>
        </Link>

        <Link className="cat rv in" href="/custom-bat">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/batsman.jpg" alt="" loading="lazy" />
          <div className="in">
            <div>
              <h3>Customised bat</h3>
              <p>Your name on the blade</p>
            </div>
            <span className="go">→</span>
          </div>
        </Link>

        <Link className="cat rv in" href="/tennis-bats">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/redsky.jpg" alt="" loading="lazy" />
          <div className="in">
            <div>
              <h3>Tennis bats</h3>
              <p>Tape ball &amp; box cricket</p>
            </div>
            <span className="go">→</span>
          </div>
        </Link>

        <Link className="cat rv in" href="/accessories" style={{ gridColumn: "2 / 4" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/stumps.jpg" alt="" loading="lazy" />
          <div className="in">
            <div>
              <h3>Accessories</h3>
              <p>Gloves, pads, helmets, bags &amp; balls</p>
            </div>
            <span className="go">→</span>
          </div>
        </Link>
      </div>
    </section>
  );
};

