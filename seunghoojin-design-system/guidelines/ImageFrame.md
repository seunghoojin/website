How images are framed in boxes and articles: at their own proportions within a range, cropped only beyond it.

Markup: give any image (or SVG) the class `ds-frame`. Its width fills the box or article; its height follows the image, but never less than half the width (`frame-wide`, 2:1) and never more than 1.25 times the width (`frame-tall`, 4:5). Inside the range nothing is cropped. Beyond it the frame stops at the limit and the image is cropped with `object-fit: cover` around a focus point, set per image as `style="--focus: 30% 60%"` (default the centre). Frames measure their container (`container-type: inline-size` on boxes, articles and sub-figures), so the range holds at every width.

For the site's editor: when an image is added, show its frame at the box width with the visible area marked, and let the author move the focus point if the image falls outside the range.
