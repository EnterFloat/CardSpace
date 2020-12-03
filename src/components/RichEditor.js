import React, { Component } from "react";
import JoditEditor from "jodit-react";

function contentChange(value) {
  console.log(value);
}

class RichEditor extends Component {
  onUpdateContent = (value) => {
    contentChange(value);
    this.props.onChange(value)
    //  this.props.dispatch(contentChange(value));
  };

  config = {
    zIndex: 0,
    readonly: false,
    placeholder: "Start typing or drag and drop images...",
    activeButtonsInReadOnly: ["fullsize", "print"],
    toolbarButtonSize: "small",
    theme: "default",
    enableDragAndDropFileToEditor: true,
    saveModeInCookie: false,
    editorCssClass: false,
    triggerChangeEvent: true,
    direction: "ltr",
    debugLanguage: false,
    i18n: "en",
    tabIndex: 1,
    toolbar: true,
    enter: "P",
    useSplitMode: false,
    colorPickerDefaultTab: "text",
    imageDefaultWidth: 100,
    removeButtons: ["image", "about", "outdent", "indent", "file", "selectall", "preview"],
    events: {},
    textIcons: false,
    uploader: {
      insertImageAsBase64URI: true,
    },
    showXPathInStatusbar: false,
  };

  render() {    
    if (this.props.config != null) {      
      this.config = this.props.config;
    }
    console.log(this.props.content)
    return (
      <JoditEditor
        value={this.props.content}
        config={this.config}
        onChange={this.onUpdateContent}
      />
    );
  }
}

export default RichEditor;
