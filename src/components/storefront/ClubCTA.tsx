import React from "react";
import Link from "next/link";

export const ClubCTA: React.FC = () => {
  return (
    <section className="club" aria-labelledby="clubT">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/img/adelaide.jpg" alt="A cricket ground at dusk" loading="lazy" />
      <div className="frame">
        <div className="txt">
          <h2 id="clubT" className="rv in">
            Kit out your club
          </h2>
          <p className="rv in">
            Bats in your club colours with your crest on the sticker, plus pads, gloves and bags
            for the whole squad. Lower prices from ten bats.
          </p>
          <Link
            className="btn white rv in"
            href="/bulk-enquiry"
            style={{ justifySelf: "start" }}
          >
            Start a bulk enquiry <span className="ar">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

