import {getFromLocalStorage, removeFromLocalStorage, setToLocalStorage} from "./utils.js";
import {SERVER_URL} from "./constants.js";

const LOCAL_STORAGE = {
    FORM_ID: 'formId',
    FORM_DRAFT: 'formDraft',
    FORM_SAVED: 'formSaved',
    FORM_VERSION: 'formVersion'
};

/*
    TODO:
     add a password, so not anyone can edit the form
     add the cool question editor

 */
class App {

    initialize() {
        // FOR TESTING
        // removeFromLocalStorage(LOCAL_STORAGE.FORM_VERSION)
        // removeFromLocalStorage(LOCAL_STORAGE.FORM_SAVED)
        // removeFromLocalStorage(LOCAL_STORAGE.FORM_DRAFT)

        this.loadingOverlay = document.getElementById('loadingOverlay');

        this.formTextarea = document.getElementById('form-textarea');
        this.formTextarea.value = getFromLocalStorage(LOCAL_STORAGE.FORM_DRAFT);
        this.formTextarea.oninput = () => {
            setToLocalStorage(LOCAL_STORAGE.FORM_DRAFT, this.formTextarea.value)
        }

        const idInput = document.getElementById('id-input');
        idInput.value = getFromLocalStorage(LOCAL_STORAGE.FORM_ID);
        idInput.onchange = () => {
            setToLocalStorage(LOCAL_STORAGE.FORM_ID, idInput.value);
        }

        const uploadButton = document.getElementById('upload-button');
        uploadButton.onclick = () => {
            this.showLoading(true)
            this.uploadToServer().then(() => this.showLoading(false));
        }

        const loadButton = document.getElementById('load-button');
        loadButton.onclick = () => {
            this.showLoading(true)
            this.loadFromServer().then(() => this.showLoading(false));
        }
    }

    showLoading(show) {
        this.loadingOverlay.style.display = show ? '' : 'none';
    }

    async loadFromServer() {

        const formId = getFromLocalStorage(LOCAL_STORAGE.FORM_ID);
        const formVersion = getFromLocalStorage(LOCAL_STORAGE.FORM_VERSION);

        if (!formId) {
            alert("Form ID is required");
            return;
        }

        const response = await fetch(`${SERVER_URL}/get-form/${formId}/${formVersion}`)
        console.log(response)

        if (response.status === 304) {
            console.log("No changes – restore last saved version")
            this.formTextarea.value =
                getFromLocalStorage(LOCAL_STORAGE.FORM_SAVED) ?? '';
            return;
        }

        if (!response.ok) {
            console.error(response.statusText);
            return;
        }

        const { form, version } = await response.json();

        setToLocalStorage(LOCAL_STORAGE.FORM_DRAFT, form);
        setToLocalStorage(LOCAL_STORAGE.FORM_SAVED, form);
        setToLocalStorage(LOCAL_STORAGE.FORM_VERSION, version);

        this.formTextarea.value = form;

        console.log(`Loaded form version ${version}`);
    }

    async uploadToServer() {

        const formId = getFromLocalStorage(LOCAL_STORAGE.FORM_ID);
        const formVersion = getFromLocalStorage(LOCAL_STORAGE.FORM_VERSION);
        const draftForm = getFromLocalStorage(LOCAL_STORAGE.FORM_DRAFT);
        const savedForm = getFromLocalStorage(LOCAL_STORAGE.FORM_SAVED);

        if (!formId) {
            alert("Form ID is required");
            return;
        }

        if (savedForm === draftForm) {
            // if form didn't change
            console.log("form didn't change - not uploading")
            return;
        }

        const response = await fetch(`${SERVER_URL}/upload-form`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: formId,
                form: draftForm,
                version: Number(formVersion),
            })
        });
        console.log(response)

        if (response.status === 409) {
            alert("You must load the latest version before uploading");
            return;
        }

        if (!response.ok) {
            console.error(response.statusText);
            return;
        }

        const { version: newVersion } = await response.json();

        setToLocalStorage(LOCAL_STORAGE.FORM_SAVED, draftForm);
        setToLocalStorage(LOCAL_STORAGE.FORM_VERSION, newVersion);
        console.log(`Uploaded form version ${newVersion}`);
    }
}

window.onload = () => {
    const app = new App();
    app.initialize();
};
