(function (window) {

    var
        SELECTORS = {
            editTextContainer: '.pad-panel--editor',
            editTextElem: '.edit-text',
            previewTextContainer: '.pad-panel--preview',
            previewTextElem: '.preview-text'
        },

        CLASSES = {
            previewTextElem: 'preview-text'
        },

        editTextContainer = document.querySelector(SELECTORS.editTextContainer),
        editTextElem = editTextContainer.querySelector(SELECTORS.editTextElem),

        previewTextContainer = document.querySelector(SELECTORS.previewTextContainer),
        previewTextElem = previewTextContainer.querySelector(SELECTORS.previewTextElem),

        converter = new showdown.Converter();    // used to convert the Markdown edit-text into HTML


    function convertTextAreaToMarkdown () {

        debugger;

        var newHTML = converter.makeHtml(editTextElem.value);

        var HTMLContentContainer = document.createElement('div');
        HTMLContentContainer.classList.add(CLASSES.previewTextElem);
        HTMLContentContainer.innerHTML = newHTML;

        previewTextContainer.replaceChild(HTMLContentContainer, previewTextElem);

        // transfer the reference
        previewTextElem = HTMLContentContainer;
    }

    function init () {
        convertTextAreaToMarkdown();
        editTextElem.addEventListener('input', convertTextAreaToMarkdown, false);
    }


    window.addEventListener('load', init, false);


}(window));
