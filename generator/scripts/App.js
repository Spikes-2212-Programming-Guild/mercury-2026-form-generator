import {getFromLocalStorage, setToLocalStorage} from "./utils.js";
import {SERVER_URL} from "./constants.js";

class App {

    initialize() {
        let formTextarea = document.getElementById('form-textarea');
        formTextarea.value = getFromLocalStorage('json_data');
        formTextarea.onchange = () => {
            setToLocalStorage("json_data", formTextarea.value)
        }

        let idInput = document.getElementById('id-input');
        idInput.value = getFromLocalStorage('id');
        idInput.onchange = () => {
            setToLocalStorage("id", idInput.value);
        }

        let uploadButton = document.getElementById('upload-button');
        uploadButton.onclick = () => {
            this.uploadFormToServer();
        }

        let loadButton = document.getElementById('load-button');
        loadButton.onclick = () => {
            this.loadFormFromServer(formTextarea);
        }
    }

    showLoadingOverlay(show) {
        document.getElementById('loadingOverlay').style.display = show ? "" : 'none';
    }

    async loadFormFromServer(formTextarea) {
        this.showLoadingOverlay(true);

        const id = getFromLocalStorage('id');
        const response = await fetch(SERVER_URL + "/get-form", {
            method: 'GET',
            headers: {'Content-Type': 'application/json', "id": id},
        });
        if (response.ok) {
            const data = await response.json();
            formTextarea.value = data[0].json_data;
            console.log("successfully fetched the form");
        } else {
            alert("error in fetching the form");
        }

        console.log(response);
        this.showLoadingOverlay(false);
    }

    async uploadFormToServer() {
        this.showLoadingOverlay(true);

        const id = getFromLocalStorage('id');
        const json_data = getFromLocalStorage('json_data');

        const response = await fetch(SERVER_URL + "/upload-form", {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({id, json_data})
        });
        if (response.ok) {
            console.log("successfully uploaded the form");
        } else {
            alert("error in uploading the form");
        }

        console.log(response);
        this.showLoadingOverlay(false);
    }
}

window.onload = () => {
    const app = new App();
    app.initialize();
};
