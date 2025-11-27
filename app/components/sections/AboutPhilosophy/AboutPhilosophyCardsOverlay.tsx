"use client";

import { useEffect, useState } from "react";
import CardSwap, { Card } from "./CardSwap";
import "./CardSwap.css";

const cards = [
  {
    title: "Clarity first",
    body: "Ξεκινάμε από ξεκάθαρους στόχους, όχι από buzzwords και μόδες.",
  },
  {
    title: "Design με σκοπό",
    body: "Κάθε στοιχείο στην οθόνη υπάρχει για να οδηγήσει σε ένα συγκεκριμένο αποτέλεσμα.",
  },
  {
    title: "Tech χωρίς φλυαρία",
    body: "Σύγχρονη τεχνολογία, χωρίς να σε πνίγουμε με τεχνικές λεπτομέρειες.",
  },
  {
    title: "Σχέση, όχι project",
    body: "Θέλουμε συνεργασία που εξελίσσεται, όχι one-off δουλειές.",
  },
];

const AboutPhilosophyCardsOverlay = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const update = () => {
      const bodyHasDark = document.body.classList.contains("about-dark");
      setIsVisible(bodyHasDark);
    };

    update();
    window.addEventListener("scroll", update);
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="about-cards-overlay">
      <CardSwap
        cardDistance={60}
        verticalDistance={70}
        delay={5000}
        pauseOnHover={false}
        width={420}
        height={260}
      >
        {cards.map((card) => (
          <Card key={card.title}>
            <h3 className="philo-card-title">{card.title}</h3>
            <p className="philo-card-body">{card.body}</p>
          </Card>
        ))}
      </CardSwap>
    </div>
  );
};

export default AboutPhilosophyCardsOverlay;
