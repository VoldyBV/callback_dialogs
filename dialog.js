class BV_dialog{
    static #templeate(){
        var temp = `
            <div class="bv-dialog-default-body">
                <div class="bv-dialog-default-hf bv-dialog-default-H">
                    <span class="bv-dialog-msg"></span>
                </div>
                <div class="bv-dialog-default-content">
                </div>
                <div class="bv-dialog-default-hf bv-dialog-default-F">
                    <button class="bv-dialog-default-btn" btn="Cancel"> Cancel </button>
                    <button class="bv-dialog-default-btn" btn="OK"> OK </button>
                </div>
            </div>
        `;
        return temp;
    }
    static #openDialog(settings, OK, Cancel, css_class, content){
        //checking if title is undefined
        if(!settings.title) settings.title = "";

        //creating and setting dialog
        var dlg = document.createElement("div");
        dlg.innerHTML = this.#templeate();
        dlg.classList.toggle("bv-dialog-default-overlay");

        if(css_class) dlg.classList.toggle(css_class);
        
        //changing title
        dlg.querySelector(".bv-dialog-msg").innerHTML = settings.title;
        
        //checking for css classes
        if(settings.classList && settings.classList.constructor == "function Array() { [native code] }"){
            //adding css classes
            for(var i = 0; i < settings.classList.length; i++){
                dlg.classList.toggle(settings.classList[i]);
            }
        }
        
        //adding content
        dlg.querySelector(".bv-dialog-default-content").innerHTML = content;
        
        //changing buttons text
        if(settings.btn_OK_Text) dlg.querySelector("[btn=OK]").innerHTML = settings.btn_OK_Text;
        if(settings.btn_Cancel_Text) dlg.querySelector("[btn=Cancel]").innerHTML = settings.btn_Cancel_Text;
        //saving dialog to settings
        settings.dlg = dlg;
        
        //Adding functions to OK and Cancel buttons and bindding object settings
        settings.dlg.querySelector("[btn=OK]").addEventListener("click", OK.bind(settings));
        settings.dlg.querySelector("[btn=Cancel]").addEventListener("click", Cancel.bind(settings));

        //opening dialog
        document.body.appendChild(settings.dlg);
    }
    static #setField(settings){

        //defining valid types
        var types = ["text", "number", "color", "datetime-local", "date", "time", "email"];
        //selecting filed in BV_dialog.prompt
        var field = settings.dlg.querySelector("[name=dialog-value]");
        //check if provided type is valid
        if(!types.includes(settings.type)){
            document.body.removeChild(settings.dlg);
            throw "Invalid type for BV_dialog.prompt";
        }
        else field.type = settings.type;
        //setting field
        if(settings.placeholder) field.placeholder = settings.placeholder;

        if(!isNaN(settings.min * 1)) field.min = settings.min;
        if(!isNaN(settings.max * 1)) field.max = settings.max;
        if(!isNaN(settings.step * 1)) field.step = settings.step;
        if(settings.value != undefined) field.value = settings.value;
    }
    static prompt(settings){
        try{
            //creating dialog's content
            var content = "<input name='dialog-value' />";

            //creating functions for OK and Cancel buttons
            var OK = function () {
                var info = this.dlg.querySelector("[name=dialog-value]").value;

                if(typeof this.on_OK == "function"){
                    this.on_OK(info);
                }

                document.body.removeChild(this.dlg);
            }
            var Cancel = function () {
                if(typeof this.on_Cancel == "function"){
                    this.on_Cancel();
                }
                document.body.removeChild(this.dlg);
            }

            //opening dialog
            this.#openDialog(settings, OK, Cancel, "prompt-dialog", content);
            this.#setField(settings);
        }
        catch(error){
            console.error(error)
        }
    }
    static singleOption(settings){
        try{
            //checking for options
            if(!settings.options) throw "You didn't provide options to choose from";

            //creating dialog's content
            var content = document.createElement("div");
            
            for(var i = 0;i < settings.options.length; i++){
                var label = document.createElement("label");//container for radio button and span
                var span = document.createElement("span");//container for text
                var rb = document.createElement("input");//radio button
                
                rb.type = "radio";
                rb.name = "dialog-value";
                rb.value = settings.options[i];
                span.innerText = settings.options[i];
                label.appendChild(rb);
                label.appendChild(span);
                content.appendChild(label);
            }

            //creating functions for OK and Cancel buttons
            var OK = function () {
                var opts = this.dlg.querySelectorAll("[name=dialog-value]");
                var info;

                for(var i = 0;i < opts.length; i++){
                    if(opts[i].checked){
                        info = opts[i].value;
                        break;
                    }
                }

                if(typeof this.on_OK == "function"){
                    this.on_OK(info);
                }

                document.body.removeChild(this.dlg);
            }
            var Cancel = function () {
                if(typeof this.on_Cancel == "function"){
                    this.on_Cancel();
                }

                document.body.removeChild(this.dlg);
            }
            
            //opening dialog
            this.#openDialog(settings, OK, Cancel, "singleOption-dialog", content.innerHTML);
        }
        catch(error){
            console.error(error)
        }
    }
    static multiOption(settings){
        try{
            //checking for options
            if(!settings.options) throw "You didn't provide options to choose from";

            //creating dialog's content
            var content = document.createElement("div");
            
            for(var i = 0;i < settings.options.length; i++){
                var label = document.createElement("label");//container for radio button and span
                var span = document.createElement("span");//sontainer for text
                var cb = document.createElement("input");//radio button
                
                cb.type = "checkbox";
                cb.name = "dialog-value";
                cb.value = settings.options[i];
                span.innerText = settings.options[i];
                label.appendChild(cb);
                label.appendChild(span);
                content.appendChild(label);
            }

            //creating functions for OK and Cancel buttons
            var OK = function () {
                var opts = this.dlg.querySelectorAll("[name=dialog-value]");
                var info = [];

                for(var i = 0, j = 0;i < opts.length; i++){
                    if(opts[i].checked){
                        info[j++] = opts[i].value;
                    }
                }

                if(typeof this.on_OK == "function"){
                    this.on_OK(info);
                }

                document.body.removeChild(this.dlg);
            }
            var Cancel = function () {
                if(typeof this.on_Cancel == "function"){
                    this.on_Cancel();
                }

                document.body.removeChild(this.dlg);
            }
            
            //opening dialog
            this.#openDialog(settings, OK, Cancel, "singleOption-dialog", content.innerHTML);
        }
        catch(error){
            console.error(error)
        }
    }
    static confirm(settings){
        try{
        	//message
        	var content = `<span>${settings.message}</span>`;
            //creating functions for OK and Cancel buttons
            var OK = function () {
                if(typeof this.on_OK == "function"){
                    this.on_OK(this.on_OK_params);
                }

                document.body.removeChild(this.dlg);
            }
            var Cancel = function () {
                if(typeof this.on_Cancel == "function"){
                    this.on_Cancel();
                }

                document.body.removeChild(this.dlg);
            }
            
            //opening dialog
            this.#openDialog(settings, OK, Cancel, "confirm-dialog", content);
        }
        catch(error){
            console.error(error)
        }
    }
    static alert(settings){
        try{
        	//message
        	var content = `<span>${settings.message}</span>`;
            //creating functions for OK and Cancel buttons
            var OK = function () {
                document.body.removeChild(this.dlg);
            }
            var Cancel = function () {

            }
            
            //opening dialog
            this.#openDialog(settings, OK, Cancel, "alert-dialog", content);
        }
        catch(error){
            console.error(error)
        }
    }
    static customDialog(settings){
        try{
            //creating dialog
            this.#openDialog(settings, () => {}, () => {}, undefined, "");

            //function for closing dialog
            function CloseDlg () {
                document.body.removeChild(this);
            }

            //getting dialog's content and targeting dialog
            var temp = document.body.querySelector("#" + settings.tempID).content.cloneNode(true);
            var dlg = document.body.querySelector(".bv-dialog-default-overlay");

            //adding content to dialog
            if(temp.querySelector("div[dialog-content]")) {
                dlg.querySelector(".bv-dialog-default-content").innerHTML = temp.querySelector("div[dialog-content]").innerHTML;
            }
            else throw "There is no content in given template.";

            //adding dialog's control buttons
            if(temp.querySelector("div[dialog-buttons]")){
                dlg.querySelector(".bv-dialog-default-F").innerHTML = temp.querySelector("div[dialog-buttons]").innerHTML;
            }
            else throw "There are no buttons in given template.";

            //targeting buttons
            var buttons = dlg.querySelector(".bv-dialog-default-F").querySelectorAll("button");

            //addind default css style and functions
            for(var i = 0; i < buttons.length; i++){
                buttons[i].classList = "bv-dialog-default-btn " + buttons[i].classList;

                if(!buttons[i].hasAttribute("close-dialog") || buttons[i].getAttribute("close-dialog") == "true"){
                    buttons[i].addEventListener("click", CloseDlg.bind(dlg));
                }
            }
        }
        catch(error){
            console.error(error);
        }
    }
}