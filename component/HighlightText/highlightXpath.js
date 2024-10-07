/** highlightXpath.js */
import React from "react";
//import "./highlight.css";

const highlighted = {
  'font-style': 'normal',
  'background': 'yellow',
};

// const highlighted:hover {
//   background: lime;
// }

class HighlightXpath extends React.Component {
  render = () => {
    /**
     * This creates the regex to find the wanted `quote`.
     * If you want to highlight all the occurrences of a `quote`, not
     * only the first occurrence, add 'g' as the second parameter:
     * ex: const regex = new RegExp(`(${this.props.quote})`);
     * If you want to highlight multiple quotes from an array
     * you could do
     * const regex = new RegExp(`(${this.props.quotes.join('|')})`);
     */
    const regex = new RegExp(`(${this.props.quote})`,"g");
    /**
     * In `content` we wrap `quote`'s occurrence(s) in `em`s
     * with a class `highlighted`. Please note that this will
     * be rendered as html, not React, so `class` is used instead
     * of `className`.
     */
    const highlightedHtml = this.props.content.replace(
      regex,
      `<em style={${highlighted}>$1</em>`
    );
    return (
      <div ref="test" dangerouslySetInnerHTML={{ __html: highlightedHtml }}     />
    );
  };
}

export default HighlightXpath;