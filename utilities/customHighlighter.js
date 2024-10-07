/**
 * Class used to highlight search terms in the text and html
 * @Author Logicease
 * @Architect Sagar Gandhi
 * @Developer Vishal and Anjali
 */
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
  Linking,
} from 'react-native';

class CustomHighlighter {
  /**
   * Returns highlight html if text is html
   * Else returns the highlighted TEXT
   * @param {*} text
   * @param {*} firstTerm
   * @param {*} secondTerm
   * @param {*} isHTML
   */
  doHighlight(text, firstTerm = null, secondTerm = null) {
    var isHTML = RegExp.prototype.test.bind(/(<([^>]+)>)/i);
    if (isHTML(text)) {
      if (firstTerm && secondTerm) {
        let yellowHighlighted = this.doHighlightHTML(text, firstTerm, 'yellow');
        return this.doHighlightHTML(yellowHighlighted, secondTerm, '#20b2aa');
      } else if (firstTerm) {
        return this.doHighlightHTML(text, firstTerm, 'yellow');
      } else {
        return this.doHighlightHTML(text, secondTerm, '#20b2aa');
      }
    } else {
      return this.highlightedText(text, firstTerm, secondTerm);
    }
  }

  /**
   * Returns the Text by replacing the highlighted terms provided by user
   * with the react native text component.
   * @param {*} text
   * @param {*} firstTerm
   * @param {*} secondTerm
   */
  highlightedText(text, firstTerm, secondTerm) {
    if (firstTerm && secondTerm) {
      var regex = new RegExp(
        '(' + firstTerm.toLowerCase() + '|' + secondTerm.toLowerCase() + ')',
        'ig',
      );
    } else if (firstTerm) {
      var regex = new RegExp('(' + firstTerm.toLowerCase() + ')', 'ig');
    } else {
      var regex = new RegExp('(' + secondTerm.toLowerCase() + ')', 'ig');
    }

    var allChars = text.split(regex);

    for (var i = 0; i < allChars.length; i++) {
      if (firstTerm && allChars[i].toLowerCase() == firstTerm.toLowerCase()) {
        allChars[i] = (
          <Text style={{backgroundColor: 'yellow'}} key={i}>
            {allChars[i]}
          </Text>
        );
      } else if (
        secondTerm &&
        allChars[i].toLowerCase() == secondTerm.toLowerCase()
      ) {
        allChars[i] = (
          <Text style={{backgroundColor: '#20b2aa'}} key={i}>
            {allChars[i]}
          </Text>
        );
      }
    }

    return <Text>{allChars}</Text>;
  }

  /**
   * Returns the html with highlighted search Keywords
   * @param {*} htmlData
   * @param {*} term
   * @param {*} color
   */
  doHighlightHTML(htmlData, term, color) {
    let searchTerm = term;
    let bodyText = htmlData;

    // the highlightStartTag and highlightEndTag parameters are optional
    let highlightStartTag = `<span style=' background-color:${color};'>`;
    let highlightEndTag = '</span>';

    var newText = '';
    var i = -1;
    var lcSearchTerm = searchTerm.toLowerCase();
    var lcBodyText = bodyText.toLowerCase();

    while (bodyText.length > 0) {
      i = lcBodyText.indexOf(lcSearchTerm, i + 1);
      if (i < 0) {
        newText += bodyText;
        bodyText = '';
      } else {
        if (bodyText.lastIndexOf('>', i) >= bodyText.lastIndexOf('<', i)) {
          // skip anything inside a <script> block
          if (
            lcBodyText.lastIndexOf('/script>', i) >=
            lcBodyText.lastIndexOf('<script', i)
          ) {
            if (
              lcBodyText.lastIndexOf(';', i) >= lcBodyText.lastIndexOf('&', i)
            ) {
              newText +=
                bodyText.substring(0, i) +
                highlightStartTag +
                bodyText.substr(i, searchTerm.length) +
                highlightEndTag;
              bodyText = bodyText.substr(i + searchTerm.length);
              lcBodyText = bodyText.toLowerCase();
              i = -1;
            }
          }
        }
      }
    }

    return newText;
  }
}
export default new CustomHighlighter();
