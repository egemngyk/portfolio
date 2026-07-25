import { getVal, setVal, showMsg, reloadData } from "./utils.js";

export function renderContactForm(c) {
  setVal("c-email", c.email || "");
  setVal("c-github", c.github || "");
  setVal("c-website", c.website || "");
}

async function saveContact() {
  const body = {
    email: getVal("c-email"),
    github: getVal("c-github"),
    website: getVal("c-website"),
  };
  const res = await window.ADMIN.updateContact(body);
  showMsg(
    "contact-msg",
    res.ok ? "Kaydedildi ✓" : res.error || "Hata",
    !res.ok
  );
  if (res.ok) reloadData();
}

export function initContact() {
  document
    .getElementById("btn-save-contact")
    ?.addEventListener("click", saveContact);
}
