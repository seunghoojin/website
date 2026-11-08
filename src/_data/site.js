// Site-wide values used by the masthead, the footer and <head>.
const now = new Date();

export default {
  name: "Andrew SeungHoo Jin",
  subtitle: "Architecture and Artificial Intelligence, Seoul National University",
  url: "https://seunghoojin.com",
  // "This site was updated on …", set at each build, in Seoul time.
  updated: now.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Seoul",
  }),
  year: now.toLocaleDateString("en-GB", { year: "numeric", timeZone: "Asia/Seoul" }),
};
