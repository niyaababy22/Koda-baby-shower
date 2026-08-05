// 
// RSVP form + public well-wishes wall
// 
import { rsvpsRef } from "./firebase-init.js";
import {
  addDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/12.17.0/firebase-firestore.js";


const FORMSPREE_ENDPOINT = "";

function notifyByEmail(name, guests) {
  if (!FORMSPREE_ENDPOINT) return;

  fetch(FORMSPREE_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      message: `${name} just RSVP'd yes for ${guests} guest${guests === 1 ? "" : "s"}!`,
    }),
  }).catch((error) => console.error("Email notification failed:", error));
}

// Sort newest-first without needing a Firestore composite index.
// (docs without a confirmed server timestamp yet are treated as newest.)
function sortByNewest(docs) {
  return docs.slice().sort((a, b) => {
    const aTime = a.createdAt ? a.createdAt.toMillis() : Date.now();
    const bTime = b.createdAt ? b.createdAt.toMillis() : Date.now();
    return bTime - aTime;
  });
}

// 
// RSVP form behavior
// 
const toggleBtns = document.querySelectorAll(".toggle-btn");
const form = document.getElementById("rsvp-form");
const guestsField = document.getElementById("guests-field");
const noteField = document.getElementById("note-field");
const noteInput = document.getElementById("rsvp-note");
const publicHint = document.getElementById("public-hint");
const submitBtn = document.getElementById("rsvp-submit");
const thanksBox = document.getElementById("rsvp-thanks");
const thanksText = document.getElementById("rsvp-thanks-text");

let attending = null;

toggleBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    attending = btn.dataset.choice === "yes";

    toggleBtns.forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");

    form.classList.remove("hidden");
    guestsField.classList.toggle("hidden", !attending);
    noteField.classList.toggle("hidden", attending);
    publicHint.classList.toggle("hidden", attending);
    submitBtn.textContent = attending ? "Send RSVP" : "Send Note";
  });
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (attending === null) return;

  submitBtn.disabled = true;
  submitBtn.textContent = "Sending...";

  const name = document.getElementById("rsvp-name").value.trim();
  const guests = attending
    ? Number(document.getElementById("rsvp-guests").value) || 1
    : 0;
  const note = attending ? "" : noteInput.value.trim();

  try {
    await addDoc(rsvpsRef, {
      name,
      attending,
      guests,
      note,
      createdAt: serverTimestamp(),
    });

    form.classList.add("hidden");
    thanksBox.classList.remove("hidden");
    thanksText.textContent = attending
      ? "Thank you! We can't wait to celebrate with you."
      : "Thank you for the sweet note — you'll be missed!";
    form.reset();

    if (attending) {
      notifyByEmail(name, guests);
    }
  } catch (error) {
    console.error("RSVP failed:", error);
    submitBtn.disabled = false;
    submitBtn.textContent = attending ? "Send RSVP" : "Send Note";
    alert("Something went wrong sending your RSVP. Please try again.");
  }
});

// 
// Well wishes wall — updates live for every visitor
// 
const wishesWall = document.getElementById("wishes-wall");
const wishesEmpty = document.getElementById("wishes-empty");

const wishesQuery = query(rsvpsRef, where("attending", "==", false));

onSnapshot(
  wishesQuery,
  (snapshot) => {
    const wishes = sortByNewest(
      snapshot.docs
        .map((doc) => doc.data())
        .filter((entry) => entry.note && entry.note.trim().length > 0)
    );

    wishesWall.querySelectorAll(".wish-bubble").forEach((el) => el.remove());

    if (wishes.length === 0) {
      wishesEmpty.classList.remove("hidden");
      return;
    }

    wishesEmpty.classList.add("hidden");

    wishes.forEach((wish) => {
      const bubble = document.createElement("div");
      bubble.className = "wish-bubble";

      const message = document.createElement("p");
      message.className = "wish-message";
      message.textContent = wish.note;

      const name = document.createElement("p");
      name.className = "wish-name";
      name.textContent = `— ${wish.name || "A friend"}`;

      bubble.appendChild(message);
      bubble.appendChild(name);
      wishesWall.appendChild(bubble);
    });
  },
  (error) => console.error("Couldn't load wishes wall:", error)
);