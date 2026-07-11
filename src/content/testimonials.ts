/**
 * Client testimonials for the home page (rendered after the comparison table).
 *
 * IMPORTANT: `enabled` ships as false because the quotes below are PLACEHOLDERS.
 * Publishing invented testimonials is an FTC violation - replace every item
 * with a real, attributable client quote (get written permission to use the
 * name/market), then flip `enabled` to true. Numbers in quotes convert best.
 */

export type Testimonial = {
  quote: string;
  name: string; // client's name (with permission)
  detail: string; // market + vertical, e.g. "Investor, Tampa FL"
};

export const testimonials = {
  enabled: false, // flip to true ONLY after replacing the placeholders with real quotes
  eyebrow: "In their words",
  title: "What clients close with Nextus leads",
  items: [
    {
      quote:
        "[PLACEHOLDER - replace with a real client quote, ideally with a number: e.g. 'Two of my first five Nextus leads went under contract.']",
      name: "[Client name]",
      detail: "[Vertical], [Market]",
    },
    {
      quote:
        "[PLACEHOLDER - a quote about the confirmation calls / lead quality difference works well here.]",
      name: "[Client name]",
      detail: "[Vertical], [Market]",
    },
    {
      quote:
        "[PLACEHOLDER - a quote about exclusivity / not racing other agents works well here.]",
      name: "[Client name]",
      detail: "[Vertical], [Market]",
    },
  ] as Testimonial[],
};
