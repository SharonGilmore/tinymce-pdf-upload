import { Editor, TinyMCE } from "tinymce";

declare const tinymce: TinyMCE;

const setup = (editor: Editor): void => {
  const fileupload_url = editor.getParam("fileupload_url");
  if (fileupload_url) {
    editor.ui.registry.addButton("fileupload", {
      tooltip: "Upload a file",
      icon: "upload",
      onAction: () => {
        const input = document.createElement("input");
        input.type = "file";
        input.click();

        input.onchange = async (e: any) => {
          const file = e.target.files[0];

          if (file.type !== "application/pdf") {
            alert("Invalid file type - only PDF files are accepted");
            return;
          }

          const formData = new FormData();
          formData.set("file", file);
          fetch(`${fileupload_url}`, {
            method: "POST",
            body: formData,
            headers: { Accept: "application/json" },
          })
            .then((res) => res.json())
            .then((res) => {
              if (res.error) throw new Error();
              editor.insertContent(
                `<a target="_blank" href="${res.url}">${res.filename}</a>`
              );
            })
            .catch(() => alert("Unable to upload file"));
        };
      },
    });
  }
};

export default (): void => {
  tinymce.PluginManager.add("fileupload", setup);
};
