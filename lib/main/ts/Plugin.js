import { __awaiter, __generator } from "tslib";
var setup = function (editor) {
  var fileupload_url = editor.getParam("fileupload_url");
  if (fileupload_url) {
    editor.ui.registry.addButton("fileupload", {
      tooltip: "Upload a file",
      icon: "upload",
      onAction: function () {
        var input = document.createElement("input");
        input.type = "file";
        input.click();
        input.onchange = function (e) {
          return __awaiter(void 0, void 0, void 0, function () {
            var file, formData;
            return __generator(this, function (_a) {
              file = e.target.files[0];
              if (file.type !== "application/pdf") {
                alert("Invalid file type - only PDF files are accepted");
                return [2 /*return*/];
              }
              formData = new FormData();
              formData.set("file", file);
              fetch(`${fileupload_url}`, {
                method: "POST",
                body: formData,
                headers: { Accept: "application/json" },
              })
                .then(function (res) {
                  return res.json();
                })
                .then(function (res) {
                  if (res.error) throw new Error();
                  return editor.insertContent(
                    '<a target="_blank" href="'
                      .concat(res.url, '">')
                      .concat(res.filename, "</a>")
                  );
                })
                .catch(function () {
                  alert("File could not be uploaded");
                });
              return [2 /*return*/];
            });
          });
        };
      },
    });
  }
};
export default (function () {
  tinymce.PluginManager.add("fileupload", setup);
});
//# sourceMappingURL=Plugin.js.map
