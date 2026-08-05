
const PASSWORD = "teddy2026";

import { rsvpsRef } from "./firebase-init.js";
import { query, where, onSnapshot } from "https://www.gstatic.com/firebasejs/12.17.0/firebase-firestore.js";

const gate = document.getElementById("gate");
const gateForm = document.getElementById("gate-form");
const gateError = document.getElementById("gate-error");
const guestContent = document.getElementById("guest-content");

gateForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const entered = document.getElementById("gate-password").value;

  if (entered === PASSWORD) {
    gate.classList.add("hidden");
    guestContent.classList.remove("hidden");
    loadGuestList();
  } else {
    gateError.classList.remove("hidden");
  }
});

function sortByNewest(docs) {
  return docs.slice().sort((a, b) => {
    const aTime = a.createdAt ? a.createdAt.toMillis() : Date.now();
    const bTime = b.createdAt ? b.createdAt.toMillis() : Date.now();
    return bTime - aTime;
  });
}

function loadGuestList() {
  const attendingList = document.getElementById("attending-list");
  const attendingEmpty = document.getElementById("attending-empty");
  const headcountText = document.getElementById("headcount-text");

  const attendingQuery = query(rsvpsRef, where("attending", "==", true));

  onSnapshot(
    attendingQuery,
    (snapshot) => {
      const guests = sortByNewest(snapshot.docs.map((doc) => doc.data()));

      attendingList.querySelectorAll(".attending-chip").forEach((el) => el.remove());

      if (guests.length === 0) {
        attendingEmpty.classList.remove("hidden");
        headcountText.textContent = "No RSVPs yet.";
        return;
      }

      attendingEmpty.classList.add("hidden");

      const totalHeadcount = guests.reduce((sum, g) => sum + (g.guests || 1), 0);
      headcountText.textContent = `${totalHeadcount} guest${totalHeadcount === 1 ? "" : "s"} confirmed so far`;

      guests.forEach((guest) => {
        const chip = document.createElement("span");
        chip.className = "attending-chip";
        const count = guest.guests > 1 ? ` (+${guest.guests - 1})` : "";
        chip.textContent = `${guest.name || "A guest"}${count}`;
        attendingList.appendChild(chip);
      });
    },
    (error) => console.error("Couldn't load guest list:", error)
  );
}