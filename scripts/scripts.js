let selectedFont = localStorage.getItem('font') || "Cascadia Code";
let selectedSize = localStorage.getItem('size') || "12";
let selectedTheme = localStorage.getItem('theme') || "monokai";
let selectedIndent = parseInt(localStorage.getItem('indent') || 4);
let isIndenting = false;

const editor = ace.edit("editor", {
    mode: "ace/mode/json",
    theme: `ace/theme/${selectedTheme}`,
    autoScrollEditorIntoView: true,
    copyWithEmptySelection: true,
    useSoftTabs: true,
    tabSize: selectedIndent,
    showPrintMargin: false,
    wrap: true,
    fontSize: `${selectedSize}pt`,
    fontFamily: selectedFont
});

syncSelectOptions()
updatePage();

$('#btn_copy').on('click', copyToClipboard);
$('#btn_settings').on('click', toggleSettings);

editor.session.on('change', indentJson);

const editorContainer = editor.container;

editorContainer.addEventListener("dragover", (e) => {
    e.preventDefault();
    editorContainer.classList.add("drag-over");
});

editorContainer.addEventListener("dragleave", () => {
    editorContainer.classList.remove("drag-over");
});

editorContainer.addEventListener("drop", (e) => {
    e.preventDefault();
    editorContainer.classList.remove("drag-over");
    handleFileDrop(e);
});

function indentJson() {

    if (isIndenting) return;
    const currentValue = editor.getValue();
    try {
        isIndenting = true;
        const json = JSON.parse(currentValue);
        const formattedJson = JSON.stringify(json, null, selectedIndent);

        if (currentValue !== formattedJson) {
            editor.setValue(formattedJson, -1);
        }
    } catch (e) {

    } finally {
        isIndenting = false;
    }
}

function handleChange() {
    selectedFont = $('#font').val();
    selectedSize = $('#size').val();
    selectedTheme = $('#theme').val();
    selectedIndent = parseInt($('#indent').val());

    localStorage.setItem('font', selectedFont);
    localStorage.setItem('size', selectedSize);
    localStorage.setItem('theme', selectedTheme);
    localStorage.setItem('indent', selectedIndent);

    updatePage();
}

function handleFileDrop(event) {
    event.preventDefault();

    const file = event.dataTransfer.files[0];

    if (file && file.type === "application/json") {
        const reader = new FileReader();
        reader.onload = function (e) {
            editor.setValue(e.target.result);
        };
        reader.readAsText(file);
    }
}

function updatePage() {
    if (selectedTheme == 'github' || selectedTheme == 'tomorrow') {
        $('.bi').css("color", "black");
    } else {
        $('.bi').css("color", "white");
    }

    editor.setTheme("ace/theme/" + selectedTheme);
    editor.setOptions({
        fontFamily: selectedFont,
        fontSize: selectedSize + 'pt',
        tabSize: selectedIndent
    });

    indentJson();
}

function syncSelectOptions() {
    $('#font').val(selectedFont);
    $('#size').val(selectedSize);
    $('#theme').val(selectedTheme);
    $('#indent').val(selectedIndent);
}

function copyToClipboard() {
    navigator.clipboard.writeText(editor.getValue())

    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 800,
        timerProgressBar: true,
        customClass: {
            popup: 'colored-toast',
        },
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        }
    });
    Toast.fire({
        icon: "success",
        title: "The code has been copied to clipboard."
    });

}

function toggleSettings() {
    $('.container-settings').toggle(25).focus();
    if ($('.container-settings').is(':visible')) $('.container-about').hide();
}

function showAbout() {
    $('.container-about').toggle(25);
}

tippy('#btn_copy', {
    content: 'Copy JSON to clipboard',
    animation: 'scale',
});

tippy('#btn_settings', {
    content: 'Settings',
    animation: 'scale',
});
