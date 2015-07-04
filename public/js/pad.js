(function (window) {

    var
        SELECTORS = {
            editTextContainer: '.pad-panel--editor',
            editTextElem: '.edit-text',
            previewTextContainer: '.pad-panel--preview',
            previewTextElem: '.preview-text'
        },

        CLASSES = {
            previewTextElem: 'pad-panel__content preview-text'
        },

        // Keycodes are always mysterious. Let's provide a semantic property mappting
        // for them as well
        KEYCODES = {
            tab: 9
        },

        editTextContainer = document.querySelector(SELECTORS.editTextContainer),
        editTextElem = editTextContainer.querySelector(SELECTORS.editTextElem),

        previewTextContainer = document.querySelector(SELECTORS.previewTextContainer),
        previewTextElem = previewTextContainer.querySelector(SELECTORS.previewTextElem),

        converter = new showdown.Converter(),    // used to convert the Markdown edit-text into HTML

        currentEditTextValue = ''; // track so that we can update for ALL clients


    function isEditTextChanged () {
        return currentEditTextValue !== editTextElem.value;
    }

    function convertTextAreaToMarkdown () {

        currentEditTextValue = editTextElem.value;

        var
            newHTML = converter.makeHtml(currentEditTextValue),
            HTMLContentContainer = document.createElement('div');

        HTMLContentContainer.className = CLASSES.previewTextElem;
        HTMLContentContainer.innerHTML = newHTML;

        previewTextContainer.replaceChild(HTMLContentContainer, previewTextElem);

        // transfer the reference
        previewTextElem = HTMLContentContainer;
    }

    /**
     * Have the client open a shareJS connection and attach the
     * edited textarea text to the object that it returns.
     * document.location.pathname is used to connect to the SPECIFIC room matching the URL
     */
    function initShareJS () {

        //------------- Use this block for resting realtime updates to paths not matching the base ------//
        if (document.location.pathname.length > 1) {

            var documentName = document.location.pathname.substring(1);

            sharejs.open(documentName, 'text', function (err, doc) {
                doc.attach_textarea(editTextElem);
                convertTextAreaToMarkdown();
            });
        }
        //------------------------------------------------------------------------------------------------//

        // --------------------- Use this block for enabling updates on every path -----------------------//
        //sharejs.open('home', 'text', function (err, doc) {
        //    doc.attach_textarea(editTextElem);
        //    convertTextAreaToMarkdown();
        //});
        //-------------------------------------------------------------------------------------------------//
    }

    function initChangeChecking () {
        setTimeout(function checkForChange() {
            if (isEditTextChanged()) {
                convertTextAreaToMarkdown();
            }
        }, 1000);
    }


    /**
     * Bound callback for smoothly handling key responses for the edit text element here
     */
    function onEditTextKeydown (ev) {

        if (ev.keyCode === KEYCODES.tab) {
            // get caret position
            var startPos = this.selectionStart,
                endPos = this.selectionEnd,

                target = ev.target,
                value = this.value;

            // set textarea value to: text before caret + tab + text after caret
            target.value =
                value.substring(0, startPos)
                + '\t'
                + value.substring(endPos);

            // put caret at right position again (add one for the tab)
            this.selectionStart = this.selectionEnd = startPos + 1;

            // prevent the focus loss
            ev.preventDefault();
        }
    }


    function init () {
        initShareJS();
        initChangeChecking();
        convertTextAreaToMarkdown();
        editTextElem.addEventListener('keydown', onEditTextKeydown.bind(editTextElem));
        editTextElem.addEventListener('input', convertTextAreaToMarkdown, false);
    }

    window.addEventListener('load', init, false);


}(window));
