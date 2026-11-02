"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("Choosing a bat");
  const [orderNumber, setOrderNumber] = useState("");
  const [message, setMessage] = useState("");
  const [hasError, setHasError] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isValid =
      name.trim().length > 0 &&
      /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) &&
      message.trim().length > 0;

    if (!isValid) {
      setHasError(true);
      return;
    }

    setHasError(false);
    setIsSubmitted(true);
  };

  const firstName = name.trim().split(" ")[0];

  const faqs = [
    {
      q: "Do you ship outside India?",
      a: "Yes. We ship to the UK, Australia, New Zealand, the UAE, South Africa, the USA, Canada and more. Shipping and any import duties are shown at checkout before you pay.",
    },
    {
      q: "How long does delivery take?",
      a: "Stock bats leave us within 3 working days. Delivery takes 3–6 days in India and 7–12 days internationally. Custom bats take 10–14 days to make first.",
    },
    {
      q: "Can I return a bat?",
      a: "Unused bats in their original condition can be returned within 14 days. Engraved custom bats can't be returned unless they arrive damaged.",
    },
    {
      q: "Do I need to knock in my bat?",
      a: "Every English willow bat needs knocking in before it faces a hard ball. Add our knocking-in service on the product page and we'll do it before shipping.",
    },
    {
      q: "My bat has cracked. Can you help?",
      a: "Small surface cracks on the face are normal and can be repaired. Send us photos and we'll tell you whether it's a repair or a warranty case.",
    },
  ];

  return (
    <>
      <section className="frame ph">
        <h1>
          Contact us<span>.</span>
        </h1>
        <p className="lead">
          Questions about sizes, weights, an order or a custom bat? Write to us and a bat-maker
          will reply within one working day.
        </p>

        {/* Stadium Photography Band */}
        <div className="band">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/stadium.jpg" alt="A cricket ground under floodlights" />
        </div>

        {/* Left Information Blocks */}
        <div className="side">
          <div className="blk rv in">
            <h2>Email</h2>
            <p>
              <a href="mailto:hello@krickscricket.com">hello@krickscricket.com</a>
            </p>
          </div>
          <div className="blk rv in">
            <h2>WhatsApp</h2>
            <p>
              Message us for help choosing a bat. Send a photo of your old bat and we&apos;ll match the
              weight and pick-up.
            </p>
          </div>
          <div className="blk rv in">
            <h2>Hours</h2>
            <p>Monday to Saturday, 10:00 to 19:00 India time (GMT+5:30)</p>
          </div>
          <div className="blk rv in">
            <h2>Workshop</h2>
            <p>New Delhi, India. Visits by appointment.</p>
          </div>
        </div>

        {/* Right Form or Thank You State */}
        {isSubmitted ? (
          <div className="thanks" role="status">
            <h2>Thanks, {firstName}</h2>
            <p style={{ fontSize: "19px" }}>
              Your message is with us. We&apos;ll reply to {email} within one working day.
            </p>
            <Link
              className="btn navy"
              href="/leather-bats"
              style={{ justifySelf: "start" }}
            >
              Keep browsing <span className="ar">→</span>
            </Link>
          </div>
        ) : (
          <form className="f" id="form" noValidate onSubmit={handleSubmit}>
            <div className="two">
              <div className="field">
                <label htmlFor="n">Your name</label>
                <input
                  id="n"
                  required
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="e">Email</label>
                <input
                  id="e"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="t">What is it about?</label>
              <select
                id="t"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              >
                <option>Choosing a bat</option>
                <option>A custom bat</option>
                <option>An order I&apos;ve placed</option>
                <option>Returns and repairs</option>
                <option>Something else</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="o">Order number (if you have one)</label>
              <input
                id="o"
                autoComplete="off"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="m">Message</label>
              <textarea
                id="m"
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            {hasError && (
              <p id="err" style={{ color: "#B3261E", fontSize: "17px" }}>
                Please add your name, a valid email and a message.
              </p>
            )}

            <button className="btn" type="submit" style={{ justifySelf: "start" }}>
              Send message <span className="ar">→</span>
            </button>
          </form>
        )}
      </section>

      {/* Common Questions Accordion */}
      <section className="frame faq" aria-labelledby="faqT">
        <h2 id="faqT" className="rv in">
          Common questions
        </h2>
        <div className="qs">
          {faqs.map((faq) => (
            <details key={faq.q} className="rv in">
              <summary>{faq.q}</summary>
              <p>{faq.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
