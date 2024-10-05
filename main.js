class HELPER{
    static VerifyIsJSON(obj = Object){
        try {
            return JSON.parse(obj);
        } catch (e) {
            return false;
        };
    };
    static IsTypeofURL(string = String){
        try { 
            const is_valid_url = new URL(string);
            return true;
        }catch(e){ 
            return false;
        };
    };
};

class MUSEDBOX{
    #API = {
        linkTblMusicCard(){
            return `https://panca-hyooga.github.io/MUSEDBOX/tbl-music-card.json`;
        },
    };
    PORT = {
        gchatbox : {
            fillroom : Function,
        },
    };
    #config = {
        document_head: document.getElementsByTagName("head")[0],
        document_body: document.getElementsByTagName("body")[0],
        musiccover_path: "assets/covers/",
        sound_path: "assets/sound/",
        musiccover_img_name_extension_placeholder : "0.webp",
        iframe_link_placeholder: "about:blank",
    };
    #gates = {
        prompt : {
            new : Function,
        },
        loader : {
            show : Function,
            hide : Function,
        },
        alert : {
            new : Function,
        },
        tv : {
            show : Function,
            hide : Function,
        },
        gchatbox : {
            summon : Function,
        },
        shelf_drawer : {
            utilize : Object,
            flush : Function,
            shove : Function,
            highlight : Function,
        },
        music_card : {
            orm : {
                tbl_music_card : Object,
            },
            transport : Function,
            utilize : Object,
            rearrange : Function,
            zfocus : {
                first : Function,
                previous : Function,
                next : Function,
                targeted : Function,
            },
        },
        footer_nav : {
            utilize : Function,
            dispatch : Function,
            remix : Function,
        },
    };
    #element = {
        musedbox_header : Element,
        applogo : Element,
        musedbox_sidebar : Element,
        musedbox_body : Element,
        music_shelf : Element,
        musedbox_footer : Element,
    };
    #tabindex = {
        global_chatbox : 999940,
        applogo : 999950,
        searchbox : 999960,
        shelf_drawer : 999970,
        tv : 999982,
        prompt : 999991,
        alert : 999992,
        loader : 999993,
    };
    #musedbox_window_ = Element;

    constructor(){
        this.#DeployMusedboxWindow();
    };

    #DeployMusedboxWindow(){
        this.#__SetRequiredCssRule__();
        this.#IdentifyMusedboxWindow();
    };

    //-------------------------------------------------------------------------------------------------------------------------------------------------
    //-------------------------------------------------------------------------------------------------------------------------------------------------
    //-------------------------------------------------------------------------------------------------------------------------------------------------
    //-------------------------------------------------------------------------------------------------------------------------------------------------
    //-------------------------------------------------------------------------------------------------------------------------------------------------

    #___RandomNumberFrom({collection=[]}){
        const rand_index = Math.floor(Math.random() * ((collection.length-1) - 0) + 0);
        return collection[rand_index];
    };

    #__AudioController({audio_path_name_extension}){
        let source = new Audio(audio_path_name_extension);

        return {
            play : ()=>{
                source.play();
            },
            interrupt : ()=>{
                source.pause();
                source.currentTime = 0;
            },
            restart : function(){
                this.interrupt();
                this.play();
            },
        };
    };

    #__GetStyleValue(el, style_name = []) {
        let result = {};
        const cp_style = window.getComputedStyle(el);

        style_name.forEach((st) => {
            result[`${st}`] = parseFloat(cp_style.getPropertyValue(st));
        });

        return {
            style : (style_name)=>{
                if(result[style_name] || result[style_name] == 0){
                    return result[style_name];
                }else{
                    throw new Error("that style name doesn't mentioned on 'style_name' parameters");
                };
            },
        };
    };
    
    //-------------------------------------------------------------------------------------------------------------------------------------------------
    //-------------------------------------------------------------------------------------------------------------------------------------------------
    //-------------------------------------------------------------------------------------------------------------------------------------------------
    //-------------------------------------------------------------------------------------------------------------------------------------------------
    //-------------------------------------------------------------------------------------------------------------------------------------------------

    #_ANIMATION({target = Element, css_changes = {property_name:{'0%':0,'100%':100,unit:"px"}}, duration_ms = Number, fps = 60, monitor_max_fps = 60, iteration = 1}){
        //"still" a.k.a. "static" variable
        const still = new (function(){
            fps = Math.min(fps, monitor_max_fps);//make sure fps doesnt overflowed the monitor refresh rate

            this.time_gap_per_attemp = monitor_max_fps/fps;
            this.total_attemp_per_loop = (duration_ms/1000) * monitor_max_fps;

            this.css_style_changes = Object.entries(css_changes);
            this.css_style_changes.forEach(([entry_key, entry_val])=>{
                //validation. make sure opacity should not have unit type.
                entry_key === 'opacity' ? entry_val['unit'] = '' : '';
                //make sure convert to int so it can be calculated and not resutling NaN
                entry_val['0%'] = parseFloat(entry_val['0%']);
                entry_val['100%'] = parseFloat(entry_val['100%']);
                //adding 2 new property to each entry entry_val
                entry_val['adjustment'] = (entry_val['100%'] - entry_val['0%']) / ((duration_ms/1000) * fps);
                entry_val['progress'] = entry_val['0%'];
                //applying all 0% state on target element for each corresponding css property mentioned
                target.style[entry_key] = entry_val['0%'] + entry_val['unit'];
            });

            //clearance unused variable
            css_changes = duration_ms = fps = monitor_max_fps = undefined;
        })();

        const set_progress = {
            increment : ()=>{
                still.css_style_changes.forEach(([entry_key, entry_val])=>{
                    entry_val['progress'] += entry_val['adjustment'];
                    target.style[entry_key] = entry_val['progress'] + entry_val['unit'];
                });
            },
            decrement : ()=>{
                still.css_style_changes.forEach(([entry_key, entry_val])=>{
                    entry_val['progress'] -= entry_val['adjustment'];
                    target.style[entry_key] = Math.max(0, entry_val['progress']) + entry_val['unit'];
                });
            },
            reset : ()=>{
                still.css_style_changes.forEach(([entry_key, entry_val])=>{
                    entry_val['progress'] = entry_val['0%'];
                    target.style[entry_key] = entry_val['progress'] + entry_val['unit'];
                });
            },
        };

        const animate = new (function(){
            let windowAnimationRequest = undefined;
            let adjust = set_progress.increment;
            let cframe = undefined;
            let exec_timing = undefined;
            let loop = 1;
            let is_running = false; //prevent user spamming the button that trigger the animation again and again even tho the animation already started.
            let on_finish_func = undefined; //holding a function that will be called at the end of all iteration..

            const reset_frame_timing = ()=>{
                cframe = 0;
                exec_timing = still.time_gap_per_attemp;
            };
            //check if the animation is in the middle of execution to animate the css or no
            const is_progress_transition = ()=>{
                return !!(still.total_attemp_per_loop > cframe && cframe > 0);
            };
            const execute = ()=>{
                cframe += 1;

                if(cframe >= exec_timing){
                    //this room for code that execute each frame
                    adjust();
                    exec_timing += still.time_gap_per_attemp;
                };
                
                if(cframe >= still.total_attemp_per_loop){
                    animate.pause();
                    if(loop < iteration){
                        loop += 1;
                        animate.start(); //end of current loop, and then we restart the animation..
                    }
                    else if(loop >= iteration){//at the end of ALL loop...
                        if(typeof on_finish_func === "function"){
                            on_finish_func(); //execute the function...
                            on_finish_func = undefined; //on finish function can only be executed once.
                        };
                        loop = 1; //we reset loop count back to '1'
                    };
                    return;
                };

                windowAnimationRequest = requestAnimationFrame(execute);
            };

            this.pause = function(){
                cancelAnimationFrame(windowAnimationRequest);
                is_running = false;
            };
            this.start = function(){
                if(is_progress_transition() === false){
                    reset_frame_timing();
                    set_progress.reset();
                };
                if(is_running === false){
                    is_running = true;
                    execute();
                };
            };
            this.reverse = function(){
                adjust = (adjust === set_progress.increment ? set_progress.decrement : set_progress.increment);
                still.css_style_changes.forEach(([entry_key, entry_val])=>{
                    const temp_0 = entry_val['0%'];
                    entry_val['0%'] = entry_val['100%'];
                    entry_val['100%'] = temp_0;
                });
                if(is_progress_transition() === true){
                    cframe = still.total_attemp_per_loop - cframe;
                    exec_timing = still.total_attemp_per_loop - exec_timing;
                };
                return this;
            };
            this.onfinish = function(callback_function){
                if(!typeof callback_function === "function"){
                    throw new Error("please provide a valid function");
                };
                on_finish_func = callback_function;
                return this;
            };
        })();
        
        return {
            start : animate.start,
            pause : animate.pause,
            reverse : animate.reverse,
            onfinish : animate.onfinish,
        };
    };

    async #_FETCH({url, method = undefined, body = undefined}){
        //prepare alert window to show whatever response status from server
        const mylert = this.#gates.alert.new();

        //result interface.
        //the response json from the server are expected consist of these 3 object index :
        const RESPONSE = { 
            status : Boolean, 
            message : String,
            content : Object,
        };

        //store option for fetch api, that will be sended to server.
        const request_options = {};
        //------------------first validation rule------------------
        if(HELPER.IsTypeofURL(url) === false){throw new Error('PLease give a valid url. Example : "https://blah.com"');};
        //------------------second validation rule------------------
        if(method !== 'POST' && method !=='GET'){throw new Error('Calling ajax method must be "POST" or "GET".');};
        request_options.method = method;
        //------------------third validation rule------------------
        if(method === 'POST'){
            if(!body || body.tagName !== 'FORM'){throw new Error('Ajax body should be a valid HTML "FORM" element nodes.');};
            request_options.body = new FormData(body);
        };
        
        //show loader window
        this.#gates.loader.show();

        await fetch(url, request_options).then(async (response)=>{
            this.#gates.loader.hide();

            const response_text = await response.text();
            const response_json = HELPER.VerifyIsJSON(response_text);

            //if successfully send request to the backend, and then the backend give something back, then..
            if(response.ok && response_json){

                if(response_json.status === undefined || response_json.message === undefined || response_json.content === undefined){
                    throw new Error('Wrong response format!. There is some error on the server.');
                }else{
                    if(!(typeof response_json.status === 'boolean')){
                        throw new Error('Ajax response {status} must be type of "boolean".');
                    }
                    else if(!(typeof response_json.message === 'string')){
                        throw new Error('Ajax response {message} must be type of "string".');
                    }
                    else if(!(typeof response_json.content === 'object')){
                        throw new Error('Ajax response {content} must be type of "object".');
                    };
                };

                RESPONSE.status = response_json.status;
                RESPONSE.message = response_json.message;
                RESPONSE.content = response_json.content;

                //if code execution in the backend was attempet successfully without any error.
                if(RESPONSE.status === true){
                    if(RESPONSE.message){
                        mylert.show({
                            type : "success",
                            message : RESPONSE.message,
                            timeout_millisecond : 1500,
                        });
                    };
                }
                //display error handling sended by the backend, catch the messsage and display it as a warning.
                else if(RESPONSE.status === false){
                    mylert.show({
                        type : "warning",
                        message : `
                            ${RESPONSE.message}
                        `,
                    });
                }
                //if something else, another whatif whatif happended, then stopped the program.
                else{
                    throw new Error('Something unexpected just happened... Forced stop!.');
                };
            }
            //if any other unexpected thing happend while trying to fetch data on backeend.. then... force stop!.
            else{
                RESPONSE.status = false;
                RESPONSE.message = `Error : ${response.status} ${response.statusText}`;
                mylert.show({
                    type : "failed",
                    message : RESPONSE.message,
                });
                throw new Error('ERROR : You should try to check the network flow... Forced stop!.');
            };
        });

        //return the response from ajax call.
        return RESPONSE;
    };

    //-------------------------------------------------------------------------------------------------------------------------------------------------
    //-------------------------------------------------------------------------------------------------------------------------------------------------
    //-------------------------------------------------------------------------------------------------------------------------------------------------
    //-------------------------------------------------------------------------------------------------------------------------------------------------
    //-------------------------------------------------------------------------------------------------------------------------------------------------

    #DefineMusedboxPrompt(){
        const opacity_transition_ms = 200;

        const create_new_prompt = ()=>{
            const prompt = document.createElement("div");
            prompt.classList.add("mdb-prompt");
            prompt.setAttribute("tabindex", this.#tabindex.prompt);
            prompt.style.opacity = 0;
            prompt.style.transition = `opacity ${opacity_transition_ms}ms ease`;
            prompt.innerHTML = `
                <div class="mdb-dialogue">
                    <div class="mdb-dialogue-head">
                        <button class="mdb-dialogue-close" type="button">(X) close</button>
                        <span class="mdb-dialogue-title"></span>
                    </div>
                    <div class="mdb-dialogue-body"></div>
                    <div class="mdb-dialogue-footer">--#MuseDBox Prompt-Box#--</div>
                </div>
            `;

            const subelement = {
                title : prompt.querySelector(".mdb-dialogue-title"),
                close : prompt.querySelector(".mdb-dialogue-close"),
                body : prompt.querySelector(".mdb-dialogue-body"),
            }

            const indicator = {
                show: () => {
                    this.#musedbox_window_.prepend(prompt);
                },
                hide: () => {
                    this.#musedbox_window_.removeChild(prompt);
                },
            };
            
            const set_prompt = function({title = undefined, body = undefined}){
                if(!(typeof title === "string") || !(typeof body === "string")){
                    throw new Error("title and body must present to be able to set prompt inner html!");
                };
                subelement.title.innerHTML = title;
                subelement.body.innerHTML = body;
                return this;
            };

            const show_prompt = function(){
                indicator.show();
                prompt.focus();

                const find_input = subelement.body.querySelector('input[type="text"]');
                if(find_input) {
                    const end = find_input.value.length;
                    find_input.setSelectionRange(end, end); //place text insertion point at the end of text
                    find_input.focus();
                };
                
                prompt.style.opacity = 1;
            };

            const hide_prompt = function(){
                prompt.style.opacity = 0;

                const hide_prompt_timout = setTimeout(()=>{
                    indicator.hide();
                    clearTimeout(hide_prompt_timout);
                }, opacity_transition_ms);
            };

            //get element node inside prompt body
            const select_prompt_child_element = function(css_selector){
                return subelement.body.querySelector(css_selector);
            };

            const select_prompt_child_many = function(css_selector){
                return Array.from(subelement.body.querySelectorAll(css_selector));
            };

            subelement.close.addEventListener("click", ()=>{
                hide_prompt();
            });

            return {
                set : set_prompt,
                child : select_prompt_child_element,
                childs : select_prompt_child_many,
                show : show_prompt,
                hide : hide_prompt,
            };
        };

        //store the gate into the class property. so it can be used globally inside this class scope.
        //global gate.
        this.#gates.prompt = {
            new : create_new_prompt, //return one manipulable prompt element as an object that have method to manipulate it.
        };
    };

    #DefineMusedboxLoadingScreen(){
        const loader = document.createElement("div");
        loader.setAttribute("id", "mdb-loader");
        loader.setAttribute("tabindex", this.#tabindex.loader);

        const is_loader_exist = ()=>{
            return !!(this.#musedbox_window_.querySelector("#mdb-loader"));
        };

        const show_loading_screen = ()=>{
            if(is_loader_exist() === true){
                throw new Error('Only one request are allowed at a time!');
            };
            this.#musedbox_window_.prepend(loader);
            loader.focus();
        };

        const hide_loading_screen = ()=>{
            if(is_loader_exist() === true){
                this.#musedbox_window_.removeChild(loader);
            }
            else{
                console.log("there is no loading screen to hide...")
            };
        };

        //store into global gate.
        this.#gates.loader = {
            show : show_loading_screen,
            hide : hide_loading_screen,
        };
    };

    #DefineMusedboxAlert(){
        const create_new_alert = ()=>{
            const alert = document.createElement("div");
            alert.classList.add("mdb-alert");
            alert.setAttribute("tabindex", this.#tabindex.alert);
            alert.innerHTML = `
                <div class="mdb-alert-msgbox">
                    <div class="mdb-alert-head">
                        <button class="mdb-alert-close" type="button">(X) close</button>
                        <span class="mdb-alert-title">alertbok</span>
                    </div>
                    <div class="mdb-alert-body">
                        (filled with something)
                    </div>
                    <div class="mdb-alert-footer">
                        --#MuseDBox Alert#--
                    </div>
                </div>
            `;

            const subelement = {
                title : alert.querySelector(".mdb-alert-title"),
                close : alert.querySelector(".mdb-alert-close"),
                body : alert.querySelector(".mdb-alert-body"),
            };

            const refresh = {
                class : ()=>{
                    alert.removeAttribute("class");
                    alert.classList.add("mdb-alert");
                },
                body : ()=>{
                    subelement.body.innerHTML = '(no-message)';
                },
            };

            const is_alert_exist = ()=>{
                return !!(this.#musedbox_window_.querySelector(".mdb-alert"));
            };

            const hide_alert_window = ()=>{
                refresh.class();
                refresh.body();
                if(is_alert_exist() === true){
                    this.#musedbox_window_.removeChild(alert);
                };
            };

            const show_alert_window = ({type = "alert", message = undefined, timeout_millisecond = undefined})=>{
                if(!(typeof message === 'string')){
                    throw new Error('show alert failed, message must be type of "string".');
                };

                switch(type){
                    case "success" :
                        subelement.title.innerHTML = "Success Notice";
                        alert.classList.add("mdb-alert-success");
                    break;
                    case "warning" :
                        subelement.title.innerHTML = "Warning Notice";
                        alert.classList.add("mdb-alert-warning");
                    break;
                    case "failed" :
                        subelement.title.innerHTML = "Failed Notice";
                        alert.classList.add("mdb-alert-failed");
                    break;
                    case "alert" :
                        subelement.title.innerHTML = "(!)Alert Notice(!)";
                        alert.classList.add("mdb-alert-alert");
                    break;
                };

                subelement.body.innerHTML = message;

                this.#musedbox_window_.prepend(alert);
                alert.focus();

                if(typeof timeout_millisecond === 'number'){
                    const hide_alert_timeout = setTimeout(()=>{
                        console.log("hiding alert window, now.");
                        hide_alert_window();
                    }, timeout_millisecond);
                };
            };

            subelement.close.addEventListener("click", function(){
                hide_alert_window();
            });

            return {
                show : show_alert_window,
            };
        };

        //store into global gate.
        this.#gates.alert = {
            new : create_new_alert,
        };
    };

    #DefineTVWindow(){
        let tv_fade_timeout_timer = undefined;
        let iframe_played_timout_timer = undefined;
        const rand_number = ()=>{return this.#___RandomNumberFrom({collection:[400,700,950,1300,1500]});};
        const tv_opacity_transition_ms = 1500;

        const tv = document.createElement("div");
        tv.classList.add("mdb-tv");
        tv.setAttribute("tabindex", this.#tabindex.tv);
        tv.style.opacity = 0;
        tv.style.transition = `opacity ${tv_opacity_transition_ms}ms ease`;
        tv.innerHTML = `
            <div class="mdb-tv-screen">
                <div class="mdb-screen-partial mdb-screen-left" style="transition:left ${tv_opacity_transition_ms-500}ms ease;left:-50%;">
                    <div class="mdb-screen-frame"></div>
                </div>
                <div class="mdb-screen-partial mdb-screen-right" style="transition:right ${tv_opacity_transition_ms-500}ms ease;right:-50%;">
                    <div class="mdb-screen-frame"></div>
                </div>
                <div class="mdb-screen-center">
                     <iframe tabindex="728" class="mdb-screen-embeder" src="${this.#config.iframe_link_placeholder}"></iframe> 
                     <div class="mdb-screen-buttons">
                        <button class="mdb-screen-btnprev" type="button">PREV</button>
                        <button class="mdb-screen-btnnext" type="button">NEXT</button>
                        <button class="mdb-screen-btnclose" type="button">CLOSE</button>
                     </div>
                </div>
            </div>
        `;

        const subelement = {
            part_left : tv.querySelector(".mdb-screen-left"),
            part_right : tv.querySelector(".mdb-screen-right"),
            iframe : tv.querySelector(".mdb-screen-embeder"),
            btn_prev : tv.querySelector(".mdb-screen-btnprev"),
            btn_next : tv.querySelector(".mdb-screen-btnnext"),
            btn_close : tv.querySelector(".mdb-screen-btnclose"),
        };

        const indicator = {
            attach : ()=>{
                this.#musedbox_window_.prepend(tv);
            },
            detach : ()=>{
                this.#musedbox_window_.removeChild(tv);
            },
            show : ()=>{
                tv.style.opacity = 1;
                subelement.part_left.style.left = "0%";
                subelement.part_right.style.right = "0%";
                tv.focus();
            },
            hide : ()=>{
                tv.style.opacity = 0;
                subelement.part_left.style.left = "-50%";
                subelement.part_right.style.right = "-50%";
                tv.blur();
            },
        };

        const refresh = {
            tv_fade_timeout_timer : ()=>{
                if(tv_fade_timeout_timer){
                    clearTimeout(tv_fade_timeout_timer);
                    tv_fade_timeout_timer = undefined;
                };
            },
            iframe_src_and_timer : ()=>{
                subelement.iframe.src = this.#config.iframe_link_placeholder;
                if(iframe_played_timout_timer){
                    clearTimeout(iframe_played_timout_timer);
                    iframe_played_timout_timer = undefined;
                };
            },
        };

        const sfx = {
            transition : this.#__AudioController({audio_path_name_extension: this.#config.sound_path+'static-noise.mp3'}),
            click : this.#__AudioController({audio_path_name_extension: this.#config.sound_path+'click.mp3'}),
        };

        const iframe_set_src = (link)=>{
            subelement.iframe.src = link+"?autoplay=1";
        };

        const iframe_change_transition = (link)=>{
            const numba = rand_number();
            sfx.transition.restart();
            refresh.iframe_src_and_timer();
            iframe_played_timout_timer = setTimeout(()=>{
                iframe_set_src(link);
                sfx.transition.interrupt();
                sfx.click.restart();
            }, numba);
        };

        const subelement_func = {
            goPrevTrack : ()=>{
                this.#gates.music_card.zfocus.previous((link)=>{iframe_change_transition(link);});
            },
            goNextTrack : ()=>{
                this.#gates.music_card.zfocus.next((link)=>{iframe_change_transition(link);});
            },
            blurAway : ()=>{
                indicator.hide();
                sfx.transition.interrupt();
                sfx.click.interrupt();
                refresh.iframe_src_and_timer();
                refresh.tv_fade_timeout_timer();
                tv_fade_timeout_timer = setTimeout(()=>{
                    indicator.detach();
                }, tv_opacity_transition_ms);
            },
        };

        subelement.btn_prev.addEventListener("click", subelement_func.goPrevTrack, true);
        subelement.btn_next.addEventListener("click", subelement_func.goNextTrack, true);
        subelement.btn_close.addEventListener("click", subelement_func.blurAway, true);

        const show_tv_window = ({embedlink})=>{
            if(!!(this.#musedbox_window_.querySelector(".mdb-tv")) !== false){
                console.log("tv exsist... now rejecting attempt of showing more tv...");
                return;
            };

            if(!embedlink || embedlink && HELPER.IsTypeofURL(embedlink) !== true){
                console.log("link not set.. please provide a valid url...");
                return;
                //throw new Error("please provide a valid url");
            };

            indicator.attach();
            refresh.tv_fade_timeout_timer();
            tv_fade_timeout_timer = setTimeout(function(){
                //this function must be triggered after a short delay.
                //we give delay by using settimeout.
                indicator.show();//we cannot trigger this immidiately after prepend the tv into musedbox window.
                sfx.transition.restart();
                refresh.iframe_src_and_timer();
                iframe_played_timout_timer = setTimeout(()=>{
                    if(embedlink){
                        iframe_set_src(embedlink);
                    };
                    sfx.transition.interrupt();
                }, tv_opacity_transition_ms);
            }, 200);
        };

        this.#gates.tv = {
            show : show_tv_window,
        };
    };

    //-------------------------------------------------------------------------------------------------------------------------------------------------
    //-------------------------------------------------------------------------------------------------------------------------------------------------
    //-------------------------------------------------------------------------------------------------------------------------------------------------
    //-------------------------------------------------------------------------------------------------------------------------------------------------
    //-------------------------------------------------------------------------------------------------------------------------------------------------

    #__SetRequiredCssRule__(){
        const style = document.createElement("style");
        style.textContent = `
        *{
            box-sizing: border-box !important;
        }
        html,body{
            margin:0px !important;
            padding:0px !important;
            width: 100% !important;
            height: 100% !important;
        }
                #musedbox-container > .mdb-tv{
                    position: fixed;
                    width: 100%;
                    height: 100%;
                    z-index: 3;
                    top:0px;
                    left:0px;
                }
                    #musedbox-container > .mdb-tv > .mdb-tv-screen > .mdb-screen-center{
                        z-index: 4;
                    }
                    #musedbox-container > .mdb-tv > .mdb-tv-screen > .mdb-screen-left, #musedbox-container > .mdb-tv > .mdb-tv-screen > .mdb-screen-right{
                        z-index: 3;
                    }
                #musedbox-container > .mdb-prompt{
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: fixed;
                    width: 100%;
                    height: 100%;
                    z-index: 8;
                    top:0px;
                    left:0px;
                }
                #musedbox-container > .mdb-alert{
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: fixed;
                    width: 100%;
                    height: 100%;
                    z-index: 10;
                    top:0px;
                    left:0px;
                }
                #musedbox-container > #mdb-loader{
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: fixed;
                    width: 100%;
                    height: 100%;
                    z-index: 9;
                    top:0px;
                    left:0px;
                }
                #musedbox-container > #musedbox-body > #music-shelf > ul#shelf-drawer{
                    position: relative !important;
                }
                    #musedbox-container > #musedbox-body > #music-shelf > ul#shelf-drawer > li.music-card:first-child{
                        margin-top:30vh !important;
                    }
                    #musedbox-container > #musedbox-body > #music-shelf > ul#shelf-drawer > li.music-card:last-child{
                        margin-bottom:30vh !important;
                    }
        `;
        this.#config.document_head.appendChild(style);
    };

    //-------------------------------------------------------------------------------------------------------------------------------------------------
    //-------------------------------------------------------------------------------------------------------------------------------------------------
    //-------------------------------------------------------------------------------------------------------------------------------------------------
    //-------------------------------------------------------------------------------------------------------------------------------------------------
    //-------------------------------------------------------------------------------------------------------------------------------------------------

    #IdentifyMusedboxWindow(){
        //1.store musedbox window that already present on DOM, into a variable
        this.#musedbox_window_ = document.getElementById("musedbox-container");

        //2.call method that would identify existing element inside musedbox window
        this.#DefineMusedboxPrompt();
        this.#DefineMusedboxLoadingScreen();
        this.#DefineMusedboxAlert();
        this.#DefineTVWindow();
        //...............................
        this.#IdentifyMusedboxHeader();
        this.#CreateMusedboxSidebar();
        this.#IdentifyMusedboxBody();
        this.#IdentifyMusedboxFooter();
        
        //3.function for the musedbox window. work inside musedbox window element node scope.
        const onload = (()=>{
            this.#gates.music_card.transport();
        })();
    };

    #IdentifyMusedboxHeader(){
        //1.store musedbox header that already present on DOM, into a variable
        this.#element.musedbox_header = document.getElementById("musedbox-header");

        //2.call method that would identify existing element inside musedbox header
        this.#AssembleHeaderSearchbox();
        this.#IdentifyHeaderLogo();
        
        //3.function for the musedbox header. work inside musedbox header element node scope.
        const onload = (()=>{
            
        })();
    };

    #IdentifyHeaderLogo(){
        //1.store musedbox header that already present on DOM, into a variable
        this.#element.applogo = document.getElementById("header-logo");
        this.#element.applogo.setAttribute("tabindex", this.#tabindex.applogo);

        //2.call method that would identify existing element inside musedbox header
        //......
        
        //3.function for the musedbox header. work inside musedbox header element node scope.
        const onload = (()=>{
            
        })();
    };

    #AssembleHeaderSearchbox(){
        const searchbox = document.getElementById("header-search");
        searchbox.setAttribute("tabindex", this.#tabindex.searchbox);
        searchbox.innerHTML = `
            <input id="mdb-search-input" type="text" placeholder="Search for a muse-ic!" autocomplete="off">
            <button id="mdb-search-submit" type="button">FIND</button>
            <div id="mdb-search-result-box">
                <ul id="mdb-search-result-ul">
                    <li class="mdb-search-result-card">--placeholder--</li>
                </ul>
            </div>
        `;

        const subelement = {
            input_text : searchbox.querySelector("#mdb-search-input"),
            btn_submit : searchbox.querySelector("#mdb-search-submit"),
            resultbox : searchbox.querySelector("#mdb-search-result-box"),
            resultbox_ul : searchbox.querySelector("#mdb-search-result-box > #mdb-search-result-ul"),
        };
        
        const result_card_func = {
            locateMusicCard : ({data_id, data_trackPackname})=>{
                const findbtn_cat_node = this.#gates.footer_nav.utilize.find_btn_cat_by_trackPackname(data_trackPackname);
                this.#gates.footer_nav.remix({btn_cat_node: findbtn_cat_node});
                const findmusic_card_node = this.#gates.music_card.utilize.find_music_card_by_id(data_id);
                this.#gates.music_card.zfocus.targeted(findmusic_card_node);
            },
        };

        const spawn_new_search_result_card = ({data_id, data_trackPackname, data_title, data_img_name_extension})=>{
            const resultcard_li = document.createElement("li");
            resultcard_li.setAttribute("class", "mdb-search-result-card");
            resultcard_li.style.backgroundImage = `url(${this.#config.musiccover_path+data_img_name_extension})`;
            resultcard_li.innerHTML = `
                <div class="mdb-sreca-wrapper">
                    <span class="mdb-sreca-title">${data_title}</span>
                    <button class="mdb-sreca-button">Reveal</button>
                </div>
            `;

            resultcard_li.querySelector("button").addEventListener("click", ()=>{
                result_card_func.locateMusicCard({data_id: data_id, data_trackPackname: data_trackPackname});
                this.#gates.shelf_drawer.highlight();
            }, true);

            subelement.resultbox_ul.appendChild(resultcard_li);
        };

        const refresh = {
            input_text : ()=>{
                subelement.input_text.value = ``;
            },
            resultbox_ul : ()=>{
                subelement.resultbox_ul.innerHTML = ``;
            },
        };

        const modifier = {
            read_input_text : ()=>{
                const val = subelement.input_text.value;
                return val.length > 0 ? val : undefined;
            },
            validate_is_searchbox_node : (element_node)=>{
                return element_node && element_node.nodeType && element_node.id === "header-search" ? true : false;
            },
            is_searchbox_parent_of_ : (element_node)=>{
                return !!(element_node.closest("#header-search")); //return true or false
            },
        };

        const indicator = {
            show : ()=>{
                subelement.resultbox.style.display = "block";
            },
            hide : ()=>{
                subelement.resultbox.removeAttribute("style");
            },
        };

        const subelement_func = {
            crawlMusicCardData : ()=>{
                //console.log('tigered');
                refresh.resultbox_ul();
                const text = modifier.read_input_text();
                if(text === undefined){
                    indicator.hide();
                    return;
                };

                indicator.show();
                const tbl_data = this.#gates.music_card.orm.tbl_music_card.overhaul({search_title:text});
                if(tbl_data && tbl_data.length > 0){
                    for(let i=0; i<tbl_data.length && i<10; i++){
                        spawn_new_search_result_card({
                            data_id: tbl_data[i].id,
                            data_trackPackname: tbl_data[i].trackPackname,
                            data_title: tbl_data[i].title,
                            data_img_name_extension: tbl_data[i].logo,
                        });
                    };
                }else{
                    spawn_new_search_result_card({
                        data_id: 0,
                        data_trackPackname: "(blank)",
                        data_title: "(no data found)",
                        data_img_name_extension: this.#config.musiccover_img_name_extension_placeholder,
                    });
                };
            },
        };

        searchbox.addEventListener("focusin", e =>{
            subelement_func.crawlMusicCardData();
        }, false);

        searchbox.addEventListener("focusout", e=>{
            if(!e.relatedTarget || !modifier.is_searchbox_parent_of_(e.relatedTarget)){
                indicator.hide();
            };
        }, false);
        
        subelement.btn_submit.addEventListener("focusin", e => {e.stopPropagation();}, true);
        subelement.resultbox.addEventListener("focusin", e => {e.stopPropagation();}, true);

        subelement.input_text.addEventListener("keyup", subelement_func.crawlMusicCardData, true);
        subelement.btn_submit.addEventListener("click", subelement_func.crawlMusicCardData, true);
    };

    #CreateMusedboxSidebar(){
        //1.create the sidebar nodes
        const sidebar = document.createElement("div"); 
        sidebar.setAttribute("id", "musedbox-sidebar");
        sidebar.innerHTML = `
            <div class="mdb-sidebar-wrapper">
                <button id="mdb-sidebar-btn-credit"><i class="icofont-newspaper"></i></button>
                <button id="mdb-sidebar-btn-chat"><i class="icofont-ui-text-chat"></i></button>
            </div>
        `;

        //2.store sidebar into the element storage. if its will be used later in another method or function
        this.#element.musedbox_sidebar = sidebar;

        //3.call method that would crate the element inside the sidebar
        this.#DefineSidebarGlobalChatbox();

        //4.append sidebar into its parent element
        this.#element.musedbox_header.insertAdjacentElement("afterend", this.#element.musedbox_sidebar);

        //5.function for the sidebar. work inside sidebar element node scope.
        const onload = (()=>{
            //store element node of any child element in sidebar.
            const subelement = {
                btn_credit : sidebar.querySelector("#mdb-sidebar-btn-credit"),
                btn_chat : sidebar.querySelector("#mdb-sidebar-btn-chat"),
            };

            //prepare function for each button in sidebar
            const subelement_func = {
                openCreditPrompt : ()=>{
                    this.#gates.prompt.new().set({
                        title: `[[MUSEDBOX]] ver.03_10_24.11_55.02 (BETA)`,
                        body: `
                            <h3>ABOUT</h3>
                            <p>
                                This app was made to list all tracks from the game of "Muse Dash", linking to music video from their original creator on youtube.<br/> 
                                If you have any taught or concern about this app, feel free to contact me using global chat box provided here.<br/> 
                                I will keep updating this app to add more feature, stay tuned!. <br/> 
                                On the next update, i planning to add some new features like "autoplay" and "playlist". What do you think?
                            </p>
                            <h3>LINKS</h3>
                            <ul>
                                <li><a href="https://www.twitch.tv/punchyandmenggy" target="_blank">My TWITCH Channel</a></li>
                                <li><a href="https://cdn.peroperogames.com/" target="_blank">Peropero Official site</a></li>
                                <li><a href="https://store.steampowered.com/app/774171/Muse_Dash/" target="_blank">Buy The Game on Steam</a></li>
                                <li><a href="https://musedash.gamepedia.com/" target="_blank">MUSEDASH Wiki</a></li>
                                <li><a href="https://www.shorturl.at/OAVil" target="_blank">Muse-ic Youtube Playlist</a></li>
                            </ul>
                        `
                    }).show();
                },
                openGlobalChatbox : ()=>{
                    this.#gates.gchatbox.summon();
                },
            };

            //attach each function into the button. to where it should be.
            subelement.btn_credit.addEventListener("click", subelement_func.openCreditPrompt, true);
            subelement.btn_chat.addEventListener("click", subelement_func.openGlobalChatbox, true);
        })();
    };

    #DefineSidebarGlobalChatbox(){
        const ini = this;

        const gchatbox = document.createElement("div");
        gchatbox.setAttribute("id", "sidebar-gchatbox");
        gchatbox.setAttribute("tabindex", this.#tabindex.global_chatbox);
        // style="left:0%;width:0px;height:0px;opacity:0;"
        gchatbox.innerHTML = `
            <div class="gchatbox-wrapper" style="visibility:hidden;">
                <div class="gchatbox-content">
                    <button class="gchatbox-close">(X)close</button>
                    <div class="gchatbox-room">
                        to be filled...
                    </div>
                </div>
            </div>
        `;

        const subelement = {
            wrapper : gchatbox.querySelector(".gchatbox-wrapper"),
            room : gchatbox.querySelector(".gchatbox-room"),
            btn_close : gchatbox.querySelector(".gchatbox-close"),
        };

        const indicator = {
            focus : ()=>{
                gchatbox.focus();
            },
            show : ()=>{
                this.#element.musedbox_sidebar.insertAdjacentElement("beforeend", gchatbox);
            }
        };

        const subelement_manage = {
            wrapper : new (function(){
                let is_still_animating = false;
                const animation = ini.#_ANIMATION({target : subelement.wrapper,
                    css_changes : {
                        width : {'0%':0, '100%':280, unit:'px'},
                        height : {'0%':0, '100%':380, unit:'px'},
                        opacity : {'0%':0, '100%':1},
                        left : {'0%':0, '100%':100, unit:'%'},
                    }, duration_ms : 200, fps: 60});

                const is_visible = ()=>{
                    return !!(subelement.wrapper.hasAttribute("data-toggle-identifier")); //true or false
                };

                this.toggle = ()=>{
                    if(is_still_animating === false){
                        is_still_animating = true;
                        if(is_visible() === false){
                            subelement.wrapper.style.visibility = "visible";
                            animation.onfinish(()=>{
                                subelement.wrapper.setAttribute("data-toggle-identifier","");
                                is_still_animating=false;
                            }).start();
                        }else if(is_visible() === true){
                            animation.onfinish(()=>{
                                subelement.wrapper.removeAttribute("data-toggle-identifier");
                                is_still_animating=false;
                                animation.reverse();
                                subelement.wrapper.style.visibility = "hidden";
                            }).reverse().start();
                        };
                    };
                };
                this.fillroom = ({htmlstring})=>{
                    subelement.room.innerHTML = htmlstring
                };
            })(),
        };

        subelement.btn_close.addEventListener("click", subelement_manage.wrapper.toggle, true);

        indicator.show();

        //global gates
        this.#gates.gchatbox = {
            summon : subelement_manage.wrapper.toggle,
        };
        //adding useable function into port. so it can be used outside this class scope
        this.PORT.gchatbox = {
            fillroom : subelement_manage.wrapper.fillroom,
        };
    };

    #IdentifyMusedboxBody(){
        //1.store musedbox body that already present on DOM, into a variable
        this.#element.musedbox_body = document.getElementById("musedbox-body");

        //2.call method that would identify existing element inside musedbox body
        this.#IdentifyBodyMusicShelf();
        
        //3.function for the musedbox body. work inside musedbox body element node scope.
        const onload = (()=>{
            
        })();
    };

    #IdentifyBodyMusicShelf(){
        //1.store music shelf that already present on DOM, into a variable
        this.#element.music_shelf = document.getElementById("music-shelf");

        //2.call method that would identify existing element inside music shelf
        this.#AssembleShelfDrawer();
        this.#ProduceMusicCard();
        
        //3.function for the music shelf. work inside music shelf element node scope.
        const onload = (()=>{
            
        })();
    };

    #AssembleShelfDrawer(){
        //store shelf drawer that already present on DOM, into a variable
        const shelf_drawer = document.getElementById("shelf-drawer");
        shelf_drawer.setAttribute("tabindex", this.#tabindex.shelf_drawer);

        const refresh = {
            shelf_drawer : ()=>{
                shelf_drawer.innerHTML = "";
            },
        };

        const modifier = {
            shelf_drawer_half__offsetHeight : ()=>{
                return shelf_drawer.offsetHeight / 2;
            },
            shelf_drawer__getBoundingClientRect : ()=>{
                return shelf_drawer.getBoundingClientRect();
            },
            shelf_drawer__scrollTo : (option={top,left,behavior})=>{
                shelf_drawer.scrollTo(option);
            },
            shelf_drawer__addEventListener : (type, listener, usecapture=false)=>{
                shelf_drawer.addEventListener(type, listener, usecapture);
            },
            is_shelf_drawer_parent_of_ : (element_node)=>{
                return !!(element_node.closest("#shelf-drawer"));
            },
        };

        const append_child = (element_node)=>{
            shelf_drawer.appendChild(element_node);
        };

        const shelf_drawer_setfocus = ()=>{
            shelf_drawer.focus();
        };

        this.#gates.shelf_drawer = {
            utilize : modifier,
            flush : refresh.shelf_drawer,
            shove : append_child,
            highlight : shelf_drawer_setfocus,
        };
    };

    #ProduceMusicCard(){
        const ini = this;

        const orm = {
            tbl_music_card : new (function(){
                let data = [];
                let callbacks = [];
                this.interface = {
                    id : Number,
                    trackPackname : ["Default Music","Concept Pack","Happy Otaku Pack","Cute Is Everything","Give Up TREATMENT","Collab","MD Plus Project"],
                    title : String,
                    logo : String,
                    artist : String,
                    link : String,
                };
                this.morpher = {
                    is_empty_data : ()=>{
                        return data.length > 0 ? false : true;
                    },
                    is_trackPackname_includes : (string=String)=>{
                        return this.interface.trackPackname.includes(string);
                    },
                };
                this.overhaul = (option={sort_trackPackname:String, search_title:String})=>{
                    if(this.morpher.is_empty_data() !== false){
                        throw new Error("data not loaded yet, please commit initialization first!...");
                    };

                    let data_tempt = data;

                    if(typeof option.sort_trackPackname === "string"){
                        if(this.morpher.is_trackPackname_includes(option.sort_trackPackname) !== true){
                            throw new Error("sort_trackPackname string not a part of interface trackPackname. please check there...");
                        };
                        data_tempt = data_tempt.filter(obj => obj.trackPackname && obj.trackPackname === option.sort_trackPackname);
                    };

                    if(typeof option.search_title === "string"){
                        let regex = new RegExp(option.search_title, "i"); //"i" flags mean incasensitive
                        data_tempt = data_tempt.filter(obj => obj.title && regex.test(obj.title) === true);
                    };

                    return data_tempt;
                };
                this.register = (callback_function)=>{
                    if(typeof this.initialization !== "function"){
                        throw new Error("initialization has been called, cant register more function into it..");
                    };
                    if(!typeof callback_function === "function"){
                        throw new Error("please provide a function that will be registered as callback when data has been fully loaded..");
                    };
                    callbacks.push(callback_function);
                }
                this.initialization = ()=>{
                    if(this.morpher.is_empty_data() !== true){
                        throw new Error("data already been loaded, rejecting attempt to request more data...");
                    };

                    ini.#_FETCH({url: ini.#API.linkTblMusicCard(),method:"GET"}).then(result => {
                        if(result.status !== true){
                            throw new Error("fetch tabel music card json failed....");
                        };
                        data = result.content;
                        callbacks.forEach(function_definition => {function_definition();});
                        //prevent doing more initialization, because it can be done only one time.
                        this.initialization = undefined;
                    });
                };
            })(),
        };

        const modifier = {
            get_first_visible_music_card : ()=>{
                return this.#element.music_shelf.querySelector("li.music-card:first-child");
            },
            find_parent_music_card_of : (child_element_node)=>{
                return child_element_node.closest(".music-card");
            }, 
            validate_is_music_card_node : (element_node)=>{
                return element_node && element_node.nodeType && element_node.classList.contains("music-card") ? true : false;
            },
            read_music_card_order : function(music_card_node){
                return parseInt(music_card_node.getAttribute("data-mcard-order"));
            },
            read_music_card_id : function(music_card_node){
                return parseInt(music_card_node.getAttribute("data-mcard-id"));
            },
            read_music_card_link : function(music_card_node){
                return music_card_node.getAttribute("data-mcard-link");
            },
            is_music_card_link_present : function(music_card_node){
                const link = this.read_music_card_link(music_card_node);
                const ck = link.substring(link.indexOf("embed/") + 6).length;
                return ck && ck > 0 ? true : false;
            },
            find_music_card_by_order : (order_number)=>{
                return this.#element.music_shelf.querySelector(`li.music-card[data-mcard-order="${order_number}"]`);
            },
            find_music_card_by_id : (id_number)=>{
                const fin = Array.from(this.#element.music_shelf.querySelectorAll(`li.music-card[data-mcard-id="${id_number}"]`));
                if(fin.length > 1){
                    throw new Error('multiple card with same id detected!!. FATALL ERRORR!');
                };
                return fin[0];
            },
            find_music_card_in : (container_node)=>{
                return container_node.querySelector("li.music-card");
            },
            find_parent_musicc_wrapper_of : (child_element_node)=>{
                return child_element_node.closest(`.musicc-wrapper`);
            },
            find_zfocused_music_card : ()=>{
                return this.#element.music_shelf.querySelector("li.music-card.scale-100");
            },
            clean_music_card_css_subclass : (music_card_node)=>{
                music_card_node.setAttribute("class","music-card");
            },
            add_scale_music_card : function(music_card_node, number_percentage){
                if(number_percentage !== 100 && number_percentage !== 90 && number_percentage !== 80){
                    throw new Error("scale option available is : 80, 90, or 100");
                };
                this.clean_music_card_css_subclass(music_card_node);
                music_card_node.classList.add(`scale-${number_percentage}`);
            },
            get_all_visible_scaled_music_card : ()=>{
                return Array.from(this.#element.music_shelf.querySelectorAll("li.music-card.scale-80, li.music-card.scale-90, li.music-card.scale-100"));
            },
            is_zfocused_music_card : (music_card_node)=>{
                return music_card_node.classList.contains("scale-100") ? true : false;
            },
        };

        const music_card_func = new (function(){
            let zfocused_music_card = undefined;

            //when you are scrolling the shelf_drawer too fast, there is a chance that the card scaling will broke.
            //so here, we make sure to remove all scaling, before applying new scalling into middle music card.
            const purge_zfocus_leftover = ()=>{
                const scaled_leftover_musiccard = modifier.get_all_visible_scaled_music_card();
                scaled_leftover_musiccard.forEach(element => {
                    modifier.clean_music_card_css_subclass(element);
                });
            };

            const change_zfocus_levels = ()=>{
                purge_zfocus_leftover();

                const zfocused_music_card_order = modifier.read_music_card_order(zfocused_music_card);
            
                const card0 = modifier.find_music_card_by_order(zfocused_music_card_order - 3);
                const card1 = modifier.find_music_card_by_order(zfocused_music_card_order - 2);
                const card2 = modifier.find_music_card_by_order(zfocused_music_card_order - 1);
                const card3 = modifier.find_music_card_by_order(zfocused_music_card_order);
                const card4 = modifier.find_music_card_by_order(zfocused_music_card_order + 1);
                const card5 = modifier.find_music_card_by_order(zfocused_music_card_order + 2);
                const card6 = modifier.find_music_card_by_order(zfocused_music_card_order + 3);
    
                if(card0){modifier.clean_music_card_css_subclass(card0)};
                if(card1){modifier.add_scale_music_card(card1, 80)};
                if(card2){modifier.add_scale_music_card(card2, 90)};
                if(card3){modifier.add_scale_music_card(card3, 100)};
                if(card4){modifier.add_scale_music_card(card4, 90)};
                if(card5){modifier.add_scale_music_card(card5, 80)};
                if(card6){modifier.clean_music_card_css_subclass(card6)};
            };

            const jumpscroll_into_middle = (target_music_card = zfocused_music_card)=>{
                if(modifier.validate_is_music_card_node(target_music_card) !== true){
                    throw new Error("cant jumpscroll, please provide a valid music card node");
                };
                const shelf_half_h = ini.#gates.shelf_drawer.utilize.shelf_drawer_half__offsetHeight();
                const calc_scroll_by_top = target_music_card.offsetTop - shelf_half_h  + (target_music_card.offsetHeight / 2);
                ini.#gates.shelf_drawer.utilize.shelf_drawer__scrollTo({top: calc_scroll_by_top, behavior: "smooth",});
            };

            ini.#gates.shelf_drawer.utilize.shelf_drawer__addEventListener("scroll", ()=>{
                const scan_which_music_card_on_middle = (()=>{
                    const bounding = ini.#gates.shelf_drawer.utilize.shelf_drawer__getBoundingClientRect();
                    const half_width = bounding.left + (bounding.width/2);
                    const half_height = bounding.top + (bounding.height/2);
                    const mid_shelf = document.elementFromPoint(half_width, half_height);

                    zfocused_music_card = undefined;

                    if(ini.#gates.shelf_drawer.utilize.is_shelf_drawer_parent_of_(mid_shelf) !== true){
                        //console.log("coz you scanning outside shelf drawer... stopping");
                        return;
                    };
                    
                    //if(mid_shelf.classList.contains("music-card"))
                    //use conditional statemenet above if below code seems making some error
                    if(modifier.validate_is_music_card_node(mid_shelf) === true){
                        zfocused_music_card = mid_shelf;
                    };
                    if(modifier.validate_is_music_card_node(zfocused_music_card) !== true){
                        zfocused_music_card = modifier.find_parent_music_card_of(mid_shelf);
                    };
                })();
                if(modifier.validate_is_music_card_node(zfocused_music_card) !== true){
                    //console.log("Stopping attempt to focus on mid music card.... Because music shelf are covered with any other elements...");
                    return;
                };
                change_zfocus_levels();
            }, true);

            this.zfocus_first_music_card = ()=>{
                const first_music_card = modifier.get_first_visible_music_card();
                
                if(modifier.validate_is_music_card_node(first_music_card) === true){
                    zfocused_music_card = first_music_card;
                    jumpscroll_into_middle(zfocused_music_card);
                    change_zfocus_levels();
                }else{
                    //console.log("No first & focuses music card");
                };
            };

            this.zfocus_previous_music_card = (callback_function)=>{
                const curr_zfocus = modifier.find_zfocused_music_card();
                const cf_order = modifier.read_music_card_order(curr_zfocus);
                const prev_music_card = modifier.find_music_card_by_order(cf_order-1);
                
                if(modifier.validate_is_music_card_node(prev_music_card) === true){
                    zfocused_music_card = prev_music_card;
                    jumpscroll_into_middle(zfocused_music_card);
                    change_zfocus_levels();
                    if(typeof callback_function === "function"){
                        const link = modifier.read_music_card_link(zfocused_music_card);
                        callback_function(link);
                    };
                }else{
                    //console.log("No previous & focuses music card");
                };
            };

            this.zfocus_next_music_card = (callback_function)=>{
                const curr_zfocus = modifier.find_zfocused_music_card();
                const cf_order = modifier.read_music_card_order(curr_zfocus);
                const next_music_card = modifier.find_music_card_by_order(cf_order+1);
                
                if(modifier.validate_is_music_card_node(next_music_card) === true){
                    zfocused_music_card = next_music_card;
                    jumpscroll_into_middle(zfocused_music_card);
                    change_zfocus_levels();
                    if(typeof callback_function === "function"){
                        const link = modifier.read_music_card_link(zfocused_music_card);
                        callback_function(link);
                    };
                }else{
                    //console.log("No next & focuses music card");
                };
            };

            this.zfocus_targeted = (target_music_card_node, callback_function)=>{
                zfocused_music_card = target_music_card_node;
                if(modifier.validate_is_music_card_node(zfocused_music_card) !== true){
                    //console.log("Target is not music card node...");
                    return;
                };
                jumpscroll_into_middle(zfocused_music_card);
                change_zfocus_levels();
                return typeof callback_function === "function" ? callback_function() : undefined;
            };
        })();

        const spawn_new_music_card = ({music_card_order,data_id,data_title,data_img_name_extension,data_author,data_link="https://www.google.com"})=>{
            const music_card = document.createElement("li");
            music_card.setAttribute("class", "music-card");
            music_card.setAttribute("data-mcard-order", music_card_order);
            music_card.setAttribute("data-mcard-id", data_id);
            music_card.setAttribute("data-mcard-link", data_link);

            const check_link = modifier.is_music_card_link_present(music_card);

            music_card.innerHTML = `
                <div class="musicc-wrapper">
                    ${check_link !== true ? '<div class="musicc-curtain"><h4>NOT AVAILABLE YET (&gt;.&lt;)</h4></div>' : ''}
                    <div class="musicc-cover" style="background-image:url(${this.#config.musiccover_path}${data_img_name_extension})"></div>
                    <div class="musicc-title">
                        <h3>${data_title}</h3>
                        <small>Author : ${data_author}</small>
                    </div>
                    <div class="musicc-opt">
                        <button class="musicc-play-tv" type="button" ${check_link !== true ? 'disabled' : ''}><i class="icofont-duotone icofont-screen"></i> <span>Play</span></button>
                    </div>
                </div>
            `;

            music_card.querySelector(".musicc-play-tv").addEventListener("click", ()=>{
                music_card_func.zfocus_targeted(music_card);
                ini.#gates.tv.show({embedlink: modifier.read_music_card_link(music_card)});
            }, true);

            this.#gates.shelf_drawer.shove(music_card);
        };

        const rearrange_music_card = (option={sort_trackPackname:String, search_title:String})=>{
            if(orm.tbl_music_card.morpher.is_empty_data() === false){
                this.#gates.shelf_drawer.flush();
                const tbl_data = orm.tbl_music_card.overhaul(option);
                if(tbl_data && tbl_data.length > 0){
                    for(let i=0; i<tbl_data.length; i++){
                        spawn_new_music_card({
                            music_card_order: i+1,
                            data_id: tbl_data[i].id,
                            data_title: tbl_data[i].title,
                            data_img_name_extension: tbl_data[i].logo,
                            data_author: tbl_data[i].artist,
                            data_link: tbl_data[i].link,
                        });
                    };
                }else{
                    spawn_new_music_card({
                        music_card_order: 0,
                        data_id: 0,
                        data_title: "(no music data found)",
                        data_img_name_extension: this.#config.musiccover_img_name_extension_placeholder,
                        data_author: "-",
                        data_link: this.#config.iframe_link_placeholder,
                    });
                };
            };
        };

        const fetch_music_card_data_json = ()=>{
            if(orm.tbl_music_card.morpher.is_empty_data() === true){
                orm.tbl_music_card.register(()=>{
                    rearrange_music_card({sort_trackPackname: orm.tbl_music_card.interface.trackPackname[0]});
                    music_card_func.zfocus_first_music_card();
                });
                orm.tbl_music_card.initialization();
            };
        };

        this.#gates.music_card = {
            orm : orm,
            transport : fetch_music_card_data_json,
            utilize : modifier,
            rearrange : rearrange_music_card,
            zfocus : {
                first : music_card_func.zfocus_first_music_card,
                previous : music_card_func.zfocus_previous_music_card,
                next : music_card_func.zfocus_next_music_card,
                targeted : music_card_func.zfocus_targeted,
            },
        };
    };

    #IdentifyMusedboxFooter(){
        //1.store musedbox footer that already present on DOM, into a variable
        this.#element.musedbox_footer = document.getElementById("musedbox-footer");

        //2.call method that would identify existing element inside musedbox footer
        this.#AssembleFooterNavigation();
        
        //3.function for the musedbox footer. work inside musedbox element node scope.
        const onload = (()=>{
            this.#gates.footer_nav.dispatch();
        })();
    };

    #AssembleFooterNavigation(){
        //store shelf drawer that already present on DOM, into a variable
        const footer_nav = document.getElementById("footer-nav");

        const subelement = {
            btn_l_scroll : footer_nav.querySelector(`.fnav-scroller[data-fnavs-order="1"]`),
            btn_r_scroll : footer_nav.querySelector(`.fnav-scroller[data-fnavs-order="2"]`),
            category_btn_wrapper : footer_nav.querySelector(".fnav-category"),
        };

        const refresh = {
            btn_cat_wrapper : ()=>{
                subelement.category_btn_wrapper.innerHTML = '';
            },
        };

        const modifier = {
            validate_is_btn_cat_node : (element_node)=>{
                return element_node && element_node.nodeType && element_node.classList.contains("fnav-btn-cat") ? true : false;
            },
            find_active_btn_cat : function(){
                const su = Array.from(subelement.category_btn_wrapper.querySelectorAll("button.fnav-btn-cat.active"));
                if(su.length > 1){
                    console.log("something weird happenned. multiple active button detected at once");
                    for(let i=1;i<su.length;i++){
                        this.unmark_btn_cat(su[i]);
                    };
                };
                return su[0];
            },
            is_active_btn_cat : function(btn_cat_node){
                return !!(btn_cat_node.classList.contains("active"));
            },
            find_prevto_active_btn_cat : function(){
                const curr_active = this.find_active_btn_cat();
                let ckprev = curr_active.previousElementSibling;
                while(ckprev){
                    if(this.validate_is_btn_cat_node(ckprev) === true){
                        return ckprev;
                    }else{
                        ckprev = ckprev.previousElementSibling;
                    };
                };
                return undefined;
            },
            find_nextto_active_btn_cat : function(){
                const curr_active = this.find_active_btn_cat();
                let cknext = curr_active.nextElementSibling;
                while(cknext){
                    if(this.validate_is_btn_cat_node(cknext) === true){
                        return cknext;
                    }else{
                        cknext = cknext.nextElementSibling;
                    };
                };
                return undefined;
            },
            unmark_btn_cat : function(btn_cat_node){
                btn_cat_node.classList.remove("active");
            },
            switch_mark_btn_cat : function(btn_cat_node){
                const active_btn_cat = this.find_active_btn_cat();
                if(active_btn_cat){
                    this.unmark_btn_cat(active_btn_cat);
                };
                btn_cat_node.classList.add("active");
                btn_cat_node.scrollIntoView();
            },
            find_btn_cat_by_trackPackname : function(trackPackname=String){
                return ((su = subelement.category_btn_wrapper.querySelector(`button[data-btncat-trackPackname="${trackPackname}"]`))=>{return su ? su : undefined})();
            },
            read_btn_cat_trackPackname : function(btn_cat_node){
                return btn_cat_node.getAttribute("data-btncat-trackPackname");
            },
        };

        const switch_button_and_rearrange_music_card = ({btn_cat_node})=>{
            if(modifier.validate_is_btn_cat_node(btn_cat_node) !== true){
                throw new Error("is not something what we expected..");
            };
            modifier.switch_mark_btn_cat(btn_cat_node);
            this.#gates.music_card.rearrange({sort_trackPackname: modifier.read_btn_cat_trackPackname(btn_cat_node)});
            this.#gates.music_card.zfocus.first();
        };

        const subelement_func = {
            mark_previous_btn_cat : ()=>{
                const find_prev_to_it = modifier.find_prevto_active_btn_cat();
                if(find_prev_to_it){
                    switch_button_and_rearrange_music_card({btn_cat_node:find_prev_to_it});
                };
            },
            mark_next_btn_cat : ()=>{
                const find_next_to_it = modifier.find_nextto_active_btn_cat();
                if(find_next_to_it){
                    switch_button_and_rearrange_music_card({btn_cat_node:find_next_to_it});
                };
            },
        };

        subelement.btn_l_scroll.addEventListener("click", subelement_func.mark_previous_btn_cat, true);
        subelement.btn_r_scroll.addEventListener("click", subelement_func.mark_next_btn_cat, true);

        const spawn_new_button_category = ({btncat_trackPackname})=>{
            const btn_cat = document.createElement("button");
            btn_cat.setAttribute("class", "fnav-btn-cat");
            btn_cat.setAttribute("data-btncat-trackPackname", btncat_trackPackname)
            btn_cat.innerText = btncat_trackPackname;

            //add some function
            btn_cat.addEventListener("click", ()=>{
                modifier.is_active_btn_cat(btn_cat) === false ? switch_button_and_rearrange_music_card({btn_cat_node:btn_cat}) : '';
            }, true);

            subelement.category_btn_wrapper.appendChild(btn_cat);
        };

        const load_button_category = ()=>{
            refresh.btn_cat_wrapper();
            this.#gates.music_card.orm.tbl_music_card.interface.trackPackname.forEach((string_trackPackname) => {
                spawn_new_button_category({btncat_trackPackname: string_trackPackname});
            });
        };

        this.#gates.music_card.orm.tbl_music_card.register(()=>{
            //this will make the first button on footer navigation will be marked automatically. after page loaded..
            const mark_first_btn_automatically = (()=>{
                const find_representative = modifier.find_btn_cat_by_trackPackname(this.#gates.music_card.orm.tbl_music_card.interface.trackPackname[0]);
                modifier.switch_mark_btn_cat(find_representative);
            })();
        });

        this.#gates.footer_nav = {
            utilize : modifier,
            dispatch : load_button_category,
            remix : switch_button_and_rearrange_music_card,
        };
    };
};

/* document.body.innerHTML = '';


        
for(let i=1000;i<1200;i++){
    document.body.innerHTML += `
        {
            "id" : ${i},
            "trackPackname" : "Concept Pack",
            "album" : "",
            "title" : "",
            "logo" : "mdb_cv_${i}.webp",
            "artist" : "",
            "link" : ""
        },
    `;          
}; */
