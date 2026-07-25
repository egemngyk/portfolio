import { getVal, setVal, showMsg, reloadData } from "./utils.js";

export function renderMetaForm(m) {
  // TR alanlar
  setVal("m-name", m.name || "");
  setVal("m-title", m.title || "");
  setVal("m-birthdate", m.birthdate || "");
  setVal("m-location", m.location || "");
  setVal("m-host", m.host || "");
  setVal("m-domain", m.domain || "");
  setVal("m-status", m.status_text || "");
  setVal("m-about-heading", m.about_heading || "");
  setVal("m-about-p1", m.about_p1 || "");
  setVal("m-about-p2", m.about_p2 || "");
  setVal("m-goal-quote", m.goal_quote || "");
  setVal("m-goal-desc", m.goal_desc || "");
  // EN alanlar
  setVal("m-title-en", m.title_en || "");
  setVal("m-status-en", m.status_text_en || "");
  setVal("m-about-heading-en", m.about_heading_en || "");
  setVal("m-about-p1-en", m.about_p1_en || "");
  setVal("m-about-p2-en", m.about_p2_en || "");
  setVal("m-goal-quote-en", m.goal_quote_en || "");
  setVal("m-goal-desc-en", m.goal_desc_en || "");
}

async function saveMeta() {
  const body = {
    name: getVal("m-name"),
    title: getVal("m-title"),
    birthdate: getVal("m-birthdate"),
    location: getVal("m-location"),
    host: getVal("m-host"),
    domain: getVal("m-domain"),
    status_text: getVal("m-status"),
    about_heading: getVal("m-about-heading"),
    about_p1: getVal("m-about-p1"),
    about_p2: getVal("m-about-p2"),
    goal_quote: getVal("m-goal-quote"),
    goal_desc: getVal("m-goal-desc"),
    // EN versiyonlar
    title_en: getVal("m-title-en"),
    status_text_en: getVal("m-status-en"),
    about_heading_en: getVal("m-about-heading-en"),
    about_p1_en: getVal("m-about-p1-en"),
    about_p2_en: getVal("m-about-p2-en"),
    goal_quote_en: getVal("m-goal-quote-en"),
    goal_desc_en: getVal("m-goal-desc-en"),
  };
  const res = await window.ADMIN.updateMeta(body);
  showMsg("meta-msg", res.ok ? "Kaydedildi ✓" : res.error || "Hata", !res.ok);
  if (res.ok) reloadData();
}

export function initMeta() {
  ["btn-save-meta-1", "btn-save-meta-2", "btn-save-meta-3"].forEach((id) => {
    document.getElementById(id)?.addEventListener("click", saveMeta);
  });
}
