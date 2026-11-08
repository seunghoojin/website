// The sections of the home board, in board order.
//
// slug      folder under src/ and URL of the section's SectionIndex page
// title     red section title, English only
// open      stays open on phones (ds-group--open)
// lead      optional Markdown line under the title
// links     optional link list closing the box (Markdown, one line)
// boardLimit  how many entries the home box shows; the rest are on the SectionIndex
export default [
  {
    slug: "who-i-am",
    title: "Who.I.am",
    open: true,
    lead:
      "Hi. My name is Andrew SeungHoo Jin. Call me AndJ for short. " +
      "You can learn more about who I am and what I'm up to from a short biography, or the rest of this home page.",
    links: "[Email](mailto:seunghoojin@gmail.com), [Blog](https://blog.andj.studio).",
    boardLimit: 5,
  },
  {
    slug: "guide",
    title: "Guide",
    open: true,
    lead:
      "Each red title is a section. Its box shows the latest entries; select an entry title to read it in full, " +
      "or the red title to see everything in that section. Dates are when an entry was written.",
  },
  {
    slug: "projects",
    title: "Projects",
    lead: "Translating individual stories into tangible forms of craft.",
    boardLimit: 4,
  },
  {
    slug: "education",
    title: "Education",
    lead: "Integrating diverse knowledge to find shared principles of creation.",
    boardLimit: 4,
  },
  {
    slug: "experience",
    title: "Experience",
    lead: "Defining chapters of sustained focus and collective building.",
    boardLimit: 4,
  },
  {
    slug: "activities",
    title: "Activities",
    boardLimit: 4,
  },
];
