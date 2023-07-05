# tinymce-pdf-upload
PDF upload plugin for TinyMCE 6

__NOTE: I wrote this plugin for a project of my own when I needed a file uploader.  For this reason there's not a lot of error checking, and it's specifically limited to PDF files.  The code is there, though, and handling errors and extending it to other types of files shouldn't be too tricky.__

# How It Works
This plugin adds a 'File Upload' button to the TinyMCE 6 toolbar.  When you click that button, you'll see a file selector; once you've selected a file, the plugin does some very basic checking to make sure it's a PDF file, and then, if it is, it calls an endpoint (which you'll have to specify) and sends the file to it.

# Creating An Endpoint
To upload a file to your server, you'll need some code on the server to handle that - the only thing the plugin can do is to send the code to the server; you will need to create an endpoint on the server which receives the file and then slots it into the correct directory.  This endpoint could be written in any server-side language - PHP, Python, Ruby etc.

The endpoint should return a JSON object in the following format:

{
   error: string,     // Optional - only include this if there's an error
   filename: string,  // The name of the file which was uploaded (eg 'myfile.pdf')
   url: string        // The full url (including filename) to the uploaded file (eg 'http://mywebsite.com/files/myfile.pdf')
}

If 'error' is set, the plugin will show an alert saying "File could not be uploaded".

If there is no 'error' key, then the plugin will update the editor window to add <a href={$url}>{filename}</a>.  This will be added at the current position of your cursor.  You can use the 'edit link' button to edit the text which is shown (if you don't want to show {filename}).

### Example Endpoint ###
For instance, in PHP I could have a very basic endpoint whose URL is http://mysite.com/uploadFile, and which contains the following code (note that this has basically no error checking - you'll definitely need to add some of that):

    public function uploadFile() {
        $file = $this->request->data['file'];  // Get the uploaded file
        $result = {};
        $directory = '/var/www/htdocs/userfiles/';  // Directory to upload to
        // Now move temporary file to directory
        $newfile = $directory . '/' . $file['name'];
		    if (!move_uploaded_file($file['tmp_name'], $newfile)) {
			    $result['error'] = 'Error - Unable to move file to directory';
		    }else {
          $result['filename'] = $file['name'];
          $result['url'] = 'http://mywebsite.com/files/' . $file['name'];
        }
        return $this->response->withType('application/json')
        ->withStringBody(json_encode($result));
    }

# Using The Plugin #
If you want to use the plugin 'as-is', first you need to copy the file `dist/fileupload/plugin.min.js` to a folder called `fileupload` in your TinyMCE plugins directory (`tinymce/js/tinymce/plugins`).

Then, when you instantiate your editor using `tinymce.init`, add `fileupload` to the `toolbar` and `plugins` arrays, and create a new entry called `fileupload_url` which contains the URL of your endpoint.  So in my case I'd add the following line:

  `fileupload_url: http://mysite.com/uploadFile,`

And that should be it!

# Making Changes To The Plugin #
If you want to make changes to how the plugin works, you'll need to clone the entire repository.  Then go into `src/main/ts/Plugin.ts` and make your changes (usually I use VSCode or something similar for this - basically any text editor will do).

Once you've finished making changes, build the plugin (see below) and you can try it out.

## Building The Plugin ##
(You only need to do this if you've made changes to it)

In a command line tool, go to the plugin's home directory (ie the one this README file is in) and then run `yarn install` followed by `npm run build`.  This should recreate `plugin.min.js` in the `dist/fileupload` directory; you can now copy this across to your TinyMCE plugins directory to see your changes in action.

## Note ##
Sometimes I find that the rebuilding process gets itself stuck on a previous version and my changes don't get transmitted to the new `plugin.min.js`.  If this happens, check `lib/Plugin.js` and then `main/ts/core/Plugin.js` - if either of those don't have the changes, copy them in manually and then re-run `npm run build`.


[If this has helped you, please consider leaving a tip](https://zink.tips/Sharon711)
